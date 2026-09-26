package com.example.cosmetics.controller;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.cosmetics.entity.Product;
import com.example.cosmetics.repository.ProductRepository;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductRepository repository;

    @Autowired
    private Cloudinary cloudinary;

    // Add Product
    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return repository.save(product);
    }

    // Get All Products
    @GetMapping
    public List<Product> getAllProducts() {
        return repository.findAll();
    }

    // Get Product By ID
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {

        Optional<Product> product = repository.findById(id);

        return product.orElse(null);
    }

    // Update Product
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id,
            @RequestBody Product updatedProduct) {

        Product product = repository.findById(id).orElse(null);

        if (product == null) {
            return null;
        }

        product.setName(updatedProduct.getName());
        product.setBrand(updatedProduct.getBrand());
        product.setCategory(updatedProduct.getCategory());
        product.setDescription(updatedProduct.getDescription());
        product.setPrice(updatedProduct.getPrice());
        product.setStock(updatedProduct.getStock());
        product.setDiscount(updatedProduct.getDiscount());
        product.setRating(updatedProduct.getRating());
        product.setReviewCount(updatedProduct.getReviewCount());
        product.setBadge(updatedProduct.getBadge());
        product.setImage(updatedProduct.getImage());
        product.setAlt(updatedProduct.getAlt());

        return repository.save(product);
    }

    // Delete Product
    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Long id) {

        repository.deleteById(id);

        return "Product Deleted Successfully";
    }

    // Get Products By Category
    @GetMapping("/category/{category}")
    public List<Product> getProductsByCategory(@PathVariable String category) {

        return repository.findByCategoryIgnoreCase(category);
    }

    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String keyword) {

        return repository
                .findByNameContainingIgnoreCaseOrBrandContainingIgnoreCaseOrCategoryContainingIgnoreCase(
                        keyword,
                        keyword,
                        keyword);

    }

    @PostMapping("/upload-image")
    public String uploadImage(@RequestParam("image") MultipartFile image)
            throws IOException {

        if (image == null || image.isEmpty()) {
            throw new IllegalArgumentException("Image file is required");
        }

        Map uploadResult = cloudinary.uploader().upload(
                image.getBytes(),
                ObjectUtils.asMap(
                        "folder", "glowify/products",
                        "resource_type", "image"));

        return uploadResult.get("secure_url").toString();
    }

}