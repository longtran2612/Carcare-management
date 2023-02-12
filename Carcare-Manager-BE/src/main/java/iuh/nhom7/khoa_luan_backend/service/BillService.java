package iuh.nhom7.khoa_luan_backend.service;

import iuh.nhom7.khoa_luan_backend.base.BaseService;
import iuh.nhom7.khoa_luan_backend.common.BillStatus;
import iuh.nhom7.khoa_luan_backend.common.EnumConst;
import iuh.nhom7.khoa_luan_backend.common.OrderStatus;
import iuh.nhom7.khoa_luan_backend.common.PromotionType;
import iuh.nhom7.khoa_luan_backend.entity.*;
import iuh.nhom7.khoa_luan_backend.exception.ErrorCode;
import iuh.nhom7.khoa_luan_backend.exception.ServiceException;
import iuh.nhom7.khoa_luan_backend.model.BillPromotionDetailModel;
import iuh.nhom7.khoa_luan_backend.repository.BillRepository;
import iuh.nhom7.khoa_luan_backend.repository.OrderRepository;
import iuh.nhom7.khoa_luan_backend.repository.PromotionDetailRepository;
import iuh.nhom7.khoa_luan_backend.repository.PromotionLineRepository;
import iuh.nhom7.khoa_luan_backend.request.bill.CreateBillRequest;
import iuh.nhom7.khoa_luan_backend.request.bill.SearchBillRequest;
import iuh.nhom7.khoa_luan_backend.utils.FinderUtils;
import iuh.nhom7.khoa_luan_backend.utils.PageableUtils;
import iuh.nhom7.khoa_luan_backend.utils.QueryBuilderUtils;
import iuh.nhom7.khoa_luan_backend.utils.TextUtils;
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
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

@Service
public class BillService extends BaseService {
    private final MongoTemplate mongoTemplate;
    private final BillRepository billRepository;
    private final OrderRepository orderRepository;
    private final PromotionDetailRepository promotionDetailRepository;
    private final PromotionLineRepository promotionLineRepository;
    private final FinderUtils finderUtils;

    public BillService(MongoTemplate mongoTemplate, BillRepository billRepository,
                       OrderRepository orderRepository,
                       PromotionDetailRepository promotionDetailRepository,
                       PromotionLineRepository promotionLineRepository,
                       FinderUtils finderUtils) {
        this.mongoTemplate = mongoTemplate;
        this.billRepository = billRepository;
        this.orderRepository = orderRepository;
        this.promotionDetailRepository = promotionDetailRepository;
        this.promotionLineRepository = promotionLineRepository;
        this.finderUtils = finderUtils;
    }

    public Bill findBillById(String id) {
        Bill bill = billRepository.findById(id).orElse(null);
        if (bill == null) {
            throw new ServiceException(ErrorCode.BILL_NOT_FOUND);
        }
        return bill;
    }

    public Bill findBillByCode(String code) {
        Bill bill = billRepository.findByBillCode(code).orElse(null);
        if (bill == null) {
            throw new ServiceException(ErrorCode.BILL_NOT_FOUND);
        }
        return bill;
    }

    public List<Bill> findAllBillByCustomerId(String customerId) {
        List<Bill> bills = billRepository.findAllByCustomerId(customerId);
        if (CollectionUtils.isEmpty(bills)) {
            return new ArrayList<>();
        }
        return bills;
    }

