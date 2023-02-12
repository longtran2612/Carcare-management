package iuh.nhom7.khoa_luan_backend.repository;

import iuh.nhom7.khoa_luan_backend.entity.CarCareService;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

/**
 * 8:43 PM 15-Sep-22
 * Long Tran
 */

public interface CarCareServiceRepository extends MongoRepository<CarCareService, String> {
    boolean existsById(String id);

    Optional<CarCareService> findByServiceCode(String code);
}
