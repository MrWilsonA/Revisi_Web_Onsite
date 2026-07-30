package config

import "os"

type Config struct {
	GRPCPORT  string
	HTTPPORT  string
	DBHOST    string
	DBUSER    string
	DBNAME    string
	DBPORT    string
	DBPASS    string
	REDISHOST string
	REDISPASS string
	REDISPORT string
	JWTSECRET string
}

func Load() *Config {
	return &Config{
		GRPCPORT:  GetEnv("GRPC_PORT", "9001"),
		HTTPPORT:  GetEnv("HTTP_PORT", "8001"),
		DBUSER:  GetEnv("DB_USER", ""),
		DBHOST:    GetEnv("DB_HOST", ""),
		DBNAME:    GetEnv("DB_NAME", ""),
		DBPORT:    GetEnv("DB_PORT", ""),
		DBPASS:    GetEnv("DB_PASS", ""),
		REDISHOST: GetEnv("REDIS_HOST", ""),
		REDISPASS: GetEnv("REDIS_PASS", ""),
		REDISPORT: GetEnv("REDIS_PORT", ""),
		JWTSECRET: GetEnv("JWT_SECRET", ""),
	}
}

func GetEnv(code, fallback string) string {
	if cfg := os.Getenv(code); cfg != "" {
		return cfg
	}
	return fallback
}
