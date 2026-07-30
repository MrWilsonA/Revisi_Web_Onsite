package domain

import (
	"context"
)

type TransactionItem struct {
	ID            uint    `json:"id" gorm:"primaryKey"`
	TransactionID uint    `json:"transaction_id"`
	IceCreamID    uint    `json:"ice_cream_id"`
	Name          string  `json:"name"`
	Price         float64 `json:"price"`
	Quantity      int     `json:"quantity"`
	PictureUrl    string  `json:"picture_url"`
}

type Transaction struct {
	ID           uint              `json:"id" gorm:"primaryKey"`
	DateTime     string            `json:"date_time"`
	CustomerName string            `json:"customer_name"`
	FinalAmount  float64           `json:"final_amount"`
	Status       string            `json:"status"`
	Items        []TransactionItem `json:"items" gorm:"foreignKey:TransactionID"`
}

type TransactionRepository interface {
	CreateTransaction(ctx context.Context, transaction Transaction) error
	GetAllTransactions(ctx context.Context) ([]Transaction, error)
	UpdateStatus(ctx context.Context, id uint, status string) error
}

type TransactionUseCase interface {
	CreateTransaction(ctx context.Context, transaction Transaction) error
	GetAllTransactions(ctx context.Context) ([]Transaction, error)
	UpdateStatus(ctx context.Context, id uint, status string) error
}
