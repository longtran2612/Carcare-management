package iuh.nhom7.khoa_luan_backend.repository;

import iuh.nhom7.khoa_luan_backend.entity.Car;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

/**
 * 4:50 PM 20-Sep-22
 * Long Tran
 */
public interface CarRepository extends MongoRepository<Car, String> {

    List<Car> findAllByCustomerId(String customerId);

    Optional<Car> findByCarCode(String s);
}
