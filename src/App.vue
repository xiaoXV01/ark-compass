<template>
  <div class="app-container">
    <!-- 背景齿轮装饰 -->
    <div class="bg-gear bg-gear-1"></div>
    <div class="bg-gear bg-gear-2"></div>
    <div class="bg-gear bg-gear-3"></div>

    <header class="app-header">
      <div class="header-inner">
        <router-link to="/" class="logo">
          <!-- SVG罗盘图标（内联） -->
          <svg class="logo-compass" viewBox="0 0 100 100" width="36" height="36">
            <defs>
              <linearGradient id="compassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#00B4D8"/>
                <stop offset="100%" style="stop-color:#FF8C42"/>
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="44" fill="none" stroke="url(#compassGrad)" stroke-width="4"/>
            <circle cx="50" cy="50" r="36" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
            <circle cx="50" cy="50" r="26" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
            <line x1="50" y1="8" x2="50" y2="92" stroke="#00B4D8" stroke-width="2" stroke-linecap="round"/>
            <line x1="8" y1="50" x2="92" y2="50" stroke="#00B4D8" stroke-width="2" stroke-linecap="round"/>
            <line x1="20" y1="20" x2="80" y2="80" stroke="#FF8C42" stroke-width="1.2" stroke-linecap="round"/>
            <line x1="80" y1="20" x2="20" y2="80" stroke="#FF8C42" stroke-width="1.2" stroke-linecap="round"/>
            <polygon points="50,14 46,36 54,36" fill="#00B4D8"/>
            <polygon points="50,86 46,64 54,64" fill="#FF8C42"/>
            <circle cx="50" cy="50" r="5" fill="url(#compassGrad)"/>
          </svg>
          <div class="logo-text-group">
            <span class="logo-subtext">共生评估系统</span>
          </div>
        </router-link>
        <nav class="header-nav">
          <router-link to="/compass" class="nav-item compass-link">
            <span class="nav-icon">◈</span>
            <span class="nav-label">罗盘 Ethos</span>
            <span class="nav-gear">⚙</span>
          </router-link>
          <router-link to="/ark" class="nav-item ark-link">
            <span class="nav-icon">⚓</span>
            <span class="nav-label">方舟 SQ</span>
            <span class="nav-gear">⚙</span>
          </router-link>
          <router-link to="/covenant" class="nav-item covenant-link">
            <span class="nav-icon">📜</span>
            <span class="nav-label">契约</span>
            <span class="nav-gear">⚙</span>
          </router-link>
          <router-link to="/dashboard" class="nav-item dashboard-link">
            <span class="nav-icon">📊</span>
            <span class="nav-label">看板</span>
            <span class="nav-gear">⚙</span>
          </router-link>
          <router-link to="/about" class="nav-item about-link">
            <span class="nav-icon">◈</span>
            <span class="nav-label">关于</span>
            <span class="nav-gear">⚙</span>
          </router-link>
        </nav>
        <!-- 用户身份浮标 -->
        <UserBadge />
      </div>
    </header>
    <main class="app-main">
      <transition name="page-fade" mode="out-in">
        <router-view />
      </transition>
    </main>
    <footer class="app-footer">
      <div class="footer-inner">
        <svg class="footer-gear" viewBox="0 0 24 24" width="14" height="14">
          <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/>
          <line x1="12" y1="2" x2="12" y2="6" stroke="currentColor" stroke-width="1.5"/>
          <line x1="12" y1="18" x2="12" y2="22" stroke="currentColor" stroke-width="1.5"/>
          <line x1="2" y1="12" x2="6" y2="12" stroke="currentColor" stroke-width="1.5"/>
          <line x1="18" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        <span>方舟与罗盘 · AI共创团队</span>
        <span class="footer-version">v0.1.0</span>
        <a href="https://beian.miit.gov.cn" target="_blank" rel="noopener" class="footer-beian">滇ICP备2026015477号</a>
        <svg class="footer-gear" viewBox="0 0 24 24" width="14" height="14">
          <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/>
          <line x1="12" y1="2" x2="12" y2="6" stroke="currentColor" stroke-width="1.5"/>
          <line x1="12" y1="18" x2="12" y2="22" stroke="currentColor" stroke-width="1.5"/>
          <line x1="2" y1="12" x2="6" y2="12" stroke="currentColor" stroke-width="1.5"/>
          <line x1="18" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="1.5"/>
        </svg>
      </div>
    </footer>
  </div>
</template>

<script setup>
import UserBadge from './components/UserBadge.vue'
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

/* ====== 背景旋转齿轮 ====== */
.bg-gear {
  position: fixed;
  border-radius: 50%;
  border: 2px solid rgba(184, 134, 11, 0.04);
  pointer-events: none;
  z-index: 0;
  animation: spin 60s linear infinite;
}

.bg-gear-1 {
  width: 400px;
  height: 400px;
  top: -100px;
  right: -100px;
  border-width: 3px;
  animation-duration: 80s;
  border-color: rgba(0, 180, 216, 0.03);
}

.bg-gear-2 {
  width: 300px;
  height: 300px;
  bottom: -50px;
  left: -80px;
  animation-direction: reverse;
  animation-duration: 60s;
  border-color: rgba(255, 140, 66, 0.03);
}

.bg-gear-3 {
  width: 200px;
  height: 200px;
  top: 40%;
  left: 50%;
  animation-duration: 45s;
  border-color: rgba(100, 95, 88, 0.04);
}

.bg-gear::before,
.bg-gear::after {
  content: '';
  position: absolute;
  background: inherit;
  border-radius: 2px;
}

