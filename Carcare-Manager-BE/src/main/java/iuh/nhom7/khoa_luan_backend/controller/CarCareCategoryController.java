package iuh.nhom7.khoa_luan_backend.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import iuh.nhom7.khoa_luan_backend.entity.CarCareCategory;
import iuh.nhom7.khoa_luan_backend.entity.wrapper.WrapResponse;
import iuh.nhom7.khoa_luan_backend.model.dto.ServiceCategoryCreateDTO;
import iuh.nhom7.khoa_luan_backend.repository.CarCareCategoryRepository;
import iuh.nhom7.khoa_luan_backend.request.UpdateCategoryRequest;
import iuh.nhom7.khoa_luan_backend.service.CarCareCategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;

/**
 * 9:16 PM 16-Sep-22
 * Long Tran
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/service-categories")
@Tag(name = "Service Category", description = "Service Category API")
public class CarCareCategoryController {

    private final CarCareCategoryRepository carCareCategoryRepository;

    private final CarCareCategoryService carCareCategoryService;

    private final ExecutorService executorService;

    public CarCareCategoryController(CarCareCategoryRepository carCareCategoryRepository,
                                     CarCareCategoryService carCareCategoryService, ExecutorService executorService) {
        this.carCareCategoryRepository = carCareCategoryRepository;
        this.carCareCategoryService = carCareCategoryService;
        this.executorService = executorService;
    }

    @GetMapping("/{id}")
    public CompletableFuture<WrapResponse<Object>> getServiceCategory(@PathVariable String id) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(carCareCategoryService.findById(id)), executorService);
    }

    @GetMapping("/find-category-by-code/{code}")
    public CompletableFuture<WrapResponse<Object>> getServiceCategoryByCode(@PathVariable String code) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(carCareCategoryService.findByCode(code)), executorService);
    }

    @GetMapping
    public CompletableFuture<WrapResponse<Object>> getServiceCategories() {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(carCareCategoryRepository.findAll()), executorService);
    }

    @PostMapping("/create")
    public CompletableFuture<WrapResponse<Object>> createServiceCategory(@RequestBody ServiceCategoryCreateDTO serviceCategoryCreateDTO) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(carCareCategoryService.create(serviceCategoryCreateDTO)), executorService);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        carCareCategoryRepository.deleteById(id);
    }


    @PostMapping("/update/{id}")
    public CompletableFuture<WrapResponse<Object>> updateServiceCategory(@PathVariable String id, @RequestBody UpdateCategoryRequest carCareCategory) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(carCareCategoryService.update(id, carCareCategory)), executorService);
    }
}
