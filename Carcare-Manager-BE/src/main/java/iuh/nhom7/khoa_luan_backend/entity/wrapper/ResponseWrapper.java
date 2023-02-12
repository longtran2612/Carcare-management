package iuh.nhom7.khoa_luan_backend.entity.wrapper;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * 3:49 PM 14-Sep-22
 * Long Tran
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@JsonInclude(JsonInclude.Include.NON_ABSENT)
public class ResponseWrapper<T> {

    protected int status;

    protected String message;

    protected T data;

}
