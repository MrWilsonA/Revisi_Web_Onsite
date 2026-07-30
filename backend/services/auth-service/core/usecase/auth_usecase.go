package usecase

import (
	"context"
	"fmt"

	"github.com/Acad600-TPA/WEB-EJ-NH-JR-KO-WA-261/backend/services/auth-service/core/domain"
	"github.com/Acad600-TPA/WEB-EJ-NH-JR-KO-WA-261/backend/services/auth-service/pkg/jwt"
)

type AuthUsecaseInterface interface {
	Register(c context.Context, req RegisterRequest) error
	Login(c context.Context, req LoginRequest) (*LoginResponse, error)
	UpdateEmail(c context.Context, req UpdateEmailRequest) error
	UpdateUsername(c context.Context, req UpdateUsernameRequest) error
	UpdatePassword(c context.Context, req UpdatePasswordRequest) error
	RefreshToken(c context.Context, req RefreshTokenRequest) (*LoginResponse, error)
	IssueToken(c context.Context, user domain.User) (*LoginResponse, error)
}

type AuthUsecase struct {
	userRepo  domain.UserRepository
	cacheRepo domain.CacheRepository
	jwtMgr    jwt.Manager
}

// IssueToken implements AuthUsecaseInterface.
func (a *AuthUsecase) IssueToken(c context.Context, user domain.User) (*LoginResponse, error) {
	accessToken, err := a.jwtMgr.GenerateAccessToken(user.ID, user.Role)
	if err != nil {
		return nil, err
	}
	refreshToken, err := a.jwtMgr.GenerateRefreshToken(user.ID, user.Role)
	if err != nil {
		return nil, err
	}

	return &LoginResponse{
		AccessToken: accessToken,
		RefreshToken: refreshToken,
		Role: user.Role,
	}, nil
}

// Login implements AuthUsecaseInterface.
func (a *AuthUsecase) Login(c context.Context, req LoginRequest) (*LoginResponse, error) {
	user, err := a.userRepo.GetByEmail(c, req.Email)

	if err != nil {
		return nil, err
	}

	if user == nil {
		return nil, fmt.Errorf("User doesnt exists")
	}

	if user.Password != req.Password {
		return nil, fmt.Errorf("Password mismatch")
	}

	return a.IssueToken(c, *user)
}

// RefreshToken implements AuthUsecaseInterface.
func (a *AuthUsecase) RefreshToken(c context.Context, req RefreshTokenRequest) (*LoginResponse, error) {
	claim, err := a.jwtMgr.Verify(req.RefreshToken)
	if err != nil {
		return nil, err
	}

	user, err := a.userRepo.GetByID(c, claim.UserId)
	if err != nil {
		return nil, err
	}

	if user == nil {
		return nil, fmt.Errorf("User Doesnt Exists")
	}

	return  a.IssueToken(c, *user)
}

// Register implements AuthUsecaseInterface.
func (a *AuthUsecase) Register(c context.Context, req RegisterRequest) error {
	if existing, _ := a.userRepo.GetByEmail(c, req.Email); existing != nil {
		return fmt.Errorf("email has been taken")
	}

	if existing, _ := a.userRepo.GetByUsername(c, req.Username); existing != nil {
		return fmt.Errorf("username has been taken")
	}

	user := domain.User{
		Email: req.Email,
		Username: req.Username,
		Password: req.Password,
	}

	if err := a.userRepo.Create(c, user); err != nil {
		return fmt.Errorf("error while creating user : %v", err)
	}

	return nil
}

// UpdateEmail implements AuthUsecaseInterface.
func (a *AuthUsecase) UpdateEmail(c context.Context, req UpdateEmailRequest) error {
	if exsiting, _ := a.userRepo.GetByID(c, req.ID); exsiting == nil {
		return  fmt.Errorf("user doesnt exists")
	}

	return a.userRepo.UpdateEmail(c, req.ID, req.NewEmail)
}

// UpdateUsername implements AuthUsecaseInterface.
func (a *AuthUsecase) UpdateUsername(c context.Context, req UpdateUsernameRequest) error {
	if existing, _ := a.userRepo.GetByID(c, req.ID); existing == nil {
		return fmt.Errorf("user doesnt exists")
	}
	return a.userRepo.UpdateUsername(c, req.ID, req.NewUsername)
}

// UpdatePassword implements AuthUsecaseInterface.
func (a *AuthUsecase) UpdatePassword(c context.Context, req UpdatePasswordRequest) error {
	if existing, _ := a.userRepo.GetByID(c, req.ID); existing == nil {
		return fmt.Errorf("user doesnt exists")
	}
	return a.userRepo.UpdatePassword(c, req.ID, req.NewPassword)
}

func NewAuthUsecase(
	userRepo domain.UserRepository,
	cacheRepo domain.CacheRepository,
	jwtMgr jwt.Manager,
) AuthUsecaseInterface {
	return &AuthUsecase{
		jwtMgr:    jwtMgr,
		userRepo:  userRepo,
		cacheRepo: cacheRepo,
	}
}
