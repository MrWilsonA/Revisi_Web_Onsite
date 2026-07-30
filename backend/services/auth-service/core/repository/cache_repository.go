package repository

import (
	"context"

	"github.com/Acad600-TPA/WEB-EJ-NH-JR-KO-WA-261/backend/services/auth-service/core/domain"
	"github.com/go-redis/redis/v8"
)

type RedisCacheRepository struct {
	redisClient redis.UniversalClient
}

func NewCacheRepository (redisClient redis.UniversalClient) domain.CacheRepository {
	return &RedisCacheRepository{
		redisClient: redisClient,
	}
}

func (r *RedisCacheRepository) Get(c context.Context, key string) (interface{}, error) {
	panic("unimplemented")
}
func (r *RedisCacheRepository) Set(c context.Context, key string, value interface{}) error {
	panic("unimplemented")
}
func (r *RedisCacheRepository) Delete(c context.Context, key string) error{
	panic("unimplemented")
}