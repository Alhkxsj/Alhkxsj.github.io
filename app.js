document.addEventListener('DOMContentLoaded', () => {
    // 粒子背景初始化和自适应
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.velocity = {
                x: (Math.random() - 0.5) * 0.7,
                y: (Math.random() - 0.5) * 0.7
            };
            this.alpha = Math.random() * 0.5 + 0.1;
            this.radius = Math.random() * 2.2 + 1.3;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
            ctx.shadowColor = '#1de9b6';
            ctx.shadowBlur = 12;
            ctx.fill();
            ctx.shadowBlur = 0;
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
    const particles = Array.from({ length: 130 }, () => new Particle());
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => p.update());
        requestAnimationFrame(animate);
    }
    animate();

    // 导航滑块动画
    const nav = document.querySelector('.glass-nav');
    const slider = nav.querySelector('.nav-slider');
    const links = Array.from(nav.querySelectorAll('a'));
    function updateSlider(target) {
        const rect = target.getBoundingClientRect();
        const navRect = nav.getBoundingClientRect();
        slider.style.left = (rect.left - navRect.left) + 'px';
        slider.style.width = rect.width + 'px';
    }
    links.forEach(link => {
        link.addEventListener('mouseenter', () => updateSlider(link));
        link.addEventListener('focus', () => updateSlider(link));
    });
    nav.addEventListener('mouseleave', () => {
        const active = nav.querySelector('.active') || links[0];
        updateSlider(active);
    });
    // 激活当前导航
    links.forEach(link => {
        if(link.href === window.location.href) {
            link.classList.add('active');
            updateSlider(link);
        }
    });

    // 主标题点击动画
    const title = document.getElementById('main-title');
    if (title) {
        title.style.cursor = 'pointer';
        title.addEventListener('click', () => {
            title.classList.add('bounce');
            title.style.color = `hsl(${Math.floor(Math.random()*360)},80%,50%)`;
            setTimeout(() => {
                title.classList.remove('bounce');
                title.style.color = '';
            }, 400);
        });
    }
    // 添加 page-loaded 类，保证内容丝滑出现
    document.body.classList.add('page-loaded');
});