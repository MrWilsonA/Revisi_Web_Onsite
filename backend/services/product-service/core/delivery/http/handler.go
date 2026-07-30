package http

import "github.com/Acad600-TPA/WEB-EJ-NH-JR-KO-WA-261/backend/services/product-service/core/usecase"

type IceCreamHandler struct {
	Usecase usecase.IceCreamUsecaseStruct
}

func NewProductHandler(uc usecase.IceCreamUsecaseStruct) *IceCreamHandler{
	return &IceCreamHandler{Usecase: uc}
}