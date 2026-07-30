package repository

import (
	"context"

	"github.com/Acad600-TPA/WEB-EJ-NH-JR-KO-WA-261/backend/services/product-service/core/domain"
	"gorm.io/gorm"
)

type IceCreamRepositoryImpl struct {
	db *gorm.DB
}

func NewIceCreamRepository(db *gorm.DB) *IceCreamRepositoryImpl {
	return &IceCreamRepositoryImpl{
		db: db,
	}
}

func (i *IceCreamRepositoryImpl) CreateIceCream(c context.Context, icecream domain.IceCream) error {
	return i.db.WithContext(c).Create(&icecream).Error
}

func (i *IceCreamRepositoryImpl) GetAllIceCreams(c context.Context, page, limit int, search string) ([]domain.IceCream, int64, error) {
	var icecreams []domain.IceCream
	var total int64
	query := i.db.WithContext(c).Model(&domain.IceCream{})
	if search != "" {
		query = query.Where("name ILIKE ?", "%"+search+"%")
	}
	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}
	offset := (page - 1) * limit
	err = query.Offset(offset).Limit(limit).Find(&icecreams).Error
	return icecreams, total, err
}

func (i *IceCreamRepositoryImpl) GetDetail(c context.Context, id uint) (*domain.IceCream, error) {
	var icecream domain.IceCream
	err := i.db.WithContext(c).Where("id = ?", id).First(&icecream).Error

	if err != nil {
		return nil, err
	}

	return &icecream, err
}

func (i *IceCreamRepositoryImpl) UpdatePrice(c context.Context, id uint, newPrice float64) error {
	return i.db.WithContext(c).Where("id = ?", id).Update("price", newPrice).Error
}

func (i *IceCreamRepositoryImpl) DeleteIceCream(c context.Context, id uint) error {
	var icecream domain.IceCream

	return i.db.WithContext(c).Where("id = ?", id).Delete(&icecream).Error
}
