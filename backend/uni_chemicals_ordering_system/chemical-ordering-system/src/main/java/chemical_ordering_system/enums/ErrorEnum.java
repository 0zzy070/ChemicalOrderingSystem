package chemical_ordering_system.enums;

import lombok.Getter;

@Getter
public enum ErrorEnum {

    INVALID_INPUT(400, "Invalid input provided"),
    INTERNAL_SERVER_ERROR(500, "Internal Server Error"),
    AUTHENTICATION_FAILED(403, "Authentication failed"),
    DATA_NOT_EXIST(404, "Data not exist"),
    OPERATION_NOT_ALLOWED(600, "Operation not permitted");;

    private final int code;
    private final String errorMessage;

    ErrorEnum(int code, String errorMessage) {
        this.code = code;
        this.errorMessage = errorMessage;
    }
}
