package iuh.nhom7.khoa_luan_backend.service;

import iuh.nhom7.khoa_luan_backend.base.BaseService;
import iuh.nhom7.khoa_luan_backend.common.BillStatus;
import iuh.nhom7.khoa_luan_backend.common.PromotionType;
import iuh.nhom7.khoa_luan_backend.common.ReportType;
import iuh.nhom7.khoa_luan_backend.entity.*;
import iuh.nhom7.khoa_luan_backend.exception.ErrorCode;
import iuh.nhom7.khoa_luan_backend.exception.ServiceException;
import iuh.nhom7.khoa_luan_backend.model.BillPromotionDetailModel;
import iuh.nhom7.khoa_luan_backend.request.ReportRequest;
import iuh.nhom7.khoa_luan_backend.response.CancelBillReport;
import iuh.nhom7.khoa_luan_backend.response.PromotionReport;
import iuh.nhom7.khoa_luan_backend.response.SalesByCustomerReport;
import iuh.nhom7.khoa_luan_backend.response.SalesByDateReport;
import iuh.nhom7.khoa_luan_backend.utils.DateTimesUtils;
import iuh.nhom7.khoa_luan_backend.utils.FinderUtils;
import iuh.nhom7.khoa_luan_backend.utils.QueryBuilderUtils;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;

@Service
public class ReportService extends BaseService {
    private final FinderUtils finderUtils;
    private final MongoTemplate mongoTemplate;

    public ReportService(FinderUtils finderUtils,
                         MongoTemplate mongoTemplate) {
        this.finderUtils = finderUtils;
        this.mongoTemplate = mongoTemplate;
    }

    public List<SalesByDateReport> getSalesByDateReport(ReportRequest request) {
        List<SalesByDateReport> reportList = new ArrayList<>();
        List<Date> dates = DateTimesUtils.getDatesBetween2Dates(request.getFromDate(), request.getToDate());
        for (Date date : dates) {
            Date startDate = DateTimesUtils.getStartDateCalendarWithoutTime(date).getTime();
            Date endDate = DateTimesUtils.addDate(startDate, 1);
            List<Bill> paidBillList = queryPaidBill(request, startDate, endDate);
            if (CollectionUtils.isEmpty(paidBillList)) {
                continue;
            }
            for (Bill bill : paidBillList) {
                User user = finderUtils.findByPhone(bill.getCreateBy());
                SalesByDateReport report = SalesByDateReport.builder()
                        .userCode(user.getUserCode())
                        .userName(user.getName())
                        .date(date)
                        .totalPromotionAmount(bill.getTotalPromotionAmount())
                        .totalServicePrice(bill.getTotalServicePrice())
                        .paymentAmount(bill.getPaymentAmount())
                        .build();
                reportList.add(report);
            }
        }
        return reportList;
    }

    public List<SalesByCustomerReport> getSalesByCustomerReport(ReportRequest request) {
        List<SalesByCustomerReport> reportList = new ArrayList<>();

        List<Bill> paidBillList = queryPaidBill(request, request.getFromDate(), request.getToDate());
        Set<String> customerIds = new HashSet<>();
        for (Bill bill : paidBillList) {
            customerIds.add(bill.getCustomerId());
        }

        for (String customerId : customerIds) {
            Customer customer = finderUtils.findCustomerById(customerId);
            if (StringUtils.isNotEmpty(request.getCustomerProvince())) {
                if (!request.getCustomerProvince().equals(customer.getProvinceCode())) {
                    continue;
                }
            }
            if (StringUtils.isNotEmpty(request.getCustomerDistrict())) {
                if (!request.getCustomerDistrict().equals(customer.getDistrictCode())) {
                    continue;
                }
            }
            if (StringUtils.isNotEmpty(request.getCustomerWard())) {
                if (!request.getCustomerWard().equals(customer.getWardCode())) {
                    continue;
                }
            }
            if (request.getCustomerStatus() != null) {
                if (customer.getStatus() != request.getCustomerStatus()) {
                    continue;
                }
            }

            SalesByCustomerReport report = SalesByCustomerReport.builder()
                    .customerCode(customer.getCustomerCode())
                    .customerName(customer.getName())
                    .address(customer.getAddress())
                    .ward(customer.getWard())
                    .district(customer.getDistrict())
                    .province(customer.getProvince())
                    .statusName(customer.getStatusName())
                    .build();

            List<Car> customerCarList = finderUtils.findCarsByCustomerId(customerId);
            for (Car car : customerCarList) {
                List<Bill> customerCarBillList = queryPaidBillByCustomerIdAndCarId(request.getFromDate(), request.getToDate(), customerId, car.getId());
                if (CollectionUtils.isEmpty(customerCarBillList)) {
                    continue;
                }
                long totalPromotionValue = 0L;
                long totalServiceValue = 0L;
                long totalPaymentValue = 0L;
                for (Bill bill : customerCarBillList) {
                    totalPromotionValue += bill.getTotalPromotionAmount().longValue();
                    totalServiceValue += bill.getTotalServicePrice().longValue();
                    totalPaymentValue += bill.getPaymentAmount().longValue();
                }
                report.setCarCode(car.getCarCode());
                report.setCarBrand(car.getBrand());
                report.setLicensePlate(car.getLicensePlate());
                report.setTotalPromotionAmount(totalPromotionValue);
                report.setTotalServicePrice(totalServiceValue);
                report.setTotalPaymentAmount(totalPaymentValue);
                reportList.add(report);
            }
        }

        return reportList;
    }

