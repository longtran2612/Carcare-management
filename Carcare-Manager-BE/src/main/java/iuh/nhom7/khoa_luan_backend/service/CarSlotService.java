package iuh.nhom7.khoa_luan_backend.service;

import iuh.nhom7.khoa_luan_backend.common.OrderStatus;
import iuh.nhom7.khoa_luan_backend.converter.CarSlotConverter;
import iuh.nhom7.khoa_luan_backend.entity.CarSlot;
import iuh.nhom7.khoa_luan_backend.entity.Order;
import iuh.nhom7.khoa_luan_backend.exception.ErrorCode;
import iuh.nhom7.khoa_luan_backend.exception.ServiceException;
import iuh.nhom7.khoa_luan_backend.model.dto.CarSlotUpdateDTO;
import iuh.nhom7.khoa_luan_backend.model.profile.CarSlotProfile;
import iuh.nhom7.khoa_luan_backend.repository.CarSlotRepository;
import iuh.nhom7.khoa_luan_backend.base.BaseService;
import iuh.nhom7.khoa_luan_backend.common.EnumConst;
import iuh.nhom7.khoa_luan_backend.repository.OrderRepository;
import iuh.nhom7.khoa_luan_backend.request.order.ExecuteOrderRequest;
import iuh.nhom7.khoa_luan_backend.utils.DateTimesUtils;
import iuh.nhom7.khoa_luan_backend.utils.FinderUtils;
import iuh.nhom7.khoa_luan_backend.utils.ServiceUtils;
import iuh.nhom7.khoa_luan_backend.utils.TextUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * 9:52 PM 20-Sep-22
 * Long Tran
 */

@Service
public class CarSlotService extends BaseService {
    private final CarSlotRepository carSlotRepository;
    private final OrderRepository orderRepository;
    private final CarSlotConverter carSlotConverter;
    private final FinderUtils finderUtils;
    private final ServiceUtils serviceUtils;
    private final SendSmsService smsService;

    public CarSlotService(CarSlotRepository carSlotRepository,
                          OrderRepository orderRepository,
                          CarSlotConverter carSlotConverter,
                          FinderUtils finderUtils,
                          ServiceUtils serviceUtils,
                          SendSmsService smsService) {
        this.carSlotRepository = carSlotRepository;
        this.orderRepository = orderRepository;
        this.carSlotConverter = carSlotConverter;
        this.finderUtils = finderUtils;
        this.serviceUtils = serviceUtils;
        this.smsService = smsService;
    }

    public CarSlot findCarSlotById(String id) {
        CarSlot carSlot = carSlotRepository.findById(id).orElse(null);
        if (carSlot == null) {
            throw new ServiceException(ErrorCode.CAR_SLOT_NOT_FOUND);
        }
        return carSlot;
    }

    public CarSlot findCarSlotByCode(String code) {
        CarSlot carSlot = carSlotRepository.findByCarSlotCode(code).orElse(null);
        if (carSlot == null) {
            throw new ServiceException(ErrorCode.CAR_SLOT_NOT_FOUND);
        }
        return carSlot;
    }

    @Transactional(rollbackFor = Exception.class)
    public CarSlot create() {
        CarSlot carSlot = CarSlot.builder()
                .carSlotCode("CAR_SLOT" + sequenceValueItemRepository.getSequence(CarSlot.class))
                .name("Vị trí số " +(carSlotRepository.count()+1))
                .slotNumber(String.valueOf(carSlotRepository.count()+1))
                .status(EnumConst.CarSlotStatus.AVAILABLE.name())
                .createDate(new Date())
                .updateDate(new Date())
                .build();
        return carSlotRepository.save(carSlot);
    }

    @Transactional(rollbackFor = Exception.class)
    public CarSlot update(String id, CarSlotUpdateDTO carSlotUpdateDTO) {
        CarSlot carSlot = findCarSlotById(id);
        if (StringUtils.isNotEmpty(carSlotUpdateDTO.getName())) {
            carSlot.setName(carSlotUpdateDTO.getName());
        }
        if (StringUtils.isNotEmpty(carSlotUpdateDTO.getSlotNumber())) {
            carSlot.setSlotNumber(carSlotUpdateDTO.getSlotNumber());
        }
        if (StringUtils.isNotEmpty(carSlotUpdateDTO.getStatus())) {
            carSlot.setStatus(carSlotUpdateDTO.getStatus());
        }
        carSlot.setUpdateDate(new Date());
        return carSlotRepository.save(carSlot);
    }

