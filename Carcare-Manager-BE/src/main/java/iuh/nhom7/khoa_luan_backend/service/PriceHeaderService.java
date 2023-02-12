package iuh.nhom7.khoa_luan_backend.service;

import iuh.nhom7.khoa_luan_backend.common.CarCareServiceStatus;
import iuh.nhom7.khoa_luan_backend.common.EnumConst;
import iuh.nhom7.khoa_luan_backend.common.PriceStatus;
import iuh.nhom7.khoa_luan_backend.entity.CarCareService;
import iuh.nhom7.khoa_luan_backend.entity.Price;
import iuh.nhom7.khoa_luan_backend.entity.PriceHeader;
import iuh.nhom7.khoa_luan_backend.exception.ErrorCode;
import iuh.nhom7.khoa_luan_backend.exception.ServiceException;
import iuh.nhom7.khoa_luan_backend.model.PriceModel;
import iuh.nhom7.khoa_luan_backend.repository.CarCareServiceRepository;
import iuh.nhom7.khoa_luan_backend.repository.PriceHeaderRepository;
import iuh.nhom7.khoa_luan_backend.repository.PriceRepository;
import iuh.nhom7.khoa_luan_backend.base.BaseService;
import iuh.nhom7.khoa_luan_backend.request.CreatePriceHeaderRequest;
import iuh.nhom7.khoa_luan_backend.request.UpdatePriceHeaderRequest;
import iuh.nhom7.khoa_luan_backend.response.priceHeader.PriceHeaderResponse;
import iuh.nhom7.khoa_luan_backend.utils.DateTimesUtils;
import iuh.nhom7.khoa_luan_backend.utils.FinderUtils;
import iuh.nhom7.khoa_luan_backend.utils.MappingUtils;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * 7:42 PM 20-Sep-22
 * Long Tran
 */
@Service
public class PriceHeaderService extends BaseService {
    private final PriceHeaderRepository priceHeaderRepository;
    private final PriceRepository priceRepository;
    private final CarCareServiceRepository carCareServiceRepository;
    private final FinderUtils finderUtils;
    private final MongoTemplate mongoTemplate;

    public PriceHeaderService(PriceHeaderRepository priceHeaderRepository,
                              PriceRepository priceRepository,
                              CarCareServiceRepository carCareServiceRepository,
                              FinderUtils finderUtils,
                              MongoTemplate mongoTemplate) {
        this.priceHeaderRepository = priceHeaderRepository;
        this.priceRepository = priceRepository;
        this.carCareServiceRepository = carCareServiceRepository;
        this.finderUtils = finderUtils;
        this.mongoTemplate = mongoTemplate;
    }

    public PriceHeader findById(String priceHeaderId) {
        PriceHeader priceHeader = priceHeaderRepository.findById(priceHeaderId).orElse(null);
        if (priceHeader == null) {
            throw new ServiceException(ErrorCode.PRICE_HEADER_NOT_FOUND);
        }
        return priceHeader;
    }

    public PriceHeader findByCode(String priceHeaderCode) {
        PriceHeader priceHeader = priceHeaderRepository.findByPriceHeaderCode(priceHeaderCode).orElse(null);
        if (priceHeader == null) {
            throw new ServiceException(ErrorCode.PRICE_HEADER_NOT_FOUND);
        }
        return priceHeader;
    }

    public PriceHeaderResponse getPriceHeaderById(String priceHeaderId) {
        return mappingToPriceHeaderResponse(findById(priceHeaderId));
    }

    @Transactional(rollbackFor = Exception.class)
    public PriceHeader create(CreatePriceHeaderRequest request) {
        Calendar cal = Calendar.getInstance();
        if (request.getEffectiveDate() != null) {
            cal.setTime(request.getEffectiveDate());
            cal.set(Calendar.HOUR_OF_DAY, 0);
            cal.set(Calendar.MINUTE, 0);
            cal.set(Calendar.SECOND, 0);
            cal.set(Calendar.MILLISECOND, 0);
            Date fromDate = cal.getTime();
            request.setEffectiveDate(fromDate);
        }
        if (request.getExpirationDate() != null) {
            cal.setTime(request.getExpirationDate());
            cal.set(Calendar.HOUR_OF_DAY, 16);
            cal.set(Calendar.MINUTE, 59);
            cal.set(Calendar.SECOND, 59);
            cal.set(Calendar.MILLISECOND, 999);
            Date toDate = cal.getTime();
            request.setExpirationDate(toDate);
        }
        PriceHeader priceHeader = PriceHeader.builder()
                .name(request.getName())
                .description(request.getDescription())
                .fromDate(request.getEffectiveDate())
                .toDate(request.getExpirationDate())
                .createDate(new Date())
                .updateDate(new Date())
                .status(EnumConst.Status.INACTIVE.name())
                .build();
        validRequest(priceHeader);
        priceHeader.setPriceHeaderCode("PRICE_HEADER" + sequenceValueItemRepository.getSequence(PriceHeader.class));
        return priceHeaderRepository.save(priceHeader);
    }

