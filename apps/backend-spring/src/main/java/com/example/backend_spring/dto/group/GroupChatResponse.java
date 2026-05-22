package com.example.backend_spring.dto.group;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupChatResponse {

    private Long id;
    private Long ChatID;

    private String content;
    private String Content;

    private Long groupId;
    private Long GroupID;

    private Long userId;
    private Long UserID;

    private String authorName;
    private String AuthorName;

    private LocalDateTime createdAt;
    private LocalDateTime CreatedAt;
}