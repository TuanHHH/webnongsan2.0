package com.app.webnongsan.service;

import com.app.webnongsan.domain.Order;
import com.app.webnongsan.domain.User;
import com.app.webnongsan.domain.response.PaginationDTO;
import com.app.webnongsan.domain.response.order.OrderDTO;
import com.app.webnongsan.domain.response.user.UserDTO;
import com.app.webnongsan.repository.OrderRepository;
import com.app.webnongsan.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public Order create(Order order){
        return this.orderRepository.save(order);
    }
    public Order get(long id){
        return this.orderRepository.findById(id).orElse(null);
    }
    public Order save(Order order){
        return this.orderRepository.save(order);
    }
    public void delete (long id){ this.orderRepository.deleteById(id);}


    public List<OrderDTO> getLastFiveOrders() {
        List<Order> orders = orderRepository.findAll();
        orders.sort(Comparator.comparingLong(Order::getId).reversed());
        List<OrderDTO> responseOrders;
        responseOrders = orders.stream()
                .limit(5)
                .map(this::convertToOrderDTO)
                .collect(Collectors.toList());
        return responseOrders;
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
            res.setUserId(order.getUser().getId());
            res.setUserName(order.getUser().getName());
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
        res.setOrderTime(order.getOrderTime());
        res.setDeliveryTime(order.getDeliveryTime());
        res.setStatus(order.getStatus());
        res.setPaymentMethod(order.getPaymentMethod());
        res.setAddress(order.getAddress());
        res.setTotal_price(order.getTotal_price());
        res.setUserEmail(order.getUser().getEmail());
        res.setUserId(order.getUser().getId());
        res.setUserName(order.getUser().getName());
        return res;
    }
}
