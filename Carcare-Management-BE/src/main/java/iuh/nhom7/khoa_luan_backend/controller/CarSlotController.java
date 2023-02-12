package iuh.nhom7.khoa_luan_backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import iuh.nhom7.khoa_luan_backend.entity.wrapper.WrapResponse;
import iuh.nhom7.khoa_luan_backend.model.dto.CarSlotCreateDTO;
import iuh.nhom7.khoa_luan_backend.model.dto.CarSlotUpdateDTO;
import iuh.nhom7.khoa_luan_backend.repository.CarSlotRepository;
import iuh.nhom7.khoa_luan_backend.request.order.CompleteExecutingRequest;
import iuh.nhom7.khoa_luan_backend.request.order.ExecuteOrderRequest;
import iuh.nhom7.khoa_luan_backend.service.CarSlotService;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;

/**
 * 4:53 PM 20-Sep-22
 * Long Tran
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/car-slots")
@Tag(name = "Car Slot", description = "Car Slot API")
public class CarSlotController {
    private final ExecutorService executorService;
    private final CarSlotService carSlotService;
    private final CarSlotRepository carSlotRepository;

    public CarSlotController(ExecutorService executorService,
                             CarSlotService carSlotService,
                             CarSlotRepository carSlotRepository) {
        this.executorService = executorService;
        this.carSlotService = carSlotService;
        this.carSlotRepository = carSlotRepository;
    }

    @GetMapping
    public CompletableFuture<WrapResponse<Object>> getAllCarSlot() {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(carSlotRepository.findAll()), executorService);
    }

    @GetMapping("/{id}")
    public CompletableFuture<WrapResponse<Object>> findCarSlotById(@PathVariable String id) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(carSlotService.findCarSlotById(id)), executorService);
    }

    @GetMapping("/find-car-slot-by-code/{code}")
    public CompletableFuture<WrapResponse<Object>> findCarSlotByCode(@PathVariable String code) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(carSlotService.findCarSlotByCode(code)), executorService);
    }

    @PostMapping("/create")
    public CompletableFuture<WrapResponse<Object>> createCarSlot() {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(carSlotService.create()), executorService);
    }
    @PostMapping("/update/{id}")
    @Operation(summary = "Cập nhật Car Slot")
    public CompletableFuture<WrapResponse<Object>> updateCarSlot(@PathVariable String id, @RequestBody CarSlotUpdateDTO request) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(carSlotService.update(id, request)), executorService);
    }

    @PostMapping("/execute")
    public CompletableFuture<WrapResponse<Object>> executeOrder(@RequestBody ExecuteOrderRequest request) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(carSlotService.executeOrder(request)), executorService);
    }

    @PostMapping("/complete")
    public CompletableFuture<WrapResponse<Object>> completeOrder(@RequestBody ExecuteOrderRequest request) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(carSlotService.completeOrder(request)), executorService);
    }
    @PostMapping("/delete/{id}")
    public void delete(@PathVariable String id) {
        carSlotRepository.deleteById(id);
    }

    @PostMapping("/cancel/{id}")
    public CompletableFuture<WrapResponse<Object>> cancelOrder(@PathVariable String id) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(carSlotService.cancelOrder(id)), executorService);
    }

//    @GetMapping()
//    public CompletableFuture<WrapResponse<Object>> getCarSlots() {
//        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(carSlotService.getCarSlots(carSlotRepository.findAll())), executorService);
//    }

}