    @Transactional(rollbackFor = Exception.class)
    public PriceHeader update(String id, UpdatePriceHeaderRequest request) {
        PriceHeader priceHeader = findById(id);
        Calendar cal = Calendar.getInstance();
        Date now = new Date();
        if (StringUtils.isNotEmpty(request.getName())) {
            priceHeader.setName(request.getName());
        }
        if (StringUtils.isNotEmpty(request.getDescription())) {
            priceHeader.setDescription(request.getDescription());
        }
        if (request.getFromDate() != null) {
            if (priceHeader.getFromDate().before(now)) {
                throw new ServiceException(ErrorCode.CAN_NOT_UPDATE_FROM_DATE_AFTER_STARTED);
            }
            cal.setTime(request.getFromDate());
            cal.set(Calendar.HOUR_OF_DAY, 0);
            cal.set(Calendar.MINUTE, 0);
            cal.set(Calendar.SECOND, 0);
            cal.set(Calendar.MILLISECOND, 0);
            Date fromDate = cal.getTime();
            priceHeader.setFromDate(fromDate);
        }
        if (request.getToDate() != null) {
            cal.setTime(request.getToDate());
            cal.set(Calendar.HOUR_OF_DAY, 16);
            cal.set(Calendar.MINUTE, 59);
            cal.set(Calendar.SECOND, 59);
            cal.set(Calendar.MILLISECOND, 999);
            Date toDate = cal.getTime();
            if (toDate.before(now)) {
                throw new ServiceException(ErrorCode.PROMOTION_TO_DATE_BEFORE_NOW);
            }
            priceHeader.setToDate(toDate);
        }
        priceHeader.setUpdateDate(new Date());
        validRequest(priceHeader);
        return priceHeaderRepository.save(priceHeader);
    }

    @Transactional(rollbackFor = Exception.class)
    public PriceHeader getActivePriceHeader() {
        List<PriceHeader> priceHeaderList = priceHeaderRepository.findAllByStatus(EnumConst.Status.ACTIVE.name());
        if (CollectionUtils.isNotEmpty(priceHeaderList)) {
            for (PriceHeader priceHeader : priceHeaderList) {
                Date now = new Date();
                if (now.before(priceHeader.getFromDate()) || now.after(priceHeader.getToDate())) {
                    continue;
                }
                return priceHeader;
            }
        }
        return autoCreatePriceHeader();
    }

    @Transactional(rollbackFor = Exception.class)
    public PriceHeader activePriceHeader(String id) {
        PriceHeader priceHeader = findById(id);
        List<Price> priceList = priceRepository.findAllByPriceHeaderId(priceHeader.getId());
        Date now = new Date();
        if (now.before(priceHeader.getFromDate()) || now.after(priceHeader.getToDate())) {
            throw new ServiceException(ErrorCode.PRICE_HEADER_EXPIRED_OR_NOT_YET_EFFECTIVE);
        }

        if (CollectionUtils.isEmpty(priceList)) {
            throw new ServiceException(ErrorCode.PRICE_HEADER_HAVE_NO_PRICE);
        }

        List<PriceHeader> priceHeaderList = priceHeaderRepository.findAllByStatus(EnumConst.Status.ACTIVE.name());
        for (PriceHeader activePriceHeader : priceHeaderList) {
            if (activePriceHeader.getId().equals(priceHeader.getId())) {
                continue;
            }
            Set<String> duplicateServiceIds = new HashSet<>();
            priceHeader.getServiceIds().forEach(serviceId -> {
                if (activePriceHeader.getServiceIds().contains(serviceId)) {
                    duplicateServiceIds.add(serviceId);
                }
            });
            if (CollectionUtils.isEmpty(duplicateServiceIds)) {
                continue;
            }
            for (String duplicateServiceId : duplicateServiceIds) {
                Price duplicatePrice = priceRepository.findByServiceIdAndPriceHeaderId(duplicateServiceId, activePriceHeader.getId()).orElse(null);
                if (duplicatePrice == null || duplicatePrice.getStatus() == PriceStatus.ACTIVE) {
                    assert duplicatePrice != null;
                    throw new ServiceException(ErrorCode.PRICE_HEADER_CONTAINS_DUPLICATE_SERVICE_PRICE_ACTIVE, duplicatePrice.getServiceCode(), activePriceHeader.getPriceHeaderCode());
                }
            }
        }

        updateActivePriceHeader(priceHeader);

        // update services price
        for (Price price : priceList) {
            try {
                price.setStatus(PriceStatus.ACTIVE);
                price.setStatusName(PriceStatus.mapPriceStatus.get(PriceStatus.ACTIVE));
                priceRepository.save(price);

                CarCareService carCareService = finderUtils.findCarCareServiceById(price.getServiceId());
                PriceModel servicePrice = new PriceModel();
                servicePrice.setPriceCode(price.getPriceCode());
                servicePrice.setPrice(price.getPrice());
                servicePrice.setCurrency(price.getCurrency());
                servicePrice.setEffectiveDate(priceHeader.getFromDate());
                servicePrice.setExpirationDate(priceHeader.getToDate());
                carCareService.setServicePrice(servicePrice);
//                carCareService.setStatus(CarCareServiceStatus.ACTIVE);
//                carCareService.setStatusName(CarCareServiceStatus.mapCarCareServiceStatus.get(CarCareServiceStatus.ACTIVE));
                carCareServiceRepository.save(carCareService);
            } catch (Exception e) {
                logger.info(e.getMessage() + " at " + price.getId());
            }
        }
        return priceHeader;
    }

