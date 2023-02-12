package iuh.nhom7.khoa_luan_backend.service;

import iuh.nhom7.khoa_luan_backend.base.BaseService;
import iuh.nhom7.khoa_luan_backend.common.OrderStatus;
import iuh.nhom7.khoa_luan_backend.entity.Account;
import iuh.nhom7.khoa_luan_backend.entity.CarCareService;
import iuh.nhom7.khoa_luan_backend.entity.CarSlot;
import iuh.nhom7.khoa_luan_backend.entity.Order;
import iuh.nhom7.khoa_luan_backend.exception.ErrorCode;
import iuh.nhom7.khoa_luan_backend.exception.ServiceException;
import iuh.nhom7.khoa_luan_backend.repository.OrderRepository;
import iuh.nhom7.khoa_luan_backend.request.order.CreateOrderRequest;
import iuh.nhom7.khoa_luan_backend.request.order.ExecuteOrderRequest;
import iuh.nhom7.khoa_luan_backend.request.order.SearchOrderRequest;
import iuh.nhom7.khoa_luan_backend.request.order.UpdateOrderRequest;
import iuh.nhom7.khoa_luan_backend.utils.*;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
public class OrderService extends BaseService {
    private final MongoTemplate mongoTemplate;
    private final OrderRepository orderRepository;
    private final ServiceUtils serviceUtils;
    private final FinderUtils finderUtils;
    private final CarSlotService carSlotService;

    public OrderService(MongoTemplate mongoTemplate,
                        OrderRepository orderRepository,
                        ServiceUtils serviceUtils,
                        FinderUtils finderUtils,
                        CarSlotService carSlotService) {
        this.mongoTemplate = mongoTemplate;
        this.orderRepository = orderRepository;
        this.serviceUtils = serviceUtils;
        this.finderUtils = finderUtils;
        this.carSlotService = carSlotService;
    }

