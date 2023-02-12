package iuh.nhom7.khoa_luan_backend.base;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BasePageRequest {
    private Integer pageNumber = 0;
    private Integer pageSize = 10;
}
