package com.taskflow.config;

import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import java.net.URI;

@Configuration
public class DatabaseConfig {

    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource")
    public DataSourceProperties dataSourceProperties() {
        DataSourceProperties properties = new DataSourceProperties();
        
        String databaseUrl = System.getenv("DATABASE_URL");
        if (databaseUrl != null && !databaseUrl.isEmpty()) {
            try {
                URI dbUri = new URI(databaseUrl);
                
                String username = dbUri.getUserInfo().split(":")[0];
                String password = dbUri.getUserInfo().split(":")[1];
                String host = dbUri.getHost();
                int port = dbUri.getPort() == -1 ? 5432 : dbUri.getPort();
                String database = dbUri.getPath().replaceFirst("/", "");
                
                String jdbcUrl = String.format("jdbc:postgresql://%s:%d/%s", host, port, database);
                String query = dbUri.getQuery();
                if (query != null && !query.isEmpty()) {
                    jdbcUrl += "?" + query;
                }
                
                properties.setUrl(jdbcUrl);
                properties.setUsername(username);
                properties.setPassword(password);
            } catch (Exception e) {
                System.err.println("Error parsing DATABASE_URL: " + e.getMessage());
            }
        }
        
        return properties;
    }
}
