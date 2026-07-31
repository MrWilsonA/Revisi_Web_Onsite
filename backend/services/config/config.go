package config

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type Config struct {
	GRPCPORT        string
	HTTPPORT        string
	DBHOST          string
	DBUSER          string
	DBNAME          string
	DBPORT          string
	DBPASS          string
	REDISHOST       string
	REDISPASS       string
	REDISPORT       string
	JWTSECRET       string
	S3ENDPOINT      string
	S3PUBLICURL     string
	ACCESSKEYID     string
	SECRETACCESSKEY string
	BUCKETNAME      string
}

func Load() *Config {
	return &Config{
		GRPCPORT:        GetEnv("GRPC_PORT", "9001"),
		HTTPPORT:        GetEnv("HTTP_PORT", "8080"),
		DBUSER:          GetEnv("DB_USER", ""),
		DBHOST:          GetEnv("DB_HOST", ""),
		DBNAME:          GetEnv("DB_NAME", ""),
		DBPORT:          GetEnv("DB_PORT", ""),
		DBPASS:          GetEnv("DB_PASS", ""),
		REDISHOST:       GetEnv("REDIS_HOST", ""),
		REDISPASS:       GetEnv("REDIS_PASS", ""),
		REDISPORT:       GetEnv("REDIS_PORT", ""),
		JWTSECRET:       GetEnv("JWT_SECRET", ""),
		S3ENDPOINT:      GetEnv("S3_ENDPOINT", "seaweedfs:8333"),
		S3PUBLICURL:     GetEnv("S3_PUBLIC_URL", "http://localhost:8333"),
		ACCESSKEYID:     GetEnv("ACCESS_KEY_ID", "tpa_onsite"),
		SECRETACCESSKEY: GetEnv("SECRET_ACCESS_KEY", "tpa_onsite"),
		BUCKETNAME:      GetEnv("BUCKET_NAME", "eskrim"),
	}
}

func GetEnv(code, fallback string) string {
	if cfg := os.Getenv(code); cfg != "" {
		return cfg
	}
	return fallback
}

func (c *Config) DSN() string {
	return fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Jakarta", c.DBHOST, c.DBUSER, c.DBPASS, c.DBNAME, c.DBPORT)
}

func (c *Config) NewSeaweedClient() *minio.Client {
	client, err := minio.New(
		c.S3ENDPOINT,
		&minio.Options{
			Creds:  credentials.NewStaticV4(c.ACCESSKEYID, c.SECRETACCESSKEY, ""),
			Secure: false,
		},
	)

	if err != nil {
		log.Fatalf("Error while establishing client connection for seaweedfs : %v", err.Error())
	}

	return client
}

func (c *Config) InitStorage(client *minio.Client) {

	ctx := context.Background()

	ok, err := client.BucketExists(ctx, c.BUCKETNAME)
	if err != nil {
		log.Fatalf("error while pinging the seaweed fs : %v", err)
	}

	if !ok {
		if err := client.MakeBucket(ctx, c.BUCKETNAME, minio.MakeBucketOptions{}); err != nil {
			log.Fatalf("error while creating bucket %s : %v", c.BUCKETNAME, err)
		}
	}
}
