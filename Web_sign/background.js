document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('bg-animation');
    
    // Create canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const setCanvasSize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    
    setCanvasSize();
    container.appendChild(canvas);
    
    // Create particles
    const particles = [];
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            color: `rgba(77, 182, 229, ${Math.random() * 0.5 + 0.1})`,
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25
        });
    }
    
    // Create gradient background
    const createGradient = () => {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#f5f7fa');
        gradient.addColorStop(1, '#e4edf5');
        return gradient;
    };
    
    // Animation function
    const animate = () => {
        // Clear canvas
        ctx.fillStyle = createGradient();
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw and update particles
        particles.forEach(particle => {
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
            
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > canvas.width) {
                particle.speedX *= -1;
            }
            
            if (particle.y < 0 || particle.y > canvas.height) {
                particle.speedY *= -1;
            }
        });
        
        // Draw waves
        const time = Date.now() * 0.001;
        ctx.beginPath();
        
        for (let x = 0; x < canvas.width; x += 10) {
            const y = Math.sin(x * 0.01 + time) * 20 + canvas.height - 100;
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        
        const waveGradient = ctx.createLinearGradient(0, canvas.height - 150, 0, canvas.height);
        waveGradient.addColorStop(0, 'rgba(77, 182, 229, 0.1)');
        waveGradient.addColorStop(1, 'rgba(77, 182, 229, 0.05)');
        
        ctx.fillStyle = waveGradient;
        ctx.fill();
        
        // Continue animation
        requestAnimationFrame(animate);
    };
    
    // Handle window resize
    window.addEventListener('resize', () => {
        setCanvasSize();
    });
    
    // Start animation
    animate();
    
    // Add mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Create ripple effect on mouse move (optional)
        particles.forEach(particle => {
            // Calculate distance from mouse
            const dx = particle.x - mouseX;
            const dy = particle.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Apply subtle force if within range
            if (distance < 100) {
                const force = 0.5 * (1 - distance / 100);
                particle.speedX += dx * force * 0.01;
                particle.speedY += dy * force * 0.01;
            }
        });
    });
});