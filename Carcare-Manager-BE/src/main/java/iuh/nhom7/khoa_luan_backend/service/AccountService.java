package iuh.nhom7.khoa_luan_backend.service;

import iuh.nhom7.khoa_luan_backend.entity.Account;
import iuh.nhom7.khoa_luan_backend.entity.User;
import iuh.nhom7.khoa_luan_backend.exception.ErrorCode;
import iuh.nhom7.khoa_luan_backend.exception.ServiceException;
import iuh.nhom7.khoa_luan_backend.jwt.JwtUtils;
import iuh.nhom7.khoa_luan_backend.repository.UserRepository;
import iuh.nhom7.khoa_luan_backend.request.ChangePasswordRequest;
import iuh.nhom7.khoa_luan_backend.request.LoginRequest;
import iuh.nhom7.khoa_luan_backend.request.TokenRefreshRequest;
import iuh.nhom7.khoa_luan_backend.response.JwtResponse;
import iuh.nhom7.khoa_luan_backend.response.TokenRefreshResponse;
import iuh.nhom7.khoa_luan_backend.base.BaseService;
import iuh.nhom7.khoa_luan_backend.common.EnumConst;
import iuh.nhom7.khoa_luan_backend.repository.AccountRepository;
import iuh.nhom7.khoa_luan_backend.request.SignupRequest;
import iuh.nhom7.khoa_luan_backend.utils.FinderUtils;
import iuh.nhom7.khoa_luan_backend.utils.ServiceUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Service
public class AccountService extends BaseService {
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final FinderUtils finderUtils;
    private final ServiceUtils serviceUtils;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authenticationManager;

    @Value("${avatar.url}")
    private String avatarUrl;

