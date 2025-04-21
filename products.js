// Product management functionality
console.log("products.js loaded, defining handleProductSubmit...");

// API URL Configuration
// In production, this will be replaced with your actual backend URL
const API_URL = getApiUrl();

// Function to determine the API URL based on environment
function getApiUrl() {
  // Check if we're in production (GitHub Pages)
  const isProduction = window.location.hostname.includes('github.io');
  
  if (isProduction) {
    // Replace with your actual backend service URL when deployed
    return 'https://collegehub-backend.onrender.com';
  } else {
    // Local development
    return 'http://localhost:3000/api/products';
  }
}

let listingsContainer; // Will be initialized on DOM load
let searchInput; // Will be initialized on DOM load
let searchButton; // Will be initialized on DOM load
let addProductBtn; // Will be initialized on DOM load
let myProductsBtn; // Will be initialized on DOM load
let productModal; // Will be initialized on DOM load
let productForm; // Will be initialized on DOM load
let productDetailModal; // Will be initialized on DOM load
let categoryCards; // Will be initialized on DOM load

// Add admin button styling
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    .admin-delete {
      background-color: #ff5722 !important;
      color: white !important;
    }
    .admin-badge {
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0% { opacity: 0.7; }
      50% { opacity: 1; }
      100% { opacity: 0.7; }
    }
  `;
  document.head.appendChild(style);
});

// Admin configuration
const ADMIN_EMAILS = ['admin@collegehub.com']; // You can add multiple admin emails here

// Function to check if current user is an admin
function isAdmin() {
  const user = firebase.auth().currentUser;
  return user && ADMIN_EMAILS.includes(user.email);
}

const parallax_el = document.querySelectorAll(".parallax");
const main = document.querySelector("main");

// Calculate the intensity of the parallax effect based on screen width
const getParallaxIntensity = () => {
    const screenWidth = window.innerWidth;
    return screenWidth < 725 ? 1.2 : 1;
};

// Handle both mousemove and touchmove events
const handleParallax = (x, y) => {
    xValue = (x - window.innerWidth / 2) * getParallaxIntensity();
    yValue = (y - window.innerHeight / 2) * getParallaxIntensity();

    parallax_el.forEach((el) => {
        let speedx = el.dataset.speedx;
        let speedy = el.dataset.speedy;

        el.style.transform = `translateX(calc( 0% + ${-xValue * speedx}px)) translateY(calc(0% + ${yValue * speedy}px))`;
    });
};

// Mousemove event for desktop
window.addEventListener("mousemove", (e) => {
    handleParallax(e.clientX, e.clientY);
});

// Touchmove event for mobile
window.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    handleParallax(touch.clientX, touch.clientY);
});

if(window.innerWidth >= 725) {
    main.style.maxHeight = `${window.innerWidth * 0.6}px`;
} else {
    main.style.maxHeight = `${window.innerWidth * 1.6}px`;
}

// GSAP Animations
let timeline = gsap.timeline();

timeline.from(".text h2", {
    y: -150,
    opacity: 0,
    duration: 1,
}, "0.3")
.from(".hide", {
    opacity: 0,
    duration: 1.5,
}, "0.6");

// Intersection Observer for Animated Elements
const animatedElements = document.querySelectorAll("[data-animated='false']");

const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const target = entry.target;
            target.setAttribute("data-animated", "true");

            gsap.fromTo(
                target,
                { y: "100%", opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
            );

            observer.unobserve(target);
        }
    });
}, observerOptions);

animatedElements.forEach((element) => {
    observer.observe(element);
});


// Check authentication status on page load
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing elements');
  
  // Initialize elements after DOM is loaded
  listingsContainer = document.getElementById('listings-container');
  searchInput = document.querySelector('.search-box');
  searchButton = document.querySelector('.search-button');
  addProductBtn = document.getElementById('add-product-btn');
  myProductsBtn = document.getElementById('my-products-btn');
  productModal = document.getElementById('product-modal');
  productForm = document.getElementById('product-form');
  productDetailModal = document.getElementById('product-detail-modal');
  categoryCards = document.querySelectorAll('.category-card');

  console.log('Listings container found:', !!listingsContainer);
  console.log('Search input found:', !!searchInput);
  console.log('Search button found:', !!searchButton);
  console.log('Add Product button found:', !!addProductBtn);
  console.log('Product Modal found:', !!productModal);
  console.log('Product Form found:', !!productForm);
  
  // Initialize Cloudinary widget opener
  const uploadWidgetOpener = document.getElementById('upload-widget-opener');
  if (uploadWidgetOpener) {
    uploadWidgetOpener.addEventListener('click', function() {
      showCloudinaryUploader();
    });
  }
  
  // Listen for Cloudinary upload success event
  document.addEventListener('cloudinaryUploadSuccess', function(e) {
    console.log('Cloudinary upload success event received:', e.detail);
    const imageUrl = e.detail.url;
    const cloudinaryId = e.detail.cloudinaryId;
    
    // Update hidden fields
    document.getElementById('product-image-url').value = imageUrl;
    document.getElementById('product-cloudinary-id').value = cloudinaryId;
    
    // Show preview
    const previewImage = document.getElementById('preview-image');
    const previewContainer = document.getElementById('uploaded-image-preview');
    if (previewImage && previewContainer) {
      previewImage.src = imageUrl;
      previewContainer.style.display = 'block';
    }
  });
  
  // Add event listeners
  if (searchButton) {
    searchButton.addEventListener('click', searchProducts);
  }

  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') searchProducts();
    });
  }

  if (categoryCards && categoryCards.length > 0) {
    categoryCards.forEach(card => {
      card.addEventListener('click', () => filterByCategory(card.dataset.category));
    });
  }

  if (addProductBtn) {
    console.log('Adding click event to Add Product button');
    addProductBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Add Product button clicked');
      showAddProductModal();
    });
  }

  if (myProductsBtn) {
    myProductsBtn.addEventListener('click', function(e) {
      e.preventDefault();
      showMyProducts(e);
    });
  }

  if (productForm) {
    console.log('Adding submit event to Product Form');
    productForm.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('Product form submitted via event listener');
      handleProductSubmit(e);
    });
    
    // Add click event to the submit button as well
    const submitButton = productForm.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Submit button clicked');
        handleProductSubmit(e);
      });
    }
  }

  // Add event listeners for modal close buttons
  document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const modal = this.closest('.modal');
      if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
  });

  // Show/hide add product button based on auth status
  firebase.auth().onAuthStateChanged(user => {
    console.log('Auth state changed:', user ? 'User logged in' : 'No user');
    
    if (user) {
      console.log('User is logged in, displaying product buttons');
      if (addProductBtn) addProductBtn.style.display = 'block';
      if (myProductsBtn) myProductsBtn.style.display = 'block';
      
      // Check if user is admin and add indicator
      if (isAdmin()) {
        console.log('Admin user detected');
        
        // Add admin badge if it doesn't exist
        if (!document.getElementById('admin-badge')) {
          const adminBadge = document.createElement('div');
          adminBadge.id = 'admin-badge';
          adminBadge.className = 'admin-badge';
          adminBadge.innerHTML = 'Admin';
          adminBadge.style.cssText = 'position: fixed; top: 70px; right: 20px; background-color: #ff5722; color: white; padding: 5px 10px; border-radius: 4px; z-index: 1000; font-weight: bold; cursor: pointer;';
          adminBadge.title = 'Click to open admin panel';
          adminBadge.addEventListener('click', showAdminPanel);
          document.body.appendChild(adminBadge);
        }
      }
    } else {
      console.log('User is not logged in, hiding product buttons');
      if (addProductBtn) addProductBtn.style.display = 'none';
      if (myProductsBtn) myProductsBtn.style.display = 'none';
      
      // Remove admin badge if it exists
      const adminBadge = document.getElementById('admin-badge');
      if (adminBadge) {
        adminBadge.remove();
      }
    }
  });
  
  // Load initial products
  fetchProducts();
  
  // Indicate MongoDB and Cloudinary are being used
  console.log('Products system initialized. Using MongoDB for data storage and Cloudinary for images.');
});

// Functions
async function fetchProducts() {
  console.log('fetchProducts called');
  
  try {
    showLoader();
    
    // Fetch products from the MongoDB API
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }
    
    const products = await response.json();
    console.log('Products fetched from server:', products);
    
    // Reset the listing section heading
    const listingsHeading = document.querySelector('.listings h2');
    if (listingsHeading) {
      listingsHeading.textContent = 'Recent Listings';
    }
    
    hideLoader();
    displayProducts(products);
  } catch (error) {
    hideLoader();
    console.error('Error fetching products:', error);
    displayError('Failed to load products. Please try again later.');
  }
}

// Get user-friendly category name from category value
function getCategoryDisplayName(categoryValue) {
  const categoryMap = {
    'hostel': 'Hostel Items',
    'flatmate': 'Flatmates',
    'food': 'Food Services',
    'essentials': 'College Essentials',
    'places': 'Nearby Places',
    'notes': 'College Notice',
    'books': 'Books',
    'electronics': 'Electronics',
    'clothing': 'Clothing',
    'furniture': 'Furniture',
    'other': 'Other'
  };
  
  return categoryMap[categoryValue] || categoryValue; // Return the mapped name or the original if not found
}

function displayProducts(products) {
  console.log('displayProducts called with:', products);
  if (!listingsContainer) {
    console.error('Listings container not found on page');
    return;
  }
  
  listingsContainer.innerHTML = '';
  
  if (!products || products.length === 0) {
    console.log('No products to display');
    listingsContainer.innerHTML = '<p class="no-results">No products found.</p>';
    return;
  }
  
  console.log(`Displaying ${products.length} products`);
  products.forEach(product => {
    console.log('Creating card for product:', product);
    
    // Make sure we have valid data
    if (!product.title || !product.category) {
      console.warn('Product has missing data:', product);
      return;
    }
    
    const productCard = document.createElement('div');
    productCard.className = 'listing-card';
    productCard.dataset.id = product._id || 'unknown';
    
    // Handle potential missing image
    const imageUrl = product.image || 'https://via.placeholder.com/300x200?text=No+Image';
    
    // Get user-friendly category name
    const categoryDisplayName = getCategoryDisplayName(product.category);
    
    productCard.innerHTML = `
      <img src="${imageUrl}" alt="${product.title}" class="listing-image" onerror="this.src='https://via.placeholder.com/300x200?text=Image+Error'">
      <div class="listing-details">
        <span class="listing-category">${categoryDisplayName}</span>
        <h3 class="listing-title">${product.title}</h3>
        <p class="listing-description">${product.description ? (product.description.substring(0, 100) + (product.description.length > 100 ? '...' : '')) : 'No description'}</p>
        <p class="listing-price">${product.price || 'No price'}</p>
        <p class="listing-seller">Posted by: ${product.user?.name || 'Unknown'}</p>
      </div>
    `;
    
    productCard.addEventListener('click', () => {
      console.log('Product card clicked:', product);
      showProductDetails(product);
    });
    
    listingsContainer.appendChild(productCard);
  });
}

function showLoader() {
  if (listingsContainer) {
    listingsContainer.innerHTML = '<div class="loader"></div>';
  }
}

function hideLoader() {
  const loader = document.querySelector('.loader');
  if (loader) {
    loader.remove();
  }
}

function displayError(message) {
  if (listingsContainer) {
    listingsContainer.innerHTML = `<p class="error-message">${message}</p>`;
  }
}

async function searchProducts() {
  const searchTerm = searchInput.value.trim();
  if (!searchTerm) {
    // Reset heading and fetch all products
    const listingsHeading = document.querySelector('.listings h2');
    if (listingsHeading) {
      listingsHeading.textContent = 'Recent Listings';
    }
    fetchProducts();
    return;
  }
  
  try {
    showLoader();
    
    const response = await fetch(`${API_URL}/search/${searchTerm}`);
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }
    
    const products = await response.json();
    console.log('Search results from server:', products);
    
    // Update the listing section heading
    const listingsHeading = document.querySelector('.listings h2');
    if (listingsHeading) {
      listingsHeading.textContent = `Your Searched Listings${searchTerm ? ': ' + searchTerm : ''}`;
    }
    
    hideLoader();
    displayProducts(products);
    
    // Scroll to listings section to show search results
    document.querySelector('.listings').scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    hideLoader();
    console.error('Error searching products:', error);
    displayError('Failed to search products. Please try again later.');
  }
}

async function filterByCategory(category) {
  if (!category) {
    fetchProducts();
    return;
  }
  
  try {
    showLoader();
    
    const response = await fetch(`${API_URL}/category/${category}`);
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }
    
    const products = await response.json();
    console.log('Category filtered results from server:', products);
    
    // Update the listing section heading with category name
    const listingsHeading = document.querySelector('.listings h2');
    if (listingsHeading) {
      const categoryDisplayName = getCategoryDisplayName(category);
      listingsHeading.textContent = `${categoryDisplayName} Listings`;
    }
    
    hideLoader();
    displayProducts(products);
    
    // Scroll to listings section
    document.querySelector('.listings').scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    hideLoader();
    console.error('Error filtering products by category:', error);
    displayError('Failed to filter products. Please try again later.');
  }
}

function showAddProductModal() {
  console.log('showAddProductModal function called');
  const user = firebase.auth().currentUser;
  if (!user) {
    alert('Please log in to add a product');
    return;
  }
  
  if (!productModal || !productForm) {
    console.error('Product modal or form not found:', {
      productModal: !!productModal,
      productForm: !!productForm
    });
    alert('Error: Could not open the product form. Please refresh the page and try again.');
    return;
  }
  
  console.log('Resetting form and showing modal');
  // Reset form
  productForm.reset();
  
  // Set form mode to add
  productForm.dataset.mode = 'add';
  productForm.dataset.id = '';
  
  // Update modal title
  const modalTitle = document.querySelector('#product-modal h2');
  if (modalTitle) modalTitle.textContent = 'Add New Product';
  
  // Show modal
  productModal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  if (productModal) {
    productModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

// Make handleProductSubmit globally accessible
console.log("Defining window.handleProductSubmit function...");
window.handleProductSubmit = async function(e) {
  console.log("handleProductSubmit called!", e);
  e.preventDefault();
  console.log('Product form submitted (global function)');
  
  const user = firebase.auth().currentUser;
  if (!user) {
    alert('Please log in to add or edit a product');
    return;
  }
  
  // Get the form
  const productForm = document.getElementById('product-form');
  
  // Make sure we have the form
  if (!productForm) {
    console.error('Product form not found');
    alert('Error: Form not found. Please refresh the page and try again.');
    return;
  }
  
  const formData = new FormData(productForm);
  
  // Log form data
  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }
  
  // Validate form inputs
  const title = formData.get('title');
  const description = formData.get('description');
  const category = formData.get('category');
  const price = formData.get('price');
  const imageUrl = formData.get('imageUrl');
  const cloudinaryId = formData.get('cloudinaryId');
  
  if (!title || !description || !category || !price) {
    alert('Please fill in all required fields');
    return;
  }
  
  if (!imageUrl) {
    alert('Please upload an image');
    return;
  }
  
  // Add user information to the form data
  formData.append('userName', user.displayName || user.email.split('@')[0]);
  formData.append('userEmail', user.email);
  formData.append('userId', user.uid);
  
  const mode = productForm.dataset.mode;
  const productId = productForm.dataset.id;
  
  console.log('Form mode:', mode);
  
  try {
    let response;
    
    if (mode === 'add') {
      console.log('Sending POST request to add new product');
      // For Cloudinary, we pass the image URL directly instead of the file
      const productData = {
        title: title,
        description: description,
        category: category,
        price: price,
        image: imageUrl,
        cloudinary_id: cloudinaryId,
        userName: formData.get('userName'),
        userEmail: formData.get('userEmail'),
        userId: formData.get('userId')
      };
      
      response = await fetch(`${API_URL}/direct-upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });
    } else if (mode === 'edit') {
      console.log('Sending PUT request to update product:', productId);
      // For edit mode, similar approach with JSON data
      const productData = {
        title: title,
        description: description,
        category: category,
        price: price,
        image: imageUrl,
        cloudinary_id: cloudinaryId,
        userName: formData.get('userName'),
        userEmail: formData.get('userEmail'),
        userId: formData.get('userId')
      };
      
      response = await fetch(`${API_URL}/direct-upload/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });
    }
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error from server:', errorData);
      throw new Error(errorData.message || 'Failed to save product');
    }
    
    const result = await response.json();
    console.log('Product saved successfully:', result);
    
    closeProductModal();
    alert(mode === 'add' ? 'Product added successfully!' : 'Product updated successfully!');
    fetchProducts();
  } catch (error) {
    console.error('Error saving product:', error);
    alert(error.message || 'Failed to save product. Please try again.');
  }
};

async function showMyProducts(e) {
  // Prevent default navigation if called from an event
  if (e && e.preventDefault) {
    e.preventDefault();
  }
  
  console.log('showMyProducts called');
  const user = firebase.auth().currentUser;
  if (!user) {
    alert('Please log in to view your products');
    return;
  }
  
  try {
    showLoader();
    
    // Fetch user's products from the MongoDB API
    const response = await fetch(`${API_URL}/user/${user.uid}`);
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }
    
    const products = await response.json();
    console.log('User products fetched from server:', products);
    
    hideLoader();
    
    if (products.length === 0) {
      listingsContainer.innerHTML = '<p class="no-results">You have not added any products yet.</p>';
    } else {
      displayProducts(products);
    }
    
    // Scroll to listings section
    document.querySelector('.listings').scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    hideLoader();
    console.error('Error fetching user products:', error);
    displayError('Failed to load your products. Please try again later.');
  }
}

function showProductDetails(product) {
  if (!productDetailModal) return;
  
  // Populate modal with product details
  const modalContent = productDetailModal.querySelector('.modal-content');
  modalContent.innerHTML = `
    <span class="close-btn">&times;</span>
    <div class="product-detail-container">
      <div class="product-detail-image">
        <img src="${product.image}" alt="${product.title}">
      </div>
      <div class="product-detail-info">
        <span class="product-category">${getCategoryDisplayName(product.category)}</span>
        <h2>${product.title}</h2>
        <p class="product-description">${product.description}</p>
        <p class="product-price">${product.price}</p>
        <p class="product-seller">Posted by: ${product.user.name}</p>
        <p class="product-date">Added on: ${new Date(product.createdAt).toLocaleDateString()}</p>
        <div class="product-contact">
          <a href="mailto:${product.user.email}" class="contact-button">Contact Seller</a>
        </div>
      </div>
    </div>
  `;
  
  // Add edit/delete buttons if current user is the owner or an admin
  const user = firebase.auth().currentUser;
  if (user && (user.uid === product.user.uid || isAdmin())) {
    const actionButtons = document.createElement('div');
    actionButtons.className = 'product-actions';
    
    // Only show Edit button for the product owner
    if (user.uid === product.user.uid) {
      actionButtons.innerHTML = `
        <button class="edit-product-btn">Edit</button>
        <button class="delete-product-btn">Delete</button>
      `;
    } else if (isAdmin()) {
      // For admins, only show Delete button with admin indicator
      actionButtons.innerHTML = `
        <button class="delete-product-btn admin-delete">Delete (Admin)</button>
      `;
    }
    
    modalContent.querySelector('.product-detail-info').appendChild(actionButtons);
    
    // Add event listeners
    const editBtn = modalContent.querySelector('.edit-product-btn');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        editProduct(product);
        closeProductDetailModal();
      });
    }
    
    modalContent.querySelector('.delete-product-btn').addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this product?')) {
        deleteProduct(product._id);
        closeProductDetailModal();
      }
    });
  }
  
  // Close button functionality
  modalContent.querySelector('.close-btn').addEventListener('click', closeProductDetailModal);
  
  // Show modal
  productDetailModal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeProductDetailModal() {
  if (productDetailModal) {
    productDetailModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

function editProduct(product) {
  const user = firebase.auth().currentUser;
  if (!user || user.uid !== product.user.uid) {
    alert('You can only edit your own products');
    return;
  }
  
  // Populate form with product data
  document.getElementById('product-title').value = product.title;
  document.getElementById('product-description').value = product.description;
  document.getElementById('product-category').value = product.category;
  document.getElementById('product-price').value = product.price;
  
  // Set existing image data
  document.getElementById('product-image-url').value = product.image;
  document.getElementById('product-cloudinary-id').value = product.cloudinary_id || '';
  
  // Show image preview
  const previewImage = document.getElementById('preview-image');
  const previewContainer = document.getElementById('uploaded-image-preview');
  if (previewImage && previewContainer && product.image) {
    previewImage.src = product.image;
    previewContainer.style.display = 'block';
  }
  
  // Set form mode to edit
  productForm.dataset.mode = 'edit';
  productForm.dataset.id = product._id;
  
  // Update modal title
  document.querySelector('#product-modal h2').textContent = 'Edit Product';
  
  // Show modal
  productModal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

async function deleteProduct(productId) {
  const user = firebase.auth().currentUser;
  if (!user) {
    alert('Please log in to delete a product');
    return;
  }
  
  try {
    // First check if the user is the owner or an admin
    const isProductOwnerOrAdmin = await checkProductOwnershipOrAdmin(productId);
    
    if (!isProductOwnerOrAdmin) {
      alert('You can only delete your own products unless you are an admin');
      return;
    }
    
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    const response = await fetch(`${API_URL}/${productId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete product');
    }
    
    console.log('Product deleted successfully');
    alert('Product deleted successfully');
    
    // Close the modal and refresh the display
    closeProductDetailModal();
    fetchProducts();
  } catch (error) {
    console.error('Error deleting product:', error);
    alert(error.message || 'Failed to delete product. Please try again.');
  }
}

