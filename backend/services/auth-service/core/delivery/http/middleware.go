package http

import (
	"net/http"
	"strings"

	"github.com/Acad600-TPA/WEB-EJ-NH-JR-KO-WA-261/backend/services/pkg/jwt"
	"github.com/gin-gonic/gin"
)

func JWTAuth(c *gin.Context, jwtMgr *jwt.Manager) gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")
		if !strings.HasPrefix(header, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing toke"})
			return
		}
		token := strings.TrimPrefix(header, "Bearer ")
		resp, err := jwtMgr.Verify(token)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing toke"})
			return
		}
		c.Set("user_id", resp.UserId)
		c.Set("role", resp.Role)
		c.Next()
	}
}
