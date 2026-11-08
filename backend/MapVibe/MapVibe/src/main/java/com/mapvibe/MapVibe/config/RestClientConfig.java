package com.mapvibe.MapVibe.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    @Bean
    public RestClient mapVinaRestClient() {
        return RestClient.create();
    }
}
