package iuh.nhom7.khoa_luan_backend.service;

import iuh.nhom7.khoa_luan_backend.common.CarCareServiceStatus;
import iuh.nhom7.khoa_luan_backend.common.OrderStatus;
import iuh.nhom7.khoa_luan_backend.entity.CarCareCategory;
import iuh.nhom7.khoa_luan_backend.entity.CarCareService;
import iuh.nhom7.khoa_luan_backend.entity.Order;
import iuh.nhom7.khoa_luan_backend.entity.wrapper.ListWrapper;
import iuh.nhom7.khoa_luan_backend.exception.ErrorCode;
import iuh.nhom7.khoa_luan_backend.exception.ServiceException;
import iuh.nhom7.khoa_luan_backend.model.dto.ServiceCreateDTO;
import iuh.nhom7.khoa_luan_backend.model.dto.ServiceUpdateDTO;
import iuh.nhom7.khoa_luan_backend.model.profile.ServiceProfile;
import iuh.nhom7.khoa_luan_backend.model.search.ParameterSearchService;
import iuh.nhom7.khoa_luan_backend.repository.CarCareCategoryRepository;
import iuh.nhom7.khoa_luan_backend.repository.PriceRepository;
import iuh.nhom7.khoa_luan_backend.repository.SequenceValueItemRepository;
import iuh.nhom7.khoa_luan_backend.repository.CarCareServiceRepository;

import iuh.nhom7.khoa_luan_backend.base.BaseService;
import iuh.nhom7.khoa_luan_backend.common.Extensions;
import iuh.nhom7.khoa_luan_backend.request.SearchServiceRequest;
import iuh.nhom7.khoa_luan_backend.response.carCareService.CarCareServiceResponse;
import iuh.nhom7.khoa_luan_backend.utils.*;
import lombok.experimental.ExtensionMethod;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * 8:46 PM 15-Sep-22
 * Long Tran
 */
@Service
@ExtensionMethod(Extensions.class)
public class CarCareServiceService extends BaseService {
    private final MongoTemplate mongoTemplate;
    private final CarCareServiceRepository carCareServiceRepository;
    private final PriceRepository priceRepository;
    private final CarCareCategoryRepository carCareCategoryRepository;
    private final PriceService priceService;
    private final FinderUtils finderUtils;

    @Value("${car.url}")
    private String carCareServiceUrl;

    public CarCareServiceService(MongoTemplate mongoTemplate,
                                 CarCareServiceRepository carCareServiceRepository,
                                 PriceRepository priceRepository,
                                 SequenceValueItemRepository sequenceValueItemRepository,
                                 CarCareCategoryRepository carCareCategoryRepository,
                                 PriceService priceService,
                                 FinderUtils finderUtils) {
        this.mongoTemplate = mongoTemplate;
        this.carCareServiceRepository = carCareServiceRepository;
        this.priceRepository = priceRepository;
        this.carCareCategoryRepository = carCareCategoryRepository;
        this.priceService = priceService;
        this.finderUtils = finderUtils;
        this.sequenceValueItemRepository = sequenceValueItemRepository;
    }

    public CarCareService findById(String id) {
        CarCareService service = carCareServiceRepository.findById(id).orElse(null);
        if (service == null) {
            throw new ServiceException(ErrorCode.SERVICE_NOT_FOUND);
        }
        return service;
    }

    public CarCareService findByCode(String serviceCode) {
        CarCareService service = carCareServiceRepository.findByServiceCode(serviceCode).orElse(null);
        if (service == null) {
            throw new ServiceException(ErrorCode.SERVICE_NOT_FOUND);
        }
        return service;
    }

    public CarCareServiceResponse findCarCareServiceById(String id) {
        return mappingToCarCareServiceResponse(findById(id));
    }

    public ServiceProfile getProfileById(String id) {
        CarCareService service = findById(id);
        CarCareCategory category = finderUtils.findCategoryById(service.getCategoryId());
        ServiceProfile profile = MappingUtils.mapObject(service, ServiceProfile.class);
        profile.setCategoryName(category.getName());
        profile.setPrice(service.getServicePrice().getPrice());
        profile.setCurrency(service.getServicePrice().getCurrency());
        return profile;
    }

