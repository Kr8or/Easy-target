// Buy Now Button Click Handler for Easy Target
document.addEventListener('DOMContentLoaded', function() {
    // Select all Buy Now buttons
    const buyNowButtons = document.querySelectorAll('.buy-now, [data-action="buy-now"], button:contains("Buy Now")');
    
    // Select all add to cart buttons (the shopping cart icons)
    const addToCartButtons = document.querySelectorAll('.add-to-cart, [data-action="add-to-cart"], .cart-icon');
    
    // Function to handle the buy now process
    function handleBuyNow(event) {
      event.preventDefault();
      
      // Get product information from the closest product container
      const productContainer = event.target.closest('.product-item, .product-card, article');
      if (!productContainer) return;
      
      // Extract product details
      const productId = productContainer.dataset.productId || productContainer.id;
      const productName = productContainer.querySelector('.product-name, h3, h4')?.textContent.trim();
      const productPrice = productContainer.querySelector('.price, .product-price')?.textContent.trim();
      const productImage = productContainer.querySelector('img')?.src;
      
      // Create product object
      const product = {
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: 1
      };
      
      // Add to cart
      addToCart(product);
      
      // Show confirmation modal
      showConfirmationModal(product);
      
      // Redirect to checkout page
      setTimeout(() => {
        window.location.href = '/checkout';
      }, 1000);
    }
    
    // Function to handle adding to cart
    function handleAddToCart(event) {
      event.preventDefault();
      
      // Get product information from the closest product container
      const productContainer = event.target.closest('.product-item, .product-card, article');
      if (!productContainer) return;
      
      // Extract product details
      const productId = productContainer.dataset.productId || productContainer.id;
      const productName = productContainer.querySelector('.product-name, h3, h4')?.textContent.trim();
      const productPrice = productContainer.querySelector('.price, .product-price')?.textContent.trim();
      const productImage = productContainer.querySelector('img')?.src;
      
      // Create product object
      const product = {
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: 1
      };
      
      // Add to cart
      addToCart(product);
      
      // Show mini cart notification
      showMiniCartNotification(product);
      
      // Update cart count
      updateCartCount();
    }
    
    // Function to add product to cart
    function addToCart(product) {
      // Get existing cart or initialize new one
      let cart = JSON.parse(localStorage.getItem('easyTargetCart')) || [];
      
      // Check if product already exists in cart
      const existingProductIndex = cart.findIndex(item => item.id === product.id);
      
      if (existingProductIndex > -1) {
        // Increment quantity if product already exists
        cart[existingProductIndex].quantity += 1;
      } else {
        // Add new product to cart
        cart.push(product);
      }
      
      // Save updated cart to localStorage
      localStorage.setItem('easyTargetCart', JSON.stringify(cart));
      
      // Trigger custom event for cart update
      document.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
    }
    
    // Function to show confirmation modal
    function showConfirmationModal(product) {
      // Create modal element
      const modal = document.createElement('div');
      modal.className = 'purchase-modal';
      modal.innerHTML = `
        <div class="modal-content">
          <span class="close-modal">&times;</span>
          <h3>Item Added to Cart</h3>
          <div class="product-info">
            <img src="${product.image}" alt="${product.name}" width="80">
            <div>
              <p>${product.name}</p>
              <p>${product.price}</p>
            </div>
          </div>
          <p>Redirecting to checkout...</p>
        </div>
      `;
      
      // Add styles to modal
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100%';
      modal.style.height = '100%';
      modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
      modal.style.zIndex = '1000';
      modal.style.display = 'flex';
      modal.style.justifyContent = 'center';
      modal.style.alignItems = 'center';
      
      // Add styles to modal content
      const modalContent = modal.querySelector('.modal-content');
      modalContent.style.backgroundColor = '#fff';
      modalContent.style.padding = '20px';
      modalContent.style.borderRadius = '5px';
      modalContent.style.maxWidth = '400px';
      modalContent.style.width = '90%';
      
      // Add styles to product info
      const productInfo = modal.querySelector('.product-info');
      productInfo.style.display = 'flex';
      productInfo.style.alignItems = 'center';
      productInfo.style.margin = '15px 0';
      
      // Append modal to body
      document.body.appendChild(modal);
      
      // Close modal when clicking on close button
      modal.querySelector('.close-modal').addEventListener('click', function() {
        document.body.removeChild(modal);
      });
      
      // Auto close modal after 3 seconds
      setTimeout(function() {
        if (document.body.contains(modal)) {
          document.body.removeChild(modal);
        }
      }, 3000);
    }
    
    // Function to show mini cart notification
    function showMiniCartNotification(product) {
      // Create notification element
      const notification = document.createElement('div');
      notification.className = 'mini-cart-notification';
      notification.innerHTML = `
        <div class="notification-content">
          <p><strong>${product.name}</strong> added to cart</p>
        </div>
      `;
      
      // Add styles to notification
      notification.style.position = 'fixed';
      notification.style.top = '20px';
      notification.style.right = '20px';
      notification.style.backgroundColor = '#4CAF50';
      notification.style.color = 'white';
      notification.style.padding = '15px';
      notification.style.borderRadius = '5px';
      notification.style.zIndex = '999';
      notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
      
      // Append notification to body
      document.body.appendChild(notification);
      
      // Auto remove notification after 3 seconds
      setTimeout(function() {
        document.body.removeChild(notification);
      }, 3000);
    }
    
    // Function to update cart count in header
    function updateCartCount() {
      const cart = JSON.parse(localStorage.getItem('easyTargetCart')) || [];
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
      
      // Find cart counter element
      const cartCounter = document.querySelector('.cart-count');
      if (cartCounter) {
        cartCounter.textContent = totalItems;
        
        // Make it visible if it was hidden
        cartCounter.style.display = totalItems > 0 ? 'block' : 'none';
      }
    }
    
    // Add event listeners to Buy Now buttons
    buyNowButtons.forEach(button => {
      button.addEventListener('click', handleBuyNow);
    });
    
    // Add event listeners to Add to Cart buttons
    addToCartButtons.forEach(button => {
      button.addEventListener('click', handleAddToCart);
    });
    
    // Initialize cart count on page load
    updateCartCount();
  });