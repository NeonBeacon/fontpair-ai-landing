// 5. 3D Carousel Logic
const carouselRing = document.querySelector('.carousel-ring');
if (carouselRing) {
    const items = gsap.utils.toArray('.carousel-item');
    const itemCount = items.length;
    const radius = 500; // Radius for separation
    const angleStep = 360 / itemCount;

    // Position items in 3D space using explicit X/Z (Trigonometry)
    items.forEach((item, i) => {
        const angle = i * angleStep;
        const radian = angle * (Math.PI / 180);

        // Calculate explicit coordinates on the circle
        // sin/cos orientation depends on where 0 is. 
        // standard: x = sin, z = cos works for this coordinate system often.
        const x = radius * Math.sin(radian);
        const z = radius * Math.cos(radian);

        // Stagger Y position
        const yOffset = i % 2 === 0 ? -40 : 40;

        // Set initial base state
        gsap.set(item, {
            x: x,
            z: z,
            y: yOffset,
            rotationY: angle, // Face outward/center matches the ring angle
            transformOrigin: "50% 50%", // Rotate around its own center
            backfaceVisibility: 'hidden',
            transformStyle: "preserve-3d"
        });

        // Reset image transform (remove all previous tweaks)
        const img = item.querySelector('img');
        if (img) gsap.set(img, { z: 0, rotationY: 0, rotationX: 0 });

        // 1. Floating (Bobbing) - Animate Y
        gsap.to(item, {
            y: yOffset + 30,
            duration: 2 + Math.random(),
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            delay: Math.random() * 2
        });

        // 2. Local Wobble (Planetary Spin) - Animate the CARD itself
        gsap.to(item, {
            rotationY: angle + 25, // Wobble around the base angle
            rotationX: 10,         // Slight tilt
            duration: 4 + Math.random(),
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            delay: Math.random() * 2
        });
    });

    // Push ring back so front item is near Z=0
    gsap.set(carouselRing, { z: -radius });

    // Main Orbit
    const carouselTL = gsap.timeline({ repeat: -1 });
    carouselTL.to(carouselRing, {
        rotationY: -360,
        duration: 40,
        ease: 'none'
    });

    // Interactive Controls
    const toggleBtn = document.querySelector('#carousel-toggle');
    const speedSlider = document.querySelector('#speed-slider');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            if (carouselTL.isActive()) {
                carouselTL.pause();
                toggleBtn.textContent = '▶';
            } else {
                carouselTL.resume();
                toggleBtn.textContent = '⏸';
            }
        });
    }

    if (speedSlider) {
        carouselTL.timeScale(0.5);
        speedSlider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            gsap.to(carouselTL, { timeScale: val, duration: 0.5 });
        });
    }

    // Hover Effect
    items.forEach(item => {
        item.addEventListener('mouseenter', () => {
            carouselTL.pause();
            // Lift effect
            gsap.to(item, { scale: 1.15, zIndex: 100, boxShadow: '0 35px 70px -10px rgba(0,0,0,0.5)', duration: 0.4 });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(item, { scale: 1, zIndex: 0, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', duration: 0.4 });
            if (toggleBtn && toggleBtn.textContent === '⏸') {
                carouselTL.resume();
            }
        });
    });
}
