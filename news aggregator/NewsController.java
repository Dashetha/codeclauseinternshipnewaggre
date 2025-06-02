package com.newsaggregator.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/news")
@CrossOrigin(origins = "*")
public class NewsController {

    @Value("${news.api.key}")
    private String apiKey;

    private final String BASE_URL = "https://newsapi.org/v2";
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping("/headlines")
    public ResponseEntity<?> getTopHeadlines(
            @RequestParam(defaultValue = "us") String country,
            @RequestParam(required = false) String category) {
        
        try {
            StringBuilder url = new StringBuilder(BASE_URL + "/top-headlines");
            url.append("?country=").append(country);
            url.append("&apiKey=").append(apiKey);
            
            if (category != null && !category.isEmpty()) {
                url.append("&category=").append(category);
            }
            
            System.out.println("Requesting: " + url.toString().replace(apiKey, "API_KEY_HIDDEN"));
            String response = restTemplate.getForObject(url.toString(), String.class);
            System.out.println("Response received: " + response.substring(0, Math.min(100, response.length())) + "...");
            JsonNode jsonNode = objectMapper.readTree(response);
            
            return ResponseEntity.ok(jsonNode);
            
        } catch (Exception e) {
            System.err.println("Error fetching headlines: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Internal server error");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchNews(
            @RequestParam String query,
            @RequestParam(defaultValue = "publishedAt") String sortBy) {
        
        try {
            String url = BASE_URL + "/everything?q=" + query + 
                        "&sortBy=" + sortBy + 
                        "&apiKey=" + apiKey;
            
            String response = restTemplate.getForObject(url, String.class);
            JsonNode jsonNode = objectMapper.readTree(response);
            
            return ResponseEntity.ok(jsonNode);
            
        } catch (HttpClientErrorException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to search news");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(e.getStatusCode()).body(errorResponse);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Internal server error");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
