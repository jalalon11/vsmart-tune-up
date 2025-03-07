document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll functionality
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll to top when logo is clicked
    const logo = document.getElementById('logo');
    logo.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Mobile menu toggle functionality
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuItems = document.querySelectorAll('.mobile-menu-item');
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        mobileMenuButton.classList.toggle('open');
        mobileMenu.classList.toggle('show');

        // Animate menu items
        const menuItems = mobileMenu.querySelectorAll('.mobile-menu-item');
        menuItems.forEach((item, index) => {
            if (isMenuOpen) {
                item.style.opacity = '0';
                item.style.transform = 'translateX(-20px)';
                setTimeout(() => {
                    item.style.transition = 'all 0.3s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, index * 100);
            }
        });
    }

    mobileMenuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
            toggleMenu();
        }
    });

    // Close mobile menu when clicking on a menu item
    mobileMenuItems.forEach(item => {
        item.addEventListener('click', () => {
            if (isMenuOpen) {
                toggleMenu();
            }
        });
    });

    // Add scroll event listener to handle menu appearance
    let lastScrollTop = 0;
    const nav = document.querySelector('nav');

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop) {
            // Scrolling down
            if (isMenuOpen) {
                toggleMenu();
            }
        }
        
        if (scrollTop > 100) {
            nav.classList.add('bg-black', 'bg-opacity-95', 'backdrop-blur-lg');
        } else {
            nav.classList.remove('bg-black', 'bg-opacity-95', 'backdrop-blur-lg');
        }
        
        lastScrollTop = scrollTop;
    });

    // Modal functionality
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            document.body.style.overflow = 'hidden';
            
            // Reset and trigger animation
            const modalContent = modal.querySelector('.modal-content, .modal-fade-in');
            if (modalContent) {
                modalContent.style.transform = 'translateY(30px)';
                modalContent.style.opacity = '0';
                // Force reflow
                modalContent.offsetHeight;
                modalContent.style.transform = 'translateY(0)';
                modalContent.style.opacity = '1';
            }
        }
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            const modalContent = modal.querySelector('.modal-content, .modal-fade-in');
            if (modalContent) {
                modalContent.style.transform = 'translateY(30px)';
                modalContent.style.opacity = '0';
            }
            
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                document.body.style.overflow = 'auto';
            }, 300);
        }
    }

    // Add click event listeners to service cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', () => {
            const modalId = card.getAttribute('data-modal-target');
            if (modalId) {
                openModal(modalId);
            }
        });
    });

    // Add click event listeners to leadership cards
    document.querySelectorAll('.founder-card').forEach(card => {
        card.addEventListener('click', () => {
            const modalId = card.getAttribute('data-modal-target');
            if (modalId) {
                openModal(modalId);
            }
        });
    });

    // Add click event listeners to close buttons
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const modal = button.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });

    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    // Make modal functions globally available
    window.openModal = openModal;
    window.closeModal = closeModal;

    // Scroll animations
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight * 0.85 && elementBottom > 0) {
                element.classList.add('animate-in');
            }
        });
    };

    // Initial check for elements in view
    animateOnScroll();

    // Add scroll event listener with throttling
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                animateOnScroll();
                scrollTimeout = null;
            }, 50);
        }
    });

    // Stats Counter Animation
    const counters = document.querySelectorAll('.counter');
    const statsSection = document.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-4');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    };

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(counter => {
                    if (!counter.hasAttribute('data-animated')) {
                        counter.setAttribute('data-animated', 'true');
                        animateCounter(counter);
                    }
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    if (statsSection) {
        observer.observe(statsSection);
    }

    // Remove the old event listeners
    const founderCard = document.querySelector('.founder-card[onclick*="founderModal"]');
    const cofounderCard = document.querySelector('.founder-card[onclick*="cofounderModal"]');

    // Add click event listeners directly to the cards
    if (founderCard) {
        founderCard.addEventListener('click', function() {
            openModal('founderModal');
        });
    }

    if (cofounderCard) {
        cofounderCard.addEventListener('click', function() {
            openModal('cofounderModal');
        });
    }

    // Prevent social media links from triggering the modal
    document.querySelectorAll('.founder-social a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });

    // Initialize floating icons movement
    const floatingIcons = document.querySelectorAll('.floating-icon');
    
    floatingIcons.forEach(icon => {
        // Set initial random position within boundaries
        const wrapper = document.querySelector('.floating-icons-wrapper');
        const wrapperRect = wrapper.getBoundingClientRect();
        const iconRect = icon.getBoundingClientRect();
        
        let x = Math.random() * (wrapperRect.width - iconRect.width);
        let y = Math.random() * (wrapperRect.height - iconRect.height);
        
        // Set fixed diagonal movement speed
        let dx = 1.5; // Slightly slower speed
        let dy = 1.5; // Slightly slower speed
        let isHovered = false;
        
        // Randomly choose initial direction
        if (Math.random() > 0.5) dx *= -1;
        if (Math.random() > 0.5) dy *= -1;

        // Set initial position
        icon.style.transform = `translate(${x}px, ${y}px)`;

        // Add hover listeners
        icon.addEventListener('mouseenter', () => {
            isHovered = true;
            icon.style.transform = `translate(${x}px, ${y}px) scale(1.15)`;
        });

        icon.addEventListener('mouseleave', () => {
            isHovered = false;
            icon.style.transform = `translate(${x}px, ${y}px)`;
        });

        // Animation function
        function moveIcon() {
            if (!isHovered) {
                // Update position
                x += dx;
                y += dy;

                // Boundary check and bounce
                const padding = 10; // Reduced padding
                if (x <= padding || x >= wrapperRect.width - iconRect.width - padding) {
                    dx *= -1; // Reverse horizontal direction
                    x = Math.max(padding, Math.min(x, wrapperRect.width - iconRect.width - padding));
                }
                if (y <= padding || y >= wrapperRect.height - iconRect.height - padding) {
                    dy *= -1; // Reverse vertical direction
                    y = Math.max(padding, Math.min(y, wrapperRect.height - iconRect.height - padding));
                }

                // Apply new position with smooth transition
                icon.style.transition = 'transform 0.05s linear';
                icon.style.transform = `translate(${x}px, ${y}px)`;
            }
            requestAnimationFrame(moveIcon);
        }

        // Start animation
        moveIcon();
    });

    // Initialize AOS
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserverOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, timelineObserverOptions);

    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
});

