package iuh.nhom7.khoa_luan_backend.utils;

import iuh.nhom7.khoa_luan_backend.base.BaseObjectLoggable;
import iuh.nhom7.khoa_luan_backend.common.EnumConst;
import iuh.nhom7.khoa_luan_backend.common.OrderStatus;
import iuh.nhom7.khoa_luan_backend.entity.*;
import iuh.nhom7.khoa_luan_backend.exception.ErrorCode;
import iuh.nhom7.khoa_luan_backend.exception.ServiceException;
import iuh.nhom7.khoa_luan_backend.repository.*;
import iuh.nhom7.khoa_luan_backend.request.CreateCustomerRequest;
import iuh.nhom7.khoa_luan_backend.request.SignupRequest;
import iuh.nhom7.khoa_luan_backend.service.SendSmsService;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.concurrent.TimeUnit;

/**
 * 02:33 AM 21-Sep-22
 * Andy Lai
 *
 * ServiceUtils để chứa các method kiểm tra, xử lý logic
 * dùng chung cho các services
 *
 */
@Service
public class ServiceUtils extends BaseObjectLoggable {
    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;
    private final CarCareServiceRepository carCareServiceRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final CarSlotRepository carSlotRepository;
    private final CarRepository carRepository;
    private final FinderUtils finderUtils;
    private final PasswordEncoder encoder;
    private final SendSmsService smsService;

    @Value("${default.password}")
    private String defaultPassword;

    @Value("${SEND_SMS_PHONE_NUMBER}")
    private String SEND_SMS_PHONE_NUMBER;

    public ServiceUtils(AccountRepository accountRepository,
                        CustomerRepository customerRepository,
                        CarCareServiceRepository carCareServiceRepository,
                        UserRepository userRepository,
                        OrderRepository orderRepository,
                        CarSlotRepository carSlotRepository,
                        CarRepository carRepository,
                        FinderUtils finderUtils,
                        PasswordEncoder encoder,
                        SendSmsService smsService) {
        this.accountRepository = accountRepository;
        this.customerRepository = customerRepository;
        this.carCareServiceRepository = carCareServiceRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.carSlotRepository = carSlotRepository;
        this.carRepository = carRepository;
        this.finderUtils = finderUtils;
        this.encoder = encoder;
        this.smsService = smsService;
    }

    public void checkAccountExistence(String username) {
        Account account = accountRepository.findByUsername(username).orElse(null);
        if (account != null) {
            throw new ServiceException(ErrorCode.ACCOUNT_EXISTED);
        }
    }

    public Boolean isAccountExistence(String username) {
        Account account = accountRepository.findByUsername(username).orElse(null);
        if (account != null) {
            return true;
        }
        return false;
    }

    public void checkCustomerExistence(String identityNumber) {
        Customer customer = customerRepository.findByIdentityNumber(identityNumber).orElse(null);
        if (customer != null) {
            throw new ServiceException(ErrorCode.CUSTOMER_EXISTED);
        }
    }

    public void validateRequest(CreateCustomerRequest request) {
//        if (StringUtils.isEmpty(request.getIdentityNumber())) {
//            throw new ServiceException(ErrorCode.IDENTITY_NUMBER_EMPTY);
//        }
        if (StringUtils.isEmpty(request.getPhoneNumber())) {
            throw new ServiceException(ErrorCode.PHONE_NUMBER_EMPTY);
        }

    }

    @Transactional(rollbackFor = Exception.class)
    public Account saveAccount(SignupRequest request) {
        checkAccountExistence(request.getUsername());
        Account account = new Account();
        account.setUsername(request.getUsername());
        account.setPassword(encoder.encode(request.getPassword()));
        account.setRoles(EnumConst.Role.ROLE_USER.toString());
        return accountRepository.save(account);
    }

    @Transactional(rollbackFor = Exception.class)
    public Account saveCustomerAccount(SignupRequest request) {
        checkAccountExistence(request.getUsername());
        Account account = new Account();
        account.setUsername(request.getUsername());
        account.setPassword(encoder.encode(defaultPassword));
        account.setLoginBefore(false);
        account.setRoles(EnumConst.Role.ROLE_CUSTOMER.toString());
        return accountRepository.save(account);
    }

    public void executingOrder(Order order, Date executingDate) {
        order.setCarExecutingDate(executingDate);
        updateOrderStatus(order, OrderStatus.EXECUTING);

        updateUserStatus(order, true);
    }

