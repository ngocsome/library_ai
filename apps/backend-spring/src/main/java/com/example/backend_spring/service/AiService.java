package com.example.backend_spring.service;

import com.example.backend_spring.dto.ai.AiChatRequest;
import com.example.backend_spring.dto.ai.AiChatResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class AiService {

    private static final String AI_SERVICE_URL = "http://localhost:8000/api/chat";

    private final RestTemplate restTemplate = new RestTemplate();

    public AiChatResponse chat(AiChatRequest request) {
        try {
            Map<String, Object> body = new HashMap<>();
            body.put("message", request.getMessage());
            body.put("conversationId", request.getConversationId() == null ? "" : request.getConversationId());

            Map response = restTemplate.postForObject(AI_SERVICE_URL, body, Map.class);

            if (response == null) {
                return new AiChatResponse(
                        "AI service không trả về dữ liệu.",
                        request.getConversationId()
                );
            }

            String message = response.get("message") != null
                    ? response.get("message").toString()
                    : "AI không có phản hồi.";

            String conversationId = response.get("conversationId") != null
                    ? response.get("conversationId").toString()
                    : request.getConversationId();

            return new AiChatResponse(message, conversationId);

        } catch (Exception e) {
            return new AiChatResponse(
                    "Không kết nối được AI service. Hãy kiểm tra FastAPI ở port 8000 đã chạy chưa.",
                    request.getConversationId()
            );
        }
    }
}