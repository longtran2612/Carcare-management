package iuh.nhom7.khoa_luan_backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 10:14 PM 20-Sep-22
 * Long Tran
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserGroupCreateDTO {
    private String name;
    private String description;
}
