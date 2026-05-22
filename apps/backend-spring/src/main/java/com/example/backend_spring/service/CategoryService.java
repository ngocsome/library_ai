package com.example.backend_spring.service;

import com.example.backend_spring.dto.category.CategoryResponse;
import com.example.backend_spring.entity.Category;
import com.example.backend_spring.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private CategoryResponse toResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .CategoryID(category.getId())
                .name(category.getName())
                .CategoryName(category.getName())
                .description(category.getDescription())
                .Description(category.getDescription())
                .icon(category.getIcon())
                .Icon(category.getIcon())
                .build();
    }
}