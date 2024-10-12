package com.app.webnongsan.domain.response.order;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class OrderDetailDTO {
    private Long orderId;

    private String productName;

    private int quantity;

    private Double unit_price;
}
