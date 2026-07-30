package http

import (
	"context"
	"net/http"

	"github.com/Acad600-TPA/WEB-EJ-NH-JR-KO-WA-261/backend/services/auth-service/core/usecase"
	"github.com/Acad600-TPA/WEB-EJ-NH-JR-KO-WA-261/backend/services/pkg/jwt"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	Usecase      usecase.AuthUsecaseInterface
	cookieSecure bool
}

func (h *AuthHandler) SetAuthCookies(c *gin.Context, accessToken, refreshToken string) {
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("access_token", accessToken, int(jwt.AccessTokenTTL.Seconds()), "/", "", h.cookieSecure, true)
	c.SetCookie("refresh_token", refreshToken, int(jwt.RefreshTokenTTL.Seconds()), "/", "", h.cookieSecure, true)
}

func (h *AuthHandler) ClearAuthCookies(c *gin.Context) {
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("access_token", "", -1, "/", "", h.cookieSecure, true)
	c.SetCookie("refresh_token", "", -1, "/", "", h.cookieSecure, true)
}

func NewAuthHandler(usecase usecase.AuthUsecaseInterface, cookieSecure bool) *AuthHandler {
	return &AuthHandler{Usecase: usecase, cookieSecure: cookieSecure}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req usecase.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	if err := h.Usecase.Register(context.Background(), req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req usecase.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	loginResp, err := h.Usecase.Login(context.Background(), req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	h.SetAuthCookies(c, loginResp.AccessToken, loginResp.RefreshToken)
	c.JSON(http.StatusOK, gin.H{"message": "success login",
		"response": gin.H{
			"access_token": loginResp.AccessToken,
			"role":         loginResp.Role,
		}})
}

func (h *AuthHandler) RefreshToken(c *gin.Context) {
	token, err := c.Cookie("refresh_token")
	if err != nil || token == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing token"})
		return
	}
	loginResp, err := h.Usecase.RefreshToken(c, usecase.RefreshTokenRequest{RefreshToken: token})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success login", "response": loginResp})
}

func (h *AuthHandler) UpdateEmail(c *gin.Context) {
	var req usecase.UpdateEmailRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	if err := h.Usecase.UpdateEmail(context.Background(), req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func (h *AuthHandler) UpdateUsername(c *gin.Context) {
	var req usecase.UpdateUsernameRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	if err := h.Usecase.UpdateUsername(context.Background(), req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func (h *AuthHandler) UpdatePassword(c *gin.Context) {
	var req usecase.UpdatePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	if err := h.Usecase.UpdatePassword(context.Background(), req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
