package iuh.nhom7.khoa_luan_backend.service;

import iuh.nhom7.khoa_luan_backend.base.BaseService;
import iuh.nhom7.khoa_luan_backend.common.EnumConst;
import iuh.nhom7.khoa_luan_backend.entity.PromotionDetail;
import iuh.nhom7.khoa_luan_backend.entity.PromotionHeader;
import iuh.nhom7.khoa_luan_backend.entity.PromotionLine;
import iuh.nhom7.khoa_luan_backend.exception.ErrorCode;
import iuh.nhom7.khoa_luan_backend.exception.ServiceException;
import iuh.nhom7.khoa_luan_backend.repository.PromotionHeaderRepository;
import iuh.nhom7.khoa_luan_backend.request.promotion.header.CreatePromotionHeaderRequest;
import iuh.nhom7.khoa_luan_backend.request.promotion.header.UpdatePromotionHeaderRequest;
import iuh.nhom7.khoa_luan_backend.utils.MappingUtils;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class PromotionHeaderService extends BaseService {
    private final PromotionHeaderRepository promotionHeaderRepository;

    private final PromotionLineService promotionLineService;



    public PromotionHeaderService(PromotionHeaderRepository promotionHeaderRepository,
                                  PromotionLineService promotionLineService) {
        this.promotionHeaderRepository = promotionHeaderRepository;
        this.promotionLineService = promotionLineService;
    }

    public PromotionHeader findPromotionHeaderById(String id) {
        PromotionHeader promotionHeader = promotionHeaderRepository.findById(id).orElse(null);
        if (promotionHeader == null) {
            throw new ServiceException(ErrorCode.PROMOTION_HEADER_NOT_FOUND);
        }
        return promotionHeader;
    }

    public PromotionHeader findPromotionHeaderByCode(String code) {
        PromotionHeader promotionHeader = promotionHeaderRepository.findByPromotionHeaderCode(code).orElse(null);
        if (promotionHeader == null) {
            throw new ServiceException(ErrorCode.PROMOTION_HEADER_NOT_FOUND);
        }
        return promotionHeader;
    }

    @Transactional(rollbackFor = Exception.class)
    public PromotionHeader create(CreatePromotionHeaderRequest request) {
        if (StringUtils.isNotEmpty(request.getPromotionHeaderCode())) {
            checkPromotionHeaderExistenceByCode(request.getPromotionHeaderCode());
        } else {
            request.setPromotionHeaderCode("PROMOTION_HEADER" + sequenceValueItemRepository.getSequence(PromotionHeader.class));
        }
        Date now = new Date();
        PromotionHeader promotionHeader = MappingUtils.mapObject(request, PromotionHeader.class);
        promotionHeader.setCreateDate(now);
        promotionHeader.setUpdateDate(now);
        promotionHeader.setStatus(EnumConst.Status.ACTIVE.toString());
        if (promotionHeader.getFromDate().after(promotionHeader.getToDate())) {
            throw new ServiceException(ErrorCode.PROMOTION_HEADER_TERM_INVALID);
        }

        Calendar cal = Calendar.getInstance();

        cal.setTime(promotionHeader.getFromDate());
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        Date fromDate = cal.getTime();
        promotionHeader.setFromDate(fromDate);

        cal.setTime(promotionHeader.getToDate());
        cal.set(Calendar.HOUR_OF_DAY, 23);
        cal.set(Calendar.MINUTE, 59);
        cal.set(Calendar.SECOND, 59);
        cal.set(Calendar.MILLISECOND, 999);
        Date toDate = cal.getTime();
        if (toDate.before(now)) {
            throw new ServiceException(ErrorCode.PROMOTION_TO_DATE_BEFORE_NOW);
        }
        promotionHeader.setToDate(toDate);

        return promotionHeaderRepository.save(promotionHeader);
    }

    @Transactional(rollbackFor = Exception.class)
    public PromotionHeader update(String id, UpdatePromotionHeaderRequest request) {
        PromotionHeader promotionHeader = findPromotionHeaderById(id);
        Calendar cal = Calendar.getInstance();
        Date now = new Date();
        if (StringUtils.isNotEmpty(request.getDescription())) {
            promotionHeader.setDescription(request.getDescription());
        }
        if (request.getFromDate() != null) {
            if (promotionHeader.getFromDate().before(now)) {
                throw new ServiceException(ErrorCode.CAN_NOT_UPDATE_FROM_DATE_AFTER_STARTED);
            }
            cal.setTime(request.getFromDate());
            cal.set(Calendar.HOUR_OF_DAY, 0);
            cal.set(Calendar.MINUTE, 0);
            cal.set(Calendar.SECOND, 0);
            cal.set(Calendar.MILLISECOND, 0);
            Date fromDate = cal.getTime();
            promotionHeader.setFromDate(fromDate);
        }
        if (request.getToDate() != null) {
            cal.setTime(request.getToDate());
            cal.set(Calendar.HOUR_OF_DAY, 23);
            cal.set(Calendar.MINUTE, 59);
            cal.set(Calendar.SECOND, 59);
            cal.set(Calendar.MILLISECOND, 999);
            Date toDate = cal.getTime();
            if (toDate.before(now)) {
                throw new ServiceException(ErrorCode.PROMOTION_TO_DATE_BEFORE_NOW);
            }
            promotionHeader.setToDate(toDate);
        }
        promotionHeader.setUpdateDate(new Date());
        if (promotionHeader.getFromDate().after(promotionHeader.getToDate())) {
            throw new ServiceException(ErrorCode.PROMOTION_HEADER_TERM_INVALID);
        }

        return promotionHeaderRepository.save(promotionHeader);
    }

    private void checkPromotionHeaderExistenceByCode(String code) {
        PromotionHeader promotionHeader = promotionHeaderRepository.findByPromotionHeaderCode(code).orElse(null);
        if (promotionHeader != null) {
            throw new ServiceException(ErrorCode.PROMOTION_HEADER_CODE_EXIST, code);
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public PromotionHeader inActivePromotionHeader(String id) {
        PromotionHeader promotionHeader = findPromotionHeaderById(id);
        promotionHeader.setStatus(EnumConst.Status.INACTIVE.toString());
        List<PromotionLine> promotionLines = promotionLineService.findPromotionLineByHeaderId(id);
        if(CollectionUtils.isNotEmpty(promotionLines)){
            for(PromotionLine promotionLine : promotionLines){
                promotionLineService.inActivePromotionLine(promotionLine.getId());

            }
        }
        return promotionHeaderRepository.save(promotionHeader);

    }
    @Transactional(rollbackFor = Exception.class)
    public PromotionHeader activePromotionHeader(String id) {
        PromotionHeader promotionHeader = findPromotionHeaderById(id);
        promotionHeader.setStatus(EnumConst.Status.ACTIVE.toString());
        List<PromotionLine> promotionLines = promotionLineService.findPromotionLineByHeaderId(id);
        if(CollectionUtils.isNotEmpty(promotionLines)){
            for(PromotionLine promotionLine : promotionLines){
                promotionLineService.activePromotionLine(promotionLine.getId());
            }
        }
       return promotionHeaderRepository.save(promotionHeader);
    }
    @Transactional(rollbackFor = Exception.class)
    public void delete(String id) {
        PromotionHeader promotionHeader = findPromotionHeaderById(id);
        List<PromotionLine> promotionLines = promotionLineService.findPromotionLineByHeaderId(id);
        if(CollectionUtils.isNotEmpty(promotionLines)){
            for(PromotionLine promotionLine : promotionLines){
                promotionLineService.delete(promotionLine.getId());
            }
        }
        promotionHeaderRepository.delete(promotionHeader);
    }
}
