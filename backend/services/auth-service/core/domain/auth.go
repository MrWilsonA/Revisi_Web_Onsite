package domain

import "context"

type User struct {
	ID             uint
	Username       string
	Password       string
	Email          string
	Role           string
	ProfilePicture string
}

const (
	UserRole  = "user"
	AdminRole = "admin"
)

type UserRepository interface {
	GetByID(c context.Context, id uint)  (*User, error)
	GetByEmail(c context.Context, email string) (*User, error)
	GetByUsername(c context.Context, username string) (*User, error)
	Create(c context.Context, user User) error
	UpdateEmail(c context.Context,  id uint, newEmail string)  error
	UpdateUsername(c context.Context, id uint, newUsername string) error
	UpdatePassword(c context.Context, id uint, newPassword string) error
}

type CacheRepository interface {
	Get(c context.Context, key string) (interface{}, error)
	Set(c context.Context, key string, value interface{}) error
	Delete(c context.Context, key string) error
}