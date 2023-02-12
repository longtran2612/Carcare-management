package iuh.nhom7.khoa_luan_backend.base;

import iuh.nhom7.khoa_luan_backend.repository.SequenceValueItemRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * 10:07 PM 20-Sep-22
 * Long Tran
 */
public abstract class BaseService extends BaseObjectLoggable {

    @Autowired
    protected  SequenceValueItemRepository sequenceValueItemRepository;

    protected ModelMapper modelMapper = new ModelMapper();


}
