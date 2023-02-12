package iuh.nhom7.khoa_luan_backend.repository;


import iuh.nhom7.khoa_luan_backend.entity.SequenceValueItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

public interface SequenceValueItemRepository extends MongoRepository<SequenceValueItem, String>, SequenceValueItemRepositoryCustom {

    SequenceValueItem findBySeqName(String sequenceName);

}