// Helper function to check if current user is product owner or admin
async function checkProductOwnershipOrAdmin(productId) {
  // If user is admin, allow without further checks
  if (isAdmin()) {
    console.log('Admin privileges detected - allowing delete operation');
    return true;
  }
  
  const user = firebase.auth().currentUser;
  if (!user) return false;
  
  try {
    // Check if the product belongs to the current user
    const response = await fetch(`${API_URL}/${productId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch product details: ${response.status}`);
    }
    
    const product = await response.json();
    return product.user && product.user.uid === user.uid;
  } catch (error) {
    console.error('Error checking product ownership:', error);
    return false;
  }
}

// Close modals when clicking outside
window.addEventListener('click', (e) => {
  console.log('Window click detected');
  if (e.target.classList.contains('modal')) {
    console.log('Click on modal backdrop detected');
    e.target.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

// Admin panel functionality
async function showAdminPanel() {
  // Check if user is admin
  if (!isAdmin()) {
    alert('You need admin privileges to access this panel');
    return;
  }
  
  // Create modal if it doesn't exist
  let adminModal = document.getElementById('admin-panel-modal');
  if (!adminModal) {
    adminModal = document.createElement('div');
    adminModal.id = 'admin-panel-modal';
    adminModal.className = 'modal';
    adminModal.style.cssText = 'display: none; position: fixed; z-index: 1050; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.7);';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.cssText = 'background-color: #fefefe; margin: 5% auto; padding: 20px; border: 1px solid #888; width: 90%; max-width: 1200px; max-height: 80vh; overflow: auto;';
    
    modalContent.innerHTML = `
      <span class="close-btn" style="color: #aaa; float: right; font-size: 28px; font-weight: bold; cursor: pointer;">&times;</span>
      <h2>Admin Panel</h2>
      <div class="admin-tabs">
        <button id="tab-all-products" class="admin-tab active">All Products</button>
        <button id="tab-reported" class="admin-tab">Reported Content</button>
        <button id="tab-users" class="admin-tab">User Management</button>
      </div>
      <div id="admin-content">
        <!-- Content will be loaded here -->
        <div class="loader"></div>
      </div>
    `;
    
    adminModal.appendChild(modalContent);
    document.body.appendChild(adminModal);
    
    // Add event listeners
    const closeBtn = adminModal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
      adminModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
    
    // Tab switching
    const tabButtons = adminModal.querySelectorAll('.admin-tab');
    tabButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        // Remove active class from all tabs
        tabButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked tab
        e.target.classList.add('active');
        
        // Load appropriate content
        const tabId = e.target.id;
        if (tabId === 'tab-all-products') {
          loadAllProductsAdmin();
        } else if (tabId === 'tab-reported') {
          // Future functionality
          document.getElementById('admin-content').innerHTML = '<p>Reported content management will be available in a future update.</p>';
        } else if (tabId === 'tab-users') {
          // Future functionality
          document.getElementById('admin-content').innerHTML = '<p>User management will be available in a future update.</p>';
        }
      });
    });
  }
  
  // Show modal
  adminModal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  
  // Load all products by default
  loadAllProductsAdmin();
}

