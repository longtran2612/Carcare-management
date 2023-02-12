package iuh.nhom7.khoa_luan_backend.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import iuh.nhom7.khoa_luan_backend.common.Extensions;
import iuh.nhom7.khoa_luan_backend.entity.PriceHeader;
import iuh.nhom7.khoa_luan_backend.entity.wrapper.WrapResponse;
import iuh.nhom7.khoa_luan_backend.model.dto.PriceHeaderCreateDTO;
import iuh.nhom7.khoa_luan_backend.repository.PriceHeaderRepository;
import iuh.nhom7.khoa_luan_backend.request.CreatePriceHeaderRequest;
import iuh.nhom7.khoa_luan_backend.request.UpdatePriceHeaderRequest;
import iuh.nhom7.khoa_luan_backend.service.PriceHeaderService;
import lombok.experimental.ExtensionMethod;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;

/**
 * 7:54 PM 20-Sep-22
 * Long Tran
 */

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@ExtensionMethod(Extensions.class)
@RequestMapping("/price-headers")
@Tag(name = "Price Header", description = "Price Header API")
public class PriceHeaderController {

    private final PriceHeaderService priceHeaderService;

    private final PriceHeaderRepository priceHeaderRepository;

    private final ExecutorService executorService;

    public PriceHeaderController(PriceHeaderService priceHeaderService,
                                 PriceHeaderRepository priceHeaderRepository,
                                 ExecutorService executorService) {
        this.priceHeaderService = priceHeaderService;
        this.priceHeaderRepository = priceHeaderRepository;
        this.executorService = executorService;
    }

    @GetMapping
    public CompletableFuture<WrapResponse<Object>> getPriceHeaders() {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(priceHeaderRepository.findAll()), executorService);
    }

    @GetMapping("/{id}")
    public CompletableFuture<WrapResponse<Object>> getPriceHeaderById(@PathVariable String id) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(priceHeaderService.findById(id)), executorService);
    }

    @GetMapping("/find-price-header-by-code/{code}")
    public CompletableFuture<WrapResponse<Object>> getPriceHeaderByCode(@PathVariable String code) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(priceHeaderService.findByCode(code)), executorService);
    }

    @PostMapping("/create")
    public CompletableFuture<WrapResponse<Object>> createPriceHeader(@RequestBody CreatePriceHeaderRequest request) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(priceHeaderService.create(request)), executorService);
    }

    @PostMapping("/update/{id}")
    public CompletableFuture<WrapResponse<Object>> updatePriceHeader(@PathVariable String id, @RequestBody UpdatePriceHeaderRequest priceHeader) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(priceHeaderService.update(id, priceHeader)), executorService);
    }

    @PostMapping("/active/{id}")
    public CompletableFuture<WrapResponse<Object>> activePriceHeader(@PathVariable String id) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(priceHeaderService.activePriceHeader(id)), executorService);
    }

    @PostMapping("/inactive/{id}")
    public CompletableFuture<WrapResponse<Object>> inactivePriceHeader(@PathVariable String id) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(priceHeaderService.inactivePriceHeader(id)), executorService);
    }

    @GetMapping("/get-active-price-header")
    public CompletableFuture<WrapResponse<Object>> getActivePriceHeader() {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(priceHeaderService.getActivePriceHeader()), executorService);
    }
    @PostMapping("/delete/{id}")
    public CompletableFuture<Void> deleteById(@PathVariable String id) {
        return CompletableFuture.supplyAsync(() ->{
            priceHeaderRepository.deleteById(id);
            return null;
        }, executorService);
    }
}
