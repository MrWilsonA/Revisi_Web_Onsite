package domain

import (
	"context"
)

type Transaction struct {
	ID           uint
	DateTime     string
	CustomerName string
	FinalAmount  float64
	Status       string
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
