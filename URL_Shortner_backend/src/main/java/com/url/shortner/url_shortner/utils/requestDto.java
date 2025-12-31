package com.url.shortner.url_shortner.utils;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Getter
@Setter
public class requestDto {

    @JsonProperty("url")
    @NonNull
    private String url;
}
