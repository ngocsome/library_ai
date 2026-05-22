package com.example.backend_spring.service;

import com.example.backend_spring.dto.group.CreateGroupRequest;
import com.example.backend_spring.dto.group.GroupChatResponse;
import com.example.backend_spring.dto.group.GroupResponse;
import com.example.backend_spring.dto.group.SendMessageRequest;
import com.example.backend_spring.entity.GroupChat;
import com.example.backend_spring.entity.GroupMember;
import com.example.backend_spring.entity.StudyGroup;
import com.example.backend_spring.entity.User;
import com.example.backend_spring.repository.GroupChatRepository;
import com.example.backend_spring.repository.GroupMemberRepository;
import com.example.backend_spring.repository.StudyGroupRepository;
import com.example.backend_spring.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final StudyGroupRepository studyGroupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final GroupChatRepository groupChatRepository;
    private final UserRepository userRepository;

    public List<GroupResponse> getGroups() {
        return studyGroupRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toGroupResponse)
                .toList();
    }

    public GroupResponse createGroup(CreateGroupRequest request, String username) {
        User user = getUserByUsername(username);

        StudyGroup group = StudyGroup.builder()
                .name(request.getName())
                .description(request.getDescription())
                .subject(request.getSubject())
                .createdBy(user)
                .memberCount(1)
                .build();

        StudyGroup savedGroup = studyGroupRepository.save(group);

        GroupMember member = GroupMember.builder()
                .group(savedGroup)
                .user(user)
                .build();

        groupMemberRepository.save(member);

        return toGroupResponse(savedGroup);
    }

    public Map<String, Object> joinGroup(Long groupId, String username) {
        User user = getUserByUsername(username);

        StudyGroup group = studyGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm"));

        boolean joined = groupMemberRepository.existsByGroupIdAndUserId(groupId, user.getId());

        if (joined) {
            return Map.of("message", "Bạn đã tham gia nhóm này rồi");
        }

        GroupMember member = GroupMember.builder()
                .group(group)
                .user(user)
                .build();

        groupMemberRepository.save(member);

        group.setMemberCount(group.getMemberCount() == null ? 1 : group.getMemberCount() + 1);
        studyGroupRepository.save(group);

        return Map.of("message", "Tham gia nhóm thành công");
    }

    public List<GroupChatResponse> getChats(Long groupId) {
        return groupChatRepository.findByGroupIdOrderByCreatedAtAsc(groupId)
                .stream()
                .map(this::toChatResponse)
                .toList();
    }

    public GroupChatResponse sendMessage(Long groupId, SendMessageRequest request, String username) {
        User user = getUserByUsername(username);

        StudyGroup group = studyGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm"));

        GroupChat chat = GroupChat.builder()
                .content(request.getContent())
                .group(group)
                .user(user)
                .build();

        GroupChat savedChat = groupChatRepository.save(chat);

        return toChatResponse(savedChat);
    }

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
    }

    private GroupResponse toGroupResponse(StudyGroup group) {
        Long createdById = group.getCreatedBy() != null ? group.getCreatedBy().getId() : null;
        String createdByName = group.getCreatedBy() != null ? group.getCreatedBy().getFullName() : "Ẩn danh";

        return GroupResponse.builder()
                .id(group.getId())
                .GroupID(group.getId())

                .name(group.getName())
                .Name(group.getName())

                .description(group.getDescription())
                .Description(group.getDescription())

                .subject(group.getSubject())
                .Subject(group.getSubject())

                .memberCount(group.getMemberCount())
                .MemberCount(group.getMemberCount())

                .createdById(createdById)
                .CreatedBy(createdById)

                .createdByName(createdByName)
                .CreatedByName(createdByName)

                .createdAt(group.getCreatedAt())
                .CreatedAt(group.getCreatedAt())
                .build();
    }

    private GroupChatResponse toChatResponse(GroupChat chat) {
        Long userId = chat.getUser() != null ? chat.getUser().getId() : null;
        String authorName = chat.getUser() != null ? chat.getUser().getFullName() : "Ẩn danh";

        return GroupChatResponse.builder()
                .id(chat.getId())
                .ChatID(chat.getId())

                .content(chat.getContent())
                .Content(chat.getContent())

                .groupId(chat.getGroup() != null ? chat.getGroup().getId() : null)
                .GroupID(chat.getGroup() != null ? chat.getGroup().getId() : null)

                .userId(userId)
                .UserID(userId)

                .authorName(authorName)
                .AuthorName(authorName)

                .createdAt(chat.getCreatedAt())
                .CreatedAt(chat.getCreatedAt())
                .build();
    }
}