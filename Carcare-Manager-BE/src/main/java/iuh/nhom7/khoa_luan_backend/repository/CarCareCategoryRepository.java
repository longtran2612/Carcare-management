package iuh.nhom7.khoa_luan_backend.repository;

import iuh.nhom7.khoa_luan_backend.entity.CarCareCategory;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

/**
 * 8:44 PM 15-Sep-22
 * Long Tran
 */

public interface CarCareCategoryRepository extends MongoRepository<CarCareCategory, String> {
    Optional<CarCareCategory> findByCategoryCode(String code);
}
