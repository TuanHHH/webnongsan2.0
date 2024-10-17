package com.app.webnongsan.domain.response.order;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@AllArgsConstructor
public class OrderDetailDTO {
    private long productId;
    private String productName;
    private int quantity;
    private Double productPrice;
    private String imageUrl;
    private String category;

    private long orderId;
    private Instant orderTime;
    private int status;
}
