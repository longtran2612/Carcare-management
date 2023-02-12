package iuh.nhom7.khoa_luan_backend.service;

import iuh.nhom7.khoa_luan_backend.base.BaseService;
import iuh.nhom7.khoa_luan_backend.common.EnumConst;
import iuh.nhom7.khoa_luan_backend.common.PromotionType;
import iuh.nhom7.khoa_luan_backend.entity.*;
import iuh.nhom7.khoa_luan_backend.exception.ErrorCode;
import iuh.nhom7.khoa_luan_backend.exception.ServiceException;
import iuh.nhom7.khoa_luan_backend.repository.CarCareServiceRepository;
import iuh.nhom7.khoa_luan_backend.repository.PromotionDetailRepository;
import iuh.nhom7.khoa_luan_backend.request.promotion.detail.CreatePromotionDetailRequest;
import iuh.nhom7.khoa_luan_backend.request.promotion.detail.SearchPromotionRequest;
import iuh.nhom7.khoa_luan_backend.request.promotion.detail.UpdatePromotionDetailRequest;
import iuh.nhom7.khoa_luan_backend.utils.FinderUtils;
import iuh.nhom7.khoa_luan_backend.utils.MappingUtils;
import iuh.nhom7.khoa_luan_backend.utils.QueryBuilderUtils;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
public class PromotionDetailService extends BaseService {
    private final MongoTemplate mongoTemplate;
    private final PromotionDetailRepository promotionDetailRepository;
    private final CarCareServiceRepository carCareServiceRepository;
    private final FinderUtils finderUtils;

    public PromotionDetailService(MongoTemplate mongoTemplate,
                                  PromotionDetailRepository promotionDetailRepository,
                                  CarCareServiceRepository carCareServiceRepository,
                                  FinderUtils finderUtils) {
        this.mongoTemplate = mongoTemplate;
        this.promotionDetailRepository = promotionDetailRepository;
        this.carCareServiceRepository = carCareServiceRepository;
        this.finderUtils = finderUtils;
    }

    public PromotionDetail findPromotionDetailById(String id) {
        PromotionDetail promotionDetail = promotionDetailRepository.findById(id).orElse(null);
        if (promotionDetail == null) {
            throw new ServiceException(ErrorCode.PROMOTION_DETAIL_NOT_FOUND);
        }
        return promotionDetail;
    }

    public PromotionDetail findPromotionDetailByCode(String code) {
        PromotionDetail promotionDetail = promotionDetailRepository.findByPromotionDetailCode(code).orElse(null);
        if (promotionDetail == null) {
            throw new ServiceException(ErrorCode.PROMOTION_DETAIL_NOT_FOUND);
        }
        return promotionDetail;
    }

    public List<PromotionDetail> findAllByPromotionLineId(String id) {
        List<PromotionDetail> promotionDetails = promotionDetailRepository.findAllByPromotionLineId(id);
        if (CollectionUtils.isEmpty(promotionDetails)) {
            return new ArrayList<>();
        }
        return promotionDetails;
    }

    public PromotionDetail findPromotionDetailByPromotionLineId(String id) {
        PromotionDetail promotionDetail = promotionDetailRepository.findByPromotionLineId(id).orElse(null);
        if (promotionDetail == null) {
            throw new ServiceException(ErrorCode.PROMOTION_DETAIL_NOT_FOUND);
        }
        return promotionDetail;
    }

    @Transactional(rollbackFor = Exception.class)
    public PromotionDetail create(CreatePromotionDetailRequest request) {
        if (StringUtils.isEmpty(request.getPromotionLineId())) {
            throw new ServiceException(ErrorCode.PROMOTION_LINE_NOT_FOUND);
        }
        PromotionLine promotionLine = finderUtils.findPromotionLineById(request.getPromotionLineId());
        PromotionDetail promotionLineDetail = promotionDetailRepository.findByPromotionLineId(promotionLine.getId()).orElse(null);
        if (promotionLineDetail != null) {
            throw new ServiceException(ErrorCode.PROMOTION_LINE_ALREADY_HAS_DETAIL);
        }
        if (StringUtils.isNotEmpty(request.getPromotionDetailCode())) {
            checkPromotionDetailExistenceByCode(request.getPromotionDetailCode());
        } else {
            request.setPromotionDetailCode("PROMOTION_DETAIL" + sequenceValueItemRepository.getSequence(PromotionDetail.class));
        }
        Date now = new Date();
        PromotionDetail promotionDetail = MappingUtils.mapObject(request, PromotionDetail.class);
        if (promotionDetail.getMinimumSpend() == null) {
            promotionDetail.setMinimumSpend(BigDecimal.valueOf(0));
        }
        if (promotionDetail.getCustomerType() == null) {
            promotionDetail.setCustomerType(0);
        }
        if (BooleanUtils.isTrue(promotionDetail.getLimitUsedTime())) {
            if (promotionDetail.getLimitPromotionAmount() == null) {
                throw new ServiceException(ErrorCode.PROMOTION_DETAIL_LIMIT_AMOUNT_NOT_VALID);
            }
            double limitPromotionAmount = promotionDetail.getLimitPromotionAmount().doubleValue();
            double promotionAmount = promotionDetail.getAmount().doubleValue();
            if (PromotionType.PERCENTAGE.equals(promotionDetail.getType())) {
                double maximumDiscount = promotionDetail.getMaximumDiscount().doubleValue();
                if (limitPromotionAmount < maximumDiscount) {
                    throw new ServiceException(ErrorCode.LIMIT_AMOUNT_LOWER_THAN_MAXIMUM_DISCOUNT);
                }
            }
            if (limitPromotionAmount < promotionAmount) {
                throw new ServiceException(ErrorCode.PROMOTION_DETAIL_LIMIT_AMOUNT_NOT_VALID);
            }
        }
        promotionDetail.setPromotionUsedTime(0);
        promotionDetail.setCreateDate(now);
        promotionDetail.setUpdateDate(now);
        promotionDetail.setStatus(promotionLine.getStatus());
        return promotionDetailRepository.save(promotionDetail);
    }