    public List<CancelBillReport> getCancelBillReport(ReportRequest request) {
        List<CancelBillReport> reportList = new ArrayList<>();

        List<Bill> canceledBillList = queryCancelBill(request, request.getFromDate(), request.getToDate());
        for (Bill bill : canceledBillList) {
            String services = "";
            for (CarCareService service : bill.getServices()) {
                services = services + service.getName() + "\n";
            }

            CancelBillReport report = CancelBillReport.builder()
                    .billCode(bill.getBillCode())
                    .billCreatedDate(bill.getCreateDate())
                    .billCanceledDate(bill.getCanceledDate())
                    .canceledUserCode(bill.getCanceledByUserCode())
                    .canceledUserName(bill.getCanceledByUserName())
                    .services(services)
                    .totalServicePrice(bill.getTotalServicePrice())
                    .totalPromotionAmount(bill.getTotalPromotionAmount())
                    .paymentAmount(bill.getPaymentAmount())
                    .build();

            reportList.add(report);
        }

        return reportList;
    }

    public List<PromotionReport> getPromotionReport(ReportRequest request) {
        List<PromotionReport> reportList = new ArrayList<>();
        List<Bill> paidBillList = queryPaidBill(request, request.getFromDate(), request.getToDate());
        if (CollectionUtils.isEmpty(paidBillList)) {
            return new ArrayList<>();
        }
        Map<String, Double> promotionCountMap = new HashMap<>();
        for (Bill bill : paidBillList) {
            if (CollectionUtils.isEmpty(bill.getPromotionDetails())) {
                continue;
            }
            for (BillPromotionDetailModel promotionDetailModel : bill.getPromotionDetails()) {
                if (promotionCountMap.containsKey(promotionDetailModel.getId())) {
                    double value = promotionCountMap.get(promotionDetailModel.getId());
                    promotionCountMap.put(promotionDetailModel.getId(), value + promotionDetailModel.getPromotionUsedAmount());
                } else {
                    promotionCountMap.put(promotionDetailModel.getId(), promotionDetailModel.getPromotionUsedAmount());
                }
            }
        }
        for (String promotionId : promotionCountMap.keySet()) {
            PromotionDetail promotionDetail = finderUtils.findPromotionDetailById(promotionId);
            PromotionLine promotionLine = finderUtils.findPromotionLineById(promotionDetail.getPromotionLineId());
            if (StringUtils.isNotEmpty(request.getPromotionHeaderId())) {
                if (!request.getPromotionHeaderId().equals(promotionLine.getPromotionHeaderId())) {
                    continue;
                }
            }
            if (StringUtils.isNotEmpty(request.getPromotionType())) {
                if (!request.getPromotionType().equals(promotionDetail.getType())) {
                    continue;
                }
            }

            PromotionReport report = PromotionReport.builder()
                    .promotionDetailCode(promotionDetail.getPromotionDetailCode())
                    .promotionDetailName(promotionDetail.getDescription())
                    .fromDate(promotionLine.getFromDate())
                    .toDate(promotionLine.getToDate())
                    .promotionType(PromotionType.mapPromotionType.get(promotionDetail.getType()))
                    .promotionAmount(promotionDetail.getAmount())
                    .promotionUsedAmount(promotionCountMap.get(promotionId))
                    .build();

            if (PromotionType.SERVICE.equals(promotionDetail.getType())) {
                CarCareService service = finderUtils.findCarCareServiceById(promotionDetail.getServiceIds().get(0));
                report.setServiceCode(service.getServiceCode());
                report.setServiceName(service.getName());
            }
            if (promotionDetail.getLimitUsedTime()) {
                long promotionUsedAmount = promotionDetail.getPromotionUsedAmount().longValue();
                long limitPromotionAmount = promotionDetail.getLimitPromotionAmount().longValue();
                report.setLimitUsedTime("Có");
                report.setLimitPromotionAmount(promotionDetail.getLimitPromotionAmount());
                report.setLimitPromotionAmountLeft(limitPromotionAmount - promotionUsedAmount);
            } else {
                report.setLimitUsedTime("Không");
            }
            reportList.add(report);
        }

        return reportList;
    }

