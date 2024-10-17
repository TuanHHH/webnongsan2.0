package com.app.webnongsan.domain.response.order;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Setter
@Getter
public class OrderDetailDTO {
    private Long orderId;

    private String productName;

    private int quantity;

    private Double unit_price;

    private String imageUrl;
}