const particleVertex = `
    attribute float scale;
    uniform float uTime;

    void main() {
        vec3 p = position;
        float s = scale;

        p.y += (sin(p.x + uTime) * 0.5) + (cos(p.y + uTime) * 0.1) * 2.0;
        p.x += (sin(p.y + uTime) * 0.5);
        s += (sin(p.x + uTime) * 0.5) + (cos(p.y + uTime) * 0.1) * 2.0;

        vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = s * 15.0 * (1.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
    }
`;

const particleFragment = `
    void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 0.5);
    }
`;

function lerp(start, end, amount) {
    return (1 - amount) * start + amount;
}

class Canvas {
    constructor() {
        this.heroSection = document.querySelector('section');
        this.config = {
            canvas: document.querySelector('#hero-canvas'),
            winWidth: this.heroSection.clientWidth,
            winHeight: this.heroSection.clientHeight,
            aspectRatio: this.heroSection.clientWidth / this.heroSection.clientHeight,
            mouse: new THREE.Vector2(-10, -10)
        };

        this.onResize = this.onResize.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.animate = this.animate.bind(this);

        this.initCamera();
        this.initScene();
        this.initRenderer();
        this.initParticles();
        this.bindEvents();
        this.animate();
    }

    bindEvents() {
        window.addEventListener('resize', this.onResize);
        this.heroSection.addEventListener('mousemove', this.onMouseMove, false);
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(75, this.config.aspectRatio, 0.01, 1000);
        this.camera.position.set(0, 6, 5);
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
    }

    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.config.canvas,
            antialias: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.config.winWidth, this.config.winHeight);
    }

    initParticles() {
        const gap = 0.3;
        const amountX = 100; // Reduced for better performance
        const amountY = 100; // Reduced for better performance
        const particleNum = amountX * amountY;
        const particlePositions = new Float32Array(particleNum * 3);
        const particleScales = new Float32Array(particleNum);
        let i = 0;
        let j = 0;

        for (let ix = 0; ix < amountX; ix++) {
            for (let iy = 0; iy < amountY; iy++) {
                particlePositions[i] = ix * gap - ((amountX * gap) / 2);
                particlePositions[i + 1] = 0;
                particlePositions[i + 2] = iy * gap - ((amountX * gap) / 2);
                particleScales[j] = 1;
                i += 3;
                j++;
            }
        }

        this.particleGeometry = new THREE.BufferGeometry();
        this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        this.particleGeometry.setAttribute('scale', new THREE.BufferAttribute(particleScales, 1));

        this.particleMaterial = new THREE.ShaderMaterial({
            transparent: true,
            vertexShader: particleVertex,
            fragmentShader: particleFragment,
            uniforms: {
                uTime: { type: 'f', value: 0 }
            }
        });
        this.particles = new THREE.Points(this.particleGeometry, this.particleMaterial);
        this.scene.add(this.particles);
    }

    render() {
        this.camera.lookAt(this.scene.position);
        this.renderer.render(this.scene, this.camera);
    }

    animate() {
        this.particleMaterial.uniforms.uTime.value += 0.05;
        requestAnimationFrame(this.animate);
        this.render();
    }

    onMouseMove(e) {
        const rect = this.heroSection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (y >= 0 && y <= rect.height) {
            this.config.mouse.x = (x / rect.width) * 2 - 1;
            this.config.mouse.y = -(y / rect.height) * 2 + 1;
        }
    }

    onResize() {
        const rect = this.heroSection.getBoundingClientRect();
        this.config.winWidth = rect.width;
        this.config.winHeight = rect.height;
        this.config.aspectRatio = rect.width / rect.height;
        
        this.camera.aspect = this.config.aspectRatio;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.config.winWidth, this.config.winHeight);
    }
}

// Initialize canvas after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Canvas();
});