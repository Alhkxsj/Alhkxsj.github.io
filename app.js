document.addEventListener('DOMContentLoaded', () => {
    // 粒子背景初始化
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.velocity = {
                x: (Math.random() - 0.5) * 0.5,
                y: (Math.random() - 0.5) * 0.5
            };
            this.alpha = Math.random() * 0.5 + 0.1;
            this.radius = Math.random() * 2;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
            ctx.fill();
        }

        update() {
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            
            if (this.x < 0 || this.x > canvas.width || 
                this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
            this.draw();
        }
    }

    // 粒子系统
    const particles = Array.from({ length: 100 }, () => new Particle());
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => p.update());
        requestAnimationFrame(animate);
    }
    animate();

    // 窗口调整监听
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // 导航激活状态
    document.querySelectorAll('.glass-nav a').forEach(link => {
        if(link.href === window.location.href) {
            link.classList.add('active');
        }
    });
});