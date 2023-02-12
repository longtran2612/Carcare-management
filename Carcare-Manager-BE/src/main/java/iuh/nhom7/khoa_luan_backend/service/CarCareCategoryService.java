package iuh.nhom7.khoa_luan_backend.service;

import iuh.nhom7.khoa_luan_backend.common.Extensions;
import iuh.nhom7.khoa_luan_backend.entity.CarCareCategory;
import iuh.nhom7.khoa_luan_backend.exception.ErrorCode;
import iuh.nhom7.khoa_luan_backend.exception.ServiceException;
import iuh.nhom7.khoa_luan_backend.model.dto.ServiceCategoryCreateDTO;
import iuh.nhom7.khoa_luan_backend.repository.CarCareCategoryRepository;
import iuh.nhom7.khoa_luan_backend.base.BaseService;
import iuh.nhom7.khoa_luan_backend.common.EnumConst;
import iuh.nhom7.khoa_luan_backend.request.UpdateCategoryRequest;
import iuh.nhom7.khoa_luan_backend.response.CarCareCategoryResponse;
import iuh.nhom7.khoa_luan_backend.utils.DateTimesUtils;
import iuh.nhom7.khoa_luan_backend.utils.MappingUtils;
import lombok.experimental.ExtensionMethod;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

/**
 * 8:51 PM 15-Sep-22
 * Long Tran
 */
@Service
@ExtensionMethod(Extensions.class)
public class CarCareCategoryService extends BaseService {
    private final CarCareCategoryRepository carCareCategoryRepository;

    @Value("${carcareservice.url}")
    private String carServiceUrl;

    public CarCareCategoryService(CarCareCategoryRepository carCareCategoryRepository) {
        this.carCareCategoryRepository = carCareCategoryRepository;
    }

    public CarCareCategory findById(String id){
        CarCareCategory category = carCareCategoryRepository.findById(id).orElse(null);
        if (category == null) {
            throw new ServiceException(ErrorCode.CATEGORY_NOT_FOUND);
        }
        return category;
    }

    public CarCareCategory findByCode(String code){
        CarCareCategory category = carCareCategoryRepository.findByCategoryCode(code).orElse(null);
        if (category == null) {
            throw new ServiceException(ErrorCode.CATEGORY_NOT_FOUND);
        }
        return category;
    }

    public CarCareCategoryResponse findCategoryById(String id) {
        return mappingToCarCareCategoryResponse(findById(id));
    }

    @Transactional(rollbackFor = Exception.class)
    public CarCareCategory create(ServiceCategoryCreateDTO serviceCategoryCreateDTO) {
        CarCareCategory carCareCategory = CarCareCategory.builder()
                .categoryCode("CATEGORY" + sequenceValueItemRepository.getSequence(CarCareCategory.class))
                .imageUrl(serviceCategoryCreateDTO.getImageUrl())
                .type(serviceCategoryCreateDTO.getType())
                .name(serviceCategoryCreateDTO.getName())
                .createDate(new Date())
                .updateDate(new Date())
                .status(EnumConst.Status.ACTIVE.name())
                .build();
        if (serviceCategoryCreateDTO.getImageUrl().isBlankOrNull()) {
            carCareCategory.setImageUrl(carServiceUrl);
        } else {
            carCareCategory.setImageUrl(serviceCategoryCreateDTO.getImageUrl());
        }

        return carCareCategoryRepository.save(carCareCategory);
    }

    @Transactional(rollbackFor = Exception.class)
    public CarCareCategory update(String id, UpdateCategoryRequest request) {
        CarCareCategory carCareCategory = findById(id);
        MappingUtils.mapObject(request, carCareCategory);
        carCareCategory.setId(id);
        carCareCategory.setUpdateDate(new Date());

        return carCareCategoryRepository.save(carCareCategory);
    }

    private CarCareCategoryResponse mappingToCarCareCategoryResponse(CarCareCategory carCareCategory) {
        CarCareCategoryResponse response = MappingUtils.mapObject(carCareCategory, CarCareCategoryResponse.class);
        response.setCreateDate(DateTimesUtils.toIsoFormat(carCareCategory.getCreateDate()));
        response.setUpdateDate(DateTimesUtils.toIsoFormat(carCareCategory.getUpdateDate()));

        return response;
    }
}