    @Transactional(rollbackFor = Exception.class)
    public PriceHeader inactivePriceHeader(String id) {
        PriceHeader priceHeader = findById(id);
        List<Price> priceList = priceRepository.findAllByPriceHeaderId(priceHeader.getId());
        updateInactivePriceHeader(priceHeader);

        // update services price
        if (CollectionUtils.isEmpty(priceList)) {
            return priceHeader;
        }
        for (Price price : priceList) {
            try {
                price.setStatus(PriceStatus.INACTIVE);
                price.setStatusName(PriceStatus.mapPriceStatus.get(PriceStatus.INACTIVE));
                priceRepository.save(price);

                CarCareService carCareService = finderUtils.findCarCareServiceById(price.getServiceId());
//                carCareService.setStatus(CarCareServiceStatus.INACTIVE);
//                carCareService.setStatusName(CarCareServiceStatus.mapCarCareServiceStatus.get(CarCareServiceStatus.INACTIVE));
                carCareService.setServicePrice(null);
                carCareServiceRepository.save(carCareService);
            } catch (Exception e) {
                logger.info(e.getMessage() + " at " + price.getId());
            }
        }
        return priceHeader;
    }

    @Transactional(rollbackFor = Exception.class)
    public PriceHeader autoCreatePriceHeader() {
        Date fromDate = new Date();
        Date toDate = DateTimesUtils.addDate(fromDate, 30);

        Calendar cal = Calendar.getInstance();

        cal.setTime(fromDate);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        fromDate = cal.getTime();

        cal.setTime(toDate);
        cal.set(Calendar.HOUR_OF_DAY, 16);
        cal.set(Calendar.MINUTE, 59);
        cal.set(Calendar.SECOND, 59);
        cal.set(Calendar.MILLISECOND, 999);
        toDate = cal.getTime();

        PriceHeader priceHeader = PriceHeader.builder()
                .priceHeaderCode("PRICE_HEADER" + sequenceValueItemRepository.getSequence(PriceHeader.class))
                .name("Bảng giá mặc định")
                .description("Bảng giá mặc định")
                .fromDate(fromDate)
                .toDate(toDate)
                .createDate(new Date())
                .updateDate(new Date())
                .status(EnumConst.Status.ACTIVE.name())
                .build();
        return priceHeaderRepository.save(priceHeader);
    }

    private void validRequest(PriceHeader request) {
//        if (CollectionUtils.isNotEmpty(checkDuplicateInRange(request.getId(), request.getFromDate(), request.getToDate()))) {
//            throw new ServiceException(ErrorCode.PRICE_HEADER_EFFECTIVE_TIME_DUPLICATE);
//        }
    }

    private List<PriceHeader> checkDuplicateInRange(String id, Date from, Date to) {
        Criteria criteria = new Criteria();
        List<Criteria> filterList = new ArrayList<>();

        Criteria expirationDateCriteria = Criteria.where("toDate").gte(from).lte(to);
        filterList.add(expirationDateCriteria);

        Criteria effectiveDateCriteria = Criteria.where("fromDate").gte(from).lte(to);
        filterList.add(effectiveDateCriteria);

        if (StringUtils.isNotEmpty(id)) {
            Criteria idCriteria = Criteria.where("id").ne(id);
            filterList.add(idCriteria);
        }

        criteria.orOperator(filterList);
        Query query = new Query();
        query.addCriteria(criteria);
        logger.info("=======> query: " + query);
        return mongoTemplate.find(query, PriceHeader.class);
    }

    private PriceHeader updateInactivePriceHeader(PriceHeader priceHeader) {
        priceHeader.setStatus(EnumConst.Status.INACTIVE.name());
        priceHeader.setUpdateDate(new Date());
        return priceHeaderRepository.save(priceHeader);
    }

    private PriceHeader updateActivePriceHeader(PriceHeader priceHeader) {
        priceHeader.setStatus(EnumConst.Status.ACTIVE.name());
        priceHeader.setUpdateDate(new Date());
        return priceHeaderRepository.save(priceHeader);
    }

    private PriceHeaderResponse mappingToPriceHeaderResponse(PriceHeader priceHeader) {
        PriceHeaderResponse response = MappingUtils.mapObject(priceHeader, PriceHeaderResponse.class);
        response.setCreateDate(DateTimesUtils.toIsoFormat(priceHeader.getCreateDate()));
        response.setUpdateDate(DateTimesUtils.toIsoFormat(priceHeader.getUpdateDate()));
        response.setFromDate(DateTimesUtils.toIsoFormat(priceHeader.getFromDate()));
        response.setToDate(DateTimesUtils.toIsoFormat(priceHeader.getToDate()));

        return response;
    }
}
