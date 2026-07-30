FROM golang:1.25

WORKDIR /app

COPY ./backend/services/ ./
RUN go mod download

EXPOSE 8080

CMD ["go", "run", "./auth-service/cmd/main.go"]