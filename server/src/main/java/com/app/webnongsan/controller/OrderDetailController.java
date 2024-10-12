package com.app.webnongsan.controller;

import com.app.webnongsan.domain.OrderDetail;
import com.app.webnongsan.domain.response.PaginationDTO;
import com.app.webnongsan.service.OrderDetailService;
import com.app.webnongsan.util.annotation.ApiMessage;
import com.app.webnongsan.util.exception.ResourceInvalidException;
import com.turkraft.springfilter.boot.Filter;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v2")
@AllArgsConstructor
public class OrderDetailController {
    private final OrderDetailService orderDetailService;

    @GetMapping("detailOrder/{id}")
    @ApiMessage("Get detail Order")
    public ResponseEntity<PaginationDTO> getAll(@Filter Specification<OrderDetail> spec){
        return ResponseEntity.ok(this.orderDetailService.getAll(spec));
    }
    
    public ResponseEntity<OrderDetail> get(@PathVariable("id") long id) throws ResourceInvalidException {
        if (!this.orderDetailService.checkValidOrderDetailId(id)){
            throw new ResourceInvalidException("Detail id = " + id + " không tồn tại");
        }
        return ResponseEntity.ok(this.orderDetailService.get(id));
    }
}
