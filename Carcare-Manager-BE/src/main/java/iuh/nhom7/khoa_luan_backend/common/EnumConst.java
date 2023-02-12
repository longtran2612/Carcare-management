package iuh.nhom7.khoa_luan_backend.common;


public class EnumConst {
    public enum Role {
        ROLE_USER,
        ROLE_ADMIN,
        ROLE_CUSTOMER
    }

    public enum ServiceType {
        SERVICE,
        PRODUCT
    }
    public enum Status {
        ACTIVE,
        INACTIVE
    }

    public enum CarSlotStatus {
        AVAILABLE,
        BOOKED,
        IN_USE
    }

}