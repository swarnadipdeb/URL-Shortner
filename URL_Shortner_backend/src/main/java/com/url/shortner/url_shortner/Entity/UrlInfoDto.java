package com.url.shortner.url_shortner.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import org.springframework.data.annotation.LastModifiedDate;

import java.time.Instant;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class UrlInfoDto {

        @JsonProperty("short_code")
        @NonNull
        private String shortCode;

        @JsonProperty("url")
        @NonNull
        private String url;

        @CreatedDate
        @NonNull
        private Instant createdAt;

        @LastModifiedDate
        @NonNull
        private Instant updatedAt;

}
