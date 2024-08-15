package chemical_ordering_system.exception;

import chemical_ordering_system.enums.ErrorEnum;
import lombok.Getter;

@Getter
public class BusinessException extends Exception {

    private final ErrorEnum errorEnum;

    public BusinessException(ErrorEnum errorEnum) {
        super(errorEnum.getErrorMessage());
        this.errorEnum = errorEnum;
    }

    public BusinessException(ErrorEnum errorEnum, String message) {
        super(message);
        this.errorEnum = errorEnum;
    }

    public BusinessException(ErrorEnum errorEnum, String message, Throwable cause) {
        super(message, cause);
        this.errorEnum = errorEnum;
    }

    public BusinessException(ErrorEnum errorEnum, Throwable cause) {
        super(errorEnum.getErrorMessage(), cause);
        this.errorEnum = errorEnum;
    }

    public int getErrorCode() {
        return errorEnum.getCode();
    }
}
