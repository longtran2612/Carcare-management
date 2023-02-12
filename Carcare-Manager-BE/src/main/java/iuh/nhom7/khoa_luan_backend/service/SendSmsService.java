package iuh.nhom7.khoa_luan_backend.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import iuh.nhom7.khoa_luan_backend.base.BaseService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SendSmsService extends BaseService {
    @Value("${TWILIO_ACCOUNT_SID}")
    private String TWILIO_ACCOUNT_SID;
    @Value("${TWILIO_AUTH_TOKEN}")
    private String TWILIO_AUTH_TOKEN;

    public void sendSMS(String fromNumber, String toNumber, String message) {
        Twilio.init(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
        Message.creator(new PhoneNumber(toNumber),
                new PhoneNumber(fromNumber), message).create();
    }
}
