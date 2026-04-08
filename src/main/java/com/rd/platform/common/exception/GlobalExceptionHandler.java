package com.rd.platform.common.exception;

import com.rd.platform.common.result.Result;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

// 全局异常捕获，生产级必备
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)
    public Result<?> handleAllException(Exception e) {
        return Result.error(e.getMessage());
    }
}