async function loadAllProductsAdmin() {
  const contentDiv = document.getElementById('admin-content');
  if (!contentDiv) return;
  
  contentDiv.innerHTML = '<div class="loader"></div>';
  
  try {
    // Fetch all products
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }
    
    const products = await response.json();
    
    if (!products || products.length === 0) {
      contentDiv.innerHTML = '<p>No products found.</p>';
      return;
    }
    
    // Create table
    let tableHTML = `
      <div style="margin: 20px 0;">
        <input type="text" id="admin-search" placeholder="Search products..." style="padding: 8px; width: 300px; margin-bottom: 10px;">
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 10px; text-align: left;">Title</th>
            <th style="padding: 10px; text-align: left;">Category</th>
            <th style="padding: 10px; text-align: left;">Price</th>
            <th style="padding: 10px; text-align: left;">Seller</th>
            <th style="padding: 10px; text-align: left;">Date Added</th>
            <th style="padding: 10px; text-align: center;">Actions</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    products.forEach(product => {
      tableHTML += `
        <tr style="border-bottom: 1px solid #ddd;" data-product-id="${product._id}">
          <td style="padding: 10px;">${product.title}</td>
          <td style="padding: 10px;">${getCategoryDisplayName(product.category)}</td>
          <td style="padding: 10px;">${product.price}</td>
          <td style="padding: 10px;">${product.user?.name || 'Unknown'}</td>
          <td style="padding: 10px;">${new Date(product.createdAt).toLocaleDateString()}</td>
          <td style="padding: 10px; text-align: center;">
            <button class="admin-view-btn" style="margin-right: 5px; padding: 5px 10px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">View</button>
            <button class="admin-delete-btn" style="padding: 5px 10px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Delete</button>
          </td>
        </tr>
      `;
    });
    
    tableHTML += `
        </tbody>
      </table>
    `;
    
    contentDiv.innerHTML = tableHTML;
    
    // Add search functionality
    const searchInput = document.getElementById('admin-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = contentDiv.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
          const text = row.textContent.toLowerCase();
          if (text.includes(searchTerm)) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
    }
    
    // Add event listeners to buttons
    contentDiv.querySelectorAll('.admin-view-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const productId = e.target.closest('tr').dataset.productId;
        const product = products.find(p => p._id === productId);
        if (product) {
          // Close admin panel
          document.getElementById('admin-panel-modal').style.display = 'none';
          // Show product details
          showProductDetails(product);
        }
      });
    });
    
    contentDiv.querySelectorAll('.admin-delete-btn').forEach(button => {
      button.addEventListener('click', async (e) => {
        const productId = e.target.closest('tr').dataset.productId;
        if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
          try {
            const response = await fetch(`${API_URL}/${productId}`, {
              method: 'DELETE'
            });
            
            if (!response.ok) {
              throw new Error('Failed to delete product');
            }
            
            // Remove row from table
            e.target.closest('tr').remove();
            alert('Product deleted successfully');
            
            // Refresh products in the background
            fetchProducts();
          } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product: ' + error.message);
          }
        }
      });
    });
    
  } catch (error) {
    console.error('Error loading products for admin panel:', error);
    contentDiv.innerHTML = `<p style="color: red;">Error loading products: ${error.message}</p>`;
  }
} 