    // Báo cáo bảng kê hủy hóa đơn
    public void exportReport(ReportRequest request, HttpServletResponse response) {
        try {
            response.setContentType("application/octet-stream");
            String headerKey = "Content-Disposition";
            String headerValue = "";
            if (request.getFromDate() == null) {
                throw new ServiceException(ErrorCode.FROM_DATE_NULL);
            }
            if (request.getToDate() == null) {
                throw new ServiceException(ErrorCode.TO_DATE_NULL);
            }
            request.setFromDate(DateTimesUtils.getStartDateCalendarWithoutTime(request.getFromDate()).getTime());
            request.setToDate(DateTimesUtils.getEndDateCalendarWithoutTime(request.getToDate()).getTime());

            XSSFWorkbook workbook = new XSSFWorkbook();
            switch (request.getReportType()) {
                case ReportType.ALL:
                    String filePath = "src/main/resources/excels/bao_cao_tong_hop.xlsx";
                    workbook = new XSSFWorkbook(filePath);
                    headerValue = "attachment; filename=bao_cao_tong_hop.xlsx";
                    writeSalesByDatesReport(workbook, request);
                    writeSalesByCustomersReport(workbook, request);
                    writeCancelBillReport(workbook, request);
                    writePromotionReport(workbook, request);
                    break;
                case ReportType.CANCEL_BILL_REPORT:
                    String filePath1 = "src/main/resources/excels/bang_ke_huy_hoa_don.xlsx";
                    workbook = new XSSFWorkbook(filePath1);
                    headerValue = "attachment; filename=bang_ke_huy_hoa_don.xlsx";
                    writeCancelBillReport(workbook, request);
                    break;
                case ReportType.SALES_BY_DATE_REPORT:
                    String filePath2 = "src/main/resources/excels/dsbh_theo_ngay.xlsx";
                    workbook = new XSSFWorkbook(filePath2);
                    headerValue = "attachment; filename=dsbh_theo_ngay.xlsx";
                    writeSalesByDatesReport(workbook, request);
                    break;
                case ReportType.SALES_BY_CUSTOMER_REPORT:
                    String filePath3 = "src/main/resources/excels/dsbh_theo_khach_hang.xlsx";
                    workbook = new XSSFWorkbook(filePath3);
                    headerValue = "attachment; filename=dsbh_theo_khach_hang.xlsx";
                    writeSalesByCustomersReport(workbook, request);
                    break;
                case ReportType.PROMOTION_REPORT:
                    String filePath4 = "src/main/resources/excels/tong_ket_khuyen_mai.xlsx";
                    workbook = new XSSFWorkbook(filePath4);
                    headerValue = "attachment; filename=tong_ket_khuyen_mai.xlsx";
                    writePromotionReport(workbook, request);
                    break;
                default:
                    break;
            }

            response.setHeader(headerKey, headerValue);
            ServletOutputStream outputStream = response.getOutputStream();
            workbook.write(outputStream);
            workbook.close();
            outputStream.close();
        } catch (IOException e) {
            e.printStackTrace();
            throw new ServiceException(ErrorCode.EXPORT_ERROR);
        }
    }

