// Kinetic Carousel Logic - Standalone Package

document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Kinetic Carousel Initializing...");

    // 1. Register GSAP Plugins (if included via script tags)
    // Assumes ScrollTrigger/SplitText might not be needed for just the carousel 
    // unless we want scroll scrubbing, but the user asked for the "package".
    // We'll focus on the core animation.

    // 5. 3D Carousel Logic
    const carouselRing = document.querySelector('.carousel-ring');
    if (carouselRing) {
        const items = gsap.utils.toArray('.carousel-item');
        const itemCount = items.length;
        const radius = 500; // Large radius for clear separation
        const angleStep = 360 / itemCount;

        // Position items in 3D space using TransformOrigin Offset (Robust Method)
        items.forEach((item, i) => {
            // Stagger Y position
            const yOffset = i % 2 === 0 ? -40 : 40;

            gsap.set(item, {
                // Pivot around a point 500px behind the item -> Creates ring
                transformOrigin: `50% 50% ${-radius}px`,
                rotationY: i * angleStep,
                z: 0,
                x: 0,
                y: yOffset,
                backfaceVisibility: 'hidden'
            });

            // 1. Independent Floating (Bobbing) - Animate Y
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
                rotationY: angleStep * i + 25, // Wobble around the base angle
                rotationX: 10,         // Slight tilt
                duration: 4 + Math.random(),
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut",
                delay: Math.random() * 2
            });
        });

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

        // Hover Effect Container
        let kineticLayer = document.getElementById('kinetic-layer');
        if (!kineticLayer) {
            kineticLayer = document.createElement('div');
            kineticLayer.id = 'kinetic-layer';
            document.body.appendChild(kineticLayer);
        }

        // Impact Effect Function
        function spawnImpact(x, y, textContent) {
            // Clear previous effects instantly
            kineticLayer.innerHTML = '';

            // 1. Core
            const core = document.createElement('div');
            core.className = 'impact-core';
            core.style.left = x + 'px';
            core.style.top = y + 'px';
            kineticLayer.appendChild(core);

            // 2. Text
            const label = document.createElement('div');
            label.className = 'kinetic-text';
            label.textContent = textContent;
            label.style.left = x + 'px';
            label.style.top = y + 'px';
            kineticLayer.appendChild(label);

            // 3. Lines
            const lineCount = 12;
            const lines = [];
            for (let i = 0; i < lineCount; i++) {
                const line = document.createElement('div');
                line.className = 'impact-line';
                line.style.left = x + 'px';
                line.style.top = y + 'px';
                line.style.transform = `rotate(${i * (360 / lineCount)}deg)`;
                kineticLayer.appendChild(line);
                lines.push(line);
            }

            const tl = gsap.timeline();

            // Phase 1: Impact (Flash)
            tl.to(core, { scale: 2, opacity: 1, duration: 0.05, ease: 'power4.in' })
                // Lines shoot out concurrently
                .to(lines, {
                    scaleX: 1.5,
                    x: (i) => Math.cos(i * (Math.PI * 2 / lineCount)) * 100, // Fly outward
                    y: (i) => Math.sin(i * (Math.PI * 2 / lineCount)) * 100,
                    opacity: 1,
                    duration: 0.1
                }, 0);

            // Phase 2: Reveal
            tl.to(core, { scale: 3, opacity: 0, duration: 0.1 }, 0.05)
                .to(label, {
                    scale: 1,
                    rotation: -5,
                    opacity: 1,
                    duration: 0.4,
                    ease: 'elastic.out(1, 0.4)'
                }, 0.05);

            // Phase 3: Aftershock
            tl.to(lines, {
                x: (i) => Math.cos(i * (Math.PI * 2 / lineCount)) * 300, // Continue flying far
                y: (i) => Math.sin(i * (Math.PI * 2 / lineCount)) * 300,
                opacity: 0,
                scaleX: 0.5,
                duration: 0.8,
                ease: 'power1.out'
            }, 0.1)
                .to(label, {
                    y: '-=10', // Float up slightly
                    duration: 2,
                    ease: 'sine.inOut',
                    yoyo: true,
                    repeat: -1
                }, 0.5);
        }

        // Hover Listeners
        items.forEach(item => {
            item.addEventListener('mouseenter', (e) => {
                carouselTL.pause();
                // Lift effect
                gsap.to(item, { scale: 1.15, boxShadow: '0 35px 70px -10px rgba(0,0,0,0.5)', zIndex: 100, duration: 0.4 });

                // Trigger Impact
                spawnImpact(e.clientX + 50, e.clientY - 50, item.getAttribute('title'));
            });

            item.addEventListener('mouseleave', () => {
                gsap.to(item, { scale: 1, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', zIndex: 0, duration: 0.4 });

                // Fade out text
                gsap.to('#kinetic-layer', {
                    opacity: 0, duration: 0.2, onComplete: () => {
                        const layer = document.getElementById('kinetic-layer');
                        if (layer) layer.innerHTML = '';
                        layer.style.opacity = 1;
                    }
                });

                if (toggleBtn && toggleBtn.textContent === '⏸') {
                    carouselTL.resume();
                }
            });
        });
    }
});
