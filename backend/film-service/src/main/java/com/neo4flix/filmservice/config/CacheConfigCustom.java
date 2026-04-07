package com.neo4flix.filmservice.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;

/**
 * Cache configuration with fallback to in-memory cache if Redis is unavailable.
 * This prevents service failures due to Redis connection issues.
 */
@Configuration
@EnableCaching
@Slf4j
public class CacheConfigCustom {

    @Bean
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        try {
            log.info("Attempting to connect to Redis cache");
            // Test the connection
            connectionFactory.getConnection().close();
            log.info("Redis cache is available, using RedisCacheManager");
            return RedisCacheManager.create(connectionFactory);
        } catch (Exception e) {
            log.warn("Redis cache is not available, falling back to in-memory cache", e);
            return new ConcurrentMapCacheManager("movies", "films");
        }
    }
}