    private void writePromotionReport(XSSFWorkbook workbook, ReportRequest request) {
        XSSFSheet sheet = workbook.getSheet(ReportType.mapReportType.get(ReportType.PROMOTION_REPORT));
        logger.info("PhysicalNumberOfRows: " + Objects.requireNonNull(sheet).getPhysicalNumberOfRows());
        writeExportInfo(workbook, sheet, request);

        CellStyle style = workbook.createCellStyle();
        XSSFFont font = workbook.createFont();
        font.setFontHeight(9);
        font.setFontName("Times New Roman");
        style.setFont(font);
        style.setWrapText(true);
        style.setVerticalAlignment(VerticalAlignment.TOP);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        DataFormat format = workbook.createDataFormat();
        style.setDataFormat(format.getFormat("#,###"));

        int rowCount = 7;

        for (int i = rowCount + 1; i <= sheet.getLastRowNum(); i++) {
            Row row = sheet.getRow(i) == null ? sheet.createRow(i) : sheet.getRow(i);
            sheet.removeRow(row);
        }

//        List<PromotionLine> promotionLineList = queryPromotionLineInRange(request, request.getFromDate(), request.getToDate());
//        if (CollectionUtils.isEmpty(promotionLineList)) {
//            return;
//        }

        List<Bill> paidBillList = queryPaidBill(request, request.getFromDate(), request.getToDate());
        if (CollectionUtils.isEmpty(paidBillList)) {
            return;
        }
        Map<String, Double> promotionCountMap = new HashMap<>();
        for (Bill bill : paidBillList) {
            if (CollectionUtils.isEmpty(bill.getPromotionDetails())) {
                continue;
            }
            for (BillPromotionDetailModel promotionDetailModel : bill.getPromotionDetails()) {
                if (promotionCountMap.containsKey(promotionDetailModel.getId())) {
                    double value = promotionCountMap.get(promotionDetailModel.getId());
                    promotionCountMap.put(promotionDetailModel.getId(), value + promotionDetailModel.getPromotionUsedAmount());
                } else {
                    promotionCountMap.put(promotionDetailModel.getId(), promotionDetailModel.getPromotionUsedAmount());
                }
            }
        }
        for (String promotionId : promotionCountMap.keySet()) {
            PromotionDetail promotionDetail = finderUtils.findPromotionDetailById(promotionId);
            PromotionLine promotionLine = finderUtils.findPromotionLineById(promotionDetail.getPromotionLineId());
            if (StringUtils.isNotEmpty(request.getPromotionHeaderId())) {
                if (!request.getPromotionHeaderId().equals(promotionLine.getPromotionHeaderId())) {
                    continue;
                }
            }
            if (StringUtils.isNotEmpty(request.getPromotionType())) {
                if (!request.getPromotionType().equals(promotionDetail.getType())) {
                    continue;
                }
            }
            Row row = sheet.createRow(rowCount++);
            long promotionAmount = promotionDetail.getAmount().longValue();
            long promotionUsedAmount = promotionDetail.getPromotionUsedAmount().longValue();
            long limitPromotionAmount = promotionDetail.getLimitPromotionAmount().longValue();

            createCell(sheet, row, 0, promotionDetail.getPromotionDetailCode(), style); // promotionDetailCode
            createCell(sheet, row, 1, promotionDetail.getDescription(), style); // description
            createCell(sheet, row, 2, DateTimesUtils.convertDateToDDMMYYYY(promotionLine.getFromDate()), style); // fromDate
            createCell(sheet, row, 3, DateTimesUtils.convertDateToDDMMYYYY(promotionLine.getToDate()), style); // toDate
            createCell(sheet, row, 4, PromotionType.mapPromotionType.get(promotionDetail.getType()), style); // type
            if (PromotionType.SERVICE.equals(promotionDetail.getType())) {
                CarCareService service = finderUtils.findCarCareServiceById(promotionDetail.getServiceIds().get(0));
                createCell(sheet, row, 5, service.getServiceCode(), style); // serviceCode
                createCell(sheet, row, 6, service.getName(), style); // serviceName
            } else {
                createCell(sheet, row, 5, "", style); // serviceCode
                createCell(sheet, row, 6, "", style); // serviceName
            }
            createCell(sheet, row, 7, promotionAmount, style); // amount
            if (promotionDetail.getLimitUsedTime()) {
                createCell(sheet, row, 8, "Có", style); // limitUsedTime
                createCell(sheet, row, 9, limitPromotionAmount, style); // limitPromotionAmount
                createCell(sheet, row, 10, limitPromotionAmount - promotionUsedAmount, style); // ngân sách còn lại
            } else {
                createCell(sheet, row, 8, "Không", style); // limitUsedTime
                createCell(sheet, row, 9, "", style); // limitPromotionAmount
                createCell(sheet, row, 10, "", style); // ngân sách còn lại
            }
            long promotionUsedCount = promotionCountMap.get(promotionId).longValue();
            createCell(sheet, row, 11, promotionUsedCount, style); // promotionUsedAmount
        }

//        for (PromotionLine promotionLine : promotionLineList) {
//            PromotionDetail promotionDetail = finderUtils.findPromotionDetailByPromotionLineId(promotionLine.getId());
//            if (StringUtils.isNotEmpty(request.getPromotionType())) {
//                if (!request.getPromotionType().equals(promotionDetail.getType())) {
//                    continue;
//                }
//            }
//            Row row = sheet.createRow(rowCount++);
//            long promotionAmount = promotionDetail.getAmount().longValue();
//            long promotionUsedAmount = promotionDetail.getPromotionUsedAmount().longValue();
//            long limitPromotionAmount = promotionDetail.getLimitPromotionAmount().longValue();
//
//            createCell(sheet, row, 0, promotionDetail.getPromotionDetailCode(), style); // promotionDetailCode
//            createCell(sheet, row, 1, promotionDetail.getDescription(), style); // description
//            createCell(sheet, row, 2, DateTimesUtils.convertDateToDDMMYYYY(promotionLine.getFromDate()), style); // fromDate
//            createCell(sheet, row, 3, DateTimesUtils.convertDateToDDMMYYYY(promotionLine.getToDate()), style); // toDate
//            createCell(sheet, row, 4, PromotionType.mapPromotionType.get(promotionDetail.getType()), style); // type
//            if (PromotionType.SERVICE.equals(promotionDetail.getType())) {
//                CarCareService service = finderUtils.findCarCareServiceById(promotionDetail.getServiceIds().get(0));
//                createCell(sheet, row, 5, service.getServiceCode(), style); // serviceCode
//                createCell(sheet, row, 6, service.getName(), style); // serviceName
//            } else {
//                createCell(sheet, row, 5, "", style); // serviceCode
//                createCell(sheet, row, 6, "", style); // serviceName
//            }
//            createCell(sheet, row, 7, promotionAmount, style); // amount
//            if (promotionDetail.getLimitUsedTime()) {
//                createCell(sheet, row, 8, "Có", style); // limitUsedTime
//                createCell(sheet, row, 9, limitPromotionAmount, style); // limitPromotionAmount
//                createCell(sheet, row, 10, limitPromotionAmount - promotionUsedAmount, style); // ngân sách còn lại
//            } else {
//                createCell(sheet, row, 8, "Không", style); // limitUsedTime
//                createCell(sheet, row, 9, "", style); // limitPromotionAmount
//                createCell(sheet, row, 10, "", style); // ngân sách còn lại
//            }
//            createCell(sheet, row, 11, promotionUsedAmount, style); // promotionUsedAmount
//        }

        logger.info("row count: " + rowCount);
        Row row = sheet.createRow(rowCount);
        CellStyle style2 = workbook.createCellStyle();
        XSSFFont font2 = workbook.createFont();
        font2.setFontHeight(9);
        font2.setFontName("Times New Roman");
        font2.setBold(true);
        font2.setColor(HSSFColor.HSSFColorPredefined.RED.getIndex());
        style2.setFont(font2);
        style2.setWrapText(true);
        style2.setVerticalAlignment(VerticalAlignment.TOP);
        style2.setBorderBottom(BorderStyle.THIN);
        style2.setBorderRight(BorderStyle.THIN);
        style2.setDataFormat(format.getFormat("#,###"));
        XSSFFormulaEvaluator formulaEvaluator = workbook.getCreationHelper().createFormulaEvaluator();

        createCell(sheet, row, 0, "Tổng Kết CTKM", style2);
        createCell(sheet, row, 1, "", style2);
        createCell(sheet, row, 2, "", style2);
        createCell(sheet, row, 3, "", style2);
        createCell(sheet, row, 4, "", style2);
        createCell(sheet, row, 5, "", style2);
        createCell(sheet, row, 6, "", style2);
        createCell(sheet, row, 7, "", style2);
        createCell(sheet, row, 8, "", style2);
        createCell(sheet, row, 9, "", style2);
        createCell(sheet, row, 10, "", style2);

        // Tổng tiền đã KM
        Cell cell11 = row.getCell(11) == null ? row.createCell(11) : row.getCell(11);
        cell11.setCellFormula("SUM(L8:L" + rowCount + ")");
        cell11.setCellStyle(style2);
        formulaEvaluator.evaluateFormulaCell(cell11);
    }

