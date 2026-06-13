/**
 * NEXUS CLOUD - Particle System
 * Creates interactive floating particles with connections
 */

class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.mouse = { x: null, y: null };
        this.particleCount = 80;
        this.connectionDistance = 150;
        this.mouseRadius = 200;
        
        this.init();
        this.animate();
        this.setupEventListeners();
    }
    
    init() {
        this.resizeCanvas();
        this.createParticles();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2,
                color: this.getRandomColor()
            });
        }
    }
    
    getRandomColor() {
        const colors = [
            '99, 102, 241',  // Primary
            '6, 182, 212',   // Secondary
            '244, 114, 182', // Accent
            '139, 92, 246',  // Purple
            '34, 211, 238'   // Cyan
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        window.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }
    
    updateParticles() {
        this.connections = [];
        this.particles.forEach(particle => {
            // Move particles
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.speedX *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.speedY *= -1;
            }
            
            // Mouse interaction
            if (this.mouse.x && this.mouse.y) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.mouseRadius) {
                    const force = (this.mouseRadius - distance) / this.mouseRadius;
                    particle.x -= dx * force * 0.02;
                    particle.y -= dy * force * 0.02;
                }
            }
            
            // Connect to nearby particles
            this.particles.forEach(otherParticle => {
                if (particle === otherParticle) return;
                
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.connectionDistance) {
                    const opacity = (1 - distance / this.connectionDistance) * 0.3;
                    this.connections.push({
                        particle1: particle,
                        particle2: otherParticle,
                        opacity: opacity
                    });
                }
            });
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${particle.color}, ${particle.opacity})`;
            this.ctx.fill();
            
            // Draw glow
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 4
            );
            gradient.addColorStop(0, `rgba(${particle.color}, ${particle.opacity * 0.5})`);
            gradient.addColorStop(1, 'transparent');
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    drawConnections() {
        this.ctx.strokeStyle = `rgba(99, 102, 241, 0.5)`;
        
        this.connections.forEach(connection => {
            const dx = connection.particle1.x - connection.particle2.x;
            const dy = connection.particle1.y - connection.particle2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.connectionDistance) {
                this.ctx.beginPath();
                this.ctx.moveTo(connection.particle1.x, connection.particle1.y);
                this.ctx.lineTo(connection.particle2.x, connection.particle2.y);
                this.ctx.lineWidth = connection.opacity;
                this.ctx.stroke();
            }
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawParticles();
        this.drawConnections();
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particle system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem('particles-canvas');
});
