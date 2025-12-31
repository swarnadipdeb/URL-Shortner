package com.url.shortner.url_shortner.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.annotation.Nonnull;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@Document(collection = "url_info")
public class UrlInfo {

    @Id
    private String id;

    @JsonProperty("short_code")
    @NonNull
    private String shortCode;

    @JsonProperty("url")
    @NonNull
    private String url;

    @Nonnull
    private Long accessCount;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;


    public UrlInfoDto transformToUrlInfoDto()
    {
        return UrlInfoDto.builder().
                url(url).
                shortCode(shortCode).
                createdAt(createdAt).
                updatedAt(updatedAt).
                build();

    }

}
