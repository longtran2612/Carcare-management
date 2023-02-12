package iuh.nhom7.khoa_luan_backend.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import iuh.nhom7.khoa_luan_backend.common.Extensions;
import iuh.nhom7.khoa_luan_backend.entity.wrapper.WrapResponse;
import iuh.nhom7.khoa_luan_backend.repository.PromotionLineRepository;
import iuh.nhom7.khoa_luan_backend.request.promotion.line.CreatePromotionLineRequest;
import iuh.nhom7.khoa_luan_backend.request.promotion.line.UpdatePromotionLineRequest;
import iuh.nhom7.khoa_luan_backend.service.PromotionLineService;
import lombok.experimental.ExtensionMethod;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@ExtensionMethod(Extensions.class)
@RequestMapping("/promotion-lines")
@Tag(name = "Promotion Line", description = "Promotion Line API")
public class PromotionLineController {
    private final ExecutorService executorService;
    private final PromotionLineRepository promotionLineRepository;
    private final PromotionLineService promotionLineService;

    public PromotionLineController(ExecutorService executorService,
                                   PromotionLineRepository promotionLineRepository,
                                   PromotionLineService promotionLineService) {
        this.executorService = executorService;
        this.promotionLineRepository = promotionLineRepository;
        this.promotionLineService = promotionLineService;
    }

    @GetMapping
    public CompletableFuture<WrapResponse<Object>> getPromotionLines() {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(promotionLineRepository.findAll()), executorService);
    }

    @GetMapping("/find-promotion-line-by-id/{id}")
    public CompletableFuture<WrapResponse<Object>> findPromotionLineById(@PathVariable String id) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(promotionLineService.findPromotionLineById(id)), executorService);
    }

    @GetMapping("/find-promotion-line-by-code/{code}")
    public CompletableFuture<WrapResponse<Object>> findPromotionLineByCode(@PathVariable String code) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(promotionLineService.findPromotionLineByCode(code)), executorService);
    }

    @GetMapping("/find-all-promotion-line-by-header-id/{id}")
    public CompletableFuture<WrapResponse<Object>> findPromotionLineByHeaderId(@PathVariable String id) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(promotionLineService.findPromotionLineByHeaderId(id)), executorService);
    }

    @PostMapping("/create")
    public CompletableFuture<WrapResponse<Object>> createPromotionLine(@RequestBody CreatePromotionLineRequest request) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(promotionLineService.create(request)), executorService);
    }

    @PostMapping("/update/{id}")
    public CompletableFuture<WrapResponse<Object>> updatePromotionLine(@PathVariable String id, @RequestBody UpdatePromotionLineRequest request) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(promotionLineService.update(id, request)), executorService);
    }

    @PostMapping("/active/{id}")
    public CompletableFuture<WrapResponse<Object>> activePromotionLine(@PathVariable String id) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(promotionLineService.activePromotionLine(id)), executorService);
    }

    @PostMapping("/inactive/{id}")
    public CompletableFuture<WrapResponse<Object>> inActivePromotionLine(@PathVariable String id) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(promotionLineService.inActivePromotionLine(id)), executorService);
    }

    @PostMapping("/delete/{id}")
    public CompletableFuture<Void> deleteById(@PathVariable String id) {
        return CompletableFuture.supplyAsync(() ->{
            promotionLineService.delete(id);
            return null;
        }, executorService);
    }

}
