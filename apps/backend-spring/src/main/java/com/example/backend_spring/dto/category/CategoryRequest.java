package com.example.backend_spring.dto.category;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryRequest {

    private String name;

    private String description;

    private String icon;
}