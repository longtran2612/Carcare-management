package iuh.nhom7.khoa_luan_backend.controller;

import io.swagger.v3.oas.annotations.Hidden;
import iuh.nhom7.khoa_luan_backend.service.SendSmsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/test")
public class TestController {
    private final SendSmsService smsService;

    public TestController(SendSmsService smsService) {
        this.smsService = smsService;
    }

    @Hidden
    @GetMapping("/send-test-sms")
    public ResponseEntity<?> sendTestSms() {
        try {
            smsService.sendSMS("+840395071374", "+840395071374", "Hello from VL Car Care");
            return new ResponseEntity<>("Message sent!", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Send message failed!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
