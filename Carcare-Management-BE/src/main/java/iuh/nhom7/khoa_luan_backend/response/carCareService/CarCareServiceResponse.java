package iuh.nhom7.khoa_luan_backend.response.carCareService;

import iuh.nhom7.khoa_luan_backend.model.PriceModel;
import iuh.nhom7.khoa_luan_backend.response.PriceModelResponse;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CarCareServiceResponse {
    private String id;
    private String serviceCode;
    private String type;
    private String name;
    private String description;
    private String categoryId;
    private String statusName;
    private String imageUrl;

    private PriceModelResponse servicePrice;

    private int status;
    private Object createDate;
    private String createBy;
    private Object updateDate;
    private String updateBy;
}
