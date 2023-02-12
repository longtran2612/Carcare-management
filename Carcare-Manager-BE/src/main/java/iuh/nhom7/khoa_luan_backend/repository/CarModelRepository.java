package iuh.nhom7.khoa_luan_backend.repository;

import iuh.nhom7.khoa_luan_backend.entity.CarModel;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

/**
 * 4:50 PM 20-Sep-22
 * Long Tran
 */
public interface CarModelRepository extends MongoRepository<CarModel, String> {
    Optional<CarModel> findByCarModelCode(String s);

    List<CarModel> findAllByBrand(String s);
}
