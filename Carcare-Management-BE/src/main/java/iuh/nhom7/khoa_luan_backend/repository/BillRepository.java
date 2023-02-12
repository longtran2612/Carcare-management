package iuh.nhom7.khoa_luan_backend.repository;

import iuh.nhom7.khoa_luan_backend.entity.Bill;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface BillRepository extends MongoRepository<Bill, String> {
    Optional<Bill> findByBillCode(String code);
    List<Bill> findAllByCustomerId(String customerId);
    List<Bill> findAllByStatus(Integer status);
}
