package iuh.nhom7.khoa_luan_backend.service;

import iuh.nhom7.khoa_luan_backend.common.BillStatus;
import iuh.nhom7.khoa_luan_backend.entity.Bill;
import iuh.nhom7.khoa_luan_backend.entity.Customer;
import iuh.nhom7.khoa_luan_backend.request.ReportRequest;
import iuh.nhom7.khoa_luan_backend.request.StatisticRequest;
import iuh.nhom7.khoa_luan_backend.request.bill.SearchBillRequest;
import iuh.nhom7.khoa_luan_backend.response.AdminStatistic;
import iuh.nhom7.khoa_luan_backend.response.CustomerStatistic;
import iuh.nhom7.khoa_luan_backend.response.StatisticResponse;
import iuh.nhom7.khoa_luan_backend.utils.DateTimesUtils;
import iuh.nhom7.khoa_luan_backend.utils.FinderUtils;
import iuh.nhom7.khoa_luan_backend.utils.MappingUtils;
import iuh.nhom7.khoa_luan_backend.utils.QueryBuilderUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

/**
 * 4:16 PM 20-Nov-22
 * Long Tran
 */
@Service
public class StatisticService {

    private final MongoTemplate mongoTemplate;

    private final BillService billService;

    private final FinderUtils finderUtils;


    public StatisticService(MongoTemplate mongoTemplate, BillService billService, FinderUtils finderUtils) {
        this.mongoTemplate = mongoTemplate;
        this.billService = billService;
        this.finderUtils = finderUtils;
    }


    public CustomerStatistic getCustomerStatistic(String customerId) {
        Customer customer = finderUtils.findCustomerById(customerId);
        List<Bill> bills = billService.findAllBillByCustomerId(customerId);
        AtomicLong totalPromotionValue = new AtomicLong(0L);
        AtomicLong totalServiceValue = new AtomicLong(0L);
        AtomicLong totalPaymentValue = new AtomicLong(0L);
        AtomicInteger totalCancelBill = new AtomicInteger(0);

        bills.forEach(bill -> {
            if (bill.getStatus() == BillStatus.CANCELED) {
                totalCancelBill.getAndIncrement();
            } else {
                totalPromotionValue.addAndGet(bill.getTotalPromotionAmount().longValue());
                totalServiceValue.addAndGet(bill.getTotalServicePrice().longValue());
                totalPaymentValue.addAndGet(bill.getPaymentAmount().longValue());
            }
        });

        return CustomerStatistic.builder()
                .customerCode(customer.getCustomerCode())
                .customerName(customer.getName())
                .totalServicePrice(totalServiceValue.get())
                .totalPromotionAmount(totalPromotionValue.get())
                .totalPaymentAmount(totalPaymentValue.get())
                .totalBill(bills.size())
                .totalCancelBill(totalCancelBill.get())
                .build();
    }

    public AdminStatistic getAdminStatistic(StatisticRequest statisticRequest) {

        List<Bill> bills = queryBill(statisticRequest);

        AtomicLong totalPromotionValue = new AtomicLong(0L);
        AtomicLong totalServiceValue = new AtomicLong(0L);
        AtomicLong totalPaymentValue = new AtomicLong(0L);
        AtomicInteger totalCancelBill = new AtomicInteger(0);

        bills.forEach(bill -> {
            if (bill.getStatus() == BillStatus.CANCELED) {
                totalCancelBill.getAndIncrement();
            } else {
                totalPromotionValue.addAndGet(bill.getTotalPromotionAmount().longValue());
                totalServiceValue.addAndGet(bill.getTotalServicePrice().longValue());
                totalPaymentValue.addAndGet(bill.getPaymentAmount().longValue());
            }
        });

        return AdminStatistic.builder()
                .totalServicePrice(totalServiceValue.get())
                .totalPromotionAmount(totalPromotionValue.get())
                .totalPaymentAmount(totalPaymentValue.get())
                .totalBill(bills.size())
                .totalCancelBill(totalCancelBill.get())
                .build();
    }


    public List<StatisticResponse> getMapStatistic(StatisticRequest statisticRequest) {
        Map<String, Long> map = new HashMap<>();
        List<Date> listDate = DateTimesUtils.getDateList(statisticRequest.getFromDate(), statisticRequest.getToDate());
        for (Date date : listDate) {
            String dateStr = DateTimesUtils.convertDateToString(date, DateTimesUtils.DATE_FORMAT_DDMMYYYY);
            map.put(dateStr, 0L);
        }
        List<Bill> bills = queryBill(statisticRequest);
        bills.forEach(bill -> {
            String dateStr = DateTimesUtils.convertDateToString(bill.getPaymentDate(), DateTimesUtils.DATE_FORMAT_DDMMYYYY);
            if(bill.getStatus()!=BillStatus.CANCELED){
                if (map.containsKey(dateStr)) {
                    map.put(dateStr, map.get(dateStr) + bill.getPaymentAmount().longValue());
                }
            }
        });

        return map.entrySet().stream().sorted(Map.Entry.comparingByKey((o1, o2) ->
            Objects.requireNonNull(DateTimesUtils.convertStringToDate(o1, DateTimesUtils.DATE_FORMAT_DDMMYYYY)).compareTo(DateTimesUtils.convertStringToDate(o2,DateTimesUtils.DATE_FORMAT_DDMMYYYY)))).map(e -> new StatisticResponse(e.getKey(), e.getValue())).collect(Collectors.toList());
    }

//    private List<Bill> queryPaidBill(StatisticRequest statisticRequest) {
//        Criteria criteria = new Criteria();
//        List<Criteria> filterList = new ArrayList<>();
//        QueryBuilderUtils.addSingleValueFilter(filterList, "status", BillStatus.PAID);
//        QueryBuilderUtils.addDateFilter(filterList, "createDate", statisticRequest.getFromDate(), statisticRequest.getToDate());
//        if (StringUtils.isNotEmpty(statisticRequest.getUserId())) {
//            QueryBuilderUtils.addSingleValueFilter(filterList, "executorId", statisticRequest.getUserId());
//        }
//
//        criteria.andOperator(filterList);
//
//        Query query = new Query();
//        query.addCriteria(criteria);
//        return mongoTemplate.find(query, Bill.class);
//    }
    private List<Bill> queryBill(StatisticRequest statisticRequest) {
        Criteria criteria = new Criteria();
        List<Criteria> filterList = new ArrayList<>();
        QueryBuilderUtils.addDateFilter(filterList, "createDate", DateTimesUtils.atStartOfDay(statisticRequest.getFromDate()), DateTimesUtils.atEndOfDay(statisticRequest.getToDate()));
        if (StringUtils.isNotEmpty(statisticRequest.getUserId())) {
            QueryBuilderUtils.addSingleValueFilter(filterList, "executorId", statisticRequest.getUserId());
        }

        criteria.andOperator(filterList);

        Query query = new Query();
        query.addCriteria(criteria);
        return mongoTemplate.find(query, Bill.class);
    }
}
