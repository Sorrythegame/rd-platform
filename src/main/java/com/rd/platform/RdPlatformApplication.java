package com.rd.platform;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.rd.platform.mapper")
public class RdPlatformApplication {
    public static void main(String[] args) {
        SpringApplication.run(RdPlatformApplication.class, args);
    }
}