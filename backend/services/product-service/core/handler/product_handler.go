package handler

import (
	"net/http"

	"github.com/Acad600-TPA/WEB-EJ-NH-JR-KO-WA-261/backend/services/product-service/core/domain"
	"github.com/gin-gonic/gin"
)

type ProductHandler struct {
	productUsecase domain.IceCreamUseCase
	cookieSecure bool
}

func NewProductHandler(usecase domain.IceCreamUseCase, cookieSecure bool) *ProductHandler {
	return  &ProductHandler{
		productUsecase: usecase,
		cookieSecure: cookieSecure,
	}
}

func (ph *ProductHandler) CreateIceCream(c *gin.Context) {
	var req domain.IceCream

	if err := c.ShouldBindJSON(&req); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err":err.Error()})
		return
	}

	if err := ph.productUsecase.CreateIceCream(c.Request.Context(), req); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"err":err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message":"success creating ice cream"})
}

func (ph *ProductHandler) GetAll(c *gin.Context) {
	page := 1
	limit := 10
	search := c.Query("search")
	// For simplicity, skip parsing page/limit from query here, just use defaults or basic conversion
	
	icecreams, total, err := ph.productUsecase.GetAllIceCreams(c.Request.Context(), page, limit, search)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"err": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"data": icecreams,
		"total": total,
	})
}

func (ph *ProductHandler) GetDetail(c *gin.Context) {
	var req struct{
		id uint
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err":err.Error()})
		return
	}

	// if err = ph.productUsecase.GetDetail(c.Request.Context(), req.id)

}

func (ph *ProductHandler) UpdatePrice(c *gin.Context) {
	var req struct {
		id uint
		newPrice float64 `json:"new_price"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err":err.Error()})
		return
	}

	if err := ph.productUsecase.UpdatePrice(c.Request.Context(), req.id, req.newPrice); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err":err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":"success",
	})
}

func (ph *ProductHandler) DeleteIceCream(c *gin.Context) {
	var req struct {
		id uint
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err":err.Error()})
		return
	}

	if err := ph.productUsecase.DeleteIceCream(c.Request.Context(), req.id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"err" : err.Error()})
		return 
	}

	c.JSON(http.StatusOK, gin.H{"message" : "success"})

}

// GetDetail(c context.Context, id uint) (IceCream, error)
// UpdatePrice(c context.Context, id uint, newPrice float64) error
// DeleteIceCream(c context.Context, id uint) error