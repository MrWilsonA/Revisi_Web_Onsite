package handler

import (
	"net/http"

	"github.com/Acad600-TPA/WEB-EJ-NH-JR-KO-WA-261/backend/services/transaction-service/core/domain"
	"github.com/gin-gonic/gin"
)

type TransactionHandler struct {
	transactionUsecase domain.TransactionUseCase
}

func NewTransactionHandler(usecase domain.TransactionUseCase) *TransactionHandler {
	return &TransactionHandler{
		transactionUsecase: usecase,
	}
}

func (th *TransactionHandler) CreateTransaction(c *gin.Context) {
	var req domain.Transaction
	if err := c.ShouldBindJSON(&req); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	if err := th.transactionUsecase.CreateTransaction(c.Request.Context(), req); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"err": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "success creating transaction"})
}

func (th *TransactionHandler) GetAll(c *gin.Context) {
	transactions, err := th.transactionUsecase.GetAllTransactions(c.Request.Context())
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"err": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": transactions,
	})
}

func (th *TransactionHandler) UpdateStatus(c *gin.Context) {
	var req struct {
		ID     uint   `json:"id"`
		Status string `json:"status"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	if err := th.transactionUsecase.UpdateStatus(c.Request.Context(), req.ID, req.Status); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"err": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
