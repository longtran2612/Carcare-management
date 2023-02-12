package iuh.nhom7.khoa_luan_backend.annotations.validator.impls;

import iuh.nhom7.khoa_luan_backend.annotations.validator.ValuesAllowed;
import iuh.nhom7.khoa_luan_backend.common.Extensions;
import lombok.experimental.ExtensionMethod;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Arrays;
import java.util.List;



@ExtensionMethod(Extensions.class)
public class ValuesAllowedValidator implements ConstraintValidator<ValuesAllowed, String> {

    private List<String> expectedValues;
    private String returnMessage;

    @Override
    public void initialize(ValuesAllowed requiredIfChecked) {
        expectedValues = Arrays.asList(requiredIfChecked.values());
        returnMessage = requiredIfChecked.message().concat(" " + expectedValues);
    }

    @Override
    public boolean isValid(String testValue, ConstraintValidatorContext context) {
        if (testValue.isBlankOrNull()) {
            return true;
        }
        boolean valid = expectedValues.contains(testValue);

        if (!valid) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(returnMessage)
                    .addConstraintViolation();
        }
        return valid;
    }
}
