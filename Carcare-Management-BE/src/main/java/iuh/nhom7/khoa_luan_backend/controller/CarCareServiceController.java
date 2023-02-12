package iuh.nhom7.khoa_luan_backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import iuh.nhom7.khoa_luan_backend.annotations.validator.ValuesAllowed;
import iuh.nhom7.khoa_luan_backend.entity.CarCareService;
import iuh.nhom7.khoa_luan_backend.entity.wrapper.ListWrapper;
import iuh.nhom7.khoa_luan_backend.entity.wrapper.WrapResponse;
import iuh.nhom7.khoa_luan_backend.model.dto.ServiceCreateDTO;
import iuh.nhom7.khoa_luan_backend.model.dto.ServiceUpdateDTO;
import iuh.nhom7.khoa_luan_backend.model.profile.ServiceProfile;
import iuh.nhom7.khoa_luan_backend.model.search.ParameterSearchService;
import iuh.nhom7.khoa_luan_backend.repository.CarCareServiceRepository;
import iuh.nhom7.khoa_luan_backend.request.SearchServiceRequest;
import iuh.nhom7.khoa_luan_backend.response.carCareService.CarCareServiceResponse;
import iuh.nhom7.khoa_luan_backend.service.CarCareServiceService;
import iuh.nhom7.khoa_luan_backend.common.Extensions;
import iuh.nhom7.khoa_luan_backend.utils.MappingUtils;
import lombok.experimental.ExtensionMethod;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;

/**
 * 9:25 PM 15-Sep-22
 * Long Tran
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@ExtensionMethod(Extensions.class)
@RequestMapping("/services")
@Tag(name = "Service", description = "Service API")
public class CarCareServiceController {
    private final ExecutorService executorService;
    private final CarCareServiceService carCareServiceService;
    private final CarCareServiceRepository carCareServiceRepository;


    public CarCareServiceController(ExecutorService executorService,
                                    CarCareServiceService carCareServiceService,
                                    CarCareServiceRepository carCareServiceRepository) {
        this.executorService = executorService;
        this.carCareServiceService = carCareServiceService;
        this.carCareServiceRepository = carCareServiceRepository;
    }

    @GetMapping
    public CompletableFuture<WrapResponse<Object>> getAllService() {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(carCareServiceRepository.findAll()), executorService);
    }

    @GetMapping("/{id}")
    public CompletableFuture<WrapResponse<Object>> getService(@PathVariable String id) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(carCareServiceService.findById(id)), executorService);
    }

    @GetMapping("/find-service-by-code/{code}")
    public CompletableFuture<WrapResponse<Object>> findByCode(@PathVariable String code) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(carCareServiceService.findByCode(code)), executorService);
    }

    @GetMapping("/get-service-profile/{id}")
    public CompletableFuture<WrapResponse<Object>> getProfileById(@PathVariable String id) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(carCareServiceService.getProfileById(id)), executorService);
    }

    @PostMapping("/create")
    public CompletableFuture<WrapResponse<Object>> createService(@Valid @RequestBody ServiceCreateDTO serviceCreateDTO) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(carCareServiceService.create(serviceCreateDTO)), executorService);
    }

    @PostMapping("/update/{id}")
    public CompletableFuture<WrapResponse<Object>> updateService(@PathVariable String id, @RequestBody ServiceUpdateDTO serviceUpdateDTO) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(carCareServiceService.update(id, serviceUpdateDTO)), executorService);
    }

    @PostMapping("/active/{id}")
    public CompletableFuture<WrapResponse<Object>> activeService(@PathVariable String id) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(carCareServiceService.active(id)), executorService);
    }

    @PostMapping("/inactive/{id}")
    public CompletableFuture<WrapResponse<Object>> inActiveService(@PathVariable String id) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(carCareServiceService.inactive(id)), executorService);
    }


    @PostMapping("/search")
    @Operation(summary = "Search service")
    public CompletableFuture<WrapResponse<Object>> searchService(@RequestBody SearchServiceRequest searchServiceRequest) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(carCareServiceService.search(searchServiceRequest)), executorService);
    }

    @Operation(summary = "Get services by parameter")
    @GetMapping("/search")
    public CompletableFuture<WrapResponse<Object>> search(@RequestParam(value = "id", required = false) String id,
                                                          @RequestParam(value = "type", required = false) String type,
                                                          @RequestParam(value = "name", required = false) String name,
                                                          @RequestParam(value = "category_id", required = false) String categoryId,
                                                          @RequestParam(value = "create_by", required = false) String createBy,
                                                          @RequestParam(value = "status", required = false) String status,
                                                          @RequestParam(value = "from_date", required = false) Long fromDate,
                                                          @RequestParam(value = "to_date", required = false) Long toDate,
                                                          @RequestParam(value = "ids", required = false) List<String> ids,
                                                          @RequestParam(value = "sort_order", required = false) @ValuesAllowed(values = {"ASC", "DESC"}) @Parameter(description = "Allowed values: ASC | DESC.") String sortOrder,
                                                          @RequestParam(value = "sort_by", required = false) String sortBy,
                                                          @RequestParam(value = "current_page", required = false) @Min(value = 1, message = "currentPage phải lớn hơn 0") @Parameter(description = "Default: 1") Integer currentPage,
                                                          @RequestParam(value = "max_result", required = false) @Min(value = 1, message = "maxResult phải lớn hơn 0") @Max(value = 50, message = "maxResult phải bé hơn 50") @Parameter(description = "Default: 20; Size range: 1-50") Integer maxResult
    ) {
        if (currentPage == null || currentPage == 0) {
            currentPage = 1;
        }
        if (maxResult == null || maxResult == 0) {
            maxResult = 20;
        }
        Long startIndex = ((long) (currentPage - 1) * maxResult);
        ParameterSearchService parameterSearchService = new ParameterSearchService();


        if (!id.isBlankOrNull()) {
            parameterSearchService.setId(id);
        }
        if (!ids.isNullOrEmpty()) {
            parameterSearchService.setIds(ids);
        }
        if (!name.isBlankOrNull()) {
            parameterSearchService.setName(name);
        }
        if (!status.isBlankOrNull()) {
            parameterSearchService.setStatus(status);
        }
        if (!categoryId.isBlankOrNull()) {
            parameterSearchService.setCategoryId(categoryId);
        }
        if (!type.isBlankOrNull()) {
            parameterSearchService.setType(type);
        }
        if (!createBy.isBlankOrNull()) {
            parameterSearchService.setCreateBy(createBy);
        }
        if (null != fromDate) {
            parameterSearchService.setFromDate(new Date(fromDate));
        }
        if (null != toDate) {
            parameterSearchService.setToDate(new Date(toDate));
        }
        if (!sortOrder.isBlankOrNull()) {
            parameterSearchService.setDescSort(sortOrder.equals("DESC"));
        }
        if (!sortBy.isBlankOrNull()) {
            parameterSearchService.setSortField(sortBy);
        }

        parameterSearchService.setStartIndex(startIndex);
        parameterSearchService.setMaxResult(maxResult);

        ListWrapper<ServiceProfile> listWrapper = carCareServiceService.getServicesProfiles(parameterSearchService);
        listWrapper.setCurrentPage(currentPage);
        listWrapper.setMaxResult(maxResult);

        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(listWrapper), executorService);

    }

}
