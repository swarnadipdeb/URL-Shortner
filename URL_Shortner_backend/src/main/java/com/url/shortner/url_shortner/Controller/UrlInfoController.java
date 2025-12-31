package com.url.shortner.url_shortner.Controller;

import com.url.shortner.url_shortner.Entity.UrlInfoDto;
import com.url.shortner.url_shortner.Services.UrlInfoService;
import com.url.shortner.url_shortner.utils.requestDto;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.net.URL;

@Controller
@RequestMapping("/shorten")
@RequiredArgsConstructor
public class UrlInfoController {

    private final UrlInfoService urlInfoService;

    private boolean isValidUrl(String url) {
        try {
            new URL(url).toURI();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @PostMapping()
    public ResponseEntity createUrl(@RequestBody requestDto urlBody){
        if(!isValidUrl(urlBody.getUrl())){
            return  ResponseEntity.badRequest().body("Invalid URL");
        }
        try{
            UrlInfoDto urlDetails = urlInfoService.creteUrl(urlBody.getUrl());
            return ResponseEntity.ok().body(urlDetails);
        }catch (Exception e){
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/{shortCode}")
    public ResponseEntity getUrl(@PathVariable @NonNull String shortCode){
        try{
            UrlInfoDto urlDetails = urlInfoService.getUrl(shortCode);
            return ResponseEntity.ok().body(urlDetails);
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{shortCode}")
    public ResponseEntity updateUrl(@PathVariable @NonNull String shortCode, @RequestBody @NonNull requestDto urlBody){
        if(!isValidUrl(urlBody.getUrl())){
            return ResponseEntity.badRequest().body("Invalid URl");
        }
        try {
            return ResponseEntity.ok().body(urlInfoService.updateUrl(shortCode, urlBody.getUrl()));
        }catch (Exception e){
            if(e.getMessage().equals("Not found")){
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @DeleteMapping("/{shortCode}")
    public ResponseEntity deleteUrl(@PathVariable @NonNull String shortCode){
        try{
            urlInfoService.deleteUrl(shortCode);
            return ResponseEntity.noContent().build();
        }catch (Exception e){
            if(e.getMessage().equals("Not found")){
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/{shortCode}/stats")
    public ResponseEntity statusOfUrl(@PathVariable @NonNull String shortCode){
        try{
            return ResponseEntity.ok().body(urlInfoService.getStatsOfUrl(shortCode));
        }catch (Exception e){
            return ResponseEntity.notFound().build();
        }
    }
    }