    private void writeSalesByCustomersReport(XSSFWorkbook workbook, ReportRequest request) {
        XSSFSheet sheet = workbook.getSheet(ReportType.mapReportType.get(ReportType.SALES_BY_CUSTOMER_REPORT));
        logger.info("PhysicalNumberOfRows: " + Objects.requireNonNull(sheet).getPhysicalNumberOfRows());
        writeExportInfo(workbook, sheet, request);

        CellStyle style = workbook.createCellStyle();
        XSSFFont font = workbook.createFont();
        font.setFontHeight(9);
        font.setFontName("Times New Roman");
        style.setFont(font);
        style.setWrapText(true);
        style.setVerticalAlignment(VerticalAlignment.TOP);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        DataFormat format = workbook.createDataFormat();
        style.setDataFormat(format.getFormat("#,###"));

        int rowCount = 7;
        int stt = 1;

        for (int i = rowCount + 1; i <= sheet.getLastRowNum(); i++) {
            Row row = sheet.getRow(i) == null ? sheet.createRow(i) : sheet.getRow(i);
            sheet.removeRow(row);
        }

        List<Bill> paidBillList = queryPaidBill(request, request.getFromDate(), request.getToDate());
        Set<String> customerIds = new HashSet<>();
        for (Bill bill : paidBillList) {
            customerIds.add(bill.getCustomerId());
        }

        for (String customerId : customerIds) {
            Customer customer = finderUtils.findCustomerById(customerId);
            if (StringUtils.isNotEmpty(request.getCustomerProvince())) {
                if (!request.getCustomerProvince().equals(customer.getProvince())) {
                    continue;
                }
            }
            if (StringUtils.isNotEmpty(request.getCustomerDistrict())) {
                if (!request.getCustomerDistrict().equals(customer.getDistrict())) {
                    continue;
                }
            }
            if (StringUtils.isNotEmpty(request.getCustomerWard())) {
                if (!request.getCustomerWard().equals(customer.getWard())) {
                    continue;
                }
            }
            if (request.getCustomerStatus() != null) {
                if (customer.getStatus() != request.getCustomerStatus()) {
                    continue;
                }
            }

            Row row = sheet.createRow(rowCount++);

            createCell(sheet, row, 0, stt + "", style); // stt
            createCell(sheet, row, 1, customer.getCustomerCode(), style); // customerCode
            createCell(sheet, row, 2, customer.getName(), style); // customerName
            createCell(sheet, row, 3, customer.getAddress(), style); // address
            createCell(sheet, row, 4, customer.getWard(), style); // ward
            createCell(sheet, row, 5, customer.getDistrict(), style); // district
            createCell(sheet, row, 6, customer.getProvince(), style); // province
            createCell(sheet, row, 7, customer.getStatusName(), style); // statusName

            List<Car> customerCarList = finderUtils.findCarsByCustomerId(customerId);
            for (Car car : customerCarList) {
                List<Bill> customerCarBillList = queryPaidBillByCustomerIdAndCarId(request.getFromDate(), request.getToDate(), customerId, car.getId());
                if (CollectionUtils.isEmpty(customerCarBillList)) {
                    continue;
                }
                long totalPromotionValue = 0L;
                long totalServiceValue = 0L;
                long totalPaymentValue = 0L;
                for (Bill bill : customerCarBillList) {
                    totalPromotionValue += bill.getTotalPromotionAmount().longValue();
                    totalServiceValue += bill.getTotalServicePrice().longValue();
                    totalPaymentValue += bill.getPaymentAmount().longValue();
                }

                createCell(sheet, row, 8, car.getCarCode(), style); // carCode
                createCell(sheet, row, 9, car.getBrand(), style); // carBrand
                createCell(sheet, row, 10, car.getLicensePlate(), style); // carLicensePlate
                createCell(sheet, row, 11, totalServiceValue, style); // totalServiceValue
                createCell(sheet, row, 12, totalPromotionValue, style); // totalPromotionValue
                createCell(sheet, row, 13, totalPaymentValue, style); // totalPaymentValue

                row = sheet.createRow(rowCount++);
                createCell(sheet, row, 0, "", style); // stt
                createCell(sheet, row, 1, customer.getCustomerCode(), style); // customerCode
                createCell(sheet, row, 2, customer.getName(), style); // customerName
                createCell(sheet, row, 3, customer.getAddress(), style); // address
                createCell(sheet, row, 4, customer.getWard(), style); // ward
                createCell(sheet, row, 5, customer.getDistrict(), style); // district
                createCell(sheet, row, 6, customer.getProvince(), style); // province
                createCell(sheet, row, 7, customer.getStatusName(), style); // statusName
            }

            rowCount--;
            Row removeRow = sheet.getRow(rowCount);
            sheet.removeRow(removeRow);

            stt++;
        }
    }