    @Transactional(rollbackFor = Exception.class)
    public CarSlot executeOrder(ExecuteOrderRequest request) {
        Date now = new Date();
        Order order = finderUtils.findOrderById(request.getOrderId());
        serviceUtils.validateExecuteOrderRequest(order);
        serviceUtils.executingOrder(order, now);

        CarSlot carSlot = findCarSlotById(request.getCarSlotId());
        carSlot.setOrderId(order.getId());
        carSlot.setOrderCode(order.getOrderCode());
        carSlot.setOrderCustomerCode(order.getCustomerCode());
        carSlot.setOrderCustomerName(order.getCustomerName());
        carSlot.setOrderCustomerPhoneNumber(order.getCustomerPhoneNumber());
        carSlot.setOrderCarLicensePlate(order.getCarLicensePlate());
        carSlot.setOrderCarCode(order.getCarCode());
        carSlot.setOrderCarName(order.getCarName());
        carSlot.setOrderTotalEstimateTime(order.getTotalEstimateTime());
        carSlot.setOrderStatusName(order.getStatusName());
        carSlot.setOrderStartExecuting(now);
        carSlot.setStatus(EnumConst.CarSlotStatus.IN_USE.name());
        carSlot.setUpdateDate(new Date());
        return carSlotRepository.save(carSlot);
    }

    @Transactional(rollbackFor = Exception.class)
    public CarSlot completeOrder(ExecuteOrderRequest request) {
        CarSlot carSlot = findCarSlotById(request.getCarSlotId());
        if (!request.getOrderId().equals(carSlot.getOrderId())) {
            throw new ServiceException(ErrorCode.CAR_SLOT_ORDER_NOT_MATCH);
        }

        Date now = new Date();
        Order order = finderUtils.findOrderById(request.getOrderId());
        serviceUtils.completeOrder(order, now);

        carSlot.setOrderId(null);
        carSlot.setOrderCode(null);
        carSlot.setOrderCustomerName(null);
        carSlot.setOrderCustomerCode(null);
        carSlot.setOrderCustomerPhoneNumber(null);
        carSlot.setOrderCarLicensePlate(null);
        carSlot.setOrderCarName(null);
        carSlot.setOrderCarCode(null);
        carSlot.setOrderTotalEstimateTime(0);
        carSlot.setOrderStatusName(null);
        carSlot.setOrderStartExecuting(null);

        carSlot.setStatus(EnumConst.CarSlotStatus.AVAILABLE.name());
        carSlot.setUpdateDate(new Date());

        return carSlotRepository.save(carSlot);
    }

    @Transactional(rollbackFor = Exception.class)
    public CarSlot cancelOrder(String id) {
        CarSlot carSlot = findCarSlotById(id);

        Date now = new Date();
        Order order = finderUtils.findOrderById(carSlot.getOrderId());
        if (order.getStatus() != OrderStatus.EXECUTING) {
            throw new ServiceException(ErrorCode.ORDER_NOT_EXECUTING);
        }
        if(!TextUtils.isNullOrEmptyString(order.getExecutorId())){
            serviceUtils.updateUserStatusById(order.getExecutorId(), false);
        }
        order.setOrderCanceledDate(now);
        updateOrderStatus(order, OrderStatus.DISABLED);

        carSlot.setOrderId(null);
        carSlot.setOrderCode(null);
        carSlot.setOrderCustomerName(null);
        carSlot.setOrderCustomerCode(null);
        carSlot.setOrderCustomerPhoneNumber(null);
        carSlot.setOrderCarLicensePlate(null);
        carSlot.setOrderCarName(null);
        carSlot.setOrderCarCode(null);
        carSlot.setOrderTotalEstimateTime(0);
        carSlot.setOrderStatusName(null);
        carSlot.setOrderStartExecuting(null);

        carSlot.setStatus(EnumConst.CarSlotStatus.AVAILABLE.name());
        carSlot.setUpdateDate(new Date());
        return carSlotRepository.save(carSlot);
    }

    public List<CarSlotProfile> getCarSlots(List<CarSlot> carSlots) {
        return carSlotConverter.getCarSlotProfile(carSlots);
    }

    private void updateOrderStatus(Order order, Integer status) {
        if (order.getStatus() != OrderStatus.BILL_CREATED) {
            order.setStatus(status);
            order.setStatusName(OrderStatus.mapOrderStatus.get(status));
        }
        order.setUpdateDate(new Date());
        orderRepository.save(order);
    }

}
