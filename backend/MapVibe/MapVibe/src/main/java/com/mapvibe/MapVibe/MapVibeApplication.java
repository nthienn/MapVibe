package com.mapvibe.MapVibe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class MapVibeApplication {

    public static void main(String[] args) {
        SpringApplication.run(MapVibeApplication.class, args);
    }

}
