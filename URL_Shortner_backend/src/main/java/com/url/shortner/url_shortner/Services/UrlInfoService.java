package com.url.shortner.url_shortner.Services;


import com.url.shortner.url_shortner.Entity.UrlInfo;
import com.url.shortner.url_shortner.Entity.UrlInfoDto;
import com.url.shortner.url_shortner.repository.UrlInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UrlInfoService {

    private final UrlInfoRepository urlInfoRepository;

    private final CodeGeneratorService codeGeneratorService;

    public UrlInfoDto creteUrl(String URL) throws RuntimeException{

        String shortCode = codeGeneratorService.generateRandomCode();
        boolean isExist = urlInfoRepository.existsByshortCode(shortCode);

        int count = 0;

        while (isExist && count <= 5){
            shortCode = codeGeneratorService.generateRandomCode();
            isExist = urlInfoRepository.existsByshortCode(shortCode);
            count++;
        }
        if(count == 5) throw new RuntimeException("Internal Error(out of permutations)");

        try{
            UrlInfo urlDetails = urlInfoRepository.save(UrlInfo.builder().url(URL).shortCode(shortCode).accessCount(0L).build());
            return urlDetails.transformToUrlInfoDto();
        }catch (Exception e){
            throw new RuntimeException(e.getMessage());
        }

    }

    public UrlInfoDto getUrl(String shortCode) throws RuntimeException{

        try{
            UrlInfo urlDetails = urlInfoRepository.findByshortCode(shortCode).orElseThrow(() -> new RuntimeException("url does not exist"));
            urlDetails.setAccessCount(urlDetails.getAccessCount()+1);
            urlInfoRepository.save(urlDetails);
            return urlDetails.transformToUrlInfoDto();
        }catch (Exception e){
            throw new RuntimeException(e.getMessage());
        }

    }

    public UrlInfoDto updateUrl(String shortCode, String newUrl) throws RuntimeException {

        UrlInfo urlInfo = urlInfoRepository.findByshortCode(shortCode)
                .orElseThrow(() -> new RuntimeException("Not found"));

        urlInfo.setUrl(newUrl);   // update field

        return urlInfoRepository.save(urlInfo).transformToUrlInfoDto(); // update happens here
    }

    public boolean deleteUrl(String shortCode) throws RuntimeException {
        UrlInfo urlInfo = urlInfoRepository.findByshortCode(shortCode)
                .orElseThrow(() -> new RuntimeException("Not found"));

        urlInfoRepository.delete(urlInfo);
        return true;
    }

    public UrlInfo getStatsOfUrl(String shortCode) throws RuntimeException {

        return urlInfoRepository.findByshortCode(shortCode)
                .orElseThrow(() -> new RuntimeException("Not found"));


    }


}
