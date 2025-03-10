document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.main-nav a');
    const baseOffset = 100; // Base offset for most sections
    const startupsOffset = 80; // Special offset for startups
    let isScrolling = false;

    // Startup overlays functionality
    const ipelintBox = document.querySelector('.ipelint-box');
    const stealthBox = document.querySelector('.stealth-box');
    const ipelintOverlay = document.querySelector('#ipelint-overlay');
    const stealthOverlay = document.querySelector('#stealth-overlay');
    const closeButtons = document.querySelectorAll('.close-btn');

    ipelintBox.addEventListener('click', () => {
        ipelintOverlay.classList.add('active');
        document.body.classList.add('no-scroll');
    });

    stealthBox.addEventListener('click', () => {
        stealthOverlay.classList.add('active');
        document.body.classList.add('no-scroll');
    });

    closeButtons.forEach(btn => {
        btn.addEventListener('click', (event) => {
            event.stopPropagation();
            ipelintOverlay.classList.remove('active');
            stealthOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });

    // Portfolio item flip
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('flipped');
        });
    });

    function smoothScroll(target, duration = 1000) {
        const start = window.pageYOffset;
        let adjustedTarget = target;
        
        // Check if we're scrolling to the startups section
        const targetId = document.querySelector(`[style*="transform: translate3d(0px, ${target}px, 0px)"]`)?.parentElement?.id;
        if (targetId === 'startups') {
            adjustedTarget = target - startupsOffset;
        }
        
        const distance = adjustedTarget - start;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            const ease = t => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            
            window.scrollTo(0, start + (distance * ease(progress)));
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            } else {
                isScrolling = false;
            }
        }
        
        requestAnimationFrame(animation);
    }

    function calculateCenterOffset(targetSection) {
        const windowHeight = window.innerHeight;
        const sectionHeight = targetSection.querySelector('.about-content, .speaking-content, .consulting-content').offsetHeight;
        return (windowHeight - sectionHeight) / 2;
    }

    // Update the navigation click handler
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            let targetPosition;
            
            switch(targetId) {
                case 'about':
                    // Increased offset slightly to hide the picture completely
                    targetPosition = targetSection.offsetTop - 80;
                    break;
                case 'speaking':
                case 'consulting':
                    const windowHeight = window.innerHeight;
                    const contentHeight = targetSection.querySelector(`.${targetId}-content`).offsetHeight;
                    const headerHeight = document.querySelector('.site-header').offsetHeight;
                    targetPosition = targetSection.offsetTop - (windowHeight / 2) + (contentHeight / 2) - headerHeight;
                    break;
                case 'startups':
                    targetPosition = targetSection.offsetTop - startupsOffset;
                    break;
                case 'home':
                    targetPosition = 0;
                    break;
                default:
                    targetPosition = targetSection.offsetTop - baseOffset;
            }
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

    // Update the navigation highlighting function
    function updateNavigation() {
        const scrollPosition = window.pageYOffset + (window.innerHeight / 3);
        const header = document.querySelector('.site-header');

        sections.forEach((section, index) => {
            let sectionTop;
            
            // Adjust section top calculation based on section
            switch(section.id) {
                case 'startups':
                    sectionTop = section.offsetTop - startupsOffset;
                    break;
                case 'home':
                    sectionTop = 0;
                    break;
                case 'about':
                case 'speaking':
                case 'consulting':
                    const viewportHeight = window.innerHeight;
                    const sectionHeight = section.offsetHeight;
                    const centerOffset = (viewportHeight - sectionHeight) / 2;
                    sectionTop = section.offsetTop - centerOffset - baseOffset;
                    break;
                default:
                    sectionTop = section.offsetTop - baseOffset;
                    break;
            }
            
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLinks[index].classList.add('active');
                
                if (index === 0) {
                    document.body.classList.add('home');
                } else {
                    document.body.classList.remove('home');
                }
            }
        });
    }

    // Handle scroll events with throttling
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }

        scrollTimeout = window.requestAnimationFrame(() => {
            updateNavigation();
        });
    });

    // Set initial active section based on URL hash or default to home
    const hash = window.location.hash.substring(1) || 'home';
    const initialSection = document.getElementById(hash);
    if (initialSection) {
        const targetPosition = initialSection.offsetTop - baseOffset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'auto'
        });
    }

    // Initial navigation update
    updateNavigation();

    // Contact Form Handling
    document.getElementById('contactForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const form = document.getElementById('contactForm');
        const formData = new FormData();
        
        formData.append('entry.518714230', document.getElementById('firstName').value);
        formData.append('entry.1536066533', document.getElementById('lastName').value);
        formData.append('entry.1624606917', document.getElementById('email').value);
        formData.append('entry.281219711', document.getElementById('phone').value);
        formData.append('entry.1786678814', document.getElementById('company').value);
        formData.append('entry.1103642755', document.getElementById('interest').value);
        formData.append('entry.1553141150', document.getElementById('message').value);

        const formId = '1FAIpQLSetvlaZnziXFBcPVE_UXgAOpw2Qu97QFBzWS1vZ3a4zPi0YlA';
        const submitUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`;

        try {
            // Submit form data using fetch
            const response = await fetch(submitUrl, {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            });

            // Clear the form
            form.reset();

            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'form-success';
            successMessage.textContent = 'Thank you! Your message has been sent successfully.';
            
            // Insert success message after the form
            form.parentNode.insertBefore(successMessage, form.nextSibling);

            // Remove success message after 5 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 5000);

        } catch (error) {
            console.error('Error submitting form:', error);
            alert('There was an error submitting the form. Please try again.');
        }
    });

    // Get modal elements
    const privacyModal = document.getElementById('privacy-modal');
    const termsModal = document.getElementById('terms-modal');
    const privacyLink = document.getElementById('privacy-link');
    const termsLink = document.getElementById('terms-link');

    // Open privacy modal
    privacyLink.onclick = function(e) {
        e.preventDefault();
        privacyModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Open terms modal
    termsLink.onclick = function(e) {
        e.preventDefault();
        termsModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Close modals when clicking X
    document.querySelector('#privacy-modal .close-modal').onclick = function() {
        privacyModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    document.querySelector('#terms-modal .close-modal').onclick = function() {
        termsModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Close modals when clicking outside
    window.onclick = function(event) {
        if (event.target == privacyModal || event.target == termsModal) {
            privacyModal.style.display = 'none';
            termsModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Add this to your existing JavaScript
    document.querySelectorAll('.footer-nav').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            const section = document.getElementById(sectionId);
            const headerOffset = document.querySelector('.site-header').offsetHeight;
            const elementPosition = section.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });

    // Add this to handle footer links for Speaking and Consulting
    document.querySelector('.footer-section a[href="#speaking"]').addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('.main-nav a[href="#speaking"]').click();
    });

    document.querySelector('.footer-section a[href="#consulting"]').addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('.main-nav a[href="#consulting"]').click();
    });

    // Add this to handle footer links for Contact
    document.querySelector('.footer-section a[href="#contact"]').addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('.main-nav a[href="#contact"]').click();
    });

    function goToContact(interest) {
        // First scroll to contact section
        document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
        
        // Wait a brief moment to ensure the form is in view and accessible
        setTimeout(() => {
            // Get the interest select element
            const interestSelect = document.querySelector('select[name="entry.1103642755"]');
            if (interestSelect) {
                interestSelect.value = interest;
            }
        }, 100);
    }

    function setInterest(interest) {
        setTimeout(() => {
            const interestSelect = document.querySelector('select[name="entry.1103642755"]');
            if (interestSelect) {
                interestSelect.value = interest;
            }
        }, 100);
    }
}); 