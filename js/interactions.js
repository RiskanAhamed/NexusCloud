/**
 * NEXUS CLOUD - Advanced Interactions & Effects
 */

// Smooth Scroll Behavior
if ('scrollBehavior' in document.documentElement.style) {
    document.documentElement.style.scrollBehavior = 'smooth';
}

// Magnetic Buttons Effect
$('.magnetic-button').hover(
    function(e) {
        let pos = $(this).offset();
        let x = e.pageX - pos.left - $(this).width() / 2;
        let y = e.pageY - pos.top - $(this).height() / 2;
        
        $(this).css({
            transform: 'translate(' + x * 0.3 + 'px, ' + y * 0.3 + 'px)'
        });
    },
    function() {
        $(this).css({
            transform: 'translate(0px, 0px)'
        });
    }
);

// Glassmorphism Enhancement
let glassElements = $('.glassmorphism');

glassElements.on('mousemove', function(e) {
    let rect = this.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    
    $(this).css({
        '--x': x + 'px',
        '--y': y + 'px'
    });
});

// Hover Glow Cards
$('.feature-card').on('mouseenter', function() {
    let color = $(this).find('.feature-icon').css('background');
    
    $(this).css({
        '--glow-color': color
    });
});

// Image Zoom on Hover
$('.service-visual img, .hero-image').on('mouseenter', function() {
    $(this).css({
        'transform': 'scale(1.05)',
        'transition': 'transform 0.4s ease'
    });
}).on('mouseleave', function() {
    $(this).css({
        'transform': 'scale(1)',
        'transition': 'transform 0.4s ease'
    });
});

// Accordion Functionality
$('.accordion-item').each(function() {
    let header = $(this).find('.accordion-header');
    let content = $(this).find('.accordion-content');
    
    header.on('click', function() {
        let currentItem = $(this).closest('.accordion-item');
        let isOpen = currentItem.hasClass('active');
        
        $('.accordion-item').removeClass('active');
        $('.accordion-content').slideUp(300);
        
        if (!isOpen) {
            currentItem.addClass('active');
            content.stop(true, true).slideDown(300);
        }
    });
});

// Tooltip System
function createTooltip(element, title) {
    element.after(`<div class="tooltip">${title}</div>`);
    
    let tooltip = element.next('.tooltip');
    
    element.hover(
        function() {
            let pos = $(this).offset();
            tooltip.css({
                left: pos.left + 'px',
                top: (pos.top - 40) + 'px',
                opacity: 1
            });
        },
        function() {
            tooltip.css('opacity', 0);
        }
    );
}

// Add tooltips where specified
$('[data-tooltip]').each(function() {
    createTooltip($(this), $(this).data('tooltip'));
});

// Sticky Sidebar for Navigation
$(window).scroll(function() {
    if ($(this).scrollTop() > 500) {
        $('.sticky-sidebar').addClass('stuck');
    } else {
        $('.sticky-sidebar').removeClass('stuck');
    }
});

// Back to Top Button
let backToTop = $('<button class="back-to-top"><i class="fas fa-arrow-up"></i></button>');
$('body').append(backToTop);

$(window).scroll(function() {
    if ($(this).scrollTop() > 300) {
        backToTop.fadeIn(300);
    } else {
        backToTop.fadeOut(300);
    }
});

backToTop.click(function() {
    $('html, body').animate({ scrollTop: 0 }, 600);
});

