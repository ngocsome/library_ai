package com.example.backend_spring.dto.group;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupResponse {

    private Long id;
    private Long GroupID;

    private String name;
    private String Name;

    private String description;
    private String Description;

    private String subject;
    private String Subject;

    private Integer memberCount;
    private Integer MemberCount;

    private Long createdById;
    private Long CreatedBy;

    private String createdByName;
    private String CreatedByName;

    private LocalDateTime createdAt;
    private LocalDateTime CreatedAt;
}