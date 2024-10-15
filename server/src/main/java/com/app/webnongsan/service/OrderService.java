package com.app.webnongsan.service;

import com.app.webnongsan.domain.Order;
import com.app.webnongsan.domain.response.PaginationDTO;
import com.app.webnongsan.domain.response.order.OrderDTO;
import com.app.webnongsan.repository.OrderRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;

    public Order create(Order order){
        return this.orderRepository.save(order);
    }
    public void delete (long id){ this.orderRepository.deleteById(id);}

    public void disable(long id) {
        Optional<Order> userOrder = this.orderRepository.findById(id);
        userOrder.ifPresent(order -> {
            order.setStatus(1);
            this.orderRepository.save(order); // Lưu lại thay đổi
        });
    }

    public Optional<OrderDTO> findOrder(long id){
        OrderDTO res = new OrderDTO();
        Optional<Order> orderOptional = this.orderRepository.findById(id);
        if (orderOptional.isPresent()) {
            Order order = orderOptional.get();
            res.setId(order.getId());
            res.setOrderTime(order.getOrderTime());
            res.setDeliveryTime(order.getDeliveryTime());
            res.setStatus(order.getStatus());
            res.setPaymentMethod(order.getPaymentMethod());
            res.setAddress(order.getAddress());
            res.setTotal_price(order.getTotal_price()); // Chú ý: có thể cần sửa lại tên phương thức
            res.setUserEmail(order.getUser().getEmail());
            return Optional.of(res);
        } else {
            return Optional.empty();
        }
    }

    public PaginationDTO getAll(Specification<Order> spec, Pageable pageable){
        Page<Order> ordersPage = this.orderRepository.findAll(spec, pageable);

        PaginationDTO p = new PaginationDTO();
        PaginationDTO.Meta meta = new PaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(ordersPage.getTotalPages());
        meta.setTotal(ordersPage.getTotalElements());

        p.setMeta(meta);

        List<OrderDTO> listOrders = ordersPage.getContent().stream().map(this::convertToOrderDTO).toList();
        p.setResult(listOrders);
        return p;
    }
    public OrderDTO convertToOrderDTO(Order order) {
        OrderDTO res = new OrderDTO();
        res.setId(order.getId());
        res.setOrderTime(order.getOrderTime()); // Giả sử Order có thuộc tính orderTime
        res.setDeliveryTime(order.getDeliveryTime()); // Giả sử Order có thuộc tính deliveryTime
        res.setStatus(order.getStatus()); // Giả sử Order có thuộc tính status
        res.setPaymentMethod(order.getPaymentMethod()); // Giả sử Order có thuộc tính paymentMethod
        res.setAddress(order.getAddress()); // Giả sử Order có thuộc tính address
        res.setTotal_price(order.getTotal_price()); // Giả sử Order có thuộc tính totalPrice
        res.setUserEmail(order.getUser().getEmail()); // Giả sử Order có thuộc tính userEmail
        return res;
    }
}
