import { useEffect, useRef } from 'react';

export const StarDust = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let particles: Particle[] = [];
        let animationFrameId: number;
        let mouseX = 0;
        let mouseY = 0;

        // Handle Resize
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        // Mouse Move
        const onMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            createParticles(3); // Create a few particles on move
        };
        window.addEventListener('mousemove', onMouseMove);

        class Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            life: number;
            color: string;

            constructor() {
                this.x = mouseX;
                this.y = mouseY;
                this.size = Math.random() * 2 + 0.5; // Small dust size
                this.speedX = Math.random() * 2 - 1;
                this.speedY = Math.random() * 2 - 1;
                this.life = 100;
                // Gold/Yellowish tint for "Star Dust"
                this.color = `rgba(255, 215, 0, ${Math.random()})`;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.life -= 1.5; // Fade out speed
                if (this.size > 0.1) this.size -= 0.01;
            }

            draw() {
                if (!ctx) return;
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.life / 100;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }

        function createParticles(count: number) {
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }

            // Remove dead particles
            particles = particles.filter(p => p.life > 0);

            animationFrameId = requestAnimationFrame(animate);
        }

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-50 text-white mix-blend-screen"
        />
    );
};
