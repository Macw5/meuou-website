/* ============================================
   MEUOU - JavaScript Functionality
   ============================================ */

// ============ Global Cart Variable ============
window.cart = [];

// ============ DOM Ready ============
document.addEventListener('DOMContentLoaded', function() {
    initializeSite();
    setupEventListeners();
    updateCartCount();
});

// ============ Initialize Site ============
function initializeSite() {
    setupMobileMenu();
    setupAddToCartButtons();
    setupNewsletterForm();
    loadCartFromMemory();
}

// ============ Mobile Menu Toggle ============
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        // Close menu when a link is clicked
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }
}

// ============ Add to Cart Functionality ============
function setupAddToCartButtons() {
    const addButtons = document.querySelectorAll('.btn-add-cart');

    addButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            const productId = this.getAttribute('data-product-id');
            const productName = this.getAttribute('data-product-name');
            const productPrice = parseFloat(this.getAttribute('data-product-price'));

            addToCart({
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1
            });

            // Visual feedback
            showAddToCartFeedback(this);
        });
    });
}

function addToCart(product) {
    if (!window.cart) {
        window.cart = [];
    }

    // Check if product already exists in cart
    const existingProduct = window.cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        window.cart.push(product);
    }

    updateCartCount();
}

function showAddToCartFeedback(button) {
    const originalText = button.textContent;
    const originalBg = button.style.backgroundColor;

    button.textContent = '✓ Added!';
    button.style.backgroundColor = '#046307';

    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = originalBg;
    }, 1500);
}

// ============ Update Cart Count ============
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cartCount');
    const totalItems = window.cart ? window.cart.reduce((sum, item) => sum + item.quantity, 0) : 0;

    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// ============ Newsletter Form ============
function setupNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleNewsletterSubmit(this);
        });
    }
}

function handleNewsletterSubmit(form) {
    const formData = new FormData(form);
    const email = formData.get('email') || form.querySelector('input[type="email"]').value;

    // Simulate form submission
    const formClone = form.cloneNode(true);
    const successMessage = document.getElementById('newsletterSuccess') ||
                         form.nextElementSibling;

    form.style.display = 'none';
    if (successMessage) {
        successMessage.style.display = 'block';
    }

    setTimeout(() => {
        form.style.display = 'block';
        if (successMessage) {
            successMessage.style.display = 'none';
        }
        form.reset();
    }, 3000);
}

// ============ Cart Memory Functions ============
function loadCartFromMemory() {
    // Note: We're using a JS variable, not localStorage
    // In a production app, you'd typically use localStorage or a backend
    // This keeps cart in memory during the session
}

function saveCart() {
    // Cart is saved in window.cart variable
    // Persists during the session
}

// ============ Smooth Scrolling ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============ Lazy Loading Effect ============
function observeElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.product-card, .collection-card, .faq-item').forEach(el => {
        observer.observe(el);
    });
}

// Observe elements after DOM is ready
document.addEventListener('DOMContentLoaded', observeElements);

// ============ Image Hover Effects ============
document.querySelectorAll('.product-image img').forEach(img => {
    img.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });

    img.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// ============ Form Validation ============
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ============ Utility Functions ============
function formatPrice(price) {
    return '£' + parseFloat(price).toFixed(2);
}

function getURLParameter(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}

// ============ Product Filtering (Collections Page) ============
function filterProductsByCategory(category) {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        if (category === 'all') {
            card.style.display = 'block';
        } else {
            const cardCategory = card.getAttribute('data-category');
            card.style.display = cardCategory === category ? 'block' : 'none';
        }
    });
}

// ============ Sort Products ============
function sortProductsBy(sortType) {
    const grid = document.querySelector('.products-grid');
    const products = Array.from(grid.querySelectorAll('.product-card'));

    products.sort((a, b) => {
        switch(sortType) {
            case 'price-low':
                return parseFloat(a.getAttribute('data-price')) -
                       parseFloat(b.getAttribute('data-price'));
            case 'price-high':
                return parseFloat(b.getAttribute('data-price')) -
                       parseFloat(a.getAttribute('data-price'));
            case 'name':
                return a.getAttribute('data-name').localeCompare(
                    b.getAttribute('data-name'));
            default:
                return 0;
        }
    });

    // Re-append in sorted order
    products.forEach(product => {
        grid.appendChild(product);
    });
}

// ============ Scroll to Top Button ============
window.addEventListener('scroll', function() {
    const scrollBtn = document.getElementById('scrollToTop');
    if (scrollBtn) {
        if (window.scrollY > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    }
});

// ============ Active Navigation Link ============
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', setActiveNavLink);

// ============ Debounce Function ============
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============ Color Transition Effects ============
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('mouseenter', function() {
        if (this.classList.contains('btn')) {
            this.style.transition = 'all 0.3s ease';
        }
    });
});