    @Transactional(rollbackFor = Exception.class)
    public PromotionDetail update(String id, UpdatePromotionDetailRequest request) {
        PromotionDetail promotionDetail = findPromotionDetailById(id);
        if (StringUtils.isNotEmpty(request.getPromotionDetailCode())) {
            checkPromotionDetailExistenceByCode(request.getPromotionDetailCode());
            promotionDetail.setPromotionDetailCode(request.getPromotionDetailCode());
        }
        if (StringUtils.isNotEmpty(request.getDescription())) {
            promotionDetail.setDescription(request.getDescription());
        }
        if (StringUtils.isNotEmpty(request.getType())) {
            promotionDetail.setType(request.getType());
        }
        if (request.getAmount() != null) {
            promotionDetail.setAmount(request.getAmount());
        }
        if (request.getMaximumDiscount() != null) {
            promotionDetail.setMaximumDiscount(request.getMaximumDiscount());
        }
        if (request.getMinimumSpend() != null) {
            promotionDetail.setMinimumSpend(request.getMinimumSpend());
        }
        if (CollectionUtils.isNotEmpty(request.getCategoryIds())) {
            promotionDetail.setCategoryIds(request.getCategoryIds());
        }
        if (ObjectUtils.isNotEmpty(request.getCustomerType())) {
            promotionDetail.setCustomerType(request.getCustomerType());
        }
        if (CollectionUtils.isNotEmpty(request.getServiceIds())) {
            promotionDetail.setServiceIds(request.getServiceIds());
        }
        if (request.getLimitUsedTime() != null) {
            promotionDetail.setLimitUsedTime(request.getLimitUsedTime());
        }
        if (request.getLimitPromotionAmount() != null) {
            promotionDetail.setLimitPromotionAmount(request.getLimitPromotionAmount());
        }
        if (BooleanUtils.isTrue(promotionDetail.getLimitUsedTime())) {
            if (promotionDetail.getLimitPromotionAmount() == null) {
                throw new ServiceException(ErrorCode.PROMOTION_DETAIL_LIMIT_AMOUNT_NOT_VALID);
            }
            double limitPromotionAmount = promotionDetail.getLimitPromotionAmount().doubleValue();
            double promotionAmount = promotionDetail.getAmount().doubleValue();
            if (PromotionType.PERCENTAGE.equals(promotionDetail.getType())) {
                double maximumDiscount = promotionDetail.getMaximumDiscount().doubleValue();
                if (limitPromotionAmount < maximumDiscount) {
                    throw new ServiceException(ErrorCode.LIMIT_AMOUNT_LOWER_THAN_MAXIMUM_DISCOUNT);
                }
            }
            if (limitPromotionAmount < promotionAmount) {
                throw new ServiceException(ErrorCode.PROMOTION_DETAIL_LIMIT_AMOUNT_NOT_VALID);
            }
        }
        promotionDetail.setUpdateDate(new Date());
        return promotionDetailRepository.save(promotionDetail);
    }

