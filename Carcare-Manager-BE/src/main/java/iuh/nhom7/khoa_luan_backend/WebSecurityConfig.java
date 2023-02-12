package iuh.nhom7.khoa_luan_backend;

import iuh.nhom7.khoa_luan_backend.exception.AccessDeniedExceptionHandler;
import iuh.nhom7.khoa_luan_backend.exception.AuthenticationExceptionHandler;
import iuh.nhom7.khoa_luan_backend.jwt.AuthTokenFilter;
import iuh.nhom7.khoa_luan_backend.service.AccountService;
import iuh.nhom7.khoa_luan_backend.service.AuthService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@ComponentScan(basePackages = {"iuh.nhom7.khoa_luan_backend"})
@EnableGlobalMethodSecurity(prePostEnabled = true, proxyTargetClass = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    private final AuthService authService;
    private final AccessDeniedExceptionHandler accessDeniedExceptionHandler;
    private final AuthenticationExceptionHandler authenticationExceptionHandler;

    public WebSecurityConfig(AuthService authService,
                             AccessDeniedExceptionHandler accessDeniedExceptionHandler,
                             AuthenticationExceptionHandler authenticationExceptionHandler) {
        this.authService = authService;
        this.accessDeniedExceptionHandler = accessDeniedExceptionHandler;
        this.authenticationExceptionHandler = authenticationExceptionHandler;
    }

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    public void configure(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
        authenticationManagerBuilder.userDetailsService(authService).passwordEncoder(new BCryptPasswordEncoder());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable().authorizeRequests()
                .antMatchers("/**").permitAll()
                .antMatchers("/src/**").permitAll()
                .anyRequest().authenticated().and().exceptionHandling().authenticationEntryPoint(authenticationExceptionHandler)
                .and().exceptionHandling().accessDeniedHandler(accessDeniedExceptionHandler)
                .and().sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
    }
}
