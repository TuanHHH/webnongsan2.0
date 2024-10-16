package com.app.webnongsan.domain.response.product;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SearchProductDTO {
    private long id;
    private String product_name;
    private double price;
    private String imageUrl;
}