    public List<PromotionDetail> getAllUsablePromotionDetailByOrderId(String orderId) {
        Order order = finderUtils.findOrderById(orderId);
        Customer customer = finderUtils.findCustomerById(order.getCustomerId());
        double totalServicePrice = order.getTotalServicePrice().doubleValue();

        //filter
        Criteria criteria = new Criteria();

        List<Criteria> orFilterList = new ArrayList<>();
        Criteria serviceIdsCriteria = Criteria.where("serviceIds").isNull();
        orFilterList.add(serviceIdsCriteria);
        for (CarCareService carCareService : order.getServices()) {
            Criteria categoryIdCriteria = Criteria.where("categoryIds").is(carCareService.getCategoryId());
            orFilterList.add(categoryIdCriteria);

            Criteria serviceIdCriteria = Criteria.where("serviceIds").is(carCareService.getId());
            orFilterList.add(serviceIdCriteria);
        }
        if (CollectionUtils.isNotEmpty(orFilterList)) {
            criteria.orOperator(orFilterList);
        }

        List<Criteria> filterList = new ArrayList<>();
        QueryBuilderUtils.addSingleValueFilter(filterList, "status", EnumConst.Status.ACTIVE.toString());
        Criteria minimumSpendCriteria = Criteria.where("minimumSpend").lte(totalServicePrice);
        filterList.add(minimumSpendCriteria);
        Criteria customerTypeCriteria = Criteria.where("customerType").lte(customer.getStatus());
        filterList.add(customerTypeCriteria);
        criteria.andOperator(filterList);

        // query
        Query query = new Query();
        query.addCriteria(criteria);
        logger.info("=======> query: " + query);
        return mongoTemplate.find(query, PromotionDetail.class);
    }
    public List<PromotionDetail> search(SearchPromotionRequest request) {
        if (CollectionUtils.isEmpty(request.getServiceIds())) {
            return new ArrayList<>();
        }
        Set<CarCareService> services = new HashSet<>();
        for (String serviceId : request.getServiceIds()) {
            CarCareService service = carCareServiceRepository.findById(serviceId).orElse(null);
            if (service == null) {
                continue;
            }
            services.add(service);
        }
        double totalServicePrice = services.stream().mapToDouble(x -> x.getServicePrice().getPrice().doubleValue()).sum();

        //filter
        Criteria criteria = new Criteria();

        List<Criteria> orFilterList = new ArrayList<>();
        Criteria serviceIdsCriteria = Criteria.where("serviceIds").isNull();
        orFilterList.add(serviceIdsCriteria);
        for (CarCareService carCareService : services) {
            Criteria categoryIdCriteria = Criteria.where("categoryIds").is(carCareService.getCategoryId());
            orFilterList.add(categoryIdCriteria);

            Criteria serviceIdCriteria = Criteria.where("serviceIds").is(carCareService.getId());
            orFilterList.add(serviceIdCriteria);
        }
        if (CollectionUtils.isNotEmpty(orFilterList)) {
            criteria.orOperator(orFilterList);
        }



        List<Criteria> filterList = new ArrayList<>();

        QueryBuilderUtils.addSingleValueFilter(filterList, "customerType", request.getCustomerType());

        QueryBuilderUtils.addSingleValueFilter(filterList, "status", EnumConst.Status.ACTIVE.toString());
        Criteria minimumSpendCriteria = Criteria.where("minimumSpend").lte(totalServicePrice);
        filterList.add(minimumSpendCriteria);

        criteria.andOperator(filterList);



        Query query = new Query();
        query.addCriteria(criteria);
        logger.info("=======> query: " + query);
        return mongoTemplate.find(query, PromotionDetail.class);
    }
    public List<PromotionDetail> getAllUsablePromotionDetailByServiceIds(List<String> serviceIds) {
        if (CollectionUtils.isEmpty(serviceIds)) {
            return new ArrayList<>();
        }
        Set<CarCareService> services = new HashSet<>();
        for (String serviceId : serviceIds) {
            CarCareService service = carCareServiceRepository.findById(serviceId).orElse(null);
            if (service == null) {
                continue;
            }
            services.add(service);
        }
        double totalServicePrice = services.stream().mapToDouble(x -> x.getServicePrice().getPrice().doubleValue()).sum();


        //filter
        Criteria criteria = new Criteria();

        List<Criteria> orFilterList = new ArrayList<>();
        Criteria serviceIdsCriteria = Criteria.where("serviceIds").isNull();
        orFilterList.add(serviceIdsCriteria);
        for (CarCareService carCareService : services) {
            Criteria categoryIdCriteria = Criteria.where("categoryIds").is(carCareService.getCategoryId());
            orFilterList.add(categoryIdCriteria);

            Criteria serviceIdCriteria = Criteria.where("serviceIds").is(carCareService.getId());
            orFilterList.add(serviceIdCriteria);
        }
        if (CollectionUtils.isNotEmpty(orFilterList)) {
            criteria.orOperator(orFilterList);
        }

        List<Criteria> filterList = new ArrayList<>();
        QueryBuilderUtils.addSingleValueFilter(filterList, "status", EnumConst.Status.ACTIVE.toString());
        Criteria minimumSpendCriteria = Criteria.where("minimumSpend").lte(totalServicePrice);
        filterList.add(minimumSpendCriteria);
        Criteria customerTypeCriteria = Criteria.where("customerType").lte(0);
        filterList.add(customerTypeCriteria);
        criteria.andOperator(filterList);

        // query
        Query query = new Query();
        query.addCriteria(criteria);
        logger.info("=======> query: " + query);
        return mongoTemplate.find(query, PromotionDetail.class);
    }



    private void checkPromotionDetailExistenceByCode(String code) {
        PromotionDetail promotionDetail = promotionDetailRepository.findByPromotionDetailCode(code).orElse(null);
        if (promotionDetail != null) {
            throw new ServiceException(ErrorCode.PROMOTION_DETAIL_CODE_EXIST, code);
        }
    }
}
