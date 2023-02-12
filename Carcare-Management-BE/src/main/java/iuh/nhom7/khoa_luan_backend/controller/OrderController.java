package iuh.nhom7.khoa_luan_backend.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import iuh.nhom7.khoa_luan_backend.entity.Account;
import iuh.nhom7.khoa_luan_backend.entity.wrapper.WrapResponse;
import iuh.nhom7.khoa_luan_backend.repository.OrderRepository;
import iuh.nhom7.khoa_luan_backend.request.order.CreateOrderRequest;
import iuh.nhom7.khoa_luan_backend.request.order.SearchOrderRequest;
import iuh.nhom7.khoa_luan_backend.request.order.UpdateOrderRequest;
import iuh.nhom7.khoa_luan_backend.service.OrderService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/order")
@Tag(name = "Order", description = "Order API")
public class OrderController {
    private final ExecutorService executorService;
    private final OrderService orderService;
    private final OrderRepository orderRepository;

    public OrderController(ExecutorService executorService,
                           OrderService orderService,
                           OrderRepository orderRepository) {
        this.executorService = executorService;
        this.orderService = orderService;
        this.orderRepository = orderRepository;
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public CompletableFuture<WrapResponse<Object>> createOrder(@Valid @RequestBody CreateOrderRequest request, @AuthenticationPrincipal Account account) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(orderService.create(request, account)), executorService);
    }

    @RequestMapping(value = "/update/{id}", method = RequestMethod.POST)
    public CompletableFuture<WrapResponse<Object>> updateOrder(@PathVariable String id, @Valid @RequestBody UpdateOrderRequest request) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(orderService.update(id, request)), executorService);
    }

    @RequestMapping(value = "/cancel/{id}", method = RequestMethod.POST)
    public CompletableFuture<WrapResponse<Object>> cancelOrder(@PathVariable String id) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(orderService.cancel(id)), executorService);
    }

    @RequestMapping(value = "/complete/{id}", method = RequestMethod.POST)
    public CompletableFuture<WrapResponse<Object>> completeOrder(@PathVariable String id) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(orderService.complete(id)), executorService);
    }

    @RequestMapping(value = "/find-order-by-id/{id}", method = RequestMethod.GET)
    public CompletableFuture<WrapResponse<Object>> findOrderById(@PathVariable("id") String id) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(orderService.findOrderById(id)), executorService);
    }

    @RequestMapping(value = "/search-order", method = RequestMethod.POST)
    public CompletableFuture<WrapResponse<Object>> searchOrder(@RequestBody SearchOrderRequest request) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(orderService.searchOrder(request)), executorService);
    }

    @RequestMapping(value = "/get-all-executed-order", method = RequestMethod.GET)
    public CompletableFuture<WrapResponse<Object>> getAllExecutedOrder() {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(orderService.getAllExecutedOrder()), executorService);
    }

    @GetMapping
    public CompletableFuture<WrapResponse<Object>> findAll() {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(orderRepository.findAll()), executorService);
    }

}
