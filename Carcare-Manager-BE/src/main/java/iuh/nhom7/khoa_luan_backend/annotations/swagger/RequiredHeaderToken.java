package iuh.nhom7.khoa_luan_backend.annotations.swagger;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import iuh.nhom7.khoa_luan_backend.common.Constants;

import java.lang.annotation.*;

@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@Parameter(
        in = ParameterIn.HEADER,
        name = Constants.HEADER_TOKEN_NAME,
        required = true,
        schema = @Schema(
                type = "string"
        )
)
public @interface RequiredHeaderToken {

}
