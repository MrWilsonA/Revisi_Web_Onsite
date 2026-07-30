package jwt

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type Manager struct {
	secret []byte
}

type Claims struct {
	UserId uint
	Role   string
	jwt.RegisteredClaims
}

const (
	AccessTokenTTL  = 15 * time.Minute
	RefreshTokenTTL = 7 * 24 * time.Hour
)

func NewManager(secret string) *Manager {
	return &Manager{secret: []byte(secret)}
}

func (m *Manager) generate(userid uint, role string, ttl time.Duration) (string, error) {
	claims := Claims{
		UserId: userid,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(ttl)),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(m.secret)
}

func (m *Manager) Verify(tokenString string) (*Claims, error) {
	claims := Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (any, error) {
		return m.secret, nil
	})

	if err != nil || !token.Valid {
		return nil, errors.New("invalid token")
	}
	return &claims, nil
}

func (m *Manager) GenerateAccessToken(userid uint, role string) (string, error) {
	return m.generate(userid, role, AccessTokenTTL)
}

func (m *Manager) GenerateRefreshToken(userid uint, role string) (string, error) {
	return m.generate(userid, role, RefreshTokenTTL)
}
