package iuh.nhom7.khoa_luan_backend.repository;

import iuh.nhom7.khoa_luan_backend.entity.Price;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * 8:44 PM 15-Sep-22
 * Long Tran
 */
public interface PriceRepository extends MongoRepository<Price, String> {

    List<Price> findAllByServiceId(String serviceId);

    Optional<Price> findByServiceId(String serviceId);

    Optional<Price> findByPriceCode(String priceCode);

    List<Price> findAllByIdIn(Collection<String> ids);

    List<Price> findAllByServiceIdIn(Collection<String> ids);

    List<Price> findAllByPriceHeaderId(String priceHeaderId);
    Optional<Price> findByServiceIdAndPriceHeaderId(String serviceId, String priceHeaderId);
}
