package com.app.webnongsan.controller;
import com.app.webnongsan.domain.Order;
import com.app.webnongsan.domain.OrderDetail;
import com.app.webnongsan.domain.Product;
import com.app.webnongsan.domain.response.PaginationDTO;
import com.app.webnongsan.domain.response.order.OrderDTO;
import com.app.webnongsan.service.OrderDetailService;
import com.app.webnongsan.service.OrderService;
import com.app.webnongsan.service.ProductService;
import com.app.webnongsan.util.exception.ResourceInvalidException;
import lombok.AllArgsConstructor;
import org.aspectj.weaver.ast.Or;
import org.springframework.web.bind.annotation.*;
import com.app.webnongsan.util.annotation.ApiMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import com.turkraft.springfilter.boot.Filter;

import java.util.List;
import java.time.Instant;
import java.util.Optional;

@RestController
@RequestMapping("api/v2")
@AllArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final OrderDetailService orderDetailService;
    private final ProductService productService;

    @GetMapping("orders")
    @ApiMessage("Get all Orders")
    public ResponseEntity<PaginationDTO> getAll(@Filter Specification<Order> spec, Pageable pageable){
        return ResponseEntity.ok(this.orderService.getAll(spec, pageable));
    }

    @GetMapping("orderInfo/{orderId}")
    @ApiMessage("Get order information")
    public ResponseEntity<Optional<OrderDTO>> getOrderInfor(@PathVariable("orderId") long orderId){
        return ResponseEntity.ok(this.orderService.findOrder(orderId));
    }

    @GetMapping("overviewOrder")
    @ApiMessage("Get order for overview page")
    public ResponseEntity<List<OrderDTO>> getLastFiveOrders(){
        return ResponseEntity.ok(this.orderService.getLastFiveOrders());
    }

    @GetMapping("updateOrderStatus/{orderId}")
    @ApiMessage("Update order status")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam("status") int status){

        Order order = this.orderService.get(orderId);
        order.setStatus(status);
        if (status == 2 || status == 3) {
            order.setDeliveryTime(Instant.now());
        }
        OrderDTO o = new OrderDTO();
        o.setId(orderId);
        o.setStatus(status);
        o.setOrderTime(order.getOrderTime());
        o.setDeliveryTime(order.getDeliveryTime());
        this.orderService.save((order));
        return ResponseEntity.ok(o);
        }
}
