package iuh.nhom7.khoa_luan_backend.response;

import lombok.*;

/**
 * 6:55 PM 20-Nov-22
 * Long Tran
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatisticResponse {
    private String date;
    private Long value;
}
