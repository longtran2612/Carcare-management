package iuh.nhom7.khoa_luan_backend.exception;

import iuh.nhom7.khoa_luan_backend.base.BaseException;
import iuh.nhom7.khoa_luan_backend.base.BaseObjectLoggable;
import iuh.nhom7.khoa_luan_backend.entity.wrapper.WrapResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Arrays;

@RestControllerAdvice
public class GlobalWebExceptionHandler extends BaseObjectLoggable {
    @ExceptionHandler(BaseException.class)
    @ResponseStatus(code = HttpStatus.UNPROCESSABLE_ENTITY)
    public ResponseEntity<Object> handleBaseExceptions(BaseException baseException) {
        baseException.printStackTrace();
        WrapResponse baseResponse = new WrapResponse();
        baseResponse.setSuccess(false);
        baseResponse.setStatusCode("422");
        baseResponse.setErrorCode(baseException.getErrorCode());
        baseResponse.setMessage(Arrays.asList(baseException.getMessage()));
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY.value())
                .body(baseResponse);
    }

//    @ExceptionHandler(BlockedUserException.class)
//    @ResponseStatus(code = HttpStatus.UNPROCESSABLE_ENTITY)
//    public ResponseEntity<Object> handleBlockedExceptions(BaseException baseException) {
//        baseException.printStackTrace();
//        WrapResponse baseResponse = new WrapResponse();
//        baseResponse.setSuccess(false);
//        baseResponse.setStatusCode("403");
//        baseResponse.setErrorCode(baseException.getErrorCode());
//        baseResponse.setMessage(Arrays.asList(baseException.getMessage()));
//        return ResponseEntity.status(HttpStatus.FORBIDDEN.value())
//                .body(baseResponse);
//    }


//    @ExceptionHandler(MethodArgumentNotValidException.class)
//    @ResponseStatus(code = HttpStatus.INTERNAL_SERVER_ERROR)
//    public ResponseEntity<Object> handleNotValidExceptions(MethodArgumentNotValidException ex) {
//        WrapResponse baseResponse = new WrapResponse();
//        baseResponse.setSuccess(false);
//        baseResponse.setStatusCode("400");
//        baseResponse.setErrorCode(SharedErrorCode.BadRequest);
//        if (ex.getBindingResult() != null && ex.getBindingResult().getFieldErrors() != null) {
//            List<Violation> lstViolations = new ArrayList<>();
//            ex.getBindingResult().getFieldErrors().forEach(item -> {
//                lstViolations.add(Violation.builder()
//                        .field(item.getField())
//                        .errorCode(item.getDefaultMessage())
//                        .message(MessageSourceUtils.getMessage(item.getDefaultMessage()))
//                        .build());
//            });
//            baseResponse.setData(lstViolations);
//        }
//
//        baseResponse.setMessage(ex.getBindingResult().getAllErrors().stream()
//                .map(error -> MessageSourceUtils.getMessage(error.getDefaultMessage()))
//                .collect(Collectors.toList()));
//        return ResponseEntity.status(HttpStatus.BAD_REQUEST.value())
//                .body(baseResponse);
//    }

//    @ExceptionHandler(ConstraintViolationException.class)
//    @ResponseStatus(code = HttpStatus.INTERNAL_SERVER_ERROR)
//    public ResponseEntity<Object> handleViolationExceptions(ConstraintViolationException ex) {
//        WrapResponse baseResponse = new WrapResponse();
//        baseResponse.setSuccess(false);
//        baseResponse.setStatusCode("400");
//        baseResponse.setViolations(true);
//        baseResponse.setErrorCode(SharedErrorCode.BadRequest);
//
//        baseResponse.setData(ex.getLstViolations());
//        return ResponseEntity.status(HttpStatus.BAD_REQUEST.value())
//                .body(baseResponse);
//    }

//    @ExceptionHandler(UnAuthenticationException.class)
//    @ResponseStatus(code = HttpStatus.INTERNAL_SERVER_ERROR)
//    public ResponseEntity<Object> handleAccessDeniedException(UnAuthenticationException ex) {
//        WrapResponse baseResponse = new WrapResponse();
//        baseResponse.setSuccess(false);
//        baseResponse.setStatusCode("403");
//        baseResponse.setErrorCode(SharedErrorCode.Forbidden);
//        List<String> errorMsg = new ArrayList<>();
//        errorMsg.add(MessageSourceUtils.getMessagePermissions(ex.getMessage()));
//        baseResponse.setMessage(errorMsg);
//        return ResponseEntity.status(HttpStatus.FORBIDDEN.value())
//                .body(baseResponse);
//    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(code = HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<Object> handleAccessDeniedException(AccessDeniedException ex) {
        WrapResponse baseResponse = new WrapResponse();
        baseResponse.setSuccess(false);
        baseResponse.setStatusCode("403");
        baseResponse.setErrorCode("FORBIDDEN");

        baseResponse.setMessage(Arrays.asList(ex.getMessage()));
        return ResponseEntity.status(HttpStatus.FORBIDDEN.value())
                .body(baseResponse);
    }
}
