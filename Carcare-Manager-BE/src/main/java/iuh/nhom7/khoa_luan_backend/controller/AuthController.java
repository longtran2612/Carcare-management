package iuh.nhom7.khoa_luan_backend.controller;

import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.tags.Tag;
import iuh.nhom7.khoa_luan_backend.entity.wrapper.WrapResponse;
import iuh.nhom7.khoa_luan_backend.service.AccountService;
import iuh.nhom7.khoa_luan_backend.request.ChangePasswordRequest;
import iuh.nhom7.khoa_luan_backend.request.LoginRequest;
import iuh.nhom7.khoa_luan_backend.request.SignupRequest;
import iuh.nhom7.khoa_luan_backend.request.TokenRefreshRequest;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/auth")
@Tag(name = "Auth", description = "Auth API")
public class AuthController {
    private final ExecutorService executorService;
    private final AccountService accountService;

    public AuthController(ExecutorService executorService,
                          AccountService accountService) {
        this.executorService = executorService;
        this.accountService = accountService;
    }

    @RequestMapping(value = "/find-by-username/{username}", method = RequestMethod.GET)
    public CompletableFuture<WrapResponse<Object>> findByUsername(@PathVariable("username") String username) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(accountService.findByUsername(username)), executorService);
    }

    @RequestMapping(value = "/check-existence/{username}", method = RequestMethod.GET)
    public CompletableFuture<WrapResponse<Object>> checkExistenceByUsername(@PathVariable("username") String username) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(accountService.checkExistenceByUsername(username)), executorService);
    }

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public CompletableFuture<WrapResponse<Object>> register(@Valid @RequestBody SignupRequest signupRequest) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(accountService.signup(signupRequest)), executorService);
    }

    @Hidden
    @RequestMapping(value = "/register-admin", method = RequestMethod.POST)
    public CompletableFuture<WrapResponse<Object>> registerAdmin(@Valid @RequestBody SignupRequest signupRequest) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(accountService.signupAdmin(signupRequest)), executorService);
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public CompletableFuture<WrapResponse<Object>> login(@Valid @RequestBody LoginRequest loginRequest) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(accountService.login(loginRequest)), executorService);
    }

    @RequestMapping(value = "/refresh-token", method = RequestMethod.POST)
    public CompletableFuture<WrapResponse<Object>> refreshToken(@Valid @RequestBody TokenRefreshRequest request) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(accountService.refreshToken(request)), executorService);
    }

    @RequestMapping(value = "/logout", method = RequestMethod.POST)
    public CompletableFuture<WrapResponse<Object>> logout(@Valid @RequestBody TokenRefreshRequest request) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(accountService.logout(request)), executorService);
    }

    @RequestMapping(value = "/change-password", method = RequestMethod.POST)
    public CompletableFuture<WrapResponse<Object>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(accountService.changePassword(request)), executorService);
    }

    @RequestMapping(value = "/change-password2", method = RequestMethod.POST)
    public CompletableFuture<WrapResponse<Object>> changePassword2(@Valid @RequestBody ChangePasswordRequest request) {
        return CompletableFuture.supplyAsync(() -> WrapResponse.ok(accountService.changePassword2(request)), executorService);
    }

}

