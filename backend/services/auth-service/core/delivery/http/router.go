package http

import (
	"github.com/Acad600-TPA/WEB-EJ-NH-JR-KO-WA-261/backend/services/pkg/jwt"
	productHandler "github.com/Acad600-TPA/WEB-EJ-NH-JR-KO-WA-261/backend/services/product-service/core/delivery/http"
	productHandler "github.com/Acad600-TPA/WEB-EJ-NH-JR-KO-WA-261/backend/services/product-service/core/handler"
	transactionHandler "github.com/Acad600-TPA/WEB-EJ-NH-JR-KO-WA-261/backend/services/transaction-service/core/delivery/http"
	transactionHandler "github.com/Acad600-TPA/WEB-EJ-NH-JR-KO-WA-261/backend/services/transaction-service/core/handler"
	"github.com/gin-gonic/gin"
)

type AuthRouter struct {
	Handler AuthHandler
	c       *gin.Context
	jwtMgr  jwt.Manager
}

// CORS middleware
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, PATCH, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func NewRouter(h AuthHandler, ph *productHandler.ProductHandler, th *transactionHandler.TransactionHandler, c *gin.Context, jwtMgr *jwt.Manager) *gin.Engine {
	r := gin.Default()
	r.Use(CORSMiddleware())

	auth := r.Group("/api/auth")
	{
		auth.POST("/login", h.Login)
		auth.POST("/register", h.Register)
		auth.PATCH("/update/email", JWTAuth(c, jwtMgr), h.UpdateEmail)
		auth.PATCH("/update/username", JWTAuth(c, jwtMgr), h.UpdateUsername)
		auth.PATCH("/update/password", JWTAuth(c, jwtMgr), h.UpdatePassword)
		auth.POST("/refreshToken", h.RefreshToken)
	}
	product := r.Group("/api/ice-cream")
	{
		product.POST("/create", ph.CreateIceCream)
		product.GET("", ph.GetAll)
		product.GET("/detail", ph.GetDetail)
		product.PATCH("/price", ph.UpdatePrice)
		product.DELETE("/delete", ph.DeleteIceCream)
	}
	transaction := r.Group("/api/transaction")
	{
		transaction.POST("/create", th.CreateTransaction)
		transaction.GET("", th.GetAll)
		transaction.PATCH("/status", th.UpdateStatus)
	}
	return r
}
