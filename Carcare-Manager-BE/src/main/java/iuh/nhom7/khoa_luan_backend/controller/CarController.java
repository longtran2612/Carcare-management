package iuh.nhom7.khoa_luan_backend.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import iuh.nhom7.khoa_luan_backend.entity.wrapper.WrapResponse;
import iuh.nhom7.khoa_luan_backend.repository.CarRepository;
import iuh.nhom7.khoa_luan_backend.request.CreateCarRequest;
import iuh.nhom7.khoa_luan_backend.request.UpdateCarRequest;
import iuh.nhom7.khoa_luan_backend.service.CarService;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;

/**
 * 4:53 PM 20-Sep-22
 * Long Tran
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/cars")
@Tag(name = "car", description = "Car API")
public class CarController {
    private final ExecutorService executorService;
    private final CarService carService;
    private final CarRepository carRepository;

    public CarController(ExecutorService executorService,
                         CarService carService,
                         CarRepository carRepository) {
        this.executorService = executorService;
        this.carService = carService;
        this.carRepository = carRepository;
    }

    @GetMapping
    public CompletableFuture<WrapResponse<Object>> getAllCar() {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(carRepository.findAll()), executorService);
    }

    @GetMapping("/{id}")
    public CompletableFuture<WrapResponse<Object>> getCarById(@PathVariable String id) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(carService.findCarById(id)), executorService);
    }

    @GetMapping("/find-car-by-code/{code}")
    public CompletableFuture<WrapResponse<Object>> findCarByCode(@PathVariable String code) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(carService.findCarByCode(code)), executorService);
    }

    @GetMapping("/find-cars-by-customer-id/{customerId}")
    public CompletableFuture<WrapResponse<Object>> getCarsByCustomerId(@PathVariable String customerId) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(carService.findCarsByCustomerId(customerId)), executorService);
    }

    @PostMapping("/create")
    public CompletableFuture<WrapResponse<Object>> createCar(@Valid @RequestBody CreateCarRequest request) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(carService.create(request)), executorService);
    }

    @PostMapping("/update/{id}")
    public CompletableFuture<WrapResponse<Object>> updateCar(@PathVariable String id, @RequestBody UpdateCarRequest request) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(carService.update(id, request)), executorService);
    }

}
