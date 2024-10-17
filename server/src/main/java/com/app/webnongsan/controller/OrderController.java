package com.app.webnongsan.controller;

import com.app.webnongsan.domain.Order;
import com.app.webnongsan.domain.response.PaginationDTO;
import com.app.webnongsan.domain.response.RestResponse;
import com.app.webnongsan.domain.response.order.OrderDTO;
import com.app.webnongsan.domain.response.order.OrderDetailDTO;
import com.app.webnongsan.service.OrderService;
import com.app.webnongsan.util.annotation.ApiMessage;
import com.app.webnongsan.util.exception.ResourceInvalidException;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("api/v2")
@AllArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping("checkout")
    @ApiMessage("Create a checkout payment")
    public ResponseEntity<RestResponse<Long>> create(
            @RequestParam("userId") Long userId,
            @RequestParam("address") String address,
            @RequestParam("paymentMethod") String paymentMethod,
            @RequestParam("totalPrice") Double totalPrice,
            @RequestPart("items") List<OrderDetailDTO> items
    ) throws ResourceInvalidException{
        RestResponse<Long> response = new RestResponse<>();
        try {
            OrderDTO orderDTO = new OrderDTO();
            orderDTO.setUserId(userId);
            orderDTO.setAddress(address);
            orderDTO.setPaymentMethod(paymentMethod);
            orderDTO.setTotalPrice(totalPrice);
            orderDTO.setItems(items);
            Order order = orderService.create(orderDTO);

            response.setData(order.getId());
            response.setStatusCode(HttpStatus.CREATED.value());
            response.setMessage("Thanh toán thành công");

            return new ResponseEntity<>(response, HttpStatus.CREATED);
        }catch (ResourceInvalidException e) {
            response.setStatusCode(HttpStatus.BAD_REQUEST.value());
            response.setError(e.getMessage());
            response.setMessage("Có lỗi xảy ra: thông tin người dùng không hợp lệ");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
            response.setError(e.getMessage());
            response.setMessage("Có lỗi xảy ra trong quá trình thanh toán");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("orders")
    @ApiMessage("Get orders by user")
    public ResponseEntity<PaginationDTO> getOrderByUser(
            Pageable pageable,
            @RequestParam(value = "status", required = false) Integer status
    ) throws ResourceInvalidException {
        return ResponseEntity.ok(this.orderService.getOrderByCurrentUser(pageable, status));
    }
}
