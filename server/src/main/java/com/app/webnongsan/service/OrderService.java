package com.app.webnongsan.service;

import com.app.webnongsan.domain.*;
import com.app.webnongsan.domain.response.PaginationDTO;
import com.app.webnongsan.domain.response.order.OrderDTO;
import com.app.webnongsan.domain.response.order.OrderDetailDTO;
import com.app.webnongsan.repository.OrderDetailRepository;
import com.app.webnongsan.repository.OrderRepository;
import com.app.webnongsan.repository.ProductRepository;
import com.app.webnongsan.repository.UserRepository;
import com.app.webnongsan.util.PaginationHelper;
import com.app.webnongsan.util.SecurityUtil;
import com.app.webnongsan.util.exception.ResourceInvalidException;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final ProductRepository productRepository;
    private final PaginationHelper paginationHelper;

    public Order create(OrderDTO orderDTO) throws ResourceInvalidException {
        String emailLoggedIn = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get() : "";
        // Lấy thông tin người dùng trong db
        User currentUserDB = userService.getUserByUsername(emailLoggedIn);
//        if(orderDTO.getUserId() == currentUserDB.getId()){
//            throw new ResourceInvalidException("User không hợp lệ");
//        }
        Order order = new Order();
        order.setUser(currentUserDB);
        order.setAddress(orderDTO.getAddress());
        order.setTotal_price(orderDTO.getTotalPrice());
        order.setPaymentMethod(orderDTO.getPaymentMethod());
        order.setStatus(0);
        Order saveOrder = orderRepository.save(order);
        orderDTO.getItems().forEach(item ->{
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            OrderDetail orderDetail = new OrderDetail();
            OrderDetailId id = new OrderDetailId();
            id.setOrderId(saveOrder.getId());
            id.setProductId(product.getId());
            orderDetail.setId(id);
            orderDetail.setOrder(saveOrder);
            orderDetail.setProduct(product);
            orderDetail.setQuantity(item.getQuantity());
            orderDetail.setUnit_price(item.getProductPrice());
            orderDetailRepository.save(orderDetail);
        });
        return saveOrder;
    }

    public PaginationDTO getOrderByCurrentUser(Pageable pageable, Integer status) throws ResourceInvalidException {
        String email = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get() : "";
        User user = this.userRepository.findByEmail(email);

        if (user == null) {
            throw new ResourceInvalidException("User không tồn tại");
        }

        Page<OrderDetailDTO> orderItems = this.orderRepository.findOrderItemsByUserId(user.getId(), status, pageable);
        return this.paginationHelper.fetchAllEntities(orderItems);
    }
}
