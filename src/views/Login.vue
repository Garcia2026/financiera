<template>
  <div class="login-page">
    <canvas id="particleCanvas" ref="particleCanvas"></canvas>
    
    <div class="login-container">
      <div class="corner-glow top-left"></div>
      <div class="corner-glow top-right"></div>
      <div class="corner-glow bottom-left"></div>
      <div class="corner-glow bottom-right"></div>
      
      <!-- Logo usando SVG inline en lugar de una imagen externa -->
      <div class="logo-container">
        <svg class="logo" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <g>
            <circle cx="100" cy="100" r="95" fill="white" opacity="0.1" />
            <path d="M100,50 L60,120 L85,120 L100,90 L115,120 L140,120 Z" fill="#4CAF50" />
            <path d="M60,60 L40,100 L50,120 L80,70 Z" fill="#66BB6A" />
            <path d="M140,60 L160,100 L150,120 L120,70 Z" fill="#66BB6A" />
          </g>
        </svg>
      </div>
      
      <h1>Sistema Financiero GN</h1>
      
      <form id="loginForm" @submit.prevent="handleLogin">
        <div class="input-group">
          <input type="email" required v-model="email">
          <label>Correo electrónico</label>
        </div>
        
        <div class="input-group">
          <input type="password" required v-model="password">
          <label>Contraseña</label>
        </div>
        
        <div v-if="errorMsg" class="error-message">
          {{ errorMsg }}
        </div>
        
        <button type="submit" class="btn-login" :disabled="loading">
          {{ loading ? 'Accediendo...' : 'Iniciar Sesión' }}
        </button>
        <button type="button" class="btn-forgot" @click="forgotPassword">
          ¿Olvidaste tu contraseña?
        </button>
      </form>
      
      <div class="social-links">
        <a href="https://wa.me/50235125327" target="_blank" class="social-icon">
          <i class="fab fa-whatsapp"></i>
        </a>
        <a href="https://www.facebook.com/JARDINESGALICIAGT" target="_blank" class="social-icon">
          <i class="fab fa-facebook-f"></i>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';

// Router
const router = useRouter();

// Auth state
const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMsg = ref('');

// Canvas state
const particlesArray = ref([]);
const mousePosition = ref({
  x: null,
  y: null,
  radius: 100
});
let ctx = null;
let animationId = null;

// Login handler
const handleLogin = async () => {
  loading.value = true;
  errorMsg.value = '';
  
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push('/dashboard');
  } catch (error) {
    console.error(error);
    errorMsg.value = 'Credenciales incorrectas o error de red.';
    loading.value = false;
  }
};

const forgotPassword = () => {
  alert('Para recuperar tu contraseña, por favor contacta al administrador del sistema.');
};

// Canvas setup
onMounted(() => {
  // Asegurar que ocupamos toda la pantalla
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.body.style.overflow = 'hidden';
  document.documentElement.style.margin = '0';
  document.documentElement.style.padding = '0';
  document.documentElement.style.overflow = 'hidden';
  
  // Cargar Font Awesome desde CDN
  const linkElement = document.createElement('link');
  linkElement.rel = 'stylesheet';
  linkElement.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css';
  document.head.appendChild(linkElement);
  
  initParticleCanvas();
  positionCornerGlows();
  setupInputEffects();
  setTimeout(animateCornerGlows, 2000);
  
  // Event listeners
  window.addEventListener('resize', handleResize);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseout', handleMouseOut);
});

onBeforeUnmount(() => {
  // Restaurar estilos del body
  document.body.style.margin = '';
  document.body.style.padding = '';
  document.body.style.overflow = '';
  document.documentElement.style.margin = '';
  document.documentElement.style.padding = '';
  document.documentElement.style.overflow = '';
  
  // Limpiar event listeners
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseout', handleMouseOut);
  
  // Detener la animación
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
});

// Event handlers
const handleResize = () => {
  resizeCanvas();
  positionCornerGlows();
};

const handleMouseMove = (event) => {
  mousePosition.value.x = event.x;
  mousePosition.value.y = event.y;
};

const handleMouseOut = () => {
  mousePosition.value.x = undefined;
  mousePosition.value.y = undefined;
};

// Canvas functions
const initParticleCanvas = () => {
  const canvas = document.getElementById('particleCanvas');
  ctx = canvas.getContext('2d');
  
  resizeCanvas();
  initParticles();
  animate();
};

