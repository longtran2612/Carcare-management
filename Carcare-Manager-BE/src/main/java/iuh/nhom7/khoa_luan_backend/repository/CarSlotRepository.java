package iuh.nhom7.khoa_luan_backend.repository;

import iuh.nhom7.khoa_luan_backend.entity.CarSlot;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Optional;

/**
 * 4:51 PM 20-Sep-22
 * Long Tran
 */
public interface CarSlotRepository extends MongoRepository<CarSlot, String> {
    Optional<CarSlot> findByOrderId(String id);
    Optional<CarSlot> findByCarSlotCode(String s);
    @Query(value = "{}", count = true)
    long count();
}
