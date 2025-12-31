package com.url.shortner.url_shortner.Services;

import org.springframework.stereotype.Service;

import java.util.concurrent.ThreadLocalRandom;

@Service
public class CodeGeneratorService {

    public String generateRandomCode() {
        StringBuilder sb = new StringBuilder(6);
        ThreadLocalRandom random = ThreadLocalRandom.current();

        // first 3 letters (a-z)
        for (int i = 0; i < 3; i++) {
            char letter = (char) ('a' + random.nextInt(26));
            sb.append(letter);
        }

        // last 3 digits (0-9)
        for (int i = 0; i < 3; i++) {
            sb.append(random.nextInt(10));
        }

        return sb.toString();
    }
}