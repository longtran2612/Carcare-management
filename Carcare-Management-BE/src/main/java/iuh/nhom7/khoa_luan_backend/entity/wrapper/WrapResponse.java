package iuh.nhom7.khoa_luan_backend.entity.wrapper;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.SneakyThrows;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Getter
@Setter
public class WrapResponse<T> {

    @JsonProperty("Success")
    private boolean success;
    @JsonProperty("Data")
    private T data;

    private String errorCode;

    private List<String> message;

    @JsonProperty("violations")
    private Boolean violations;

    private String refCode;

    @JsonProperty("StatusCode")
    private String statusCode;

    public static <T> WrapResponse<T> error(String msg) {
        WrapResponse baseResponse = new WrapResponse();
        baseResponse.setData(null);
        baseResponse.setSuccess(false);
        baseResponse.setStatusCode("500");
        baseResponse.setMessage(Collections.singletonList(msg));
        return baseResponse;
    }

    public static <T> WrapResponse<T> ok(T data) {
        WrapResponse baseResponse = new WrapResponse();
        baseResponse.setData(data);
        baseResponse.setSuccess(true);
        baseResponse.setStatusCode("200");
        return baseResponse;
    }

    public static <T> CompletableFuture<WrapResponse<T>> okFuture(CompletableFuture<T> data) {
        return data.thenApply(rs -> WrapResponse.ok(rs));
    }

    @SneakyThrows
    public static <T> Class<? extends WrapResponse> getClass(Class<T> clazz) {
        return WrapResponse.ok(clazz.newInstance()).getClass();
    }
}
