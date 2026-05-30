package com.example.backend_spring.controller;

import com.example.backend_spring.dto.ai.AiChatRequest;
import com.example.backend_spring.dto.ai.AiChatResponse;
import com.example.backend_spring.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody AiChatRequest request) {
        if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "Vui lòng nhập câu hỏi.")
            );
        }

        AiChatResponse response = aiService.chat(request);
        return ResponseEntity.ok(response);
    }
}