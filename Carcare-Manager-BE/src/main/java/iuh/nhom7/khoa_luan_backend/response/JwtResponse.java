package iuh.nhom7.khoa_luan_backend.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonUnwrapped;
import iuh.nhom7.khoa_luan_backend.entity.Account;
import iuh.nhom7.khoa_luan_backend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = 1L;

    @JsonIgnore
    private User user;

    @JsonUnwrapped
    private Account account;

    private String tokenType;

    private String accessToken;

    private String refreshToken;

    public JwtResponse(String accessToken, String refreshToken, User user, Account account) {
        this.accessToken = accessToken;
        this.user = user;
        this.account = account;
        tokenType = "Bearer";
        this.refreshToken = refreshToken;
    }

}
