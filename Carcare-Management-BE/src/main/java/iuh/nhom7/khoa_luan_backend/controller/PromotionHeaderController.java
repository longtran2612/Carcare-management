package iuh.nhom7.khoa_luan_backend.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import iuh.nhom7.khoa_luan_backend.common.Extensions;
import iuh.nhom7.khoa_luan_backend.entity.wrapper.WrapResponse;
import iuh.nhom7.khoa_luan_backend.repository.PromotionHeaderRepository;
import iuh.nhom7.khoa_luan_backend.request.promotion.header.CreatePromotionHeaderRequest;
import iuh.nhom7.khoa_luan_backend.request.promotion.header.UpdatePromotionHeaderRequest;
import iuh.nhom7.khoa_luan_backend.service.PromotionHeaderService;
import lombok.experimental.ExtensionMethod;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@ExtensionMethod(Extensions.class)
@RequestMapping("/promotion-headers")
@Tag(name = "Promotion Header", description = "Promotion Header API")
public class PromotionHeaderController {
    private final ExecutorService executorService;
    private final PromotionHeaderService promotionHeaderService;
    private final PromotionHeaderRepository promotionHeaderRepository;

    public PromotionHeaderController(ExecutorService executorService,
                                     PromotionHeaderService promotionHeaderService,
                                     PromotionHeaderRepository promotionHeaderRepository) {
        this.executorService = executorService;
        this.promotionHeaderService = promotionHeaderService;
        this.promotionHeaderRepository = promotionHeaderRepository;
    }

    @GetMapping
    public CompletableFuture<WrapResponse<Object>> getPromotionHeaders() {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(promotionHeaderRepository.findAll()), executorService);
    }

    @GetMapping("/find-promotion-header-by-id/{id}")
    public CompletableFuture<WrapResponse<Object>> findPromotionHeaderById(@PathVariable String id) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(promotionHeaderService.findPromotionHeaderById(id)), executorService);
    }

    @GetMapping("/find-promotion-header-by-code/{code}")
    public CompletableFuture<WrapResponse<Object>> findPromotionHeaderByCode(@PathVariable String code) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(promotionHeaderService.findPromotionHeaderByCode(code)), executorService);
    }

    @PostMapping("/create")
    public CompletableFuture<WrapResponse<Object>> createPromotionHeader(@RequestBody CreatePromotionHeaderRequest request) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(promotionHeaderService.create(request)), executorService);
    }

    @PostMapping("/update/{id}")
    public CompletableFuture<WrapResponse<Object>> updatePromotionHeader(@PathVariable String id, @RequestBody UpdatePromotionHeaderRequest request) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(promotionHeaderService.update(id, request)), executorService);
    }

    @PostMapping("/active/{id}")
    public CompletableFuture<WrapResponse<Object>> activePromotionHeader(@PathVariable String id) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(promotionHeaderService.activePromotionHeader(id)), executorService);
    }

    @PostMapping("/inactive/{id}")
    public CompletableFuture<WrapResponse<Object>> inActivePromotionHeader(@PathVariable String id) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(promotionHeaderService.inActivePromotionHeader(id)), executorService);
    }

    @PostMapping("/delete/{id}")
    public CompletableFuture<Void> deleteById(@PathVariable String id) {
        return CompletableFuture.supplyAsync(() ->{
            promotionHeaderService.delete(id);
            return null;
        }, executorService);
    }

}