    public Page<Bill> search(SearchBillRequest request) {
        try {
            // sort
            Pageable pageable = PageableUtils.convertPageableAndSort(request.getPageNumber(), request.getPageSize(), request.getSort());

            // search
            Criteria criteria = new Criteria();
            String key = TextUtils.convertStringToSort(request.getKeyword());
            if (StringUtils.isNotEmpty(key)) {
                Criteria criteriaSearch = Criteria.where("searchingKeys").regex(key, "i");
                Criteria billCodeCriteria = Criteria.where("billCode").regex(key, "i");
                criteria.orOperator(criteriaSearch, billCodeCriteria);
            }

            // filter
            List<Criteria> filterList = new ArrayList<>();
            QueryBuilderUtils.addSingleValueFilter(filterList, "status", request.getStatus());
            QueryBuilderUtils.addDateFilter(filterList, "paymentDate", request.getFromPaymentDate(), request.getToPaymentDate());

            if (CollectionUtils.isNotEmpty(filterList)) {
                criteria.andOperator(filterList);
            }

            // query
            Query query = new Query();
            query.with(pageable);
            query.addCriteria(criteria);

            logger.info("=======> query: " + query);
            List<Bill> orderList = mongoTemplate.find(query, Bill.class);
            return PageableExecutionUtils.getPage(orderList, pageable, () -> mongoTemplate.count(Query.of(query).limit(-1).skip(-1), Bill.class));

        } catch (Exception e) {
            logger.error(">>>>>>>>>>>>>>>>>>> error search bill", e);
            return Page.empty();
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public Bill create(CreateBillRequest request, Account account) {
        Date now = new Date();
        if (StringUtils.isEmpty(request.getOrderId())) {
            throw new ServiceException(ErrorCode.ORDER_NOT_FOUND);
        }
        Order order = finderUtils.findOrderById(request.getOrderId());
        if (OrderStatus.BILL_CREATED == order.getStatus()) {
            throw new ServiceException(ErrorCode.ORDER_CREATED_BILL);
        }
        order.setPaymentDate(now);
        order.setUpdateDate(now);
        order.setStatus(OrderStatus.BILL_CREATED);
        order.setStatusName(OrderStatus.mapOrderStatus.get(OrderStatus.BILL_CREATED));
        orderRepository.save(order);

        List<BillPromotionDetailModel> billPromotionList = new LinkedList<>();
        double totalServicePrice = order.getTotalServicePrice().doubleValue();
        double totalPromotion = 0;
        if (CollectionUtils.isNotEmpty(request.getPromotionCodes())) {
            for (String promotionCode : request.getPromotionCodes()) {
                PromotionDetail promotionDetail = finderUtils.findPromotionDetailByCode(promotionCode);
                int promotionUsedTime = promotionDetail.getPromotionUsedTime() == null ? 0 : promotionDetail.getPromotionUsedTime();
                double promotionUsedAmount = promotionDetail.getPromotionUsedAmount() == null ? 0 : promotionDetail.getPromotionUsedAmount();
                if (PromotionType.PERCENTAGE.equals(promotionDetail.getType())) {
                    double promotionRate = promotionDetail.getAmount().doubleValue() / 100;
                    double promotionAmount = totalServicePrice * promotionRate;
                    double promotionMaximumDiscount = promotionDetail.getMaximumDiscount().doubleValue();

                    if (promotionAmount >= promotionMaximumDiscount) {
                        promotionAmount = promotionMaximumDiscount;
                    }
                    totalPromotion += promotionAmount;
                    promotionDetail.setPromotionUsedTime(promotionUsedTime + 1);
                    promotionDetail.setPromotionUsedAmount(promotionUsedAmount + promotionAmount);
                    if (promotionDetail.getLimitUsedTime()) {
                        double promotionAmountLeft = promotionDetail.getLimitPromotionAmount().doubleValue() - promotionDetail.getPromotionUsedAmount();
                        if (promotionAmountLeft < promotionMaximumDiscount) {
                            promotionDetail.setStatus(EnumConst.Status.INACTIVE.toString());
                            promotionDetail.setUpdateDate(now);
                            PromotionLine promotionLine = finderUtils.findPromotionLineById(promotionDetail.getPromotionLineId());
                            promotionLine.setStatus(EnumConst.Status.INACTIVE.toString());
                            promotionLine.setUpdateDate(now);
                            promotionLineRepository.save(promotionLine);
                        }
                    }
                    promotionDetailRepository.save(promotionDetail);
                    billPromotionList.add(BillPromotionDetailModel.builder()
                            .id(promotionDetail.getId())
                            .promotionDetailCode(promotionDetail.getPromotionDetailCode())
                            .description(promotionDetail.getDescription())
                            .type(promotionDetail.getType())
                            .amount(promotionDetail.getAmount())
                            .promotionUsedAmount(promotionAmount).build());
                } else {
                    double promotionAmount = promotionDetail.getAmount().doubleValue();
                    totalPromotion += promotionAmount;
                    promotionDetail.setPromotionUsedTime(promotionUsedTime + 1);
                    promotionDetail.setPromotionUsedAmount(promotionUsedAmount + promotionAmount);
                    if (promotionDetail.getLimitUsedTime()) {
                        double promotionAmountLeft = promotionDetail.getLimitPromotionAmount().doubleValue() - promotionDetail.getPromotionUsedAmount();
                        if (promotionAmountLeft < promotionAmount) {
                            promotionDetail.setStatus(EnumConst.Status.INACTIVE.toString());
                            promotionDetail.setUpdateDate(now);
                            PromotionLine promotionLine = finderUtils.findPromotionLineById(promotionDetail.getPromotionLineId());
                            promotionLine.setStatus(EnumConst.Status.INACTIVE.toString());
                            promotionLine.setUpdateDate(now);
                            promotionLineRepository.save(promotionLine);
                        }
                    }
                    promotionDetailRepository.save(promotionDetail);
                    billPromotionList.add(BillPromotionDetailModel.builder()
                            .id(promotionDetail.getId())
                            .promotionDetailCode(promotionDetail.getPromotionDetailCode())
                            .description(promotionDetail.getDescription())
                            .type(promotionDetail.getType())
                            .amount(promotionDetail.getAmount())
                            .promotionUsedAmount(promotionAmount).build());
                }
            }
            if (ObjectUtils.isEmpty(request.getTotalPromotionAmount())
                    || totalPromotion != request.getTotalPromotionAmount().doubleValue()) {
                rollBackBillPromotionDetail(billPromotionList);
                throw new ServiceException(ErrorCode.PROMOTION_AMOUNT_NOT_MATCH);
            }
        }

        double totalPaymentAmount = totalServicePrice - totalPromotion;
        if (ObjectUtils.isEmpty(request.getPaymentAmount()) || totalPaymentAmount != request.getPaymentAmount().doubleValue()) {
            rollBackBillPromotionDetail(billPromotionList);
            throw new ServiceException(ErrorCode.PAYMENT_AMOUNT_NOT_MATCH);
        }

        Bill bill = Bill.builder()
                .billCode("BILL" + sequenceValueItemRepository.getSequence(Bill.class))
                .orderId(order.getId())
                .orderCode(order.getOrderCode())
                .customerId(order.getCustomerId())
                .customerCode(order.getCustomerCode())
                .customerName(order.getCustomerName())
                .customerPhoneNumber(order.getCustomerPhoneNumber())
                .carId(order.getCarId())
                .carCode(order.getCarCode())
                .carName(order.getCarName())
                .carLicensePlate(order.getCarLicensePlate())
                .executorId(order.getExecutorId())
                .executorCode(order.getExecutorCode())
                .executorName(order.getExecutorName())
                .executorPhoneNumber(order.getExecutorPhoneNumber())
                .services(order.getServices())
                .promotionDetails(billPromotionList)
                .totalServicePrice(order.getTotalServicePrice())
                .totalPromotionAmount(BigDecimal.valueOf(totalPromotion))
                .paymentAmount(request.getPaymentAmount())
                .paymentDate(now)
                .paymentType(StringUtils.isEmpty(request.getPaymentType()) ? null : request.getPaymentType())
                .cardNumber(StringUtils.isEmpty(request.getCardNumber()) ? null : request.getCardNumber())
                .status(BillStatus.PAID)
                .statusName(BillStatus.mapBillStatus.get(BillStatus.PAID))
                .createDate(now)
                .createBy(account.getUsername())
                .updateDate(now)
                .searchingKeys(order.getSearchingKeys())
                .build();
        return billRepository.save(bill);
    }

    @Transactional(rollbackFor = Exception.class)
    public Bill cancelBill(String id, Account account) {
        Date now = new Date();
        Bill bill = findBillById(id);
        bill.setCanceledDate(now);
        bill.setStatus(BillStatus.CANCELED);
        bill.setStatusName(BillStatus.mapBillStatus.get(BillStatus.CANCELED));
        bill.setUpdateDate(now);
        rollBackBillPromotionDetail(bill.getPromotionDetails());
        try {
            // save canceled user info
            User user = finderUtils.findByPhone(account.getUsername());
            bill.setCanceledByUserId(user.getId());
            bill.setCanceledByUserCode(user.getUserCode());
            bill.setCanceledByUserName(user.getName());
        } catch (Exception e) {
            logger.info("error saving canceled user info: " + e);
        }
        return billRepository.save(bill);
    }

    private void rollBackBillPromotionDetail(List<BillPromotionDetailModel> billPromotionDetailModels) {
        Date now = new Date();
        if (CollectionUtils.isEmpty(billPromotionDetailModels)) {
            return;
        }
        for (BillPromotionDetailModel billPromotionDetailModel : billPromotionDetailModels) {
            try {
                PromotionDetail promotionDetail = finderUtils.findPromotionDetailById(billPromotionDetailModel.getId());
                promotionDetail.setPromotionUsedTime(promotionDetail.getPromotionUsedTime() - 1);
                promotionDetail.setPromotionUsedAmount(promotionDetail.getPromotionUsedAmount() - billPromotionDetailModel.getPromotionUsedAmount());
                if (promotionDetail.getLimitUsedTime()) {
                    double promotionAmountLeft = promotionDetail.getLimitPromotionAmount().doubleValue() - promotionDetail.getPromotionUsedAmount();
                    if (PromotionType.PERCENTAGE.equals(promotionDetail.getType())) {
                        if (promotionAmountLeft > promotionDetail.getMaximumDiscount().doubleValue()) {
                            PromotionLine promotionLine = finderUtils.findPromotionLineById(promotionDetail.getPromotionLineId());
                            if (now.before(promotionLine.getToDate()) && now.after(promotionLine.getFromDate())) {
                                promotionDetail.setStatus(EnumConst.Status.ACTIVE.toString());
                                promotionDetail.setUpdateDate(now);
                                promotionLine.setStatus(EnumConst.Status.ACTIVE.toString());
                                promotionLine.setUpdateDate(now);
                                promotionLineRepository.save(promotionLine);
                            }
                        }
                    } else {
                        if (promotionAmountLeft > promotionDetail.getAmount().doubleValue()) {
                            PromotionLine promotionLine = finderUtils.findPromotionLineById(promotionDetail.getPromotionLineId());
                            if (now.before(promotionLine.getToDate()) && now.after(promotionLine.getFromDate())) {
                                promotionDetail.setStatus(EnumConst.Status.ACTIVE.toString());
                                promotionDetail.setUpdateDate(now);
                                promotionLine.setStatus(EnumConst.Status.ACTIVE.toString());
                                promotionLine.setUpdateDate(now);
                                promotionLineRepository.save(promotionLine);
                            }
                        }
                    }
                }
                promotionDetailRepository.save(promotionDetail);
            } catch (Exception e) {
                logger.info("=======> rollBackBillPromotionDetail error: " + e.getMessage() + " at " + billPromotionDetailModel.getId());
            }
        }
    }

}
