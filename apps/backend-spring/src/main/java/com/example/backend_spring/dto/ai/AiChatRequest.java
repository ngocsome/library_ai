package com.example.backend_spring.dto.ai;

import lombok.Data;

@Data
public class AiChatRequest {
    private String message;
    private String conversationId;
}