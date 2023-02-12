package iuh.nhom7.khoa_luan_backend.exception;

import iuh.nhom7.khoa_luan_backend.base.BaseException;

public class ServiceException extends BaseException {
    public ServiceException(String errorCode, Object... args) {
        super(errorCode, args);
    }

    public static BaseException build(String errorCode, String msgDetail) {
        ServiceException exp = new ServiceException(errorCode);
        exp.setMessage(msgDetail);
        return exp;
    }
}
