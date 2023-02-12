package iuh.nhom7.khoa_luan_backend.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import iuh.nhom7.khoa_luan_backend.common.Extensions;
import iuh.nhom7.khoa_luan_backend.entity.wrapper.WrapResponse;
import iuh.nhom7.khoa_luan_backend.repository.PromotionDetailRepository;
import iuh.nhom7.khoa_luan_backend.request.SearchServiceRequest;
import iuh.nhom7.khoa_luan_backend.request.promotion.detail.CreatePromotionDetailRequest;
import iuh.nhom7.khoa_luan_backend.request.promotion.detail.SearchPromotionRequest;
import iuh.nhom7.khoa_luan_backend.request.promotion.detail.UpdatePromotionDetailRequest;
import iuh.nhom7.khoa_luan_backend.service.PromotionDetailService;
import lombok.experimental.ExtensionMethod;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@ExtensionMethod(Extensions.class)
@RequestMapping("/promotion-details")
@Tag(name = "Promotion Detail", description = "Promotion Detail API")
public class PromotionDetailController {
    private final ExecutorService executorService;
    private final PromotionDetailRepository promotionDetailRepository;
    private final PromotionDetailService promotionDetailService;

    public PromotionDetailController(ExecutorService executorService,
                                     PromotionDetailRepository promotionDetailRepository,
                                     PromotionDetailService promotionDetailService) {
        this.executorService = executorService;
        this.promotionDetailRepository = promotionDetailRepository;
        this.promotionDetailService = promotionDetailService;
    }

    @GetMapping
    public CompletableFuture<WrapResponse<Object>> getPromotionDetails() {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(promotionDetailRepository.findAll()), executorService);
    }

    @GetMapping("/find-promotion-detail-by-id/{id}")
    public CompletableFuture<WrapResponse<Object>> findPromotionDetailById(@PathVariable String id) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(promotionDetailService.findPromotionDetailById(id)), executorService);
    }

    @GetMapping("/find-promotion-detail-by-code/{code}")
    public CompletableFuture<WrapResponse<Object>> findPromotionDetailByCode(@PathVariable String code) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(promotionDetailService.findPromotionDetailByCode(code)), executorService);
    }

    @GetMapping("/find-all-promotion-detail-by-promotion-line-id/{id}")
    public CompletableFuture<WrapResponse<Object>> findAllByPromotionLineId(@PathVariable String id) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(promotionDetailService.findAllByPromotionLineId(id)), executorService);
    }

    @GetMapping("/find-promotion-detail-by-promotion-line-id/{id}")
    public CompletableFuture<WrapResponse<Object>> findPromotionDetailByPromotionLineId(@PathVariable String id) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(promotionDetailService.findPromotionDetailByPromotionLineId(id)), executorService);
    }

    @PostMapping("/create")
    public CompletableFuture<WrapResponse<Object>> createPromotionDetail(@RequestBody CreatePromotionDetailRequest request) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(promotionDetailService.create(request)), executorService);
    }

    @PostMapping("/update/{id}")
    public CompletableFuture<WrapResponse<Object>> updatePromotionDetail(@PathVariable String id, @RequestBody UpdatePromotionDetailRequest request) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(promotionDetailService.update(id, request)), executorService);
    }

    @GetMapping("/get-all-usable-promotion-by-order-id/{orderId}")
    public CompletableFuture<WrapResponse<Object>> getAllUsablePromotionDetailByOrderId(@PathVariable String orderId) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(promotionDetailService.getAllUsablePromotionDetailByOrderId(orderId)), executorService);
    }

    @PostMapping("/get-all-usable-promotion-by-service-ids")
    public CompletableFuture<WrapResponse<Object>> getAllUsablePromotionDetailByServiceIds(@RequestBody List<String> serviceIds) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(promotionDetailService.getAllUsablePromotionDetailByServiceIds(serviceIds)), executorService);
    }

    @PostMapping("/search")
    public CompletableFuture<WrapResponse<Object>> search(@RequestBody SearchPromotionRequest searchPromotionRequest) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(promotionDetailService.search(searchPromotionRequest)), executorService);
    }

}
