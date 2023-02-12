package iuh.nhom7.khoa_luan_backend.base;

import iuh.nhom7.khoa_luan_backend.utils.MessageSourceUtils;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BaseException extends RuntimeException {

    protected String errorCode;

    protected String message;

    public BaseException() {
    }

    protected BaseException(String errorCode, Object... args) {
        this.errorCode = errorCode;
        this.message = MessageSourceUtils.getMessage(errorCode, args);
    }
}
