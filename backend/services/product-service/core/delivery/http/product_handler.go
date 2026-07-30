package http

import (
	"fmt"
	"net/http"
	"os"
	"strconv"

	"github.com/Acad600-TPA/WEB-EJ-NH-JR-KO-WA-261/backend/services/product-service/core/domain"
	"github.com/gin-gonic/gin"
	"github.com/minio/minio-go/v7"
)

type ProductHandler struct {
	productUsecase domain.IceCreamUseCase
	minioClient    *minio.Client
	cookieSecure   bool
}

func NewProductHandler(usecase domain.IceCreamUseCase, minioClient *minio.Client, cookieSecure bool) *ProductHandler {
	return &ProductHandler{
		productUsecase: usecase,
		minioClient:    minioClient,
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

	// Upload ke S3 menggunakan MinIO client
	objectName := header.Filename // atau generate UUID biar unik
	_, err = ph.minioClient.PutObject(c.Request.Context(), "eskrim", objectName, file, header.Size, minio.PutObjectOptions{
		ContentType: header.Header.Get("Content-Type"),
	})
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"err": "Gagal upload ke S3"})
		return
	}
	// Buat public URL
	finalUrl := fmt.Sprintf("%s/%s/%s", os.Getenv("S3_PUBLIC_URL"), "eskrim", objectName)

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
