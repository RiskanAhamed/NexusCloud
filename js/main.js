/**
 * NEXUS CLOUD - Main JavaScript Functions
 */

$(document).ready(function() {
    // AOS Animation Init
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true
    });
    
    // Navbar Scroll Effect
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('.floating-nav').addClass('scrolled');
        } else {
            $('.floating-nav').removeClass('scrolled');
        }
    });
    
    // Smooth Scroll for Navigation Links
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        let target = $($(this).attr('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 100
            }, 800);
        }
    });
    
    // Mobile Menu Toggle
    $('.mobile-menu-btn').click(function() {
        $('.nav-links').slideToggle(400);
    });
    
    // Button Click Ripple Effect
    $('.btn-primary, .btn-secondary').on('click', function(e) {
        let ripple = document.createElement('span');
        $(ripple).addClass('ripple');
        $(this).append(ripple);
        
       let rect = $(this)[0].getBoundingClientRect();
        ripple.style.left = (e.clientX - rect.left) + 'px';
        ripple.style.top = (e.clientY - rect.top) + 'px';
        
        setTimeout(() => $(ripple).remove(), 600);
    });
    
    // Counter Animation
    function countUp(selector, end, duration) {
        let obj = $(selector);
        let start = 0;
        let increment = end / (duration / 16);
        let timer = setInterval(function() {
            start += increment;
            if (start >= end) {
                start = end;
                clearInterval(timer);
            }
            obj.text(Math.floor(start));
        }, 16);
    }
    
    // Animate counters when visible
    $('.stat-value').each(function() {
        let text = $(this).text();
        if (text.includes('%') || text.includes('+')) {
            return;
        }
        
        let num = parseInt(text);
        if (!isNaN(num)) {
            $(this).text('0');
            
            $(window).scroll(function() {
            if (isVisible($(this)[0], $(this))) {
                    countUp(this, num, 2000);
                }
            });
        }
    });
    
    function isVisible(element, win) {
        let docViewTop = $(win).scrollTop();
        let docViewBottom = docViewTop + $(win).height();
        let elemTop = $(element).offset().top;
        let elemBottom = elemTop + $(element).height();
        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }
    
    // Dashboard Metrics Animation on Hover
    $('.metric-box').hover(
        function() {
            let value = $(this).find('.metric-value').text();
            let current = $(this).find('.metric-bar .metric-fill').width();
            let newValue = parseFloat(value);
            
            $(this).find('.metric-bar .metric-fill').stop(true, true).animate({
                width: newValue + '%'
            }, 800);
        },
        function() {
            let value = $(this).find('.metric-value').text();
            $(this).find('.metric-bar .metric-fill').width(value);
        }
    );
    
    // Service Card Flip Effect
    $('.service-card').hover(
        function() {
            $(this).css('transform', 'perspective(1000px) rotateX(5deg) translateY(-15px)');
        },
        function() {
            $(this).css('transform', 'perspective(1000px) rotateX(0) translateY(0)');
        }
    );
    
    // Testimonial Slider Auto Rotate
    let testimonialIndex = 0;
    let testimonials = $('.testimonial-card');
    let totalTestimonials = testimonials.length;
    
    function rotateTestimonials() {
        testimonials.fadeOut(400);
        testimonials.eq(testimonialIndex).fadeIn(400);
        
        testimonialIndex = (testimonialIndex + 1) % totalTestimonials;
    }
    
    // Start auto rotation
    let testimonialInterval = setInterval(rotateTestimonials, 5000);
    
    // Pause on hover
    $('.testimonials-slider').hover(
        function() { clearInterval(testimonialInterval); },
        function() { testimonialInterval = setInterval(rotateTestimonials, 5000); }
    );
    
    // Form Handling
    $('form').on('submit', function(e) {
        e.preventDefault();
        
        let submitBtn = $(this).find('button[type="submit"]');
        let originalText = submitBtn.html();
        
        submitBtn.html('<div class="spinner"></div> Processing...').prop('disabled', true);
        
        setTimeout(function() {
            alert('Thank you! Your message has been sent.');
            submitBtn.html(originalText).prop('disabled', false);
         $(this)[0].reset();
        }, 2000);
    });
    
    // Typing Effect for Hero Title
    let typingElement = null;
    let typeText = "Quantum Computing";
    let typeSpeed = 100;
    let typeIndex = 0;
    
    function typeWriter() {
        if (typeIndex < typeText.length) {
            typingElement.append(typeText.charAt(typeIndex));
            typeIndex++;
            setTimeout(typeWriter, typeSpeed);
        }
    }
    
    setTimeout(function() {
        typingElement = $('<span>').addClass('typing-effect').css({
            borderBottom: '3px solid var(--primary)'
        });
        $('#hero-subtitle').after(typingElement);
        typeWriter();
    }, 1000);
    
    // Progress Bar Animation
    $('.progress-bar').each(function() {
        let width = $(this).attr('data-width') || '0';
        $(this).css('width', '0%');
        
        setTimeout(function() {
            $(this).animate({ width: width + '%' }, 1500);
        }, 1000);
    });
    
    // Parallax Effect on Scroll
    $(window).scroll(function() {
        let scrollPosition = $(window).scrollTop();
        let parallaxElements = $('[data-parallax]');
        
        parallaxElements.each(function() {
            let speed = $(this).data('parallax') || 0.5;
            let yPos = -(scrollPosition * speed);
            $(this).css('transform', 'translateY(' + yPos + 'px)');
        });
    });
    
    // Cursor Follower
    if ($('.mouse-follower').length === 0) {
        $('body').append('<div class="mouse-follower"></div>');
    }
    
    $('.mouse-follower').mousemove(function(e) {
        $('.mouse-follower').css({
            left: e.pageX,
            top: e.pageY
        });
    });
    
    // Add hover effect to links
    $('a').mouseenter(function() {
        $('.mouse-follower').addClass('hover');
    }).mouseleave(function() {
        $('.mouse-follower').removeClass('hover');
    });
    
    // Pricing Toggle Animation
    let pricingToggle = $('#pricing-toggle');
    
    pricingToggle.on('change', function() {
        let isChecked = $(this).is(':checked');
        let priceType = isChecked ? 'monthly' : 'yearly';
        
        $('.price-item').fadeTo(300, 0.7, function() {
            $(this).delay(300).fadeTo(300, 1);
        });
        
        // Update prices based on plan
        $('.price-monthly').hide();
        $('.price-yearly').show();
        
        if (isChecked) {
            $('.price-yearly').hide();
            $('.price-monthly').show();
        }
    });
    
    // Notification System
    function showNotification(message, type) {
        let notification = $(`
            <div class="notification ${type}">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button class="close-notify"><i class="fas fa-times"></i></button>
            </div>
        `);
        
        $('.notifications-container').append(notification);
        
        notification.css({ transform: 'translateX(100%)' });
        notification.css({ animation: 'slideInRight 0.5s forwards' });
        
        setTimeout(() => {
            notification.css({ animation: 'slideInLeft 0.5s forwards' });
        }, 4000);
        
        notification.find('.close-notify').click(function() {
            notification.fadeOut(300, function() {
                $(this).remove();
            });
        });
    }
    
    // Add notifications container if not exists
    if ($('.notifications-container').length === 0) {
        $('body').append('<div class="notifications-container"></div>');
    }
    
    // Console Easter Egg
    console.log('%cNEXUS CLOUD', 'font-size: 30px; font-weight: bold; color: #6366f1;');
    console.log('%cWelcome to the future of cloud computing!', 'font-size: 14px; color: #06b6d4;');
    
    // Performance Optimizations
    window.addEventListener('load', function() {
        setTimeout(function() {
            $('body').removeClass('loading');
        }, 1000);
    });
    
    // Lazy Load Images
    if ('IntersectionObserver' in window) {
        let imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    let img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        $('img[data-src]').each(function() {
            imageObserver.observe(this);
        });
    }
    
    // Prevent Double Click Zoom on Mobile
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        let now = Date.now();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    });
    
    // Add loading screen
    $('body').prepend(`
        <div class="loading-screen">
            <div class="loader-logo">
                <i class="fas fa-cloud"></i>
            </div>
            <div class="loader-text">Loading...</div>
            <div class="loader-progress"></div>
        </div>
    `);
    
    // Loading Screen Animation
    $('.loader-progress').animate({ width: '100%' }, 2000);
});

// Global Variables
var nexusCloud = {
    version: '3.0.0',
    environment: 'production',
    
    init: function() {
        console.log('Nexus Cloud v' + this.version + ' initialized');
    },
    
    api: {
        baseUrl: 'https://api.nexuscloud.com/v3',
        key: '',
        
        setApiKey: function(key) {
            this.key = key;
        }
    }
};

nexusCloud.init();

