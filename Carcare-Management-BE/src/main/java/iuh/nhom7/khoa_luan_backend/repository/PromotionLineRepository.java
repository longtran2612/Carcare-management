package iuh.nhom7.khoa_luan_backend.repository;

import iuh.nhom7.khoa_luan_backend.entity.PromotionLine;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface PromotionLineRepository extends MongoRepository<PromotionLine, String> {
    List<PromotionLine> findAllByPromotionHeaderId(String s);

    Optional<PromotionLine> findByPromotionLineCode(String s);

    List<PromotionLine> findAllByStatus(String status);
}
