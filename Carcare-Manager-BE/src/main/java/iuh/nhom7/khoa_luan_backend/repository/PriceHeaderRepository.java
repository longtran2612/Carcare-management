package iuh.nhom7.khoa_luan_backend.repository;

import iuh.nhom7.khoa_luan_backend.entity.PriceHeader;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

/**
 * 7:29 PM 20-Sep-22
 * Long Tran
 */

public interface PriceHeaderRepository extends MongoRepository<PriceHeader, String> {
    List<PriceHeader> findAllByStatus(String status);

    Optional<PriceHeader> findByPriceHeaderCode(String s);
}
