// ==================== 主JavaScript文件 ====================

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initNavbar();
    initSkillBars();
    initSmoothScroll();
    initAnimations();
});

// ==================== 导航栏功能 ====================
function initNavbar() {
    const header = document.getElementById('header');
    
    if (!header) return;
    
    // 滚动时添加阴影效果
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ==================== 技能条动画 ====================
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    if (skillBars.length === 0) return;
    
    // 创建Intersection Observer来检测元素是否进入视口
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const progress = progressBar.getAttribute('data-progress');
                
                // 延迟一下再开始动画，效果更好
                setTimeout(() => {
                    progressBar.style.width = progress + '%';
                }, 100);
                
                // 动画完成后取消观察
                observer.unobserve(progressBar);
            }
        });
    }, {
        threshold: 0.5 // 元素50%可见时触发
    });
    
    // 观察所有技能条
    skillBars.forEach(bar => {
        bar.style.width = '0%'; // 初始宽度为0
        observer.observe(bar);
    });
}

// ==================== 平滑滚动 ====================
function initSmoothScroll() {
    // 为所有内部链接添加平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // 忽略空的hash链接
            if (href === '#') return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 80; // 导航栏高度
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== 滚动动画 ====================
function initAnimations() {
    // 为所有卡片和项目添加滚动动画
    const animatedElements = document.querySelectorAll(
        '.card, .project-card, .education-item, .experience-item, .skill-category'
    );
    
    if (animatedElements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        // 设置初始状态
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        
        observer.observe(element);
    });
}

// ==================== 表单验证（用于联系页面）====================
function validateContactForm(form) {
    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const message = form.querySelector('#message');
    
    let isValid = true;
    
    // 验证姓名
    if (name && name.value.trim() === '') {
        showError(name, 'Please enter your name');
        isValid = false;
    } else if (name) {
        clearError(name);
    }
    
    // 验证邮箱
    if (email && email.value.trim() === '') {
        showError(email, 'Please enter your email');
        isValid = false;
    } else if (email && !isValidEmail(email.value)) {
        showError(email, 'Please enter a valid email');
        isValid = false;
    } else if (email) {
        clearError(email);
    }
    
    // 验证消息
    if (message && message.value.trim() === '') {
        showError(message, 'Please enter a message');
        isValid = false;
    } else if (message) {
        clearError(message);
    }
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(input, message) {
    const formGroup = input.parentElement;
    const error = formGroup.querySelector('.error-message') || document.createElement('span');
    
    error.className = 'error-message';
    error.textContent = message;
    error.style.color = '#ef4444';
    error.style.fontSize = '0.875rem';
    error.style.marginTop = '0.25rem';
    error.style.display = 'block';
    
    input.style.borderColor = '#ef4444';
    
    if (!formGroup.querySelector('.error-message')) {
        formGroup.appendChild(error);
    }
}

function clearError(input) {
    const formGroup = input.parentElement;
    const error = formGroup.querySelector('.error-message');
    
    if (error) {
        error.remove();
    }
    
    input.style.borderColor = '';
}

// ==================== 下载简历功能 ====================
function downloadResume() {
    // 创建一个临时链接并触发下载
    const link = document.createElement('a');
    link.href = 'files/Vincent_Zhu_Resume.pdf';
    link.download = 'Vincent_Zhu_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 可选：发送分析事件
    console.log('Resume downloaded');
}

// ==================== 工具函数 ====================

// 节流函数 - 用于优化滚动事件性能
function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    
    return function(...args) {
        const currentTime = Date.now();
        
        if (currentTime - lastExecTime < delay) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                lastExecTime = currentTime;
                func.apply(this, args);
            }, delay);
        } else {
            lastExecTime = currentTime;
            func.apply(this, args);
        }
    };
}

// 防抖函数
function debounce(func, delay) {
    let timeoutId;
    
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// ==================== 导出函数供HTML使用 ====================
window.validateContactForm = validateContactForm;
window.downloadResume = downloadResume;