    public Order findOrderById(String id) {
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null) {
            throw new ServiceException(ErrorCode.ORDER_NOT_FOUND);
        }
        return order;
    }

    public Page<Order> searchOrder(SearchOrderRequest request) {
        try {
            // sort
            Pageable pageable = PageableUtils.convertPageableAndSort(request.getPageNumber(), request.getPageSize(), request.getSort());

            // search
            Criteria criteria = new Criteria();
            String key = TextUtils.convertStringToSort(request.getKeyword());
            if (StringUtils.isNotEmpty(key)) {
                Criteria criteriaSearch = Criteria.where("searchingKeys").regex(key, "i");
                criteria.orOperator(criteriaSearch);
            }

            //filter
            List<Criteria> filterList = new ArrayList<>();
            QueryBuilderUtils.addSingleValueFilter(filterList, "status", request.getStatus());
            QueryBuilderUtils.addDateFilter(filterList, "estimateReceiveDate", request.getFromReceiveDate(), request.getToReceiveDate());
            QueryBuilderUtils.addDateFilter(filterList, "estimateExecuteDate", request.getFromExecuteDate(), request.getToExecuteDate());
            Criteria exceptCriteria = Criteria.where("status").ne(OrderStatus.BILL_CREATED);
            filterList.add(exceptCriteria);

            if (CollectionUtils.isNotEmpty(filterList)) {
                criteria.andOperator(filterList);
            }

            // query
            Query query = new Query();
            query.with(pageable);
            query.addCriteria(criteria);

            logger.info("=======> query: " + query);
            List<Order> orderList = mongoTemplate.find(query, Order.class);
            return PageableExecutionUtils.getPage(orderList, pageable, () -> mongoTemplate.count(Query.of(query).limit(-1).skip(-1), Order.class));
        } catch (Exception e) {
            logger.error(">>>>>>>>>>>>>>>>>>> error search order", e);
            return Page.empty();
        }
    }

    public List<Order> getAllExecutedOrder() {
        try {
            Criteria criteria = new Criteria();
            List<Criteria> filterList = new ArrayList<>();
            QueryBuilderUtils.addSingleValueFilter(filterList, "status", OrderStatus.EXECUTED);
            criteria.andOperator(filterList);

            Query query = new Query();
            query.addCriteria(criteria);
            return mongoTemplate.find(query, Order.class);
        } catch (Exception e) {
            logger.error(">>>>>>>>>>>>>>>>>>> error search order", e);
            return new ArrayList<>();
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public Order create(CreateOrderRequest request, Account account) {
        Order order = MappingUtils.mapObject(request, Order.class);
//        serviceUtils.validateOrderRequest(order);
        serviceUtils.fillingMissingValue(order);
        order.setOrderCode("ORDER" + sequenceValueItemRepository.getSequence(Order.class));
        order.setEstimateReceiveDate(ObjectUtils.isEmpty(request.getReceiveDate()) ? null : request.getReceiveDate());
        order.setEstimateExecuteDate(ObjectUtils.isEmpty(request.getExecuteDate()) ? null : request.getExecuteDate());
        order.setStatus(OrderStatus.PENDING);
        order.setStatusName(OrderStatus.mapOrderStatus.get(OrderStatus.PENDING));
        order.setCreateDate(new Date());
        order.setCreateBy(account.getUsername());
        order.setUpdateDate(new Date());

        List<CarCareService> services = new ArrayList<>();
        if (CollectionUtils.isEmpty(request.getServiceIds())) {
            throw new ServiceException(ErrorCode.SERVICE_NOT_FOUND);
        }
        for (String serviceId: request.getServiceIds()) {
            CarCareService service = finderUtils.findCarCareServiceById(serviceId);
            services.add(service);
        }
        order.setServices(services);
        order.setTotalEstimateTime(services.stream().mapToDouble(CarCareService::getEstimateTime).sum());
        order.setTotalServicePrice(BigDecimal.valueOf(services.stream().mapToDouble(value -> value.getServicePrice().getPrice().doubleValue()).sum()));

        collectSearchingKeys(order);
        return orderRepository.save(order);
    }

    @Transactional(rollbackFor = Exception.class)
    public Order update(String id, UpdateOrderRequest request) {
        Order order = findOrderById(id);
        if (StringUtils.isNotEmpty(request.getCustomerId())) {
            order.setCustomerId(request.getCustomerId());
        }
        if (StringUtils.isNotEmpty(request.getCarId())) {
            order.setCarId(request.getCarId());
        }
        if (StringUtils.isNotEmpty(request.getExecutorId())
                && !request.getExecutorId().equals(order.getExecutorId())) {
            if (OrderStatus.EXECUTED == order.getStatus()
                    || (OrderStatus.BILL_CREATED == order.getStatus() && order.getCarExecutedDate() != null)) {
                throw new ServiceException(ErrorCode.EXECUTED_ORDER_CAN_NOT_UPDATE);
            }
            if(OrderStatus.EXECUTING == order.getStatus()) {
            if (StringUtils.isNotEmpty(order.getExecutorId())) {
                serviceUtils.updateUserStatusById(order.getExecutorId(), false);
            }
            serviceUtils.updateUserStatusById(request.getExecutorId(), true);
            }
            order.setExecutorId(request.getExecutorId());
        }
        serviceUtils.fillingMissingValue(order);
        order.setEstimateReceiveDate(ObjectUtils.isEmpty(request.getReceiveDate()) ? order.getEstimateReceiveDate() : request.getReceiveDate());
        order.setEstimateExecuteDate(ObjectUtils.isEmpty(request.getExecuteDate()) ? order.getEstimateExecuteDate() : request.getExecuteDate());
        order.setUpdateDate(new Date());

        List<CarCareService> services = new ArrayList<>();
        if (CollectionUtils.isEmpty(request.getServiceIds())) {
            throw new ServiceException(ErrorCode.SERVICE_NOT_FOUND);
        }
        for (String serviceId: request.getServiceIds()) {
            CarCareService service = finderUtils.findCarCareServiceById(serviceId);
            services.add(service);
        }
        order.setServices(services);
        order.setTotalEstimateTime(services.stream().mapToDouble(CarCareService::getEstimateTime).sum());
        order.setTotalServicePrice(BigDecimal.valueOf(services.stream().mapToDouble(value -> value.getServicePrice().getPrice().doubleValue()).sum()));

        collectSearchingKeys(order);
        return orderRepository.save(order);
    }
    @Transactional(rollbackFor = Exception.class)
    public Order cancel(String id) {
        Order order = findOrderById(id);
        CarSlot carSlot = finderUtils.findCarSlotByOrderId(order.getId());
        if (carSlot != null) {
            carSlotService.cancelOrder(carSlot.getId());
        }
        if(!TextUtils.isNullOrEmptyString(order.getExecutorId())){
            serviceUtils.updateUserStatusById(order.getExecutorId(), false);
        }
        order.setStatus(OrderStatus.DISABLED);
        order.setStatusName(OrderStatus.mapOrderStatus.get(OrderStatus.DISABLED));
        order.setUpdateDate(new Date());
        return orderRepository.save(order);
    }

    @Transactional(rollbackFor = Exception.class)
    public Order complete(String id) {
        Order order = findOrderById(id);
        CarSlot carSlot = finderUtils.findCarSlotByOrderId(order.getId());
        if (carSlot != null) {
            carSlotService.completeOrder(ExecuteOrderRequest.builder()
                    .orderId(order.getId())
                    .carSlotId(carSlot.getId())
                    .build());
        } else {
            throw new ServiceException(ErrorCode.ORDER_NOT_EXECUTING);
        }

        if (order.getStatus() != OrderStatus.BILL_CREATED) {
            order.setStatus(OrderStatus.EXECUTED);
            order.setStatusName(OrderStatus.mapOrderStatus.get(OrderStatus.EXECUTED));
        }
        order.setUpdateDate(new Date());
        return orderRepository.save(order);
    }

    private void collectSearchingKeys(Order order) {
        Set<String> searchingKeys = new HashSet<>();
        if (StringUtils.isNotEmpty(order.getOrderCode())) {
            searchingKeys.add(order.getOrderCode());
            searchingKeys.add(TextUtils.convertStringToSort(order.getOrderCode()));
        }
        if (StringUtils.isNotEmpty(order.getCustomerCode())) {
            searchingKeys.add(order.getCustomerCode());
            searchingKeys.add(TextUtils.convertStringToSort(order.getCustomerCode()));
        }
        if (StringUtils.isNotEmpty(order.getCustomerName())) {
            searchingKeys.add(order.getCustomerName());
            searchingKeys.add(TextUtils.convertStringToSort(order.getCustomerName()));
        }
        if (StringUtils.isNotEmpty(order.getCustomerPhoneNumber())) {
            searchingKeys.add(order.getCustomerPhoneNumber());
            searchingKeys.add(TextUtils.convertStringToSort(order.getCustomerPhoneNumber()));
        }
        if (StringUtils.isNotEmpty(order.getCarCode())) {
            searchingKeys.add(order.getCarCode());
            searchingKeys.add(TextUtils.convertStringToSort(order.getCarCode()));
        }
        if (StringUtils.isNotEmpty(order.getCarLicensePlate())) {
            searchingKeys.add(order.getCarLicensePlate());
            searchingKeys.add(TextUtils.convertStringToSort(order.getCarLicensePlate()));
        }

        order.setSearchingKeys(searchingKeys);
    }

}
