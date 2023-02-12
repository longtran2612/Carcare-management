package iuh.nhom7.khoa_luan_backend.service;

import iuh.nhom7.khoa_luan_backend.common.Extensions;
import iuh.nhom7.khoa_luan_backend.entity.Car;
import iuh.nhom7.khoa_luan_backend.entity.CarModel;
import iuh.nhom7.khoa_luan_backend.exception.ErrorCode;
import iuh.nhom7.khoa_luan_backend.exception.ServiceException;
import iuh.nhom7.khoa_luan_backend.repository.CarModelRepository;
import iuh.nhom7.khoa_luan_backend.repository.CarRepository;
import iuh.nhom7.khoa_luan_backend.base.BaseService;
import iuh.nhom7.khoa_luan_backend.common.EnumConst;
import iuh.nhom7.khoa_luan_backend.request.CreateCarRequest;
import iuh.nhom7.khoa_luan_backend.request.UpdateCarRequest;
import iuh.nhom7.khoa_luan_backend.utils.FinderUtils;
import iuh.nhom7.khoa_luan_backend.utils.MappingUtils;
import iuh.nhom7.khoa_luan_backend.utils.ServiceUtils;
import iuh.nhom7.khoa_luan_backend.utils.TextUtils;
import lombok.experimental.ExtensionMethod;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

/**
 * 9:18 PM 20-Sep-22
 * Long Tran
 */
@Service
@ExtensionMethod(Extensions.class)
public class CarService extends BaseService {
    @Value("${car.url}")
    private String carUrl;
    private final CarRepository carRepository;
    private final CarModelRepository carModelRepository;
    private final ServiceUtils serviceUtils;
    private final FinderUtils finderUtils;

    public CarService(CarRepository carRepository,
                      CarModelRepository carModelRepository,
                      ServiceUtils serviceUtils,
                      FinderUtils finderUtils) {
        this.carRepository = carRepository;
        this.carModelRepository = carModelRepository;
        this.serviceUtils = serviceUtils;
        this.finderUtils = finderUtils;
    }

    public Car findCarById(String id) {
        Car car = carRepository.findById(id).orElse(null);
        if (car == null) {
            throw new ServiceException(ErrorCode.CAR_NOT_FOUND);
        }
        return car;
    }

    public Car findCarByCode(String code) {
        Car car = carRepository.findByCarCode(code).orElse(null);
        if (car == null) {
            throw new ServiceException(ErrorCode.CAR_NOT_FOUND);
        }
        return car;
    }

    public List<Car> findCarsByCustomerId(String customerId) {
        return carRepository.findAllByCustomerId(customerId);
    }

    @Transactional(rollbackFor = Exception.class)
    public Car create(CreateCarRequest request) {
        if (StringUtils.isEmpty(request.getCarModel())) {
            throw new ServiceException(ErrorCode.CAR_MODEL_NOT_FOUND);
        }
        Car car = MappingUtils.mapObject(request, Car.class);
        car.setCarCode("CAR" + sequenceValueItemRepository.getSequence(Car.class));
        car.setStatus(EnumConst.Status.ACTIVE.name());
        car.setCreateDate(new Date());
        car.setUpdateDate(new Date());
        car.setImageUrl(carUrl);
        serviceUtils.fillingMissingValue(car);

        CarModel carModel = carModelRepository.findByCarModelCode(request.getCarModel()).orElse(null);
        if (carModel == null) {
            throw new ServiceException(ErrorCode.CAR_MODEL_NOT_FOUND);
        }
        fillingCarModelInfo(car, carModel);
        return carRepository.save(car);
    }

    @Transactional(rollbackFor = Exception.class)
    public Car update(String id, UpdateCarRequest request) {
        Car car = findCarById(id);
        if (StringUtils.isNotEmpty(request.getName())) {
            car.setName(request.getName());
        }
        if (StringUtils.isNotEmpty(request.getColor())) {
            car.setColor(request.getColor());
        }
        if (StringUtils.isNotEmpty(request.getLicensePlate())) {
            car.setLicensePlate(request.getLicensePlate());
        }
        if (StringUtils.isNotEmpty(request.getImageUrl())) {
            car.setImageUrl(request.getImageUrl());
        }
        car.setUpdateDate(new Date());
        if (StringUtils.isNotEmpty(request.getCarModel())){
            CarModel carModel = carModelRepository.findByCarModelCode(request.getCarModel()).orElse(null);
            if (carModel == null) {
                throw new ServiceException(ErrorCode.CAR_MODEL_NOT_FOUND);
            }
            fillingCarModelInfo(car, carModel);
        }

        return carRepository.save(car);
    }

    private Car fillingCarModelInfo(Car car, CarModel carModel) {
        car.setBrand(StringUtils.isEmpty(carModel.getBrand()) ? null : carModel.getBrand());
        car.setModel(StringUtils.isEmpty(carModel.getModel()) ? null : carModel.getModel());
        car.setEngine(StringUtils.isEmpty(carModel.getEngine()) ? null : carModel.getEngine());
        car.setTransmission(StringUtils.isEmpty(carModel.getTransmission()) ? null : carModel.getTransmission());
        car.setSeats(ObjectUtils.isEmpty(carModel.getSeats()) ? null : carModel.getSeats());
        car.setFuel(StringUtils.isEmpty(carModel.getFuel()) ? null : carModel.getFuel());
        car.setYear(ObjectUtils.isEmpty(carModel.getYear()) ? null : carModel.getYear());
        car.setCarModelCode(StringUtils.isEmpty(carModel.getCarModelCode()) ? null : carModel.getCarModelCode());

        return car;
    }

}
