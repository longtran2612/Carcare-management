package iuh.nhom7.khoa_luan_backend.exception;

public class ErrorCode {

    // Account
    public static final String ACCOUNT_NOT_FOUND = "ACCOUNT_NOT_FOUND";
    public static final String ACCOUNT_EXISTED = "ACCOUNT_EXISTED";
    public static final String LOGIN_FAILED = "LOGIN_FAILED";

    public static final String OLD_PASSWORD_NOT_CORRECT = "OLD_PASSWORD_NOT_CORRECT";

    public static final String INVALID_REFRESH_TOKEN_REQUEST = "INVALID_REFRESH_TOKEN_REQUEST";

    // User
    public static final String USER_NOT_FOUND = "USER_NOT_FOUND";
    public static final String USER_IS_EXECUTING = "USER_IS_EXECUTING";

    // Customer
    public static final String CUSTOMER_EXISTED = "CUSTOMER_EXISTED";
    public static final String CUSTOMER_NOT_FOUND = "CUSTOMER_NOT_FOUND";

    // Order
    public static final String ORDER_NOT_FOUND = "ORDER_NOT_FOUND";
    public static final String ORDER_CREATED_BILL = "ORDER_CREATED_BILL";
    public static final String EXISTED_PENDING_ORDER = "EXISTED_PENDING_ORDER";
    public static final String EXISTED_EXECUTING_ORDER = "EXISTED_EXECUTING_ORDER";

    public static final String EXISTED_EXECUTING_ORDER_CAR = "EXISTED_EXECUTING_ORDER_CAR";
    public static final String EXECUTOR_NOT_FOUND = "EXECUTOR_NOT_FOUND";
    public static final String EXECUTED_ORDER_CAN_NOT_UPDATE = "EXECUTED_ORDER_CAN_NOT_UPDATE";

    // CarCareService
    public static final String SERVICE_NOT_FOUND = "SERVICE_NOT_FOUND";
    public static final String SERVICE_PRICE_NULL = "SERVICE_PRICE_NULL";
    public static final String SERVICE_PRICE_NOT_FOUND = "SERVICE_PRICE_NOT_FOUND";

    // CarCareCategory
    public static final String CATEGORY_NOT_FOUND = "CATEGORY_NOT_FOUND";

    // Price Header
    public static final String PRICE_HEADER_NOT_FOUND = "PRICE_HEADER_NOT_FOUND";
    public static final String PRICE_HEADER_EXPIRED_OR_NOT_YET_EFFECTIVE = "PRICE_HEADER_EXPIRED_OR_NOT_YET_EFFECTIVE";
    public static final String PRICE_HEADER_EFFECTIVE_TIME_DUPLICATE = "PRICE_HEADER_EFFECTIVE_TIME_DUPLICATE";
    public static final String PRICE_HEADER_HAVE_NO_PRICE = "PRICE_HEADER_HAVE_NO_PRICE";

    // Price
    public static final String PRICE_HEADER_CONTAINS_SERVICE_PRICE = "PRICE_HEADER_CONTAINS_SERVICE_PRICE";
    public static final String PRICE_HEADER_CONTAINS_DUPLICATE_SERVICE_PRICE_ACTIVE = "PRICE_HEADER_CONTAINS_DUPLICATE_SERVICE_PRICE_ACTIVE";
    public static final String PRICE_CONTAINS_DUPLICATE_SERVICE_PRICE_ACTIVE = "PRICE_CONTAINS_DUPLICATE_SERVICE_PRICE_ACTIVE";


    // Car
    public static final String CAR_NOT_FOUND = "CAR_NOT_FOUND";

    // Car Model
    public static final String CAR_MODEL_NOT_FOUND = "CAR_MODEL_NOT_FOUND";

    // Car Slot
    public static final String CAR_SLOT_NOT_FOUND = "CAR_SLOT_NOT_FOUND";
    public static final String CAR_SLOT_ORDER_NOT_MATCH = "CAR_SLOT_ORDER_NOT_MATCH";
    public static final String ORDER_EXECUTED_OR_DISABLED = "ORDER_EXECUTED_OR_DISABLED";
    public static final String ORDER_NOT_EXECUTING = "ORDER_NOT_EXECUTING";

    // Promotion Header
    public static final String PROMOTION_HEADER_NOT_FOUND = "PROMOTION_HEADER_NOT_FOUND";
    public static final String PROMOTION_HEADER_CODE_EXIST = "PROMOTION_HEADER_CODE_EXIST";
    public static final String PROMOTION_HEADER_TERM_INVALID = "PROMOTION_HEADER_TERM_INVALID";
    public static final String PROMOTION_TO_DATE_BEFORE_NOW = "PROMOTION_TO_DATE_BEFORE_NOW";
    public static final String PROMOTION_FROM_DATE_BEFORE_NOW = "PROMOTION_FROM_DATE_BEFORE_NOW";
    public static final String CAN_NOT_UPDATE_FROM_DATE_AFTER_STARTED = "CAN_NOT_UPDATE_FROM_DATE_AFTER_STARTED";
    public static final String PROMOTION_TO_DATE_AFTER_NOW = "PROMOTION_TO_DATE_AFTER_NOW";
    public static final String PROMOTION_FROM_DATE_AFTER_NOW = "PROMOTION_FROM_DATE_AFTER_NOW";

    // Promotion Line
    public static final String PROMOTION_LINE_NOT_FOUND = "PROMOTION_LINE_NOT_FOUND";
    public static final String PROMOTION_LINE_CODE_EXIST = "PROMOTION_LINE_CODE_EXIST";
    public static final String PROMOTION_LINE_TERM_INVALID = "PROMOTION_LINE_TERM_INVALID";

    // Promotion Detail
    public static final String PROMOTION_DETAIL_NOT_FOUND = "PROMOTION_DETAIL_NOT_FOUND";
    public static final String PROMOTION_DETAIL_CODE_EXIST = "PROMOTION_DETAIL_CODE_EXIST";
    public static final String PROMOTION_LINE_ALREADY_HAS_DETAIL = "PROMOTION_LINE_ALREADY_HAS_DETAIL";
    public static final String PROMOTION_DETAIL_LIMIT_AMOUNT_NOT_VALID = "PROMOTION_DETAIL_LIMIT_AMOUNT_NOT_VALID";
    public static final String LIMIT_AMOUNT_LOWER_THAN_MAXIMUM_DISCOUNT = "LIMIT_AMOUNT_LOWER_THAN_MAXIMUM_DISCOUNT";



    // Bill
    public static final String BILL_NOT_FOUND = "BILL_NOT_FOUND";
    public static final String PROMOTION_AMOUNT_NOT_MATCH = "PROMOTION_AMOUNT_NOT_MATCH";
    public static final String ORDER_NOT_EXECUTED_YET = "ORDER_NOT_EXECUTED_YET";
    public static final String PAYMENT_AMOUNT_NOT_MATCH = "PAYMENT_AMOUNT_NOT_MATCH";

    // Validate
    public static final String IDENTITY_NUMBER_EMPTY = "IDENTITY_NUMBER_EMPTY";
    public static final String PHONE_NUMBER_EMPTY = "PHONE_NUMBER_EMPTY";

    //System
    public static final String UPLOAD_ERROR = "UPLOAD_ERROR";
    public static final String EXPORT_ERROR = "EXPORT_ERROR";
    public static final String FROM_DATE_NULL = "FROM_DATE_NULL";
    public static final String TO_DATE_NULL = "TO_DATE_NULL";
}
