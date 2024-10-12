package com.app.webnongsan.service;
import com.app.webnongsan.repository.OrderDetailRepository;
import com.app.webnongsan.domain.OrderDetail;
import com.app.webnongsan.domain.response.PaginationDTO;
import com.app.webnongsan.domain.response.order.OrderDetailDTO;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class OrderDetailService {
    private final OrderDetailRepository orderDetailRepository;
    public boolean checkValidOrderDetailId(Long id){
        return this.orderDetailRepository.existsById(id);
    }
    public OrderDetail get(long id){
        return this.orderDetailRepository.findById(id).orElse(null);
    }
    public PaginationDTO getAll(Specification<OrderDetail> spec){
        Pageable pageable = PageRequest.of(0, Integer.MAX_VALUE); // Lấy tất cả
        Page<OrderDetail> orderDetailsPage = this.orderDetailRepository.findAll(spec, pageable);

        PaginationDTO p = new PaginationDTO();
        PaginationDTO.Meta meta = new PaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(orderDetailsPage.getTotalPages());
        meta.setTotal(orderDetailsPage.getTotalElements());

        p.setMeta(meta);

        List<OrderDetailDTO> listOrderDetail = orderDetailsPage.getContent().stream().map(this::convertToOrderDetailDTO).toList();
        p.setResult(listOrderDetail);
        return p;
    }
    public OrderDetailDTO convertToOrderDetailDTO(OrderDetail orderDetail) {
        OrderDetailDTO res = new OrderDetailDTO();
        res.setOrderId(orderDetail.getOrder().getId());
        res.setQuantity(orderDetail.getQuantity());
        res.setProductName(orderDetail.getProduct().getProduct_name());
        res.setUnit_price(orderDetail.getUnit_price());

        return res;
    }
}
