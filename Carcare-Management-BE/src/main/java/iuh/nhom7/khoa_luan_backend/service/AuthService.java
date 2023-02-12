package iuh.nhom7.khoa_luan_backend.service;

import iuh.nhom7.khoa_luan_backend.entity.Account;
import iuh.nhom7.khoa_luan_backend.repository.AccountRepository;
import iuh.nhom7.khoa_luan_backend.common.EnumConst;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AuthService implements UserDetailsService {
    private final AccountRepository accountRepository;

    public AuthService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Account account = accountRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Không tồn tại tài khoản " + username));
        return Account.builder()
                .username(account.getUsername())
                .password(account.getPassword())
                .roles(account.getRoles())
                .build();
    }
}
