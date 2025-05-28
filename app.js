document.addEventListener('DOMContentLoaded', () => {
    // 粒子背景初始化和自适应
    const canvas = document.getElementById('particle-canvas');
    if (!canvas || !canvas.getContext) return;
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
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
            ctx.shadowColor = '#1de9b6';
            ctx.shadowBlur = 12;
            ctx.fill();
            ctx.restore();
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
    const PARTICLE_COUNT = 130;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => p.update());
        requestAnimationFrame(animate);
    }
    animate();

    // 导航滑块动画（已优化，适配移动端、桌面端、resize、点击、初始）
    const nav = document.querySelector('.glass-nav');
    if (nav) {
        const slider = nav.querySelector('.nav-slider');
        const links = Array.from(nav.querySelectorAll('a'));

        function updateSlider(target) {
            if (!target || !slider) return;
            const rect = target.getBoundingClientRect();
            const navRect = nav.getBoundingClientRect();
            slider.style.left = (rect.left - navRect.left) + 'px';
            slider.style.width = rect.width + 'px';
        }

        // 鼠标悬停/聚焦时滑块移动
        links.forEach(link => {
            link.addEventListener('mouseenter', () => updateSlider(link));
            link.addEventListener('focus', () => updateSlider(link));
            // 移动端点击也要更新
            link.addEventListener('click', () => {
                links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                updateSlider(link);
            });
        });

        // 鼠标移出导航后，滑块回到当前激活项
        nav.addEventListener('mouseleave', () => {
            const active = nav.querySelector('.active') || links[0];
            updateSlider(active);
        });

        // 页面初始激活项
        let foundActive = false;
        links.forEach(link => {
            if (link.pathname === window.location.pathname) {
                link.classList.add('active');
                foundActive = true;
            }
        });
        if (!foundActive) links[0].classList.add('active');

        // 初始定位滑块（延迟保证渲染后准确）
        setTimeout(() => {
            const active = nav.querySelector('.active') || links[0];
            updateSlider(active);
        }, 0);

        // 窗口resize、横竖屏切换时，滑块跟随当前激活项
        window.addEventListener('resize', () => {
            const active = nav.querySelector('.active') || links[0];
            updateSlider(active);
        });
    }

    // 主标题点击弹跳动画
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

    // 内容淡入
    document.body.classList.add('page-loaded');
});