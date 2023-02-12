package iuh.nhom7.khoa_luan_backend.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import iuh.nhom7.khoa_luan_backend.annotations.swagger.RequiredHeaderToken;
import iuh.nhom7.khoa_luan_backend.entity.Account;
import iuh.nhom7.khoa_luan_backend.entity.wrapper.WrapResponse;
import iuh.nhom7.khoa_luan_backend.model.dto.UserCreateDTO;
import iuh.nhom7.khoa_luan_backend.model.dto.UserUpdateDTO;
import iuh.nhom7.khoa_luan_backend.repository.UserRepository;
import iuh.nhom7.khoa_luan_backend.request.UpdateUserRequest;
import iuh.nhom7.khoa_luan_backend.service.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/users")
@Tag(name = "User", description = "User API")
public class UserController {
    private final UserRepository userRepository;
    private final UserService userService;
    private final ExecutorService executorService;

    public UserController(UserRepository userRepository,
                          UserService userService,
                          ExecutorService executorService) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.executorService = executorService;
    }

    @GetMapping("/phone/{phone}")
    @PreAuthorize("isAuthenticated()")
    @RequiredHeaderToken
    public CompletableFuture<WrapResponse<Object>> findUserByPhone(@PathVariable String phone) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(userService.findUserByPhone(phone)), executorService);
    }

    @GetMapping("/get-all-execute-available-user")
//    @PreAuthorize("isAuthenticated()")
    public CompletableFuture<WrapResponse<Object>> getAllExecuteAvailableUser() {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(userService.getAllExecuteAvailableUser()), executorService);
    }

    @GetMapping("/{userId}")
    @PreAuthorize("isAuthenticated()")
    public CompletableFuture<WrapResponse<Object>> findUserById(@PathVariable String userId) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(userService.findUserById(userId)), executorService);
    }

    @PatchMapping("/update")
    @PreAuthorize("isAuthenticated()")
    public CompletableFuture<WrapResponse<Object>> partialUpdateUser(@AuthenticationPrincipal Account account, @RequestBody UserUpdateDTO user) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(userService.partialUpdateUser(account, user)), executorService);
    }

    @PutMapping("/update-user/{userPhone}")
    @PreAuthorize("isAuthenticated()")
    public CompletableFuture<WrapResponse<Object>> updateUser(@PathVariable String userPhone, @RequestBody UpdateUserRequest updateUser) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(userService.updateUser(userPhone, updateUser)), executorService);
    }

    @DeleteMapping("/delete-user/{userPhone}")
    @PreAuthorize("isAuthenticated()")
    public CompletableFuture<WrapResponse<Object>> deleteUser(@PathVariable String userPhone) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(userService.deleteUser(userPhone)), executorService);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    @RequiredHeaderToken
    public CompletableFuture<WrapResponse<Object>> findAllUser() {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(userRepository.findAll()), executorService);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @RequiredHeaderToken
    public CompletableFuture<WrapResponse<Object>> updateUserById(@PathVariable String id, @RequestBody UpdateUserRequest updateUser) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(userService.updateUserById(id, updateUser)), executorService);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @RequiredHeaderToken
    public CompletableFuture<WrapResponse<Object>> createUser(@RequestBody UserCreateDTO userCreateDTO, @AuthenticationPrincipal Account account) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(userService.createUser(userCreateDTO, account)), executorService);
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/active/{id}")
    public CompletableFuture<WrapResponse<Object>> activeUser(@PathVariable String id) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(userService.activeUser(id)), executorService);
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/inactive/{id}")
    public CompletableFuture<WrapResponse<Object>> inActiveUser(@PathVariable String id) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(userService.inactiveUser(id)), executorService);
    }

}

