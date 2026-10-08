package com.sunuxam;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;


@SpringBootApplication
@ConfigurationPropertiesScan
public class ApplicationSunuXam {

    public static void main(String[] args) {
        SpringApplication.run(ApplicationSunuXam.class, args);
    }
}
