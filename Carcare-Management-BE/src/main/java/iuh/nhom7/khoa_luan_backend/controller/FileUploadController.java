package iuh.nhom7.khoa_luan_backend.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import iuh.nhom7.khoa_luan_backend.entity.wrapper.WrapResponse;
import iuh.nhom7.khoa_luan_backend.service.AmazonS3Service;
import iuh.nhom7.khoa_luan_backend.service.FirebaseImageService;
import org.apache.http.entity.ContentType;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/upload")
@Tag(name = "File Uploader", description = "Upload File API")
public class FileUploadController {
    private final ExecutorService executorService;
    private final FirebaseImageService firebaseImageService;

    public FileUploadController(ExecutorService executorService,
                                FirebaseImageService firebaseImageService) {
        this.executorService = executorService;
        this.firebaseImageService = firebaseImageService;
    }

//    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public CompletableFuture<WrapResponse<Object>> upload(@RequestPart("files") List<MultipartFile> files) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(firebaseImageService.uploadFiles(files)), executorService);
    }

    @PostMapping(value = "/upload")
    public CompletableFuture<WrapResponse<Object>> upload(@RequestPart("file") MultipartFile file) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                return WrapResponse.ok(firebaseImageService.save(file));
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }, executorService);
    }

}
