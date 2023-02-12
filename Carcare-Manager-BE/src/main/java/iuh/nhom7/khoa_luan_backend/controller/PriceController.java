package iuh.nhom7.khoa_luan_backend.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import iuh.nhom7.khoa_luan_backend.entity.wrapper.WrapResponse;
import iuh.nhom7.khoa_luan_backend.model.dto.PriceCreateDTO;
import iuh.nhom7.khoa_luan_backend.repository.PriceRepository;
import iuh.nhom7.khoa_luan_backend.request.price.UpdatePriceRequest;
import iuh.nhom7.khoa_luan_backend.service.PriceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;

/**
 * 9:15 PM 16-Sep-22
 * Long Tran
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/prices")
@Tag(name = "Price", description = "Price API")
public class PriceController {

    private final PriceRepository priceRepository;

    private final PriceService priceService;

    private final ExecutorService executorService;

    public PriceController(PriceRepository priceRepository, PriceService priceService, ExecutorService executorService) {
        this.priceRepository = priceRepository;
        this.priceService = priceService;
        this.executorService = executorService;
    }

    @GetMapping
    public CompletableFuture<WrapResponse<Object>> findAll() {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(priceRepository.findAll()), executorService);
    }

    @GetMapping("/{id}")
    public CompletableFuture<WrapResponse<Object>> getPrice(@PathVariable String id) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(priceService.findPriceById(id)), executorService);
    }

    @GetMapping("/find-price-by-code/{code}")
    public CompletableFuture<WrapResponse<Object>> getPriceByCode(@PathVariable String code) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(priceService.findPriceByCode(code)), executorService);
    }

    @GetMapping("/parent={parent_id}")
    public CompletableFuture<WrapResponse<Object>> getPriceByServiceId(@PathVariable(value = "parent_id") String parentId) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(priceRepository.findAllByServiceId(parentId)), executorService);
    }

    @GetMapping("/header={header_id}")
    public CompletableFuture<WrapResponse<Object>> getPriceByHeader(@PathVariable(value = "header_id") String headerId) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(priceRepository.findAllByPriceHeaderId(headerId)), executorService);
    }

    @PostMapping("/create")
    public CompletableFuture<WrapResponse<Object>> createPrice(@RequestBody PriceCreateDTO priceCreateDTO) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(priceService.create(priceCreateDTO)), executorService);
    }

    @PostMapping("/update/{id}")
    public CompletableFuture<WrapResponse<Object>> updatePriceById(@PathVariable String id, @Valid @RequestBody UpdatePriceRequest request) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(priceService.updatePriceById(id, request)), executorService);
    }

    @PostMapping("/delete/{id}")
    public CompletableFuture<Void> deleteById(@PathVariable String id) {
        return CompletableFuture.supplyAsync(() ->{
            priceRepository.deleteById(id);
            return null;
        }, executorService);
    }
}
