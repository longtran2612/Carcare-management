package iuh.nhom7.khoa_luan_backend.utils;

import iuh.nhom7.khoa_luan_backend.base.BaseObjectLoggable;
import iuh.nhom7.khoa_luan_backend.entity.*;
import iuh.nhom7.khoa_luan_backend.exception.ErrorCode;
import iuh.nhom7.khoa_luan_backend.exception.ServiceException;
import iuh.nhom7.khoa_luan_backend.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 02:29 AM 21-Sep-22
 * Andy Lai
 *
 * FinderUtils là các method query data
 * dùng cho việc tìm một đối tượng ở các services
 *
 */
@Service
public class FinderUtils extends BaseObjectLoggable {
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final PriceRepository priceRepository;
    private final PriceHeaderRepository priceHeaderRepository;
    private final CarCareServiceRepository carCareServiceRepository;
    private final CarCareCategoryRepository carCareCategoryRepository;
    private final CarRepository carRepository;
    private final OrderRepository orderRepository;
    private final PromotionLineRepository promotionLineRepository;
    private final PromotionHeaderRepository promotionHeaderRepository;
    private final PromotionDetailRepository promotionDetailRepository;
    private final CarSlotRepository carSlotRepository;

    public FinderUtils(AccountRepository accountRepository,
                       UserRepository userRepository,
                       CustomerRepository customerRepository,
                       PriceRepository priceRepository,
                       PriceHeaderRepository priceHeaderRepository,
                       CarCareServiceRepository carCareServiceRepository,
                       CarCareCategoryRepository carCareCategoryRepository,
                       CarRepository carRepository,
                       OrderRepository orderRepository,
                       PromotionLineRepository promotionLineRepository,
                       PromotionHeaderRepository promotionHeaderRepository,
                       PromotionDetailRepository promotionDetailRepository,
                       CarSlotRepository carSlotRepository) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.priceRepository = priceRepository;
        this.priceHeaderRepository = priceHeaderRepository;
        this.carCareServiceRepository = carCareServiceRepository;
        this.carCareCategoryRepository = carCareCategoryRepository;
        this.carRepository = carRepository;
        this.orderRepository = orderRepository;
        this.promotionLineRepository = promotionLineRepository;
        this.promotionHeaderRepository = promotionHeaderRepository;
        this.promotionDetailRepository = promotionDetailRepository;
        this.carSlotRepository = carSlotRepository;
    }

    public User findByPhone(String phone) {
        User user = userRepository.findByPhone(phone).orElse(null);
        if (user == null) {
            throw new ServiceException(ErrorCode.USER_NOT_FOUND);
        }
        return user;
    }

    public User findUserById(String id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            throw new ServiceException(ErrorCode.USER_NOT_FOUND);
        }
        return user;
    }

    public Account findByUsername(String username) {
        Account account = accountRepository.findByUsername(username).orElse(null);
        if (account == null) {
            throw new ServiceException(ErrorCode.ACCOUNT_NOT_FOUND);
        }
        return account;
    }

    public Customer findCustomerById(String id) {
        Customer customer = customerRepository.findById(id).orElse(null);
        if (customer == null) {
            throw new ServiceException(ErrorCode.CUSTOMER_NOT_FOUND);
        }
        return customer;
    }

    public PriceHeader findPriceHeaderById(String priceHeaderId) {
        PriceHeader priceHeader = priceHeaderRepository.findById(priceHeaderId).orElse(null);
        if (priceHeader == null) {
            throw new ServiceException(ErrorCode.PRICE_HEADER_NOT_FOUND);
        }
        return priceHeader;
    }

    public CarCareService findCarCareServiceById(String id) {
        CarCareService service = carCareServiceRepository.findById(id).orElse(null);
        if (service == null) {
            throw new ServiceException(ErrorCode.SERVICE_NOT_FOUND);
        }
        return service;
    }

    public Price findPriceById(String priceId) {
        Price price = priceRepository.findById(priceId).orElse(null);
        if (price == null) {
            throw new ServiceException(ErrorCode.SERVICE_PRICE_NOT_FOUND);
        }
        return price;
    }

    public CarCareCategory findCategoryById(String id){
        CarCareCategory category = carCareCategoryRepository.findById(id).orElse(null);
        if (category == null) {
            throw new ServiceException(ErrorCode.CATEGORY_NOT_FOUND);
        }
        return category;
    }

    public Car findCarById(String id) {
        Car car = carRepository.findById(id).orElse(null);
        if (car == null) {
            throw new ServiceException(ErrorCode.CAR_NOT_FOUND);
        }
        return car;
    }

    public List<Car> findCarsByCustomerId(String customerId) {
        return carRepository.findAllByCustomerId(customerId);
    }

    public Order findOrderById(String id) {
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null) {
            throw new ServiceException(ErrorCode.ORDER_NOT_FOUND);
        }
        return order;
    }

    public PromotionHeader findPromotionHeaderById(String id) {
        PromotionHeader promotionHeader = promotionHeaderRepository.findById(id).orElse(null);
        if (promotionHeader == null) {
            throw new ServiceException(ErrorCode.PROMOTION_HEADER_NOT_FOUND);
        }
        return promotionHeader;
    }

    public PromotionLine findPromotionLineById(String id) {
        PromotionLine promotionLine = promotionLineRepository.findById(id).orElse(null);
        if (promotionLine == null) {
            throw new ServiceException(ErrorCode.PROMOTION_LINE_NOT_FOUND);
        }
        return promotionLine;
    }

    public List<PromotionLine> findAllPromotionLineByStatus(String status) {
        return promotionLineRepository.findAllByStatus(status);
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

    public PromotionDetail findPromotionDetailByPromotionLineId(String id) {
        PromotionDetail promotionDetail = promotionDetailRepository.findByPromotionLineId(id).orElse(null);
        if (promotionDetail == null) {
            throw new ServiceException(ErrorCode.PROMOTION_DETAIL_NOT_FOUND);
        }
        return promotionDetail;
    }

    public CarSlot findCarSlotById(String id) {
        CarSlot carSlot = carSlotRepository.findById(id).orElse(null);
        if (carSlot == null) {
            throw new ServiceException(ErrorCode.CAR_SLOT_NOT_FOUND);
        }
        return carSlot;
    }

    public CarSlot findCarSlotByOrderId(String orderId) {
        return carSlotRepository.findByOrderId(orderId).orElse(null);
    }

}
