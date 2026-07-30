package repository

import (
	"context"

	"github.com/Acad600-TPA/WEB-EJ-NH-JR-KO-WA-261/backend/services/auth-service/core/domain"
	"gorm.io/gorm"
)

type UserRepositoryImpl struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepositoryImpl {
	return &UserRepositoryImpl{
		db: db,
	}
}

func (r *UserRepositoryImpl) GetByID(c context.Context, id uint) (*domain.User, error) {
	var user domain.User
	err := r.db.WithContext(c).Where("id = ?", id).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, err
}

func (r *UserRepositoryImpl) GetByEmail(c context.Context, email string) (*domain.User, error) {
	var user domain.User
	err := r.db.WithContext(c).Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, err
}

func (r *UserRepositoryImpl) GetByUsername(c context.Context, username string) (*domain.User, error) {
	var user domain.User
	err := r.db.WithContext(c).Where("username = ?", username).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, err
}

func (r *UserRepositoryImpl) Create(c context.Context, user domain.User) error {
	return r.db.WithContext(c).Create(&user).Error
}

func (r *UserRepositoryImpl) UpdateEmail(c context.Context, id uint, newEmail string) error {
	return r.db.WithContext(c).Where("id = ?", id).Update("email", newEmail).Error
}

func (r *UserRepositoryImpl) UpdateUsername(c context.Context, id uint, newUsername string) error {
	return r.db.WithContext(c).Where("id = ?", id).Update("username", newUsername).Error
}

func (r *UserRepositoryImpl) UpdatePassword(c context.Context, id uint, newPassword string) error {
	return r.db.WithContext(c).Where("id = ?", id).Update("password", newPassword).Error
}
