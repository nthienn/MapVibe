package com.mapvibe.MapVibe.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "mapvina")
public class MapVinaProperties {

    private String apiKey;
    private String searchUrl;
}