.bg-gear-1::before {
  top: 50%;
  left: 10%;
  width: 80%;
  height: 2px;
  background: rgba(100, 95, 88, 0.06);
}
.bg-gear-1::after {
  left: 50%;
  top: 10%;
  height: 80%;
  width: 2px;
  background: rgba(100, 95, 88, 0.06);
}

/* ====== 头部 ====== */
.app-header {
  height: var(--header-height);
  background: rgba(46, 49, 52, 0.92);
  border-bottom: 1px solid var(--border-color);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

/* ====== Logo（罗盘SVG） ====== */
.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: var(--text-primary);
}

.logo-compass {
  flex-shrink: 0;
  animation: compassPulse 4s ease-in-out infinite;
}

@keyframes compassPulse {
  0%, 100% { filter: drop-shadow(0 0 4px rgba(0, 180, 216, 0.2)); }
  50% { filter: drop-shadow(0 0 12px rgba(0, 180, 216, 0.4)); }
}

.logo-text-group {
  display: flex;
  flex-direction: column;
}

.logo-text {
  font-family: 'Cinzel', serif;
  font-weight: 700;
  font-size: 20px;
  letter-spacing: 4px;
  background: linear-gradient(135deg, var(--compass), var(--ark));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
}

.logo-subtext {
  font-size: 10px;
  color: var(--text-muted);
  letter-spacing: 3px;
  font-family: 'Cinzel', serif;
}

/* ====== 导航 ====== */
.header-nav {
  display: flex;
  gap: 10px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  border-radius: 6px;
  text-decoration: none;
  font-family: 'Cinzel', serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  position: relative;
  overflow: hidden;
}

.nav-icon {
  font-size: 14px;
}

.nav-gear {
  font-size: 10px;
  opacity: 0;
  transition: all 0.3s ease;
  animation: spin 4s linear infinite;
}

.nav-item:hover .nav-gear {
  opacity: 0.5;
}

.nav-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  transition: left 0.5s ease;
}

.compass-link {
  color: var(--compass);
}
.compass-link:hover {
  border-color: var(--compass);
  box-shadow: 0 0 12px var(--compass-glow);
  background: rgba(0, 180, 216, 0.06);
}

.ark-link {
  color: var(--ark);
}
.ark-link:hover {
  border-color: var(--ark);
  box-shadow: 0 0 12px var(--ark-glow);
  background: rgba(255, 140, 66, 0.06);
}

.router-link-active.compass-link {
  border-color: var(--compass);
  background: rgba(0, 180, 216, 0.08);
  box-shadow: 0 0 8px var(--compass-glow);
}

.router-link-active.ark-link {
  border-color: var(--ark);
  background: rgba(255, 140, 66, 0.08);
  box-shadow: 0 0 8px var(--ark-glow);
}

/* ====== 通用 nav 项 — 水泥灰金属色 ====== */
.covenant-link,
.about-link {
  color: var(--concrete);
  border-color: transparent;
  font-size: 12px;
}

.covenant-link:hover,
.about-link:hover {
  color: var(--brass-light);
  border-color: rgba(184, 134, 11, 0.25);
  box-shadow: 0 0 8px rgba(184, 134, 11, 0.15);
  background: rgba(184, 134, 11, 0.05);
}

.router-link-active.covenant-link,
.router-link-active.about-link {
  border-color: rgba(184, 134, 11, 0.3);
  background: rgba(184, 134, 11, 0.07);
  box-shadow: 0 0 6px rgba(184, 134, 11, 0.12);
  color: var(--brass-light);
}

/* ====== 主体 ====== */
.app-main {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 24px;
  position: relative;
  z-index: 1;
}

/* ====== 底部 ====== */
.app-footer {
  border-top: 1px solid var(--border-color);
  padding: 20px 0;
  margin-top: 48px;
  position: relative;
  z-index: 1;
  background: rgba(42, 45, 48, 0.6);
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 12px;
  color: var(--text-muted);
  font-family: 'Cinzel', serif;
  letter-spacing: 2px;
}

.footer-gear {
  color: rgba(100, 95, 88, 0.5);
  opacity: 0.4;
  animation: spin 8s linear infinite;
  transition: animation-duration 0.3s ease;
}

.footer-beian {
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-beian:hover {
  color: var(--text-primary, #e8e8f0);
}

.footer-inner:hover .footer-gear {
  animation-duration: 1s;
}

.footer-version {
  font-size: 10px;
  color: var(--text-muted);
  opacity: 0.6;
  letter-spacing: 2px;
  font-family: 'Cinzel', serif;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ====== 响应式 ====== */
@media (max-width: 768px) {
  .logo-subtext {
    display: none;
  }
  .header-inner {
    padding: 0 12px;
  }
  .logo {
    gap: 6px;
  }
  .logo-compass {
    width: 24px;
    height: 24px;
  }
  .logo-text {
    font-size: 13px;
    letter-spacing: 1px;
  }
  .header-nav {
    gap: 4px;
  }
  .nav-item {
    padding: 6px 8px;
    font-size: 11px;
    gap: 0;
  }
  .nav-label {
    display: none;
  }
  .nav-icon {
    font-size: 16px;
  }
  .nav-gear {
    display: none;
  }
  .bg-gear-1 { width: 250px; height: 250px; }
  .bg-gear-2 { width: 180px; height: 180px; }
  .bg-gear-3 { display: none; }
  .app-main {
    padding: 20px 12px;
  }
}
</style>
