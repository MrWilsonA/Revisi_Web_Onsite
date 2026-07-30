package repository

import (
	"context"

	"github.com/Acad600-TPA/WEB-EJ-NH-JR-KO-WA-261/backend/services/transaction-service/core/domain"
	"gorm.io/gorm"
)

type TransactionRepositoryImpl struct {
	db *gorm.DB
}

func NewTransactionRepository(db *gorm.DB) domain.TransactionRepository {
	return &TransactionRepositoryImpl{
		db: db,
	}
}

func (t *TransactionRepositoryImpl) CreateTransaction(ctx context.Context, transaction domain.Transaction) error {
	return t.db.WithContext(ctx).Create(&transaction).Error
}

func (t *TransactionRepositoryImpl) GetAllTransactions(ctx context.Context) ([]domain.Transaction, error) {
	var transactions []domain.Transaction
	err := t.db.WithContext(ctx).Find(&transactions).Error
	return transactions, err
}

func (t *TransactionRepositoryImpl) UpdateStatus(ctx context.Context, id uint, status string) error {
	return t.db.WithContext(ctx).Model(&domain.Transaction{}).Where("id = ?", id).Update("status", status).Error
}
