package usecase

import (
	"context"

	"github.com/Acad600-TPA/WEB-EJ-NH-JR-KO-WA-261/backend/services/auth-service/config"
	"github.com/Acad600-TPA/WEB-EJ-NH-JR-KO-WA-261/backend/services/transaction-service/core/domain"
)

type TransactionUsecaseStruct struct {
	TransactionRepo domain.TransactionRepository
	Cfg             *config.Config
}

func NewTransactionUsecase(transRepo domain.TransactionRepository, cfg *config.Config) domain.TransactionUseCase {
	return &TransactionUsecaseStruct{TransactionRepo: transRepo, Cfg: cfg}
}

func (u *TransactionUsecaseStruct) CreateTransaction(ctx context.Context, trx domain.Transaction) error {
	return u.TransactionRepo.CreateTransaction(ctx, trx)
}

func (u *TransactionUsecaseStruct) GetAllTransactions(ctx context.Context) ([]domain.Transaction, error) {
	return u.TransactionRepo.GetAllTransactions(ctx)
}

func (u *TransactionUsecaseStruct) UpdateStatus(ctx context.Context, id uint, status string) error {
	return u.TransactionRepo.UpdateStatus(ctx, id, status)
}
