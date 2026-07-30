package usecase

import (
	"context"

	"github.com/Acad600-TPA/WEB-EJ-NH-JR-KO-WA-261/backend/services/auth-service/config"
	"github.com/Acad600-TPA/WEB-EJ-NH-JR-KO-WA-261/backend/services/product-service/core/domain"
)

type IceCreamUsecaseStruct struct {
	IceCreamRepo domain.IceCreamRepository
	Cfg          *config.Config
}

func NewIceCreamUsecase(iceCreamRepo domain.IceCreamRepository, cfg *config.Config) domain.IceCreamUseCase {
	return &IceCreamUsecaseStruct{IceCreamRepo: iceCreamRepo, Cfg: cfg}
}

func (u *IceCreamUsecaseStruct) CreateIceCream(c context.Context, icecream domain.IceCream) error {
	if err := u.IceCreamRepo.CreateIceCream(c, icecream); err != nil {
		return err
	}
	return nil
}

func (u *IceCreamUsecaseStruct) GetAllIceCreams(c context.Context, page, limit int, search string) ([]domain.IceCream, int64, error) {
	return u.IceCreamRepo.GetAllIceCreams(c, page, limit, search)
}

func (u *IceCreamUsecaseStruct) GetDetail(c context.Context, id uint) (*domain.IceCream, error) {
	exist, err := u.IceCreamRepo.GetDetail(c, id)
	if err != nil || exist == nil {
		return nil, err
	}
	return exist, nil
}

func (u *IceCreamUsecaseStruct) UpdatePrice(c context.Context, id uint, newPrice float64) error {
	err := u.IceCreamRepo.UpdatePrice(c, id, newPrice)
	if err != nil {
		return err
	}
	return nil
}
func (u *IceCreamUsecaseStruct) DeleteIceCream(c context.Context, id uint) error {
	err := u.IceCreamRepo.DeleteIceCream(c, id)
	if err != nil {
		return err
	}
	return nil
}
