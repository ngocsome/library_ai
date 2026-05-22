package com.example.backend_spring.dto.forum;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ForumPostResponse {

    private Long id;
    private Long PostID;

    private String title;
    private String Title;

    private String content;
    private String Content;

    private Integer viewCount;
    private Integer ViewCount;

    private Integer likeCount;
    private Integer LikeCount;

    private Boolean liked;
    private Boolean Liked;

    private Long categoryId;
    private Long CategoryID;

    private String categoryName;
    private String CategoryName;

    private Long userId;
    private Long UserID;

    private String authorName;
    private String AuthorName;

    private LocalDateTime createdAt;
    private LocalDateTime CreatedAt;

    private List<ForumCommentResponse> comments;
    private List<ForumCommentResponse> Comments;
}