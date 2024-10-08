package com.app.webnongsan.controller;

import com.app.webnongsan.domain.Cart;
import com.app.webnongsan.domain.response.PaginationDTO;
import com.app.webnongsan.service.CartService;
import com.app.webnongsan.util.annotation.ApiMessage;
import com.app.webnongsan.util.exception.ResourceInvalidException;
import com.turkraft.springfilter.boot.Filter;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v2")
@AllArgsConstructor
public class CartController {
    private final CartService cartService;

    @PostMapping("cart")
    @ApiMessage("Add to cart")
    public ResponseEntity<Cart> add(@RequestBody Cart cart) throws ResourceInvalidException {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.cartService.addToCart(cart));
    }

    @DeleteMapping("cart/{productId}")
    @ApiMessage("Delete product from cart")
    public ResponseEntity<Void> delete(@PathVariable long productId) throws ResourceInvalidException {
        this.cartService.deleteFromCart(productId);
        return ResponseEntity.ok(null);
    }

    @GetMapping("cart")
    @ApiMessage("Get cart by user")
    public ResponseEntity<PaginationDTO> getCartByUser(Pageable pageable) throws ResourceInvalidException {
        return ResponseEntity.ok(this.cartService.getCartByCurrentUser(pageable));
    }

    @PutMapping("cart")
    @ApiMessage("Update quantity")
    public ResponseEntity<Cart> updateQuantity(
            @RequestParam Long productId,
            @RequestParam int quantity) throws ResourceInvalidException {
            Cart updatedCart = cartService.updateProductQuantity(productId, quantity);
            return ResponseEntity.ok(updatedCart);
    }
}