// ============ Responsive Image Sizing ============
function handleResponsiveImages() {
    if (window.innerWidth < 768) {
        document.querySelectorAll('.product-image').forEach(img => {
            img.style.height = '200px';
        });
    } else {
        document.querySelectorAll('.product-image').forEach(img => {
            img.style.height = '300px';
        });
    }
}

window.addEventListener('resize', debounce(handleResponsiveImages, 250));
document.addEventListener('DOMContentLoaded', handleResponsiveImages);

// ============ Add to Wishlist (Placeholder) ============
function addToWishlist(productId) {
    console.log('Added product ' + productId + ' to wishlist');
    alert('Added to wishlist! (Feature coming soon)');
}

// ============ Newsletter Email Validation ============
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');

    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');

            if (validateEmail(emailInput.value)) {
                // Form is valid, show success message
                const successMsg = this.nextElementSibling;
                this.style.display = 'none';
                if (successMsg && successMsg.classList.contains('newsletter-success')) {
                    successMsg.style.display = 'block';
                }

                setTimeout(() => {
                    this.style.display = 'flex';
                    if (successMsg && successMsg.classList.contains('newsletter-success')) {
                        successMsg.style.display = 'none';
                    }
                    this.reset();
                }, 3000);
            } else {
                emailInput.style.borderColor = '#800020';
                setTimeout(() => {
                    emailInput.style.borderColor = '';
                }, 2000);
            }
        });
    });
});

// ============ Product Page Functions ============
function changeImage(thumbnail) {
    const mainImage = document.getElementById('mainImage');
    const fullSrcUrl = thumbnail.src.replace('w=200', 'w=800');
    mainImage.src = fullSrcUrl;

    // Add visual feedback
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.style.borderColor = 'transparent';
    });
    thumbnail.style.borderColor = '#B8860B';
}

// ============ Contact Form Handling ============
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate form
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                alert('Please fill in all required fields');
                return;
            }

            if (!validateEmail(email)) {
                alert('Please enter a valid email address');
                return;
            }

            // Show success message
            const formContainer = this.parentElement;
            const successMsg = document.getElementById('formSuccess');

            this.style.display = 'none';
            if (successMsg) {
                successMsg.style.display = 'block';
            }

            setTimeout(() => {
                this.style.display = 'block';
                if (successMsg) {
                    successMsg.style.display = 'none';
                }
                this.reset();
            }, 3000);
        });
    }
});

// ============ Quantity Controls in Cart ============
function updateQuantity(index, change) {
    if (window.cart[index]) {
        window.cart[index].quantity += change;
        if (window.cart[index].quantity < 1) {
            window.cart.splice(index, 1);
        }
        updateCartCount();
        // This would trigger a cart re-render on the cart page
    }
}

// ============ Price Formatting in Cart ============
function formatCurrency(amount) {
    return '£' + parseFloat(amount).toFixed(2);
}

// ============ Navigation Active State ============
function updateActiveNavLink() {
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-menu a').forEach(link => {
        const href = link.getAttribute('href');
        const linkPath = href.split('/').pop();
        const currentPage = currentPath.split('/').pop() || 'index.html';

        if (linkPath === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', updateActiveNavLink);

// ============ Smooth Page Transitions ============
document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.hostname === window.location.hostname &&
        !link.target &&
        !link.getAttribute('download')) {
        // Could add page transition animation here
    }
});

// ============ Keyboard Navigation ============
document.addEventListener('keydown', function(e) {
    // Close mobile menu on escape
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('navMenu');
        if (navMenu) {
            navMenu.classList.remove('active');
        }
    }
});

// ============ Print Styles Support ============
window.addEventListener('beforeprint', function() {
    // Adjust styles for printing if needed
});

// ============ Performance Optimization ============
// Debounce window resize events
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Handle resize events
    }, 250);
});

// ============ Accessibility Enhancements ============
document.querySelectorAll('button, a').forEach(element => {
    element.addEventListener('focus', function() {
        this.style.outline = '2px solid #B8860B';
        this.style.outlineOffset = '2px';
    });

    element.addEventListener('blur', function() {
        this.style.outline = '';
        this.style.outlineOffset = '';
    });
});

// ============ Session Storage (for cart persistence during session) ============
function getCartFromSession() {
    // Returns the current cart from memory
    return window.cart || [];
}

function clearCart() {
    window.cart = [];
    updateCartCount();
}

// ============ Initialize on Every Page Load ============
window.addEventListener('load', function() {
    // Ensure all interactive elements are functional
    setupAddToCartButtons();
    updateCartCount();
});
