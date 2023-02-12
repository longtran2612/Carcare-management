package iuh.nhom7.khoa_luan_backend.repository;

import iuh.nhom7.khoa_luan_backend.entity.PromotionHeader;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface PromotionHeaderRepository extends MongoRepository<PromotionHeader, String> {
    Optional<PromotionHeader> findByPromotionHeaderCode(String s);
}
