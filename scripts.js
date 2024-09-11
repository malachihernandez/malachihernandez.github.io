document.addEventListener('DOMContentLoaded', function() {
    const typedText = document.getElementById('typed-text');
    const cursor = document.getElementById('cursor');
    const header = document.getElementById('animated-header');
    const heroImageContainer = document.querySelector('.image-container');
    const heroText = document.getElementById('hero-text');
    const hero1 = document.querySelector('.hero');
    const prevButton = document.querySelector('.hero-prev');
    const nextButton = document.querySelector('.hero-next');
    const text = "Welcome"; // Text to type
    const delay = 300; // Delay between letters in milliseconds
    let currentIndex = 0;
    let autoScrollInterval;

    // Clear existing text and cursor styles before starting new animation
    function clearAnimation() {
        typedText.innerHTML = ''; // Clear any existing typed text
        cursor.style.animation = 'none'; // Reset cursor animation
        cursor.textContent = '|'; // Reset cursor
    }

    // Function to start typing animation
    function startTyping() {
        clearAnimation(); // Clear previous animations

        let index = 0;

        function typeLetter() {
            if (index < text.length) {
                const letter = document.createElement('span');
                letter.textContent = text.charAt(index);
                letter.className = 'letter';
                typedText.appendChild(letter);
                index++;
                setTimeout(typeLetter, delay);
            } else {
                setTimeout(() => {
                    cursor.style.animation = 'fallIntoPeriod 0.5s forwards';
                    cursor.textContent = '.';
                    cursor.style.animation = 'none';

                    setTimeout(() => {
                        header.classList.add('shifted');
                        heroImageContainer.style.opacity = '1';

                        setTimeout(() => {
                            heroText.style.opacity = '1';

                            // Start the transition to Hero Section 1 after the delay
                            setTimeout(() => {
                                showHero(); // Show only Hero 1
                                startAutoScroll(); // Start auto-scroll
                            }, 5000); // 5 seconds delay
                        }, 1500);
                    }, 1500);
                }, 600);
            }
        }

        typeLetter();
    }

    // Blink cursor three times before starting typing
    setTimeout(startTyping, 1500);

    // Smooth scrolling for anchor links
    document.querySelectorAll('.smooth-scroll').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
            const startPosition = window.scrollY;
            const distance = targetPosition - startPosition;
            const duration = 1500;
            let startTime = null;

            function animation(currentTime) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const run = ease(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
            }

            function ease(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            }

            requestAnimationFrame(animation);
        });
    });

    // Function to show Hero Section 1
    function showHero() {
        hero1.style.opacity = '1';
        hero1.style.left = '0';
        hero1.style.width = '100%'; // Ensure full width for Hero 1
    }

    // Auto-scroll to the next hero section (only one section now)
    function autoScroll() {
        // No other section to scroll to
    }

    // Start auto-scroll
    function startAutoScroll() {
        clearInterval(autoScrollInterval); // Clear any previous interval
        autoScrollInterval = setInterval(autoScroll, 10000); // Start auto-scroll with 10 seconds interval
    }

    // Add event listeners for arrows (no next section to navigate to)
    prevButton.addEventListener('click', () => {
        // No other section to navigate to
    });

    nextButton.addEventListener('click', () => {
        // No other section to navigate to
    });

    // Initial auto-scroll start
    startAutoScroll();
});

// JavaScript for changing header color on scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    
    // Change header color based on scroll position
    if (window.scrollY > 0) {
        header.classList.add('scroll-header');
    } else {
        header.classList.remove('scroll-header');
    }

    // Check if sections are in view
    const sections = ['about', 'contact', 'services'];
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (isInViewport(section)) {
            section.classList.add('in-view');
        } else {
            section.classList.remove('in-view');
        }
    });
});

// Helper function to check if an element is in the viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Contact Section Animation
document.addEventListener('DOMContentLoaded', function () {
    const section = document.querySelector('#contact');
    const sectionHeader = section.querySelector('.section-header');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                sectionHeader.style.opacity = 1; // Ensure the header stays visible
                sectionHeader.style.transition = 'opacity 1s ease-in-out'; // Add fade-in effect
                observer.unobserve(entry.target); // Stop observing once the header is visible
            }
        });
    }, {
        threshold: 0.1 // Adjust threshold as needed
    });

    observer.observe(section);
});

//Form Verfication
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const errorMessage = document.getElementById('errorMessage');
    const formMessages = document.getElementById('form-messages');
    
    // Flag to prevent multiple form submissions
    let formSubmitted = false;

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the default form submission

        // Check form validity
        if (!form.checkValidity()) {
            // If the form is not valid, add invalid class to fields and show error message
            const fields = form.querySelectorAll('input, select, textarea');
            fields.forEach(field => {
                if (!field.checkValidity()) {
                    field.classList.add('invalid');
                } else {
                    field.classList.remove('invalid');
                }
            });
            errorMessage.textContent = 'Please fill in all required fields correctly.';
            return; // Exit the function if the form is invalid
        }

        // If the form is valid, clear any previous error messages
        errorMessage.textContent = '';

        // Only allow one submission to avoid multiple alerts
        if (formSubmitted) {
            return;
        }
        formSubmitted = true;

        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        fetch('https://script.google.com/macros/s/AKfycbwBl4fjJUf84TSmxpFfiDmTntV_zR10dKrL2Esx-R0xv-daRmr-IAsWghmSfpE7n1kj/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                form.reset(); // Reset the form only after successful submission
                formMessages.textContent = 'Form submitted successfully!'; // Show success message

                // Clear success message after 5 seconds
                setTimeout(() => {
                    formMessages.textContent = '';
                }, 5000);

                // Reset the submission flag after some time
                setTimeout(() => { formSubmitted = false; }, 3000);
            } else {
                errorMessage.textContent = 'An error occurred. Please try again.';
                formSubmitted = false; // Reset flag if submission fails
            }
        })
        .catch(error => {
            console.error('Error:', error);
            errorMessage.textContent = 'An error occurred. Please try again.';
            formSubmitted = false; // Reset flag if submission fails
        });
    });
});


//Java to handle portfolio full screen overlay //
document.querySelector('.ipelint-box').addEventListener('click', function() {
    document.querySelector('.fullscreen-overlay').classList.add('active');
    document.body.classList.add('no-scroll'); // Prevent background scrolling
});

document.querySelector('.close-btn').addEventListener('click', function(event) {
    event.stopPropagation(); // Prevent the click event from bubbling up to the parent
    document.querySelector('.fullscreen-overlay').classList.remove('active');
    document.body.classList.remove('no-scroll'); // Re-enable background scrolling
});

// About Card Flipping Java //
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', function() {
        // Close any already opened cards
        document.querySelectorAll('.card.flipped').forEach(flippedCard => {
            if (flippedCard !== card) {
                flippedCard.classList.remove('flipped');
            }
        });

        // Toggle the current card
        card.classList.toggle('flipped');
    });
});

