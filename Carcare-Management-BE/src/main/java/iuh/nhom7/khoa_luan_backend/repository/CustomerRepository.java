package iuh.nhom7.khoa_luan_backend.repository;

import iuh.nhom7.khoa_luan_backend.entity.Customer;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CustomerRepository extends MongoRepository<Customer, String> {
    Optional<Customer> findByIdentityNumber(String identityNumber);

    Optional<Customer> findByCustomerCode(String customerCode);

    Optional<Customer> findByPhoneNumber(String p);
}
