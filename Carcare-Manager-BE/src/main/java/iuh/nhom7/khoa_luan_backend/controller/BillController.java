package iuh.nhom7.khoa_luan_backend.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import iuh.nhom7.khoa_luan_backend.entity.Account;
import iuh.nhom7.khoa_luan_backend.entity.wrapper.WrapResponse;
import iuh.nhom7.khoa_luan_backend.repository.BillRepository;
import iuh.nhom7.khoa_luan_backend.request.bill.CreateBillRequest;
import iuh.nhom7.khoa_luan_backend.request.bill.SearchBillRequest;
import iuh.nhom7.khoa_luan_backend.service.BillService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/bills")
@Tag(name = "Bill", description = "Bill API")
public class BillController {
    private final ExecutorService executorService;
    private final BillRepository billRepository;
    private final BillService billService;

    public BillController(ExecutorService executorService,
                          BillRepository billRepository,
                          BillService billService) {
        this.executorService = executorService;
        this.billRepository = billRepository;
        this.billService = billService;
    }

    @GetMapping
    public CompletableFuture<WrapResponse<Object>> getBills() {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(billRepository.findAll()), executorService);
    }

    @GetMapping("/find-bill-by-id/{id}")
    public CompletableFuture<WrapResponse<Object>> findBillById(@PathVariable String id) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(billService.findBillById(id)), executorService);
    }

    @GetMapping("/find-bill-by-code/{code}")
    public CompletableFuture<WrapResponse<Object>> findBillByCode(@PathVariable String code) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(billService.findBillByCode(code)), executorService);
    }

    @GetMapping("/find-all-bill-by-customer-id/{id}")
    public CompletableFuture<WrapResponse<Object>> findAllBillByCustomerId(@PathVariable String id) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(billService.findAllBillByCustomerId(id)), executorService);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
    @PostMapping("/create")
    public CompletableFuture<WrapResponse<Object>> createBill(@RequestBody CreateBillRequest request, @AuthenticationPrincipal Account account) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(billService.create(request, account)), executorService);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
    @PostMapping("/cancel/{id}")
    public CompletableFuture<WrapResponse<Object>> cancelBill(@PathVariable String id, @AuthenticationPrincipal Account account) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(billService.cancelBill(id, account)), executorService);
    }
    @PostMapping("/search-bill")
    public CompletableFuture<WrapResponse<Object>> searchBill(@RequestBody SearchBillRequest request) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(billService.search(request)), executorService);
    }

}
