package iuh.nhom7.khoa_luan_backend.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import iuh.nhom7.khoa_luan_backend.entity.wrapper.WrapResponse;
import iuh.nhom7.khoa_luan_backend.request.ReportRequest;
import iuh.nhom7.khoa_luan_backend.service.ReportService;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/report")
@Tag(name = "Report", description = "Report API")
public class ReportController {
    private final ExecutorService executorService;
    private final ReportService reportService;

    public ReportController(ExecutorService executorService, ReportService reportService) {
        this.executorService = executorService;
        this.reportService = reportService;
    }

    @PostMapping("/get-sales-by-date-report")
    public CompletableFuture<WrapResponse<Object>> getSalesByDateReport(@RequestBody ReportRequest request) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(reportService.getSalesByDateReport(request)), executorService);
    }

    @PostMapping("/get-sales-by-customer-report")
    public CompletableFuture<WrapResponse<Object>> getSalesByCustomerReport(@RequestBody ReportRequest request) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(reportService.getSalesByCustomerReport(request)), executorService);
    }

    @PostMapping("/get-canceled-bill-report")
    public CompletableFuture<WrapResponse<Object>> getCancelBillReport(@RequestBody ReportRequest request) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(reportService.getCancelBillReport(request)), executorService);
    }

    @PostMapping("/get-promotion-report")
    public CompletableFuture<WrapResponse<Object>> getPromotionReport(@RequestBody ReportRequest request) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(reportService.getPromotionReport(request)), executorService);
    }

    @PostMapping("/get-report-in-range-date")
    public CompletableFuture<Void> exportReport(@RequestBody ReportRequest request, HttpServletResponse response) {
        return new CompletableFuture<Void>().supplyAsync(() -> {
            reportService.exportReport(request, response);
            return null;
        }, executorService);
    }
}
