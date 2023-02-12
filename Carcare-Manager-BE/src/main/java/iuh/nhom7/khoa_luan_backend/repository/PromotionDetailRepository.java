package iuh.nhom7.khoa_luan_backend.repository;

import iuh.nhom7.khoa_luan_backend.entity.PromotionDetail;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface PromotionDetailRepository extends MongoRepository<PromotionDetail, String> {
    List<PromotionDetail> findAllByPromotionLineId(String id);
    Optional<PromotionDetail> findByPromotionLineId(String id);

    Optional<PromotionDetail> findByPromotionDetailCode(String s);
}
