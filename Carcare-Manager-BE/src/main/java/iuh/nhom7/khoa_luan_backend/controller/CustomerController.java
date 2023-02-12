package iuh.nhom7.khoa_luan_backend.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import iuh.nhom7.khoa_luan_backend.entity.Account;
import iuh.nhom7.khoa_luan_backend.entity.Customer;
import iuh.nhom7.khoa_luan_backend.entity.wrapper.WrapResponse;
import iuh.nhom7.khoa_luan_backend.repository.CustomerRepository;
import iuh.nhom7.khoa_luan_backend.request.CreateCustomerRequest;
import iuh.nhom7.khoa_luan_backend.service.CustomerService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/customer")
@Tag(name = "Customer", description = "Customer API")
public class CustomerController {
    private final ExecutorService executorService;
    private final CustomerService customerService;

    private final CustomerRepository customerRepository;

    public CustomerController(ExecutorService executorService,
                              CustomerService customerService,
                              CustomerRepository customerRepository) {
        this.executorService = executorService;
        this.customerService = customerService;
        this.customerRepository = customerRepository;

    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public CompletableFuture<WrapResponse<Object>> findCustomerById(@PathVariable("id") String id) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(customerService.findCustomerById(id)), executorService);
    }

    @RequestMapping(value = "/find-customer-by-code/{code}", method = RequestMethod.GET)
    public CompletableFuture<WrapResponse<Object>> findCustomerByCode(@PathVariable("code") String code) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(customerService.findCustomerByCode(code)), executorService);
    }
    @RequestMapping(value = "/find-customer-by-phone/{phone}", method = RequestMethod.GET)
    public CompletableFuture<WrapResponse<Object>> findCustomerByPhone(@PathVariable("phone") String phone) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(customerService.findCustomerByPhone(phone)), executorService);
    }
    @GetMapping
    public CompletableFuture<WrapResponse<Object>> findAll() {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(customerRepository.findAll()), executorService);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public CompletableFuture<WrapResponse<Object>> createCustomer(@Valid @RequestBody CreateCustomerRequest request, @AuthenticationPrincipal Account account) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(customerService.create(request, account)), executorService);
    }

    @RequestMapping(value = "/update/{id}", method = RequestMethod.POST)
    public CompletableFuture<WrapResponse<Object>> updateCustomer(@PathVariable String id, @Valid @RequestBody CreateCustomerRequest request) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(customerService.update(id, request)), executorService);
    }

}
