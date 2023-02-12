package iuh.nhom7.khoa_luan_backend.converter;

import iuh.nhom7.khoa_luan_backend.entity.Car;
import iuh.nhom7.khoa_luan_backend.model.profile.CarProfile;
import iuh.nhom7.khoa_luan_backend.repository.CarModelRepository;
import iuh.nhom7.khoa_luan_backend.repository.UserRepository;
import org.springframework.stereotype.Component;

/**
 * 2:35 PM 25-Sep-22
 * Long Tran
 */
@Component
public class CarConverter {

    private final UserRepository userRepository;

    private final CarModelRepository carModelRepository;

    public CarConverter(UserRepository userRepository,
                        CarModelRepository carModelRepository) {
        this.userRepository = userRepository;
        this.carModelRepository = carModelRepository;
    }

    public CarProfile getCarProfile(Car car) {
        return CarProfile.builder()
                .id(car.getId())
                .name(car.getName())
                .color(car.getColor())
//                .status(car.getStatus())
                .licensePlate(car.getLicensePlate())
                .description(car.getDescription())
//                .user(userRepository.findById(car.getUserId()).orElse(null))
//                .carModel(carModelRepository.findById(car.getCarModelId()).orElse(null))
                .imageUrl(car.getImageUrl())
                .createDate(car.getCreateDate())
                .createBy(car.getCreateBy())
                .updateDate(car.getUpdateDate())
                .updateBy(car.getUpdateBy())
                .build();
    }
}
