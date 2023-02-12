package iuh.nhom7.khoa_luan_backend.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import iuh.nhom7.khoa_luan_backend.entity.wrapper.WrapResponse;
import iuh.nhom7.khoa_luan_backend.request.StatisticRequest;
import iuh.nhom7.khoa_luan_backend.service.StatisticService;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;

/**
 * 4:15 PM 20-Nov-22
 * Long Tran
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/statistic")
@Tag(name = "Statistic", description = "Statistic API")
public class StatisticController {
    private final ExecutorService executorService;
    private final StatisticService statisticService;

    public StatisticController(ExecutorService executorService, StatisticService statisticService) {
        this.executorService = executorService;
        this.statisticService = statisticService;
    }
    @GetMapping("/get-customer-statistic/{id}")
    public CompletableFuture<WrapResponse<Object>> getCustomerStatistic(@PathVariable String id) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(statisticService.getCustomerStatistic(id)), executorService);
    }
    @PostMapping
    public CompletableFuture<WrapResponse<Object>> getStatistic(@RequestBody StatisticRequest statisticRequest) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(statisticService.getMapStatistic(statisticRequest)), executorService);
    }

    @PostMapping("/get-admin-statistic")
    public CompletableFuture<WrapResponse<Object>> getAdminStatistic(@RequestBody StatisticRequest statisticRequest) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(statisticService.getAdminStatistic(statisticRequest)), executorService);
    }
}
