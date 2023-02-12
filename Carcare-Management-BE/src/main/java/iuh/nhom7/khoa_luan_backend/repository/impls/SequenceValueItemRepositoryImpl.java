package iuh.nhom7.khoa_luan_backend.repository.impls;

import iuh.nhom7.khoa_luan_backend.entity.SequenceValueItem;
import iuh.nhom7.khoa_luan_backend.repository.SequenceValueItemRepository;
import iuh.nhom7.khoa_luan_backend.repository.SequenceValueItemRepositoryCustom;
import org.springframework.context.annotation.Lazy;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;


public class SequenceValueItemRepositoryImpl implements SequenceValueItemRepositoryCustom {

    private final SequenceValueItemRepository sequenceValueItemRepository;

    public SequenceValueItemRepositoryImpl(@Lazy SequenceValueItemRepository sequenceValueItemRepository) {
        this.sequenceValueItemRepository = sequenceValueItemRepository;
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public synchronized String getSequence(Class forClass) {
        String sequenceName = forClass.getName();
        SequenceValueItem sequenceValueItem = sequenceValueItemRepository.findBySeqName(sequenceName);
        if (null == sequenceValueItem) {
            sequenceValueItem = new SequenceValueItem();
            sequenceValueItem.setSeqName(sequenceName);
            sequenceValueItem.setSeqId(1000);

            sequenceValueItem.setLastUpdatedStamp(new Date());
            sequenceValueItem.setCreatedStamp(new Date());
            sequenceValueItemRepository.save(sequenceValueItem);
            return "1000";
        }
        int sequenceId = sequenceValueItem.getSeqId() + 1;
        sequenceValueItem.setSeqId(sequenceId);
        sequenceValueItem.setLastUpdatedStamp(new Date());
        sequenceValueItemRepository.save(sequenceValueItem);
        return String.valueOf(sequenceId);
    }
}
