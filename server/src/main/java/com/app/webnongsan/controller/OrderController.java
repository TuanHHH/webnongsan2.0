package com.app.webnongsan.controller;
import com.app.webnongsan.domain.Order;
import com.app.webnongsan.domain.response.PaginationDTO;
import com.app.webnongsan.domain.response.order.OrderDTO;
import com.app.webnongsan.service.OrderService;
import com.app.webnongsan.util.exception.ResourceInvalidException;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.app.webnongsan.util.annotation.ApiMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import com.turkraft.springfilter.boot.Filter;

import java.util.Optional;

@RestController
@RequestMapping("api/v2")
@AllArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @GetMapping("orders")
    @ApiMessage("Get all Orders")
    public ResponseEntity<PaginationDTO> getAll(@Filter Specification<Order> spec, Pageable pageable){
        return ResponseEntity.ok(this.orderService.getAll(spec, pageable));
    }

    @GetMapping("orderInfo/{orderId}")
    @ApiMessage("Get order infor")
    public ResponseEntity<Optional<OrderDTO>> getOrderInfor(@PathVariable("orderId") long orderId){
        return ResponseEntity.ok(this.orderService.findOrder(orderId));
    }
}