    @Transactional(rollbackFor = Exception.class)
    public Boolean inactive(String id) {
        CarCareService service = carCareServiceRepository.findById(id).orElse(null);
        if (service == null) {
            throw new ServiceException(ErrorCode.SERVICE_NOT_FOUND);
        }
        service.setUpdateDate(new Date());
        service.setStatus(CarCareServiceStatus.DISABLED);
        service.setStatusName(CarCareServiceStatus.mapCarCareServiceStatus.get(CarCareServiceStatus.DISABLED));
        carCareServiceRepository.save(service);
        return true;
    }
    @Transactional(rollbackFor = Exception.class)
    public Boolean active(String id) {
        CarCareService service = carCareServiceRepository.findById(id).orElse(null);
        if (service == null) {
            throw new ServiceException(ErrorCode.SERVICE_NOT_FOUND);
        }
        service.setUpdateDate(new Date());
        service.setStatus(CarCareServiceStatus.ACTIVE);
        service.setStatusName(CarCareServiceStatus.mapCarCareServiceStatus.get(CarCareServiceStatus.ACTIVE));
        carCareServiceRepository.save(service);
        return true;
    }



    @Transactional(rollbackFor = Exception.class)
    public CarCareService create(ServiceCreateDTO serviceCreateDTO) {
//        if (serviceCreateDTO.getServicePrice() == null) {
//            throw new ServiceException(ErrorCode.SERVICE_PRICE_NULL);
//        }
        CarCareCategory category = finderUtils.findCategoryById(serviceCreateDTO.getCategoryId());
        CarCareService carCareService = MappingUtils.mapObject(serviceCreateDTO, CarCareService.class);
        carCareService.setServiceCode("SERVICE" + sequenceValueItemRepository.getSequence(CarCareService.class));
        carCareService.setCreateDate(new Date());
        carCareService.setCategoryName(category.getName());
        carCareService.setUpdateDate(new Date());
        carCareService.setCategoryId(category.getId());
        carCareService.setCategoryCode(category.getCategoryCode());
        carCareService.setStatus(CarCareServiceStatus.ACTIVE);
        carCareService.setStatusName(CarCareServiceStatus.mapCarCareServiceStatus.get(CarCareServiceStatus.ACTIVE));
        if (serviceCreateDTO.getImageUrl().isBlankOrNull()) {
            carCareService.setImageUrl(carCareServiceUrl);
        } else {
            carCareService.setImageUrl(serviceCreateDTO.getImageUrl());
        }
        CarCareService service = carCareServiceRepository.save(carCareService);

        //create price
//        priceService.createPrice(service);
        return service;
    }

    @Transactional(rollbackFor = Exception.class)
    public CarCareService update(String id, ServiceUpdateDTO serviceUpdateDTO) {
        CarCareService carCareService = findById(id);

        if (StringUtils.isNotEmpty(serviceUpdateDTO.getCategoryId())) {
            CarCareCategory category = finderUtils.findCategoryById(serviceUpdateDTO.getCategoryId());
            carCareService.setCategoryCode(category.getCategoryCode());
            carCareService.setCategoryName(category.getName());
        }
//        if (ObjectUtils.isNotEmpty(serviceUpdateDTO.getServicePrice())) {
//            carCareService.getServicePrice().setPrice(serviceUpdateDTO.getServicePrice().getPrice());
//            carCareService.getServicePrice().setCurrency(serviceUpdateDTO.getServicePrice().getCurrency());
//        }
        if (StringUtils.isNotEmpty(serviceUpdateDTO.getImageUrl())) {
            carCareService.setImageUrl(serviceUpdateDTO.getImageUrl());
        }
        if (StringUtils.isNotEmpty(serviceUpdateDTO.getName())) {
            carCareService.setName(serviceUpdateDTO.getName());
        }
        if (StringUtils.isNotEmpty(serviceUpdateDTO.getDescription())) {
            carCareService.setDescription(serviceUpdateDTO.getDescription());
        }
        if (StringUtils.isNotEmpty(serviceUpdateDTO.getType())) {
            carCareService.setType(serviceUpdateDTO.getType());
        }
        if (StringUtils.isNotEmpty(String.valueOf(serviceUpdateDTO.getEstimateTime()))) {
            carCareService.setEstimateTime(serviceUpdateDTO.getEstimateTime());
        }

        carCareService.setUpdateDate(new Date());

        //update price
//        priceService.updateServicePrice(carCareService.getServicePrice());
        return carCareServiceRepository.save(carCareService);
    }