    public AccountService(AccountRepository accountRepository,
                          UserRepository userRepository,
                          FinderUtils finderUtils,
                          ServiceUtils serviceUtils,
                          JwtUtils jwtUtils,
                          PasswordEncoder encoder,
                          AuthenticationManager authenticationManager) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
        this.finderUtils = finderUtils;
        this.serviceUtils = serviceUtils;
        this.jwtUtils = jwtUtils;
        this.encoder = encoder;
        this.authenticationManager = authenticationManager;
    }

    public Account findByUsername(String username) {
        Account account = accountRepository.findByUsername(username).orElse(null);
        if (account == null) {
            throw new ServiceException(ErrorCode.ACCOUNT_NOT_FOUND);
        }
        return account;
    }

    public boolean checkExistenceByUsername(String username) {
        return accountRepository.existsByUsername(username);
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean signup(SignupRequest signupRequest){
        // nếu tài khoản tồn tại
        if (checkExistenceByUsername(signupRequest.getUsername())) {
            throw new ServiceException(ErrorCode.ACCOUNT_EXISTED);
        }

        // đăng ký
        Account account = new Account();
        account.setUsername(signupRequest.getUsername());
        account.setPassword(encoder.encode(signupRequest.getPassword()));
        account.setRoles(EnumConst.Role.ROLE_USER.toString());
        accountRepository.save(account);

        // tạo user sau khi đăng ký
        User.UserBuilder builder = User.builder();
        builder.userCode("USER" + sequenceValueItemRepository.getSequence(User.class));
        builder.name(signupRequest.getFullname());
        builder.phone(account.getUsername());
        builder.email(signupRequest.getEmail());
        builder.address("Chưa có");
        builder.image(avatarUrl);
        builder.createDate(new Date());
        builder.updateDate(new Date());
        builder.status(EnumConst.Status.ACTIVE.toString());
        User newUser = builder
                .build();
        userRepository.save(newUser);
        return true;
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean signupAdmin(SignupRequest signupRequest){
        // nếu tài khoản tồn tại
        if (checkExistenceByUsername(signupRequest.getUsername())) {
            throw new ServiceException(ErrorCode.ACCOUNT_EXISTED);
        }

        // đăng ký
        Account account = new Account();
        account.setUsername(signupRequest.getUsername());
        account.setPassword(encoder.encode(signupRequest.getPassword()));
        account.setRoles(EnumConst.Role.ROLE_ADMIN.toString());
        accountRepository.save(account);

        // tạo user sau khi đăng ký
        User.UserBuilder builder = User.builder();
        builder.userCode("ADMIN" + sequenceValueItemRepository.getSequence(User.class));
        builder.name(signupRequest.getFullname());
        builder.phone(account.getUsername());
        builder.email(signupRequest.getEmail());
        builder.address("Chưa có");
        builder.image(avatarUrl);
        builder.createDate(new Date());
        builder.updateDate(new Date());
        builder.status(EnumConst.Status.ACTIVE.toString());
        User newUser = builder
                .build();
        userRepository.save(newUser);
        return true;
    }

    public JwtResponse login(LoginRequest loginRequest) {
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        } catch (AuthenticationException e) {
            throw new ServiceException("Tài khoản hoặc mật khẩu không chính xác");
        }
        SecurityContextHolder.getContext().setAuthentication(authentication);
        Account account = (Account) authentication.getPrincipal();
        validateAccount(account);

        String jwt = jwtUtils.generateJwtToken(authentication);

        //generate a refresh token for refresh access token
        String refreshToken = jwtUtils.generateJwtRefreshToken(account.getUsername());
        setRefreshToken(account.getUsername(), refreshToken);
        return new JwtResponse(jwt, refreshToken, null, account);
    }
    private void validateAccount(Account account) {
        if (account == null) {
            throw new ServiceException(ErrorCode.ACCOUNT_NOT_FOUND);
        }
        Account account1 = accountRepository.findByUsername(account.getUsername()).orElse(null);
        if(account1.getStatus().equals(EnumConst.Status.INACTIVE.toString())){
            throw new ServiceException("Tài Khoản Đã Bị Khóa");
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public TokenRefreshResponse refreshToken(TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();
        if (StringUtils.isEmpty(requestRefreshToken) || !jwtUtils.validateJwtToken(requestRefreshToken)){
            throw new ServiceException(ErrorCode.INVALID_REFRESH_TOKEN_REQUEST);
        }
        String username = jwtUtils.getUserNameFromJwtToken(requestRefreshToken);
        Account account = findByUsername(username);
        if (!requestRefreshToken.equals(account.getRefreshToken())) {
            throw new ServiceException(ErrorCode.INVALID_REFRESH_TOKEN_REQUEST);
        }
        String newAccessToken = jwtUtils.generateJwtTokenWithAccountId(account.getUsername());
        String newRefreshToken = jwtUtils.generateJwtRefreshToken(account.getUsername());
        setRefreshToken(account.getUsername(), newRefreshToken);
        return new TokenRefreshResponse(newAccessToken, newRefreshToken);
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean logout(TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();
        if (StringUtils.isEmpty(requestRefreshToken) || !jwtUtils.validateJwtToken(requestRefreshToken)){
            throw new ServiceException(ErrorCode.INVALID_REFRESH_TOKEN_REQUEST);
        }
        String username = jwtUtils.getUserNameFromJwtToken(requestRefreshToken);
        Account account = findByUsername(username);
        if (!requestRefreshToken.equals(account.getRefreshToken())) {
            throw new ServiceException(ErrorCode.INVALID_REFRESH_TOKEN_REQUEST);
        }
        setRefreshToken(account.getUsername(), null);
        return true;
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean changePassword(ChangePasswordRequest request) {
        Account account = findByUsername(request.getUsername());
        account.setPassword(encoder.encode(request.getNewPassword()));
        account.setLoginBefore(true);
        accountRepository.save(account);
        return true;
    }
    @Transactional(rollbackFor = Exception.class)
    public boolean changePassword2(ChangePasswordRequest request) {
        try {
             authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getOldPassword()));
        } catch (AuthenticationException e) {
            throw new ServiceException(ErrorCode.OLD_PASSWORD_NOT_CORRECT);
        }
        Account account = findByUsername(request.getUsername());
        account.setPassword(encoder.encode(request.getNewPassword()));
        account.setLoginBefore(true);
        accountRepository.save(account);
        return true;
    }

    private void setRefreshToken(String username, String refreshToken) {
        Account account = findByUsername(username);
        account.setRefreshToken(refreshToken);
        accountRepository.save(account);
    }
}