    private void writeSalesByDatesReport(XSSFWorkbook workbook, ReportRequest request) {
        XSSFSheet sheet = workbook.getSheet(ReportType.mapReportType.get(ReportType.SALES_BY_DATE_REPORT));
        writeExportInfo(workbook, sheet, request);

        CellStyle style = workbook.createCellStyle();
        XSSFFont font = workbook.createFont();
        font.setFontHeight(9);
        font.setFontName("Times New Roman");
        font.setBold(false);
        style.setFont(font);
        style.setWrapText(true);
        style.setVerticalAlignment(VerticalAlignment.TOP);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        DataFormat format = workbook.createDataFormat();
        style.setDataFormat(format.getFormat("#,###"));
        logger.info("PhysicalNumberOfRows: " + sheet.getPhysicalNumberOfRows());

        CellStyle style2 = workbook.createCellStyle();
        XSSFFont font2 = workbook.createFont();
        font2.setFontHeight(9);
        font2.setFontName("Times New Roman");
        font2.setBold(true);
        style2.setFont(font2);
        style2.setWrapText(true);
        style2.setVerticalAlignment(VerticalAlignment.TOP);
        style2.setBorderBottom(BorderStyle.THIN);
        style2.setBorderRight(BorderStyle.THIN);
        style2.setDataFormat(format.getFormat("#,###"));

        int rowCount = 7;
        int stt = 1;
        int tempRowCount = 8;

        for (int i = rowCount + 1; i <= sheet.getLastRowNum(); i++) {
            Row row = sheet.getRow(i) == null ? sheet.createRow(i) : sheet.getRow(i);
            sheet.removeRow(row);
        }

        long totalPromotionValue = 0L;
        long totalServiceValue = 0L;
        long totalPaymentValue = 0L;

        List<Date> dates = DateTimesUtils.getDatesBetween2Dates(request.getFromDate(), request.getToDate());
        for (Date date : dates) {
            Date startDate = DateTimesUtils.getStartDateCalendarWithoutTime(date).getTime();
            Date endDate = DateTimesUtils.addDate(startDate, 1);
            List<Bill> paidBillList = queryPaidBill(request, startDate, endDate);
            if (CollectionUtils.isEmpty(paidBillList)) {
                continue;
            }

            Row row = sheet.createRow(rowCount++);
            createCell(sheet, row, 0, stt + "", style); // stt

            for (Bill bill : paidBillList) {
                int columnCount = 1;
                User user = finderUtils.findByPhone(bill.getCreateBy());
                long totalPromotionAmount = bill.getTotalPromotionAmount().longValue();
                long totalServicePrice = bill.getTotalServicePrice().longValue();
                long totalPaymentAmount = bill.getPaymentAmount().longValue();
                createCell(sheet, row, columnCount++, user.getUserCode(), style); // userCode
                createCell(sheet, row, columnCount++, user.getName(), style); // userName
                createCell(sheet, row, columnCount++, DateTimesUtils.convertDateToDDMMYYYY(date), style); // date
                createCell(sheet, row, columnCount++, totalPromotionAmount, style); // totalPromotionAmount
                createCell(sheet, row, columnCount++, totalServicePrice, style); // totalServicePrice
                createCell(sheet, row, columnCount++, totalPaymentAmount, style); // paymentAmount
                row = sheet.createRow(rowCount++);
                createCell(sheet, row, 0, "", style); // stt

                totalPromotionValue += bill.getTotalPromotionAmount().longValue();
                totalServiceValue += bill.getTotalServicePrice().longValue();
                totalPaymentValue += bill.getPaymentAmount().longValue();
            }

            rowCount--;

            XSSFFormulaEvaluator formulaEvaluator = workbook.getCreationHelper().createFormulaEvaluator();

            createCell(sheet, row, 1, "", style);
            createCell(sheet, row, 2, "", style);
            createCell(sheet, row, 3, "Tổng cộng", style2);

            // Tổng tiền khuyến mãi
            Cell cell8 = row.getCell(4) == null ? row.createCell(4) : row.getCell(4);
            cell8.setCellFormula("SUM(E" + tempRowCount + ":E" + rowCount + ")");
            cell8.setCellStyle(style2);
            formulaEvaluator.evaluateFormulaCell(cell8);

            // Tổng tiền dịch vụ
            Cell cell7 = row.getCell(5) == null ? row.createCell(5) : row.getCell(5);
            cell7.setCellFormula("SUM(F" + tempRowCount + ":F" + rowCount + ")");
            cell7.setCellStyle(style2);
            formulaEvaluator.evaluateFormulaCell(cell7);

            // Tổng tiền thanh toán
            Cell cell9 = row.getCell(6) == null ? row.createCell(6) : row.getCell(6);
            cell9.setCellFormula("SUM(G" + tempRowCount + ":G" + rowCount + ")");
            cell9.setCellStyle(style2);
            formulaEvaluator.evaluateFormulaCell(cell9);

            rowCount++;
            stt++;
            tempRowCount = rowCount + 1;
        }

        logger.info("row count: " + rowCount);
        Row row = sheet.createRow(rowCount);

        createCell(sheet, row, 0, "Tổng cộng", style2);
        createCell(sheet, row, 1, "", style2);
        createCell(sheet, row, 2, "", style2);
        createCell(sheet, row, 3, "", style2);
        createCell(sheet, row, 4, totalPromotionValue, style2);
        createCell(sheet, row, 5, totalServiceValue, style2);
        createCell(sheet, row, 6, totalPaymentValue, style2);
    }

