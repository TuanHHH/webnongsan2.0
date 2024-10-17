package com.app.webnongsan.domain.response.order;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OrderDTO {
    private Long userId;
    private String address;
    private String paymentMethod;
    private Double totalPrice;
    private List<OrderDetailDTO> items;
}
