package iuh.nhom7.khoa_luan_backend.request;

import lombok.Data;

@Data
public class ChangePasswordRequest {
    private String username;
    private String newPassword;
    private String oldPassword;
}