    private void writeCancelBillReport(XSSFWorkbook workbook, ReportRequest request) {
        XSSFSheet sheet = workbook.getSheet(ReportType.mapReportType.get(ReportType.CANCEL_BILL_REPORT));
        writeExportInfo(workbook, sheet, request);

        CellStyle style = workbook.createCellStyle();
        XSSFFont font = workbook.createFont();
        font.setFontHeight(9);
        font.setFontName("Times New Roman");
        style.setFont(font);
        style.setWrapText(true);
        style.setVerticalAlignment(VerticalAlignment.TOP);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        DataFormat format = workbook.createDataFormat();
        style.setDataFormat(format.getFormat("#,###"));

        int rowCount = 7;
        int stt = 1;

        for (int i = rowCount + 1; i <= sheet.getLastRowNum(); i++) {
            Row row = sheet.getRow(i);
            sheet.removeRow(row);
        }

        List<Bill> canceledBillList = queryCancelBill(request, request.getFromDate(), request.getToDate());
        for (Bill bill : canceledBillList) {
            Row row = sheet.createRow(rowCount++);
            int columnCount = 0;
            String services = "";
            for (CarCareService service : bill.getServices()) {
                services = services + service.getName() + "\r\n";
            }

            createCell(sheet, row, columnCount++, stt + "", style); // stt
            createCell(sheet, row, columnCount++, bill.getBillCode(), style); // billCode
            createCell(sheet, row, columnCount++, DateTimesUtils.convertDateToDDMMYYYY(bill.getCreateDate()), style); // createdDate
            createCell(sheet, row, columnCount++, DateTimesUtils.convertDateToDDMMYYYY(bill.getCanceledDate()), style); // canceledDate
            createCell(sheet, row, columnCount++, bill.getCanceledByUserCode(), style); // canceledByUserCode
            createCell(sheet, row, columnCount++, bill.getCanceledByUserName(), style); // canceledByUserName
            createCell(sheet, row, columnCount++, services, style); // services
            createCell(sheet, row, columnCount++, bill.getTotalServicePrice().longValue(), style); // totalServicePrice
            createCell(sheet, row, columnCount++, bill.getTotalPromotionAmount().longValue(), style); // totalPromotionAmount
            createCell(sheet, row, columnCount++, bill.getPaymentAmount().longValue(), style); // paymentAmount

            stt++;
        }
        logger.info("row count: " + rowCount);
        Row row = sheet.createRow(rowCount);
        CellStyle style2 = workbook.createCellStyle();
        XSSFFont font2 = workbook.createFont();
        font2.setFontHeight(9);
        font2.setFontName("Times New Roman");
        font2.setBold(true);
        style2.setFont(font2);
        style2.setWrapText(true);
        style2.setVerticalAlignment(VerticalAlignment.TOP);
        style2.setBorderBottom(BorderStyle.THIN);
        style2.setBorderRight(BorderStyle.THIN);
        style2.setDataFormat(format.getFormat("#,###"));

        XSSFFormulaEvaluator formulaEvaluator = workbook.getCreationHelper().createFormulaEvaluator();

        createCell(sheet, row, 0, "", style2);
        createCell(sheet, row, 1, "", style2);
        createCell(sheet, row, 2, "", style2);
        createCell(sheet, row, 3, "", style2);
        createCell(sheet, row, 4, "", style2);
        createCell(sheet, row, 5, "", style2);
        createCell(sheet, row, 6, "Tổng giá trị", style2);


        // Tổng tiền dịch vụ
        Cell cell7 = row.getCell(7) == null ? row.createCell(7) : row.getCell(7);
        cell7.setCellFormula("SUM(H8:H" + rowCount + ")");
        cell7.setCellStyle(style2);
        formulaEvaluator.evaluateFormulaCell(cell7);

        // Tổng tiền khuyến mãi
        Cell cell8 = row.getCell(8) == null ? row.createCell(8) : row.getCell(8);
        cell8.setCellFormula("SUM(I8:I" + rowCount + ")");
        cell8.setCellStyle(style2);
        formulaEvaluator.evaluateFormulaCell(cell8);

        // Tổng tiền thanh toán
        Cell cell9 = row.getCell(9) == null ? row.createCell(9) : row.getCell(9);
        cell9.setCellFormula("SUM(J8:J" + rowCount + ")");
        cell9.setCellStyle(style2);
        formulaEvaluator.evaluateFormulaCell(cell9);
    }

