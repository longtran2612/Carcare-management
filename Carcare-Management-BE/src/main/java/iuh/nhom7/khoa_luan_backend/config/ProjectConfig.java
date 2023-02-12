package iuh.nhom7.khoa_luan_backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.ArrayList;
import java.util.List;

/**
 * 9:40 AM 27-Apr-22
 * Long Tran
 **/

@Configuration
@EnableWebMvc
@EnableConfigurationProperties
public class ProjectConfig {

    @Bean
    public WebMvcConfigurer customConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
                configurer.defaultContentType(MediaType.APPLICATION_JSON);
            }
        };
    }

    @Bean
    public OpenAPI springShopOpenAPI() {
        List<Server> servers = new ArrayList<>();

        Server server = new Server();
        //local
//        server.setUrl("http://localhost:5000/");
        server.setUrl("https://khoa-luan-gl.herokuapp.com/");
        server.setDescription("Swagger");
        servers.add(server);
        return new OpenAPI()
                .info(new Info().title("Swagger")
                        .description("Swagger UI")
                        .version("1.0"))
                .servers(servers);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public ModelMapper modelMapper() {
        // Tạo object và cấu hình
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration()
                .setMatchingStrategy(MatchingStrategies.STRICT)
                .setAmbiguityIgnored(true)

                .setSkipNullEnabled(true);;
        return modelMapper;
    }
}
