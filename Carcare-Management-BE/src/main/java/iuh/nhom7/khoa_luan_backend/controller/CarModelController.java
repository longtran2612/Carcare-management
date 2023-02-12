package iuh.nhom7.khoa_luan_backend.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import iuh.nhom7.khoa_luan_backend.entity.wrapper.WrapResponse;
import iuh.nhom7.khoa_luan_backend.model.dto.CarModelCreateDTO;
import iuh.nhom7.khoa_luan_backend.repository.CarModelRepository;
import iuh.nhom7.khoa_luan_backend.service.CarModelService;
import lombok.SneakyThrows;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;

/**
 * 4:53 PM 20-Sep-22
 * Long Tran
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/car-models")
@Tag(name = "Car model", description = "Car model API")
public class CarModelController {
    private final ExecutorService executorService;
    private final CarModelService carModelService;
    private final CarModelRepository carModelRepository;

    public CarModelController(ExecutorService executorService,
                              CarModelService carModelService,
                              CarModelRepository carModelRepository) {
        this.executorService = executorService;
        this.carModelService = carModelService;
        this.carModelRepository = carModelRepository;
    }

    @PostMapping("/create")
    public CompletableFuture<WrapResponse<Object>> createCarModel(@RequestBody CarModelCreateDTO carModelCreateDTO) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(carModelService.create(carModelCreateDTO)), executorService);
    }

    @PostMapping("/update/{id}")
    public CompletableFuture<WrapResponse<Object>> updateCarModel(@PathVariable String id, @RequestBody CarModelCreateDTO carModelCreateDTO) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(carModelService.updateCarModel(id, carModelCreateDTO)), executorService);
    }

    @GetMapping
    public CompletableFuture<WrapResponse<Object>> getAllCarModel() {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(carModelRepository.findAll()), executorService);
    }

    @GetMapping("/{id}")
    public CompletableFuture<WrapResponse<Object>> getCarModelById(@PathVariable String id) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(carModelService.findCarModelById(id)), executorService);
    }

    @GetMapping("/find-car-model-by-code/{code}")
    public CompletableFuture<WrapResponse<Object>> findCarModelByCode(@PathVariable String code) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(carModelService.findCarModelByCode(code)), executorService);
    }
    @GetMapping("/find-car-model-by-brand/{brand}")
    public CompletableFuture<WrapResponse<Object>> findAllByBrand(@PathVariable String brand) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(carModelRepository.findAllByBrand(brand)), executorService);
    }

    @PostMapping("/import-from-excel")
    @SneakyThrows
    public CompletableFuture<WrapResponse<Object>> importModels(@RequestPart("file") MultipartFile file) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                return WrapResponse.ok(carModelService.importModels(file.getBytes()));
            } catch (IOException e) {
                return WrapResponse.error(e.getMessage());
            }
        }, executorService);
    }

    @GetMapping("/export-to-excel")
    public CompletableFuture<Void> exportToExcel(HttpServletResponse response) {
        return new CompletableFuture<Void>().supplyAsync(() -> {
            carModelService.exportToExcel(response);
            return null;
        }, executorService);
    }

}