    public void completeOrder(Order order, Date executedDate) {
        if (order.getStatus() != OrderStatus.EXECUTING) {
            throw new ServiceException(ErrorCode.ORDER_NOT_EXECUTING);
        }
        order.setCarExecutedDate(executedDate);
        double totalExecuteTime = DateTimesUtils.getDateDiff(order.getCarExecutingDate(), executedDate, TimeUnit.MINUTES);
        order.setTotalExecuteTime(totalExecuteTime);
        updateOrderStatus(order, OrderStatus.EXECUTED);

        updateUserStatus(order, false);

        try {
            sendCompleteSms(order);
        } catch (Exception e) {
            logger.info("==========> error sending Order Complete Sms: " + e);
        }
    }

    public void validateOrderRequest(Order order) {
        Car car = finderUtils.findCarById(order.getCarId());
        if (CollectionUtils.isNotEmpty(orderRepository.findAllByCarIdAndStatus(car.getId(), OrderStatus.EXECUTING))) {
            throw new ServiceException(ErrorCode.EXISTED_PENDING_ORDER);
        }
//        if (CollectionUtils.isNotEmpty(orderRepository.findAllByCarIdAndStatus(car.getId(), OrderStatus.EXECUTING))) {
//            throw new ServiceException(ErrorCode.EXISTED_EXECUTING_ORDER);
//        }
    }

    public void validateExecuteOrderRequest(Order order) {
        if (order.getStatus() == OrderStatus.EXECUTED || order.getStatus() == OrderStatus.DISABLED) {
            throw new ServiceException(ErrorCode.ORDER_EXECUTED_OR_DISABLED);
        }
        Car car = finderUtils.findCarById(order.getCarId());
        if (CollectionUtils.isNotEmpty(orderRepository.findAllByCarIdAndStatus(car.getId(), OrderStatus.EXECUTING))) {
            throw new ServiceException(ErrorCode.EXISTED_EXECUTING_ORDER_CAR);
        }
        if(StringUtils.isEmpty(order.getExecutorId())) {
            throw new ServiceException(ErrorCode.EXECUTOR_NOT_FOUND);
        }
        User user = finderUtils.findUserById(order.getExecutorId());
        if (user.isExecuting()) {
            throw new ServiceException(ErrorCode.USER_IS_EXECUTING);
        }
    }

    public void updateUserStatusById(String userId, boolean executing) {
        User user = finderUtils.findUserById(userId);
        user.setExecuting(executing);
        user.setUpdateDate(new Date());
        userRepository.save(user);
    }

    public void fillingMissingValue(Order order) {
        Customer customer = finderUtils.findCustomerById(order.getCustomerId());
        order.setCustomerCode(customer.getCustomerCode());
        order.setCustomerName(customer.getName());
        order.setCustomerPhoneNumber(customer.getPhoneNumber());

        Car car = finderUtils.findCarById(order.getCarId());
        order.setCarLicensePlate(car.getLicensePlate());
        order.setCarName(car.getName());
        order.setCarCode(car.getCarCode());

        if (StringUtils.isNotEmpty(order.getExecutorId())) {
            User user = finderUtils.findUserById(order.getExecutorId());
            order.setExecutorCode(user.getUserCode());
            order.setExecutorName(user.getName());
            order.setExecutorPhoneNumber(user.getPhone());
        }
    }

    public void fillingMissingValue(Car car) {
        Customer customer = finderUtils.findCustomerById(car.getCustomerId());
        car.setCustomerCode(customer.getCustomerCode());
        car.setCustomerName(customer.getName());
        car.setCustomerPhoneNumber(customer.getPhoneNumber());
        car.setCustomerIdentityNumber(customer.getIdentityNumber());
    }

    private void updateOrderStatus(Order order, Integer status) {
        if (order.getStatus() != OrderStatus.BILL_CREATED) {
            order.setStatus(status);
            order.setStatusName(OrderStatus.mapOrderStatus.get(status));
        }
        order.setUpdateDate(new Date());
        orderRepository.save(order);
    }

    private void updateUserStatus(Order order, boolean executing) {
        User user = finderUtils.findUserById(order.getExecutorId());
        user.setExecuting(executing);
        user.setUpdateDate(new Date());
        userRepository.save(user);
    }

    private void sendCompleteSms(Order order) {
        String message = "Chào anh/chị " + order.getCustomerName()
                + "\nYêu cầu chăm sóc xe mang biển số " + order.getCarLicensePlate() + " đã được xử lý hoàn tất"
                + "\nQuý khách đã có thể đến Trung tâm để nhận xe"
                + "\nLV Car Care";
        smsService.sendSMS(SEND_SMS_PHONE_NUMBER, "+84" + order.getCustomerPhoneNumber(), message);
    }
}