// Video/Audio Player Controls (Placeholder)
$('.media-player').each(function() {
    let playPauseBtn = $(this).find('.play-pause');
    let progressBar = $(this).find('.progress-bar');
    let timeDisplay = $(this).find('.time-display');
    
    let currentTime = 0;
    let duration = 180; // 3 minutes
    
    playPauseBtn.on('click', function() {
        $(this).toggleClass('playing');
        updatePlayIcon($(this));
    });
    
    function updatePlayIcon(btn) {
        if (btn.hasClass('playing')) {
            btn.find('i').addClass('fa-pause').removeClass('fa-play');
        } else {
            btn.find('i').addClass('fa-play').removeClass('fa-pause');
        }
    }
    
    setInterval(function() {
        if (currentTime < duration) {
            currentTime++;
            let mins = Math.floor(currentTime / 60);
            let secs = currentTime % 60;
            timeDisplay.text(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
            progressBar.css('width', (currentTime / duration * 100) + '%');
        }
    }, 1000);
});

// Drag and Drop File Upload
let dropZone = $('.drop-zone');

dropZone.on('dragover', function(e) {
    e.preventDefault();
    $(this).addClass('dragging');
});

dropZone.on('dragleave', function() {
    $(this).removeClass('dragging');
});

dropZone.on('drop', function(e) {
    e.preventDefault();
    $(this).removeClass('dragging');
    
    let files = e.originalEvent.dataTransfer.files;
    handleFiles(files);
});

function handleFiles(files) {
    for (let i = 0; i < files.length; i++) {
        addFileToUploadList(files[i]);
    }
}

function addFileToUploadList(file) {
    let uploadItem = $(`
        <div class="upload-item">
            <i class="fas fa-file"></i>
            <span>${file.name}</span>
            <div class="progress"></div>
        </div>
    `);
    
    $('.upload-list').append(uploadItem);
    
    // Simulate upload progress
    let progress = 0;
    let interval = setInterval(function() {
        progress += 5;
        uploadItem.find('.progress').css('width', progress + '%');
        
        if (progress >= 100) {
            clearInterval(interval);
            uploadItem.find('.progress').parent().addClass('completed');
        }
    }, 100);
}

// Color Theme Switcher
let themeSwitcher = $('#theme-switcher');

themeSwitcher.on('change', function() {
    let theme = $(this).val();
    
    switch(theme) {
        case 'dark':
            $('body').addClass('dark-theme').removeClass('light-theme');
            break;
        case 'light':
            $('body').addClass('light-theme').removeClass('dark-theme');
            break;
        case 'midnight':
            $('body').addClass('midnight-theme').removeClass('dark-theme light-theme');
            break;
    }
    
    localStorage.setItem('nexusTheme', theme);
});

// Search Functionality
let searchInput = $('#search-input');
let searchResults = $('#search-results');

searchInput.on('input', function() {
    let query = $(this).val().toLowerCase();
    
    if (query.length > 2) {
        performSearch(query);
    } else {
        searchResults.hide();
    }
});

function performSearch(query) {
    let results = [];
    
    $('.nav-link').each(function() {
        let text = $(this).text().toLowerCase();
        if (text.includes(query)) {
            results.push($(this));
        }
    });
    
    displayResults(results, query);
}

function displayResults(results, query) {
    searchResults.empty();
    
    results.forEach(result => {
        let match = result.text().match(new RegExp(query, 'gi'));
        let html = `<div class="result-item">${result[0]}</div>`;
        searchResults.append(html);
    });
    
    searchResults.show();
}

// Keyboard Shortcuts
$(document).keydown(function(e) {
    switch(e.key) {
        case '/':
            e.preventDefault();
            $('#search-input').focus();
            break;
        case 'Escape':
            $('.dropdown-menu, .modal, .tooltip').hide();
            break;
        case 't':
            if (e.ctrlKey || e.metaKey) {
                themeSwitcher.focus();
            }
            break;
    }
});

// Speech Recognition Integration (Placeholder)
if ('webkitSpeechRecognition' in window) {
    let recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    
    $('.voice-command').on('click', function() {
        let btn = $(this);
        btn.find('i').addClass('pulse');
        recognition.start();
        
        recognition.onresult = function(event) {
          let command = event.results[0][0].transcript.toLowerCase();
            executeCommand(command);
        };
        
        recognition.onend = function() {
            btn.find('i').removeClass('pulse');
        };
    });
}

function executeCommand(command) {
    if (command.includes('home')) {
        $('a[href="index.html"]').click();
    } else if (command.includes('about')) {
        $('a[href="#about"]').click();
    } else if (command.includes('services')) {
        $('a[href="#services"]').click();
    } else if (command.includes('contact')) {
        $('a[href="#contact"]').click();
    }
}

// Analytics Tracking (Placeholder)
class AnalyticsTracker {
    constructor() {
        this.events = [];
    }
    
    trackPageView(page) {
        this.events.push({
            type: 'pageview',
            page: page,
            timestamp: new Date().toISOString()
        });
        this.sendToServer();
    }
    
    trackClick(element) {
        this.events.push({
            type: 'click',
            element: element,
            timestamp: new Date().toISOString()
        });
    }
    
    sendToServer() {
        // In production, send to analytics server
        console.log('Analytics:', this.events[this.events.length - 1]);
    }
}

let tracker = new AnalyticsTracker();

tracker.trackPageView(window.location.pathname);

// Click tracking
$(document).on('click', '*', function() {
    tracker.trackClick(this.tagName);
});

// Error Boundary for JS Errors
window.onerror = function(message, source, lineno, colno, error) {
    console.error('Error:', message);
    
    // Show friendly error message to user
    if (!$('.error-overlay').length) {
        let errorOverlay = $(`
            <div class="error-overlay">
                <h3>Something went wrong</h3>
                <p>We encountered an unexpected error.</p>
                <button onclick="location.reload()">Refresh Page</button>
            </div>
        `);
        $('body').append(errorOverlay);
    }
};

// Performance Monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        let timing = performance.timing;
        let loadTime = timing.domContentLoadedEventEnd - timing.navigationStart;
        console.log('Page Load Time:', loadTime + 'ms');
    });
}

// Service Worker Registration (PWA Support)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registered:', registration.scope);
        }).catch(function(err) {
            console.log('ServiceWorker registration failed:', err);
        });
    });
}

// Touch Gesture Support
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, false);

document.addEventListener('touchend', function(e) {
    let touchEndX = e.changedTouches[0].screenX;
    let touchEndY = e.changedTouches[0].screenY;
    
    let deltaX = touchEndX - touchStartX;
    let deltaY = touchEndY - touchStartY;
    
    if (Math.abs(deltaX) > 50) {
        handleSwipe(deltaX > 0 ? 'right' : 'left');
    } else if (Math.abs(deltaY) > 50) {
        handleSwipe(deltaY > 0 ? 'down' : 'up');
    }
});

function handleSwipe(direction) {
    console.log('Swipe detected:', direction);
    
    switch(direction) {
        case 'left':
            // Go to next section
            break;
        case 'right':
            // Go to previous section
            break;
        case 'up':
            // Open menu
            break;
        case 'down':
            // Close menu
            break;
    }
}

// Dashboard Sidebar - Active State Toggle
$('.sidebar-menu a').on('click', function(e) {
    e.preventDefault();
    $('.sidebar-menu a').removeClass('active');
    $(this).addClass('active');
});

console.log('✅ All interactions loaded successfully');