const resizeCanvas = () => {
  const canvas = document.getElementById('particleCanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

const initParticles = () => {
  const numberOfParticles = 150;
  particlesArray.value = [];
  
  for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.value.push(createParticle());
  }
};

const createParticle = () => {
  const canvas = document.getElementById('particleCanvas');
  
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2 + 0.5,
    speedX: Math.random() * 1 - 0.5,
    speedY: Math.random() * 1 - 0.5,
    color: getRandomColor()
  };
};

const getRandomColor = () => {
  const colors = [
    'rgba(180, 180, 180, 0.3)',
    'rgba(150, 150, 150, 0.3)',
    'rgba(100, 170, 255, 0.3)',
    'rgba(200, 200, 210, 0.3)'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const updateParticle = (particle) => {
  const canvas = document.getElementById('particleCanvas');
  
  // Mover partículas
  particle.x += particle.speedX;
  particle.y += particle.speedY;
  
  // Rebote en los bordes
  if (particle.x > canvas.width || particle.x < 0) {
    particle.speedX = -particle.speedX;
  }
  if (particle.y > canvas.height || particle.y < 0) {
    particle.speedY = -particle.speedY;
  }
  
  // Interacción con el mouse
  if (mousePosition.value.x !== undefined) {
    const dx = mousePosition.value.x - particle.x;
    const dy = mousePosition.value.y - particle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < mousePosition.value.radius) {
      const forceDirectionX = dx / distance;
      const forceDirectionY = dy / distance;
      const force = (mousePosition.value.radius - distance) / mousePosition.value.radius;
      
      const directionX = forceDirectionX * force * 0.6;
      const directionY = forceDirectionY * force * 0.6;
      
      particle.speedX -= directionX;
      particle.speedY -= directionY;
    }
  }
};

const drawParticle = (particle) => {
  ctx.fillStyle = particle.color;
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
  ctx.fill();
};

const connectParticles = () => {
  const maxDistance = 150;
  
  for (let a = 0; a < particlesArray.value.length; a++) {
    for (let b = a; b < particlesArray.value.length; b++) {
      const dx = particlesArray.value[a].x - particlesArray.value[b].x;
      const dy = particlesArray.value[a].y - particlesArray.value[b].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < maxDistance) {
        const opacity = 1 - (distance / maxDistance);
        ctx.strokeStyle = `rgba(150, 150, 150, ${opacity * 0.2})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particlesArray.value[a].x, particlesArray.value[a].y);
        ctx.lineTo(particlesArray.value[b].x, particlesArray.value[b].y);
        ctx.stroke();
      }
    }
  }
};

const animate = () => {
  const canvas = document.getElementById('particleCanvas');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  for (let i = 0; i < particlesArray.value.length; i++) {
    updateParticle(particlesArray.value[i]);
    drawParticle(particlesArray.value[i]);
  }
  
  connectParticles();
  animationId = requestAnimationFrame(animate);
};

const positionCornerGlows = () => {
  const cornerGlows = document.querySelectorAll('.corner-glow');
  const container = document.querySelector('.login-container');
  
  if (!container) return;
  
  const rect = container.getBoundingClientRect();
  
  if (cornerGlows[0]) {
    cornerGlows[0].style.top = `${rect.top + 10}px`;
    cornerGlows[0].style.left = `${rect.left + 10}px`;
  }
  
  if (cornerGlows[1]) {
    cornerGlows[1].style.top = `${rect.top + 10}px`;
    cornerGlows[1].style.left = `${rect.right - 10}px`;
  }
  
  if (cornerGlows[2]) {
    cornerGlows[2].style.top = `${rect.bottom - 10}px`;
    cornerGlows[2].style.left = `${rect.left + 10}px`;
  }
  
  if (cornerGlows[3]) {
    cornerGlows[3].style.top = `${rect.bottom - 10}px`;
    cornerGlows[3].style.left = `${rect.right - 10}px`;
  }
};

const animateCornerGlows = () => {
  const cornerGlows = document.querySelectorAll('.corner-glow');
  if (!cornerGlows.length) return;
  
  const randomCorner = Math.floor(Math.random() * cornerGlows.length);
  cornerGlows[randomCorner].style.opacity = '1';
  
  setTimeout(() => {
    cornerGlows[randomCorner].style.opacity = '0';
  }, 700);
  
  setTimeout(animateCornerGlows, Math.random() * 3000 + 1000);
};

const setupInputEffects = () => {
  const inputs = document.querySelectorAll('input');
  
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.style.transition = 'transform 0.3s ease';
      this.parentElement.style.transform = 'translateY(-2px)';
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.style.transform = 'translateY(0)';
    });
  });
};
</script>

<style>
/* Reset global para asegurar que el componente ocupe todo el espacio disponible */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

#app {
  height: 100%;
  width: 100%;
}
</style>

<style scoped>
.login-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #0f0f0f 0%, #222 100%);
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

#particleCanvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.login-container {
  position: relative;
  z-index: 2;
  width: 360px;
  background: rgba(15, 15, 15, 0.8);
  border-radius: 12px;
  padding: 40px 30px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
  animation: fadeIn 0.8s ease-out;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.logo {
  width: 120px;
  height: auto;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
  transition: all 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
  filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.5));
}

.login-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0.05),
    rgba(255, 255, 255, 0)
  );
  transform: rotate(45deg);
  animation: shine 12s infinite linear;
  pointer-events: none;
}

.login-container h1 {
  color: #fff;
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: 600;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
  letter-spacing: 1px;
}

.input-group {
  position: relative;
  margin-bottom: 25px;
}

.input-group input {
  width: 100%;
  padding: 12px 15px;
  background: rgba(40, 40, 40, 0.7);
  border: none;
  outline: none;
  border-radius: 6px;
  color: #fff;
  font-size: 15px;
  transition: all 0.3s ease;
  border: 1px solid rgba(100, 100, 100, 0.2);
}

.input-group input:focus {
  box-shadow: 0 0 10px rgba(98, 155, 200, 0.6);
  border-color: rgba(98, 155, 200, 0.8);
}

.input-group label {
  position: absolute;
  top: 12px;
  left: 15px;
  color: #aaa;
  font-size: 15px;
  pointer-events: none;
  transition: all 0.3s ease;
}

.input-group input:focus ~ label,
.input-group input:valid ~ label {
  top: -22px;
  left: 0;
  color: #4CAF50;
  font-size: 13px;
}

.error-message {
  color: #ff6b6b;
  font-size: 14px;
  text-align: center;
  margin-bottom: 15px;
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

.btn-login {
  width: 100%;
  padding: 12px;
  border: none;
  background: linear-gradient(45deg, #388E3C, #4CAF50, #388E3C);
  background-size: 200% 200%;
  color: white;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-login:not(:disabled):hover {
  background-position: right center;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
}

.btn-login::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0)
  );
  transform: rotate(45deg);
  transition: all 0.3s ease;
  opacity: 0;
}

.btn-login:not(:disabled):hover::after {
  animation: btnShine 1.5s ease;
  opacity: 1;
}

.social-links {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.social-icon {
  color: #aaa;
  font-size: 24px;
  margin: 0 15px;
  transition: all 0.3s ease;
  position: relative;
}

.social-icon:hover {
  color: #fff;
  transform: translateY(-3px);
  text-shadow: 0 10px 10px rgba(0, 0, 0, 0.3);
}

.social-icon::before {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: #4CAF50;
  transition: width 0.3s ease;
}

.social-icon:hover::before {
  width: 100%;
}

.corner-glow {
  position: absolute;
  width: 6px;
  height: 6px;
  background: rgba(76, 175, 80, 0.8);
  border-radius: 50%;
  box-shadow: 0 0 10px 2px rgba(76, 175, 80, 0.4);
  opacity: 0;
  z-index: 3;
}

.btn-forgot {
  background: none;
  border: none;
  color: #999;
  font-size: 12px;
  cursor: pointer;
  margin-top: 15px;
  text-align: center;
  display: block;
  width: 100%;
  transition: all 0.3s ease;
}

.btn-forgot:hover {
  color: #4CAF50;
}

@keyframes shine {
  0% {
    transform: translateX(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) rotate(45deg);
  }
}

@keyframes btnShine {
  0% {
    transform: translateX(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) rotate(45deg);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shake {
  10%, 90% {
    transform: translateX(-1px);
  }
  20%, 80% {
    transform: translateX(2px);
  }
  30%, 50%, 70% {
    transform: translateX(-3px);
  }
  40%, 60% {
    transform: translateX(3px);
  }
}
</style>