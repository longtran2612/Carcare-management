package iuh.nhom7.khoa_luan_backend.converter;

import iuh.nhom7.khoa_luan_backend.entity.CarSlot;
import iuh.nhom7.khoa_luan_backend.model.profile.CarSlotProfile;
import iuh.nhom7.khoa_luan_backend.model.search.ParameterSearchService;
import iuh.nhom7.khoa_luan_backend.repository.CarRepository;
import iuh.nhom7.khoa_luan_backend.service.CarService;
import iuh.nhom7.khoa_luan_backend.service.CarCareServiceService;
import iuh.nhom7.khoa_luan_backend.utils.FinderUtils;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * 2:35 PM 25-Sep-22
 * Long Tran
 */
@Component
public class CarSlotConverter {
    private final CarService carService;
    private final CarRepository carRepository;
    private final CarCareServiceService carCareServiceService;
    private final FinderUtils finderUtils;

    public CarSlotConverter(CarService carService,
                            CarRepository carRepository,
                            CarCareServiceService carCareServiceService,
                            FinderUtils finderUtils) {
        this.carService = carService;
        this.carRepository = carRepository;
        this.carCareServiceService = carCareServiceService;
        this.finderUtils = finderUtils;
    }


    public List<CarSlotProfile> getCarSlotProfile(List<CarSlot> carSlots){
        List<CarSlotProfile> carSlotProfiles = new ArrayList<>();
        for (CarSlot carSlot : carSlots) {
            carSlotProfiles.add(getCarSlotProfile(carSlot));
        }

        return carSlotProfiles;
    }

    public CarSlotProfile getCarSlotProfile(CarSlot carSlot){
        CarSlotProfile carSlotProfile = CarSlotProfile.builder()
                .id(carSlot.getId())
                .carSlotCode(carSlot.getCarSlotCode())
                .name(carSlot.getName())
                .slotNumber(carSlot.getSlotNumber())
                .status(carSlot.getStatus())
                .createBy(carSlot.getCreateBy())
                .createDate(carSlot.getCreateDate())
                .updateDate(carSlot.getUpdateDate())
                .build();

        return carSlotProfile;
    }
}
