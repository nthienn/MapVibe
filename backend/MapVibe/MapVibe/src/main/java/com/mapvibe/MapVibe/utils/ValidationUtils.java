package com.mapvibe.MapVibe.utils;

import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.lang.reflect.Field;

public final class ValidationUtils {
    private ValidationUtils() {
    }

    public static FieldError getFirstFieldError(BindingResult bindingResult, Class<?> dtoClass) {

        for (Field field : dtoClass.getDeclaredFields()) {

            FieldError error = bindingResult.getFieldError(field.getName());

            if (error != null) {
                return error;
            }
        }

        return bindingResult.getFieldError();
    }
}
