package iuh.nhom7.khoa_luan_backend.exception;

/**
 * Tạo CustomException để trả về tin nhắn lỗi theo ý muốn
 * @author Lại Văn Vượng
 *
 */
public class CustomException extends Exception{

    /**
     *
     */
    private static final long serialVersionUID = 1L;

    public CustomException(String message) {
        super(message);
    }
}