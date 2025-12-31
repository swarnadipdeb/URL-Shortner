package com.url.shortner.url_shortner.repository;

import com.url.shortner.url_shortner.Entity.UrlInfo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
 public interface UrlInfoRepository
            extends MongoRepository<UrlInfo, Long> {

        // custom queries (optional)
        boolean existsByshortCode(String shortCode);

        Optional<UrlInfo> findByshortCode(String shortCode);
    }

