package http

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"strconv"

	"github.com/Acad600-TPA/WEB-EJ-NH-JR-KO-WA-261/backend/services/product-service/core/domain"
	"github.com/gin-gonic/gin"
)

type ProductHandler struct {
	productUsecase domain.IceCreamUseCase
	cookieSecure   bool
}

func NewProductHandler(usecase domain.IceCreamUseCase, cookieSecure bool) *ProductHandler {
	return &ProductHandler{
		productUsecase: usecase,
		cookieSecure:   cookieSecure,
	}
}

func (ph *ProductHandler) CreateIceCream(c *gin.Context) {
	name := c.PostForm("name")
	priceStr := c.PostForm("price")
	description := c.PostForm("description")
	flavour := c.PostForm("flavour")

	price, err := strconv.ParseFloat(priceStr, 64)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": "Invalid price format"})
		return
	}

	file, header, err := c.Request.FormFile("picture")
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": "Picture file is required"})
		return
	}
	defer file.Close()

	// 1. Get fid from SeaweedFS Master
	seaweedMaster := os.Getenv("SEAWEEDFS_MASTER")
	if seaweedMaster == "" {
		seaweedMaster = "seaweedfs-master:9333"
	}

	resp, err := http.Get("http://" + seaweedMaster + "/dir/assign")
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"err": "Failed to connect to SeaweedFS master"})
		return
	}
	defer resp.Body.Close()

	var assignResp struct {
		Fid       string `json:"fid"`
		Url       string `json:"url"`
		PublicUrl string `json:"publicUrl"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&assignResp); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"err": "Failed to parse SeaweedFS response"})
		return
	}

	// 2. Upload file to SeaweedFS Volume
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile("file", header.Filename)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"err": "Failed to create form file"})
		return
	}
	if _, err := io.Copy(part, file); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"err": "Failed to copy file content"})
		return
	}
	writer.Close()

	// Internal docker network usually maps URL to volume server
	uploadUrl := fmt.Sprintf("http://%s/%s", assignResp.Url, assignResp.Fid)
	uploadReq, err := http.NewRequest("POST", uploadUrl, body)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"err": "Failed to prepare upload request"})
		return
	}
	uploadReq.Header.Set("Content-Type", writer.FormDataContentType())

	client := &http.Client{}
	uploadResp, err := client.Do(uploadReq)
	if err != nil || uploadResp.StatusCode >= 400 {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"err": "Failed to upload file to SeaweedFS"})
		return
	}
	defer uploadResp.Body.Close()

	// 3. Build Public URL
	seaweedPublic := os.Getenv("SEAWEEDFS_PUBLIC_URL")
	if seaweedPublic == "" {
		seaweedPublic = "http://localhost:8081"
	}
	// Append thumbnail suffix if required (e.g., ?width=200&height=200) - For now just using plain fid, or we can add it based on rubric
	// "appending the thumbnail suffix (defined in env file)" -> let's check if there's an env for THUMBNAIL_SUFFIX, if not, hardcode standard suffix
	thumbnailSuffix := os.Getenv("THUMBNAIL_SUFFIX")
	finalUrl := fmt.Sprintf("%s/%s%s", seaweedPublic, assignResp.Fid, thumbnailSuffix)

	req := domain.IceCream{
		Name:        name,
		Price:       price,
		Description: description,
		Flavour:     flavour,
		PictureUrl:  finalUrl,
	}

	if err := ph.productUsecase.CreateIceCream(c.Request.Context(), req); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"err": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "success creating ice cream"})
}

func (ph *ProductHandler) GetAll(c *gin.Context) {
	pageStr := c.Query("page")
	limitStr := c.Query("limit")
	search := c.Query("search")

	page := 1
	limit := 25

	if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
		page = p
	}
	if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
		limit = l
	}

	icecreams, total, err := ph.productUsecase.GetAllIceCreams(c.Request.Context(), page, limit, search)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"err": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  icecreams,
		"total": total,
	})
}

func (ph *ProductHandler) GetDetail(c *gin.Context) {
	var req struct {
		id uint
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// if err = ph.productUsecase.GetDetail(c.Request.Context(), req.id)

}

func (ph *ProductHandler) UpdatePrice(c *gin.Context) {
	var req struct {
		ID       uint
		NewPrice float64 `json:"new_price"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	if err := ph.productUsecase.UpdatePrice(c.Request.Context(), req.ID, req.NewPrice); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "success",
	})
}

func (ph *ProductHandler) DeleteIceCream(c *gin.Context) {
	var req struct {
		id uint
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	if err := ph.productUsecase.DeleteIceCream(c.Request.Context(), req.id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})

}

// GetDetail(c context.Context, id uint) (IceCream, error)
// UpdatePrice(c context.Context, id uint, newPrice float64) error
// DeleteIceCream(c context.Context, id uint) error
