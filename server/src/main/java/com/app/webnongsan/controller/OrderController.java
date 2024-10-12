package com.app.webnongsan.controller;
import com.app.webnongsan.domain.Order;
import com.app.webnongsan.domain.Product;
import com.app.webnongsan.domain.response.PaginationDTO;
import com.app.webnongsan.service.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.app.webnongsan.util.annotation.ApiMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.turkraft.springfilter.boot.Filter;
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
}