    public ListWrapper<ServiceProfile> getServicesProfiles(ParameterSearchService parameterSearchService) {
        List<Criteria> criteria = new ArrayList<>();
        if (!parameterSearchService.getId().isBlankOrNull()) {
            criteria.add(Criteria.where("id").in(parameterSearchService.getId()));
        }
        if (parameterSearchService.getIds() != null) {
            criteria.add(Criteria.where("id").in(parameterSearchService.getIds()));
        }
        if (!parameterSearchService.getType().isBlankOrNull()) {
            criteria.add(Criteria.where("type").in(parameterSearchService.getType()));
        }
        if (!parameterSearchService.getCreateBy().isBlankOrNull()) {
            criteria.add(Criteria.where("createBy").in(parameterSearchService.getCreateBy()));
        }
        if (!parameterSearchService.getName().isBlankOrNull()) {
            criteria.add(Criteria.where("name").regex(parameterSearchService.getName()));
        }
        if (!parameterSearchService.getCategoryId().isBlankOrNull()) {
            criteria.add(Criteria.where("categoryId").regex(parameterSearchService.getCategoryId()));
        }
        if (!parameterSearchService.getStatus().isBlankOrNull()) {
            criteria.add(Criteria.where("status").in(parameterSearchService.getStatus()));
        }
        if (null != parameterSearchService.getFromDate()) {
            criteria.add(Criteria.where("createDate").gte(parameterSearchService.getFromDate()));
        }
        if (null != parameterSearchService.getToDate()) {
            criteria.add(Criteria.where("createDate").lte(parameterSearchService.getToDate()));
        }
        Query query = new Query();
        if (criteria.isEmpty()) {
            query.addCriteria(new Criteria());
        } else {
            query.addCriteria(new Criteria().andOperator(criteria));
        }
        // sort
        if (!parameterSearchService.getSortField().isBlankOrNull()) {
            if (parameterSearchService.getDescSort() != null) {
                if (parameterSearchService.getDescSort()) {
                    query.with(Sort.by(parameterSearchService.getSortField()).descending());
                } else {
                    query.with(Sort.by(parameterSearchService.getSortField()).ascending());
                }
            }
        } else {
            query.with(Sort.by("createDate").descending());
        }
        // Phân trang
        long totalResult;
        List<Criteria> pageableCriteria = new ArrayList<>(criteria);
        Query pageableQuery = new Query();
        if (pageableCriteria.isEmpty()) {
            pageableQuery.addCriteria(new Criteria());
        } else {
            pageableQuery.addCriteria(new Criteria().andOperator(pageableCriteria));
        }
//        pageableQuery.addCriteria(new Criteria().andOperator(pageableCriteria));
        totalResult = mongoTemplate.count(pageableQuery, CarCareService.class);
        if (parameterSearchService.getCount() != null && parameterSearchService.getCount()) {
            return ListWrapper.<ServiceProfile>builder()
                    .total(totalResult)
                    .build();
        }
        if (parameterSearchService.getStartIndex() >= 0) {
            query.skip(parameterSearchService.getStartIndex());
        }
        if (parameterSearchService.getMaxResult() > 0) {
            query.limit(parameterSearchService.getMaxResult());
        }

        if (parameterSearchService.getMaxResult() > 0) {
            query.limit(parameterSearchService.getMaxResult());
        }
        return ListWrapper.<ServiceProfile>builder()
                .total(totalResult)
                .totalPage((totalResult - 1) / parameterSearchService.getMaxResult() + 1)
                .data(buildServiceProfile(mongoTemplate.find(query, CarCareService.class)))
                .build();
    }

