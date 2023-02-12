package iuh.nhom7.khoa_luan_backend.service;

import iuh.nhom7.khoa_luan_backend.base.BaseService;
import iuh.nhom7.khoa_luan_backend.common.EnumConst;
import iuh.nhom7.khoa_luan_backend.entity.PromotionDetail;
import iuh.nhom7.khoa_luan_backend.entity.PromotionHeader;
import iuh.nhom7.khoa_luan_backend.entity.PromotionLine;
import iuh.nhom7.khoa_luan_backend.exception.ErrorCode;
import iuh.nhom7.khoa_luan_backend.exception.ServiceException;
import iuh.nhom7.khoa_luan_backend.repository.PromotionDetailRepository;
import iuh.nhom7.khoa_luan_backend.repository.PromotionLineRepository;
import iuh.nhom7.khoa_luan_backend.request.promotion.detail.CreatePromotionDetailRequest;
import iuh.nhom7.khoa_luan_backend.request.promotion.line.CreatePromotionLineRequest;
import iuh.nhom7.khoa_luan_backend.request.promotion.line.UpdatePromotionLineRequest;
import iuh.nhom7.khoa_luan_backend.utils.FinderUtils;
import iuh.nhom7.khoa_luan_backend.utils.MappingUtils;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class PromotionLineService extends BaseService {
    private final PromotionLineRepository promotionLineRepository;
    private final PromotionDetailService promotionDetailService;

    private final PromotionDetailRepository promotionDetailRepository;
    private final FinderUtils finderUtils;

    public PromotionLineService(PromotionLineRepository promotionLineRepository,
                                PromotionDetailService promotionDetailService,
                                PromotionDetailRepository promotionDetailRepository,
                                FinderUtils finderUtils) {
        this.promotionLineRepository = promotionLineRepository;
        this.promotionDetailService = promotionDetailService;
        this.promotionDetailRepository = promotionDetailRepository;
        this.finderUtils = finderUtils;
    }

    public PromotionLine findPromotionLineById(String id) {
        PromotionLine promotionLine = promotionLineRepository.findById(id).orElse(null);
        if (promotionLine == null) {
            throw new ServiceException(ErrorCode.PROMOTION_LINE_NOT_FOUND);
        }
        return promotionLine;
    }

    public PromotionLine findPromotionLineByCode(String code) {
        PromotionLine promotionLine = promotionLineRepository.findByPromotionLineCode(code).orElse(null);
        if (promotionLine == null) {
            throw new ServiceException(ErrorCode.PROMOTION_LINE_NOT_FOUND);
        }
        return promotionLine;
    }

    public List<PromotionLine> findPromotionLineByHeaderId(String id) {
        List<PromotionLine> promotionLines = promotionLineRepository.findAllByPromotionHeaderId(id);
        if (CollectionUtils.isEmpty(promotionLines)) {
            return new ArrayList<>();
        }
        return promotionLines;
    }

    @Transactional(rollbackFor = Exception.class)
    public PromotionLine create(CreatePromotionLineRequest request) {
        if (StringUtils.isEmpty(request.getPromotionHeaderId())) {
            throw new ServiceException(ErrorCode.PROMOTION_HEADER_NOT_FOUND);
        }
        PromotionHeader promotionHeader = finderUtils.findPromotionHeaderById(request.getPromotionHeaderId());
        if (StringUtils.isNotEmpty(request.getPromotionLineCode())) {
            checkPromotionLineExistenceByCode(request.getPromotionLineCode());
        } else {
            request.setPromotionLineCode("PROMOTION_LINE" + sequenceValueItemRepository.getSequence(PromotionLine.class));
        }
        Date now = new Date();
        PromotionLine promotionLine = MappingUtils.mapObject(request, PromotionLine.class);
        promotionLine.setCreateDate(now);
        promotionLine.setUpdateDate(now);
        promotionLine.setStatus(promotionHeader.getStatus());

        Calendar cal = Calendar.getInstance();

        cal.setTime(promotionLine.getFromDate());
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        Date fromDate = cal.getTime();
        promotionLine.setFromDate(fromDate);

        cal.setTime(promotionLine.getToDate());
        cal.set(Calendar.HOUR_OF_DAY, 23);
        cal.set(Calendar.MINUTE, 59);
        cal.set(Calendar.SECOND, 59);
        cal.set(Calendar.MILLISECOND, 999);
        Date toDate = cal.getTime();
        promotionLine.setToDate(toDate);

        if (promotionLine.getFromDate().before(promotionHeader.getFromDate())
                || promotionLine.getToDate().after(promotionHeader.getToDate())) {
            throw new ServiceException(ErrorCode.PROMOTION_LINE_TERM_INVALID);
        }
        promotionLineRepository.save(promotionLine);

        CreatePromotionDetailRequest createPromotionDetailRequest = CreatePromotionDetailRequest.builder()
                .description(promotionLine.getDescription())
                .type(promotionLine.getType())
                .promotionLineId(promotionLine.getId())
                .amount(request.getAmount())
                .minimumSpend(request.getMinimumSpend())
                .maximumDiscount(request.getMaximumDiscount())
                .customerType(request.getCustomerType())
                .serviceIds(request.getServiceIds())
                .limitUsedTime(request.getLimitUsedTime())
                .categoryIds(request.getCategoryIds())
                .limitPromotionAmount(request.getLimitPromotionAmount())
                .build();
        promotionDetailService.create(createPromotionDetailRequest);
        return promotionLine;
    }

    @Transactional(rollbackFor = Exception.class)
    public PromotionLine update(String id, UpdatePromotionLineRequest request) {
        PromotionLine promotionLine = findPromotionLineById(id);
        Date now = new Date();
        Calendar cal = Calendar.getInstance();
        if (StringUtils.isNotEmpty(request.getPromotionLineCode())) {
            checkPromotionLineExistenceByCode(request.getPromotionLineCode());
            promotionLine.setPromotionLineCode(request.getPromotionLineCode());
        }
        if (StringUtils.isNotEmpty(request.getDescription())) {
            promotionLine.setDescription(request.getDescription());
        }
        if (StringUtils.isNotEmpty(request.getType())) {
            promotionLine.setType(request.getType());
        }
        if (request.getFromDate() != null) {
            if (promotionLine.getFromDate().before(now)) {
                throw new ServiceException(ErrorCode.CAN_NOT_UPDATE_FROM_DATE_AFTER_STARTED);
            }
            cal.setTime(request.getFromDate());
            cal.set(Calendar.HOUR_OF_DAY, 0);
            cal.set(Calendar.MINUTE, 0);
            cal.set(Calendar.SECOND, 0);
            cal.set(Calendar.MILLISECOND, 0);
            Date fromDate = cal.getTime();
            promotionLine.setFromDate(fromDate);
        }
        if (request.getToDate() != null) {
            cal.setTime(request.getToDate());
            cal.set(Calendar.HOUR_OF_DAY, 0);
            cal.set(Calendar.MINUTE, 0);
            cal.set(Calendar.SECOND, 0);
            cal.set(Calendar.MILLISECOND, 0);
            Date toDate = cal.getTime();
            if (toDate.before(now)) {
                throw new ServiceException(ErrorCode.PROMOTION_TO_DATE_BEFORE_NOW);
            }
            promotionLine.setToDate(request.getToDate());
        }
        promotionLine.setUpdateDate(new Date());

        PromotionHeader promotionHeader = finderUtils.findPromotionHeaderById(promotionLine.getPromotionHeaderId());
        if (promotionLine.getFromDate().before(promotionHeader.getFromDate())
                || promotionLine.getToDate().after(promotionHeader.getToDate())) {
            throw new ServiceException(ErrorCode.PROMOTION_LINE_TERM_INVALID);
        }
        return promotionLineRepository.save(promotionLine);
    }

    private void checkPromotionLineExistenceByCode(String code) {
        PromotionLine promotionLine = promotionLineRepository.findByPromotionLineCode(code).orElse(null);
        if (promotionLine != null) {
            throw new ServiceException(ErrorCode.PROMOTION_LINE_CODE_EXIST, code);
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public PromotionLine inActivePromotionLine(String id) {
        PromotionLine promotionLine = findPromotionLineById(id);
        promotionLine.setStatus(EnumConst.Status.INACTIVE.toString());
        PromotionDetail promotionDetail = promotionDetailService.findPromotionDetailByPromotionLineId(id);
        promotionDetail.setStatus(EnumConst.Status.INACTIVE.toString());
        promotionDetailRepository.save(promotionDetail);
        return promotionLineRepository.save(promotionLine);
    }


    @Transactional(rollbackFor = Exception.class)
    public PromotionLine activePromotionLine(String id) {
        PromotionLine promotionLine = findPromotionLineById(id);
        promotionLine.setStatus(EnumConst.Status.ACTIVE.toString());
        PromotionDetail promotionDetail = promotionDetailService.findPromotionDetailByPromotionLineId(id);
        if(promotionDetail.getLimitUsedTime()){
            if(promotionDetail.getPromotionUsedAmount() >= promotionDetail.getLimitPromotionAmount().doubleValue()){
                throw new ServiceException(ErrorCode.LIMIT_AMOUNT_LOWER_THAN_MAXIMUM_DISCOUNT, promotionLine.getPromotionLineCode());
            }
            if(!promotionDetail.getType().equals("PERCENTAGE")){
                if ((promotionDetail.getPromotionUsedAmount() + promotionDetail.getAmount().doubleValue()) >= promotionDetail.getLimitPromotionAmount().doubleValue()) {
                    throw new ServiceException(ErrorCode.LIMIT_AMOUNT_LOWER_THAN_MAXIMUM_DISCOUNT, promotionLine.getPromotionLineCode());
                }
            }
        }
        promotionDetail.setStatus(EnumConst.Status.ACTIVE.toString());
        promotionDetailRepository.save(promotionDetail);
        return promotionLineRepository.save(promotionLine);
    }

    @Transactional(rollbackFor = Exception.class)
    public void delete(String id) {
        PromotionLine promotionLine = findPromotionLineById(id);
        promotionLineRepository.delete(promotionLine);
        PromotionDetail promotionDetail = promotionDetailService.findPromotionDetailByPromotionLineId(id);
        promotionDetailRepository.delete(promotionDetail);
    }

}
