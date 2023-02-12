package iuh.nhom7.khoa_luan_backend.common;

import java.util.HashMap;
import java.util.Map;

public class IdentityType {
    public static final int CCCD = 0;
    public static final int CMND = 1;
    public static final int PASSPORT = 2;

    public static Map<Integer, String> mapIdentityType;

    static {
        mapIdentityType = new HashMap<>();
        mapIdentityType.put(CCCD, "Căn cước công dân");
        mapIdentityType.put(CMND, "Chứng minh nhân dân");
        mapIdentityType.put(PASSPORT, "Passport");
    }
}