    private List<ServiceProfile> buildServiceProfile(List<CarCareService> carCareServices) {
        if (carCareServices != null && carCareServices.size() > 0) {
            List<ServiceProfile> serviceProfiles = new ArrayList<>();
            for (CarCareService carCareService : carCareServices) {
                CarCareCategory category = finderUtils.findCategoryById(carCareService.getCategoryId());
                ServiceProfile serviceProfile = ServiceProfile.builder()
                        .id(carCareService.getId())
                        .serviceCode(carCareService.getServiceCode())
                        .name(carCareService.getName())
                        .type(carCareService.getType())
                        .description(carCareService.getDescription())
                        .estimateTime(carCareService.getEstimateTime())
                        .statusName(carCareService.getStatusName())
                        .imageUrl(carCareService.getImageUrl())
                        .price(carCareService.getServicePrice().getPrice())
                        .currency(carCareService.getServicePrice().getCurrency())
                        .categoryId(category.getId())
                        .categoryCode(category.getCategoryCode())
                        .categoryName(category.getName())
                        .build();
                serviceProfiles.add(serviceProfile);
            }
            return serviceProfiles;
        }
        return new ArrayList<>();
    }

    public List<CarCareService> search(SearchServiceRequest request) {
        try {

            // search
            Criteria criteria = new Criteria();
            String key = TextUtils.convertStringToSort(request.getKeyword());


            if (StringUtils.isNotEmpty(key)) {
                Criteria criteria1 = Criteria.where("name").regex(request.getKeyword(), "i");
                Criteria criteria2 = Criteria.where("serviceCode").regex(request.getKeyword(), "i");
                criteria.orOperator(criteria1, criteria2);
            }
            List<Criteria> filterList = new ArrayList<>();
            QueryBuilderUtils.addSingleValueFilter(filterList, "status", request.getStatus());
            QueryBuilderUtils.addSingleValueFilter(filterList, "type", request.getType());
            QueryBuilderUtils.addSingleValueFilter(filterList, "categoryId", request.getCategoryId());

            if(request.getStatus() !=null){
                if(request.getStatus() ==100){
                    Criteria exceptCriteria = Criteria.where("servicePrice").ne(null);
                    filterList.add(exceptCriteria);
                }
            }

            if (CollectionUtils.isNotEmpty(filterList)) {
                criteria.andOperator(filterList);
            }

            // query
            Query query = new Query();
            query.addCriteria(criteria);

            logger.info("=======> query: " + query);
            return mongoTemplate.find(query, CarCareService.class);

        } catch (Exception e) {
            logger.error(">>>>>>>>>>>>>>>>>>> error search order", e);
            return new ArrayList<>();
        }
    }

    public List<CarCareService> getActiveService() {
        Criteria criteria = new Criteria();
        criteria = Criteria.where("status").is(CarCareServiceStatus.ACTIVE);
        Query query = new Query();
        query.addCriteria(criteria);
        return mongoTemplate.find(query, CarCareService.class);
    }

    private CarCareServiceResponse mappingToCarCareServiceResponse(CarCareService carCareService) {
        CarCareServiceResponse response = MappingUtils.mapObject(carCareService, CarCareServiceResponse.class);
        response.setCreateDate(DateTimesUtils.toIsoFormat(carCareService.getCreateDate()));
        response.setUpdateDate(DateTimesUtils.toIsoFormat(carCareService.getUpdateDate()));
        response.getServicePrice().setEffectiveDate(DateTimesUtils.toIsoFormat(carCareService.getServicePrice().getEffectiveDate()));
        response.getServicePrice().setExpirationDate(DateTimesUtils.toIsoFormat(carCareService.getServicePrice().getExpirationDate()));

        return response;
    }
}