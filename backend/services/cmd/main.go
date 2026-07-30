package main

import (
	"fmt"
	"log"
	"strings"

	"github.com/Acad600-TPA/WEB-EJ-NH-JR-KO-WA-261/backend/services/auth-service/core/delivery/http"
	"github.com/Acad600-TPA/WEB-EJ-NH-JR-KO-WA-261/backend/services/auth-service/core/domain"
	"github.com/Acad600-TPA/WEB-EJ-NH-JR-KO-WA-261/backend/services/auth-service/core/repository"
	"github.com/Acad600-TPA/WEB-EJ-NH-JR-KO-WA-261/backend/services/auth-service/core/usecase"
	"github.com/Acad600-TPA/WEB-EJ-NH-JR-KO-WA-261/backend/services/config"
	"github.com/Acad600-TPA/WEB-EJ-NH-JR-KO-WA-261/backend/services/pkg/jwt"

	productHandler "github.com/Acad600-TPA/WEB-EJ-NH-JR-KO-WA-261/backend/services/product-service/core/delivery/http"
	productDomain "github.com/Acad600-TPA/WEB-EJ-NH-JR-KO-WA-261/backend/services/product-service/core/domain"
	productRepo "github.com/Acad600-TPA/WEB-EJ-NH-JR-KO-WA-261/backend/services/product-service/core/repository"
	productUsecase "github.com/Acad600-TPA/WEB-EJ-NH-JR-KO-WA-261/backend/services/product-service/core/usecase"

	transactionHandler "github.com/Acad600-TPA/WEB-EJ-NH-JR-KO-WA-261/backend/services/transaction-service/core/delivery/http"
	transactionDomain "github.com/Acad600-TPA/WEB-EJ-NH-JR-KO-WA-261/backend/services/transaction-service/core/domain"
	transactionRepo "github.com/Acad600-TPA/WEB-EJ-NH-JR-KO-WA-261/backend/services/transaction-service/core/repository"
	transactionUsecase "github.com/Acad600-TPA/WEB-EJ-NH-JR-KO-WA-261/backend/services/transaction-service/core/usecase"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func NewRedisClient() redis.UniversalClient {
	password := config.GetEnv("REDIS_PASS", "")
	if addrs := config.GetEnv("REDIS_ADDRS", ""); addrs != "" {
		return redis.NewClusterClient(&redis.ClusterOptions{
			Addrs:    strings.Split(addrs, ","),
			Password: password,
		})
	}
	return redis.NewClient(&redis.Options{
		Password: password,
		Addr:     fmt.Sprintf("%s:%s", config.GetEnv("REDIS_HOST", "localhost"), config.GetEnv("REDIS_PORT", "6379")),
	})
}

func main() {
	cfg := config.Load()
	var db *gorm.DB
	var err error
	dsn := "host=" + cfg.DBHOST + " user=" + cfg.DBUSER + " password=" + cfg.DBPASS + " dbname=" + cfg.DBNAME + " port=" + cfg.DBPORT + " sslmode=disable"
	for i := 0; i < 10; i++ {
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err == nil {
			break
		}
	}
	if err := db.AutoMigrate(&domain.User{}, &productDomain.IceCream{}, &transactionDomain.Transaction{}, &transactionDomain.TransactionItem{}); err != nil {
		log.Fatalf("gagal migrasi database: %v", err)
	}
	cookieSecure := config.GetEnv("COOKIE_SECURE", "false") == "true"
	redis := NewRedisClient()
	jwtMgr := jwt.NewManager(config.GetEnv("JWT_SECRET", ""))
	cacheRepo := repository.NewCacheRepository(redis)
	userRepo := repository.NewUserRepository(db)
	uc := usecase.NewAuthUsecase(userRepo, cacheRepo, *jwtMgr)
	handler := http.NewAuthHandler(uc, cookieSecure)

	pRepo := productRepo.NewIceCreamRepository(db)
	pUc := productUsecase.NewIceCreamUsecase(pRepo, cfg)
	pHandler := productHandler.NewProductHandler(pUc, cookieSecure)

	tRepo := transactionRepo.NewTransactionRepository(db)
	tUc := transactionUsecase.NewTransactionUsecase(tRepo, cfg)
	tHandler := transactionHandler.NewTransactionHandler(tUc)

	router := http.NewRouter(*handler, pHandler, tHandler, &gin.Context{}, jwtMgr)
	if err := router.Run(":" + cfg.HTTPPORT); err != nil {
		log.Fatalf("failed to run")
	}
}