    private void writeExportInfo(XSSFWorkbook workbook, XSSFSheet sheet, ReportRequest request) {
        CellStyle style = getStyle(workbook, 9);

        // ngày in
        Date now = new Date();
        String printDate = DateTimesUtils.convertDateToDDMMYYYY(now);
        Row row = sheet.getRow(2) == null ? sheet.createRow(2) : sheet.getRow(2);
        Cell cell = row.getCell(0) == null ? row.createCell(0) : row.getCell(0);
        cell.setCellValue("Ngày in: " + printDate);
        cell.setCellStyle(style);

        style.setVerticalAlignment(VerticalAlignment.CENTER);

        // Từ ngày
        String fromDate = DateTimesUtils.convertDateToDDMMYYYY(request.getFromDate());
        Row row6 = sheet.getRow(5) == null ? sheet.createRow(5) : sheet.getRow(5);
        Cell cell6 = row6.getCell(3) == null ? row6.createCell(3) : row6.getCell(3);
        logger.info("fromDate: " + fromDate);
        cell6.setCellValue("Từ ngày: " + fromDate);
        cell6.setCellStyle(getStyle(workbook, 11));

        // Đến ngày
        String toDate = DateTimesUtils.convertDateToDDMMYYYY(request.getToDate());
        Cell cell7 = row6.getCell(5) == null ? row6.createCell(5) : row6.getCell(5);
        logger.info("toDate: " + toDate);
        cell7.setCellValue("Đến ngày: " + toDate);
        cell7.setCellStyle(getStyle(workbook, 11));
    }

    private void createCell(XSSFSheet sheet, Row row, int columnCount, Object value, CellStyle style) {
//        sheet.autoSizeColumn(columnCount);
        Cell cell = row.createCell(columnCount);
        if (value instanceof Long) {
            cell.setCellValue((Long) value);
        } else if (value instanceof Boolean) {
            cell.setCellValue((Boolean) value);
        } else {
            cell.setCellValue((String) value);
        }
        cell.setCellStyle(style);
    }

    private CellStyle getStyle(XSSFWorkbook workbook, int fontHeight) {
        CellStyle style = workbook.createCellStyle();
        XSSFFont font = workbook.createFont();
        font.setFontHeight(fontHeight);
        font.setFontName("Times New Roman");
        style.setFont(font);
        return style;
    }

    private List<Bill> queryCancelBill(ReportRequest request, Date fromDate, Date toDate) {
        Criteria criteria = new Criteria();
        List<Criteria> filterList = new ArrayList<>();
        QueryBuilderUtils.addSingleValueFilter(filterList, "status", BillStatus.CANCELED);
        QueryBuilderUtils.addDateFilter(filterList, "createDate", fromDate, toDate);
        if (StringUtils.isNotEmpty(request.getUserId())) {
            QueryBuilderUtils.addSingleValueFilter(filterList, "canceledByUserId", request.getUserId());
        }
        if (StringUtils.isNotEmpty(request.getServiceId())) {
            QueryBuilderUtils.addSingleValueFilter(filterList, "services.id", request.getServiceId());
        }
        criteria.andOperator(filterList);

        Query query = new Query();
        query.addCriteria(criteria);
        logger.info("=======> query: " + query);
        return mongoTemplate.find(query, Bill.class);
    }

    private List<Bill> queryPaidBill(ReportRequest request, Date fromDate, Date toDate) {
        Criteria criteria = new Criteria();
        List<Criteria> filterList = new ArrayList<>();
        QueryBuilderUtils.addSingleValueFilter(filterList, "status", BillStatus.PAID);
        QueryBuilderUtils.addDateFilter(filterList, "createDate", fromDate, toDate);
        if (StringUtils.isNotEmpty(request.getUsername())) {
            QueryBuilderUtils.addSingleValueFilter(filterList, "createBy", request.getUsername());
        }
        if (StringUtils.isNotEmpty(request.getCustomerId())) {
            QueryBuilderUtils.addSingleValueFilter(filterList, "customerId", request.getCustomerId());
        }
        criteria.andOperator(filterList);

        Query query = new Query();
        query.addCriteria(criteria);
        logger.info("=======> query: " + query);
        return mongoTemplate.find(query, Bill.class);
    }

    private List<Bill> queryPaidBillByCustomerIdAndCarId(Date fromDate, Date toDate, String customerId, String carId) {
        Criteria criteria = new Criteria();
        List<Criteria> filterList = new ArrayList<>();
        QueryBuilderUtils.addSingleValueFilter(filterList, "status", BillStatus.PAID);
        QueryBuilderUtils.addDateFilter(filterList, "createDate", fromDate, toDate);
        QueryBuilderUtils.addSingleValueFilter(filterList, "customerId", customerId);
        QueryBuilderUtils.addSingleValueFilter(filterList, "carId", carId);
        criteria.andOperator(filterList);

        Query query = new Query();
        query.addCriteria(criteria);
        logger.info("=======> query: " + query);
        return mongoTemplate.find(query, Bill.class);
    }

    private List<PromotionLine> queryPromotionLineInRange(ReportRequest request, Date fromDate, Date toDate) {
        Criteria criteria = new Criteria();
        List<Criteria> filterList = new ArrayList<>();
        QueryBuilderUtils.addDateFilter(filterList, "fromDate", fromDate, toDate);
        QueryBuilderUtils.addDateFilter(filterList, "toDate", fromDate, toDate);
        Criteria effectiveDateCriteria = new Criteria();
        Criteria fromDateCriteria = Criteria.where("fromDate").lte(fromDate);
        Criteria toDateCriteria = Criteria.where("toDate").gte(toDate);
        effectiveDateCriteria.andOperator(fromDateCriteria, toDateCriteria);
        filterList.add(effectiveDateCriteria);

        QueryBuilderUtils.addSingleValueFilter(filterList, "promotionHeaderId", request.getPromotionHeaderId());
        criteria.orOperator(filterList);

        Query query = new Query();
        query.addCriteria(criteria);
        logger.info("=======> query: " + query);
        return mongoTemplate.find(query, PromotionLine.class);
    }

}
