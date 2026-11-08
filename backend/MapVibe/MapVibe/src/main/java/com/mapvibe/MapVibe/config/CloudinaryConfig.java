package com.mapvibe.MapVibe.config;

import com.cloudinary.Cloudinary;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @NonFinal
    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @NonFinal
    @Value("${cloudinary.api-key}")
    private String apiKey;

    @NonFinal
    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> config = new HashMap<>();

        config.put("cloud_name", cloudName);
        config.put("api_key", apiKey);
        config.put("api_secret", apiSecret);

        return new Cloudinary(config);
    }
}
