package com.example.backend_spring.service;

import com.example.backend_spring.dto.forum.*;
import com.example.backend_spring.entity.ForumCategory;
import com.example.backend_spring.entity.ForumComment;
import com.example.backend_spring.entity.ForumPost;
import com.example.backend_spring.entity.ForumPostLike;
import com.example.backend_spring.entity.User;
import com.example.backend_spring.repository.ForumCategoryRepository;
import com.example.backend_spring.repository.ForumCommentRepository;
import com.example.backend_spring.repository.ForumPostLikeRepository;
import com.example.backend_spring.repository.ForumPostRepository;
import com.example.backend_spring.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ForumService {

    private final ForumCategoryRepository forumCategoryRepository;
    private final ForumPostRepository forumPostRepository;
    private final ForumCommentRepository forumCommentRepository;
    private final ForumPostLikeRepository forumPostLikeRepository;
    private final UserRepository userRepository;

    public List<ForumCategoryResponse> getCategories() {
        return forumCategoryRepository.findAll()
                .stream()
                .map(this::toCategoryResponse)
                .toList();
    }

    public List<ForumPostResponse> getPosts(Long categoryId) {
        List<ForumPost> posts;

        if (categoryId != null) {
            posts = forumPostRepository.findByCategoryIdOrderByCreatedAtDesc(categoryId);
        } else {
            posts = forumPostRepository.findAllByOrderByCreatedAtDesc();
        }

        return posts.stream()
                .map(post -> toPostResponse(post, false, false))
                .toList();
    }

    public ForumPostResponse getPostById(Long id, String username) {
        ForumPost post = forumPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết"));

        post.setViewCount(post.getViewCount() == null ? 1 : post.getViewCount() + 1);
        forumPostRepository.save(post);

        boolean liked = false;

        if (username != null && !username.isBlank()) {
            User user = getUserByUsername(username);
            liked = forumPostLikeRepository.existsByPostIdAndUserId(id, user.getId());
        }

        return toPostResponse(post, true, liked);
    }

    public ForumPostResponse createPost(CreatePostRequest request, String username) {
        User user = getUserByUsername(username);

        ForumCategory category = null;
        if (request.getCategoryId() != null) {
            category = forumCategoryRepository.findById(request.getCategoryId())
                    .orElse(null);
        }

        ForumPost post = ForumPost.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .category(category)
                .user(user)
                .viewCount(0)
                .likeCount(0)
                .build();

        ForumPost savedPost = forumPostRepository.save(post);

        return toPostResponse(savedPost, true, false);
    }

    public ForumCommentResponse addComment(Long postId, CreateCommentRequest request, String username) {
        User user = getUserByUsername(username);

        ForumPost post = forumPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết"));

        ForumComment comment = ForumComment.builder()
                .content(request.getContent())
                .parentId(request.getParentId())
                .post(post)
                .user(user)
                .build();

        ForumComment savedComment = forumCommentRepository.save(comment);

        return toCommentResponse(savedComment);
    }

    public Map<String, Object> likePost(Long postId, String username) {
        User user = getUserByUsername(username);

        ForumPost post = forumPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết"));

        boolean liked = forumPostLikeRepository.existsByPostIdAndUserId(postId, user.getId());

        if (liked) {
            return Map.of(
                    "message", "Bạn đã thích bài viết này rồi",
                    "liked", true,
                    "likeCount", post.getLikeCount() == null ? 0 : post.getLikeCount()
            );
        }

        ForumPostLike like = ForumPostLike.builder()
                .post(post)
                .user(user)
                .build();

        forumPostLikeRepository.save(like);

        post.setLikeCount(post.getLikeCount() == null ? 1 : post.getLikeCount() + 1);
        forumPostRepository.save(post);

        return Map.of(
                "message", "Đã thích bài viết",
                "liked", true,
                "likeCount", post.getLikeCount()
        );
    }

    public Map<String, Object> unlikePost(Long postId, String username) {
        User user = getUserByUsername(username);

        ForumPost post = forumPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết"));

        ForumPostLike like = forumPostLikeRepository.findByPostIdAndUserId(postId, user.getId())
                .orElseThrow(() -> new RuntimeException("Bạn chưa thích bài viết này"));

        forumPostLikeRepository.delete(like);

        int currentLikeCount = post.getLikeCount() == null ? 0 : post.getLikeCount();
        post.setLikeCount(Math.max(0, currentLikeCount - 1));
        forumPostRepository.save(post);

        return Map.of(
                "message", "Đã bỏ thích bài viết",
                "liked", false,
                "likeCount", post.getLikeCount()
        );
    }

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
    }

    private ForumCategoryResponse toCategoryResponse(ForumCategory category) {
        return ForumCategoryResponse.builder()
                .id(category.getId())
                .CategoryID(category.getId())
                .name(category.getName())
                .Name(category.getName())
                .description(category.getDescription())
                .Description(category.getDescription())
                .color(category.getColor())
                .Color(category.getColor())
                .build();
    }

    private ForumPostResponse toPostResponse(ForumPost post, boolean includeComments, boolean liked) {
        Long categoryId = post.getCategory() != null ? post.getCategory().getId() : null;
        String categoryName = post.getCategory() != null ? post.getCategory().getName() : "Chung";

        Long userId = post.getUser() != null ? post.getUser().getId() : null;
        String authorName = post.getUser() != null ? post.getUser().getFullName() : "Ẩn danh";

        List<ForumCommentResponse> comments = List.of();

        if (includeComments) {
            comments = forumCommentRepository.findByPostIdOrderByCreatedAtAsc(post.getId())
                    .stream()
                    .map(this::toCommentResponse)
                    .toList();
        }

        return ForumPostResponse.builder()
                .id(post.getId())
                .PostID(post.getId())

                .title(post.getTitle())
                .Title(post.getTitle())

                .content(post.getContent())
                .Content(post.getContent())

                .viewCount(post.getViewCount())
                .ViewCount(post.getViewCount())

                .likeCount(post.getLikeCount())
                .LikeCount(post.getLikeCount())

                .liked(liked)
                .Liked(liked)

                .categoryId(categoryId)
                .CategoryID(categoryId)

                .categoryName(categoryName)
                .CategoryName(categoryName)

                .userId(userId)
                .UserID(userId)

                .authorName(authorName)
                .AuthorName(authorName)

                .createdAt(post.getCreatedAt())
                .CreatedAt(post.getCreatedAt())

                .comments(comments)
                .Comments(comments)
                .build();
    }

    private ForumCommentResponse toCommentResponse(ForumComment comment) {
        Long userId = comment.getUser() != null ? comment.getUser().getId() : null;
        String authorName = comment.getUser() != null ? comment.getUser().getFullName() : "Ẩn danh";

        return ForumCommentResponse.builder()
                .id(comment.getId())
                .CommentID(comment.getId())
                .content(comment.getContent())
                .Content(comment.getContent())
                .userId(userId)
                .UserID(userId)
                .authorName(authorName)
                .AuthorName(authorName)
                .parentId(comment.getParentId())
                .ParentID(comment.getParentId())
                .createdAt(comment.getCreatedAt())
                .CreatedAt(comment.getCreatedAt())
                .build();
    }
}