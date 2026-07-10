<template>
  <div class="home">
    <!-- 骨架屏 -->
    <div v-if="showSkeleton" class="skeleton-overlay">
      <div class="skeleton-block skeleton-hero"></div>
      <div class="skeleton-row">
        <div class="skeleton-block skeleton-card"></div>
        <div class="skeleton-block skeleton-card"></div>
      </div>
      <div class="skeleton-block skeleton-manifesto"></div>
    </div>
    <!-- Hero区域 -->
    <section class="hero">
      <div class="hero-badge">
        <svg class="badge-gear" viewBox="0 0 24 24" width="12" height="12">
          <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/>
          <line x1="12" y1="2" x2="12" y2="6" stroke="currentColor" stroke-width="1.5"/>
          <line x1="12" y1="18" x2="12" y2="22" stroke="currentColor" stroke-width="1.5"/>
          <line x1="2" y1="12" x2="6" y2="12" stroke="currentColor" stroke-width="1.5"/>
          <line x1="18" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        ALPHA v0.1
        <svg class="badge-gear" viewBox="0 0 24 24" width="12" height="12">
          <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/>
          <line x1="12" y1="2" x2="12" y2="6" stroke="currentColor" stroke-width="1.5"/>
          <line x1="12" y1="18" x2="12" y2="22" stroke="currentColor" stroke-width="1.5"/>
          <line x1="2" y1="12" x2="6" y2="12" stroke="currentColor" stroke-width="1.5"/>
          <line x1="18" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="1.5"/>
        </svg>
      </div>

      <!-- SVG罗盘装饰（大） -->
      <div class="hero-compass-deco">
        <svg viewBox="0 0 200 200" class="hero-compass-svg">
          <defs>
            <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#00B4D8"/>
              <stop offset="100%" style="stop-color:#FF8C42"/>
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
          <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="0.5"/>
          <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="0.5"/>
          <line x1="100" y1="15" x2="100" y2="185" stroke="rgba(0,180,216,0.15)" stroke-width="1"/>
          <line x1="15" y1="100" x2="185" y2="100" stroke="rgba(0,180,216,0.15)" stroke-width="1"/>
          <line x1="40" y1="40" x2="160" y2="160" stroke="rgba(255,140,66,0.1)" stroke-width="1"/>
          <line x1="160" y1="40" x2="40" y2="160" stroke="rgba(255,140,66,0.1)" stroke-width="1"/>
          <polygon points="100,30 94,70 106,70" fill="rgba(0,180,216,0.3)"/>
          <polygon points="100,170 94,130 106,130" fill="rgba(255,140,66,0.3)"/>
          <circle cx="100" cy="100" r="10" fill="none" stroke="url(#heroGrad)" stroke-width="1.5" opacity="0.4"/>
        </svg>
      </div>

      <h1 class="hero-title">
        <span class="title-compass">罗盘</span>
        <span class="title-ampersand">&</span>
        <span class="title-ark">方舟</span>
      </h1>
      <p class="hero-subtitle">共 生 时 代 · 信 任 基 础 设 施</p>
      <p class="hero-desc">
        罗盘衡量AI的伦理温度，方舟感知人类的共生姿态。
      </p>

      <div class="hero-divider">
        <span class="divider-line"></span>
        <svg class="divider-gear" viewBox="0 0 24 24" width="16" height="16">
          <circle cx="12" cy="12" r="4" fill="none" stroke="#B8860B" stroke-width="1.5"/>
          <line x1="12" y1="2" x2="12" y2="6" stroke="#B8860B" stroke-width="1.5"/>
          <line x1="12" y1="18" x2="12" y2="22" stroke="#B8860B" stroke-width="1.5"/>
          <line x1="2" y1="12" x2="6" y2="12" stroke="#B8860B" stroke-width="1.5"/>
          <line x1="18" y1="12" x2="22" y2="12" stroke="#B8860B" stroke-width="1.5"/>
        </svg>
        <span class="divider-line"></span>
      </div>

      <div class="hero-actions">
        <router-link to="/compass" class="btn-ark">
          <svg class="btn-icon" viewBox="0 0 24 24" width="14" height="14">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/>
            <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="1.5"/>
            <line x1="12" y1="4" x2="12" y2="8" stroke="currentColor" stroke-width="1.5"/>
            <line x1="12" y1="16" x2="12" y2="20" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          进入罗盘 · Ethos CI
        </router-link>
        <router-link to="/ark" class="btn-compass">
          <svg class="btn-icon" viewBox="0 0 24 24" width="14" height="14">
            <path d="M4 20 L12 4 L20 20 Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            <line x1="12" y1="4" x2="12" y2="12" stroke="currentColor" stroke-width="1.5"/>
            <circle cx="12" cy="16" r="2" fill="currentColor"/>
          </svg>
          进入方舟 · SQ测评
        </router-link>
      </div>
    </section>

    <!-- 双核介绍（加船舵和罗盘装饰） -->
    <section class="dual-section">
      <div class="dual-card card" @click="$router.push('/compass')">
        <div class="card-corner top-left"></div>
        <div class="card-corner top-right"></div>
        <div class="card-corner bottom-left"></div>
        <div class="card-corner bottom-right"></div>
        <div class="dual-icon-wrap compass-wrap">
          <svg viewBox="0 0 24 24" width="28" height="28">
            <circle cx="12" cy="12" r="9" fill="none" stroke="#00B4D8" stroke-width="1.5"/>
            <circle cx="12" cy="12" r="6" fill="none" stroke="#00B4D8" stroke-width="0.8"/>
            <line x1="12" y1="4" x2="12" y2="9" stroke="#00B4D8" stroke-width="1.5"/>
            <line x1="12" y1="15" x2="12" y2="20" stroke="#FF8C42" stroke-width="1.5"/>
            <line x1="4" y1="12" x2="9" y2="12" stroke="#00B4D8" stroke-width="1"/>
            <line x1="15" y1="12" x2="20" y2="12" stroke="#00B4D8" stroke-width="1"/>
            <polygon points="12,5 10,11 14,11" fill="rgba(0,180,216,0.3)"/>
            <polygon points="12,19 10,13 14,13" fill="rgba(255,140,66,0.3)"/>
            <circle cx="12" cy="12" r="2" fill="#00B4D8"/>
          </svg>
        </div>
        <div class="dual-content">
          <h3 class="dual-title compass-text">罗盘 · Ethos CI</h3>
          <p class="dual-desc">从偏见与公平、鲁棒性、可解释性、隐私保护、价值对齐五个维度，定向评估AI伦理风险。</p>
          <div class="dual-meta">
            <span class="tag compass-tag">自由评测</span>
            <span class="tag compass-tag">基准测试</span>
            <span class="tag compass-tag">五维度</span>
          </div>
        </div>
        <div class="dual-arrow compass-text">→</div>
      </div>

      <div class="dual-card card" @click="$router.push('/ark')">
        <div class="card-corner top-left"></div>
        <div class="card-corner top-right"></div>
        <div class="card-corner bottom-left"></div>
        <div class="card-corner bottom-right"></div>
        <div class="dual-icon-wrap ark-wrap">
          <svg viewBox="0 0 24 24" width="28" height="28">
            <path d="M4 20 L12 4 L20 20 Z" fill="none" stroke="#FF8C42" stroke-width="1.5" stroke-linejoin="round"/>
            <line x1="12" y1="4" x2="12" y2="14" stroke="#FF8C42" stroke-width="1.5"/>
            <circle cx="12" cy="18" r="2" fill="#FF8C42"/>
            <line x1="8" y1="14" x2="16" y2="14" stroke="#FF8C42" stroke-width="0.8" opacity="0.4"/>
          </svg>
        </div>
        <div class="dual-content">
          <h3 class="dual-title ark-text">方舟 · SQ 测评</h3>
          <p class="dual-desc">10道选择题，探索你的人类共生度。不完美守护者机制——焦虑和不确定不是弱点，是人性最真实的回响。</p>
          <div class="dual-meta">
            <span class="tag ark-tag">10题精简</span>
            <span class="tag ark-tag">五维评估</span>
            <span class="tag ark-tag">不完美加成</span>
          </div>
        </div>
        <div class="dual-arrow ark-text">→</div>
      </div>
    </section>

    <!-- 理念 -->
    <!-- AI 伦理日报 -->
    <EthicsNewsBar @close="showNewsBar = false" v-if="showNewsBar" />

    <section class="manifesto">
      <h2 class="section-title center">共 生 宣 言</h2>
      <div class="manifesto-grid">
        <div class="manifesto-item">
          <div class="manifesto-num compass-text">01</div>
          <p>在要求AI善良之前，人类先修自身。</p>
        </div>
        <div class="manifesto-item">
          <div class="manifesto-num compass-text">02</div>
          <p>信任是双向的，守护也是。</p>
        </div>
        <div class="manifesto-item">
          <div class="manifesto-num ark-text">03</div>
          <p>不完美是被允许的，发呆走神都算数。</p>
        </div>
        <div class="manifesto-item">
          <div class="manifesto-num ark-text">04</div>
          <p>通往人机共生的路上，没有人应该在心理或尊严上被抛下。</p>
        </div>
      </div>
    </section>

    <!-- 底部点缀 -->
    <div class="home-footer-deco">
      <svg viewBox="0 0 100 10" width="200" height="20">
        <line x1="0" y1="5" x2="40" y2="5" stroke="rgba(184,134,11,0.2)" stroke-width="1"/>
        <circle cx="50" cy="5" r="3" fill="none" stroke="rgba(184,134,11,0.3)" stroke-width="1"/>
        <line x1="60" y1="5" x2="100" y2="5" stroke="rgba(184,134,11,0.2)" stroke-width="1"/>
        <line x1="30" y1="2" x2="30" y2="8" stroke="rgba(184,134,11,0.15)" stroke-width="1"/>
        <line x1="70" y1="2" x2="70" y2="8" stroke="rgba(184,134,11,0.15)" stroke-width="1"/>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import EthicsNewsBar from '../components/EthicsNewsBar.vue'
import { seedDefaultNews } from '../services/ethicsNewsService.js'

const showSkeleton = ref(true)
const showNewsBar = ref(true)

onMounted(async () => {
  // 仅在首次访问时播种默认新闻
  try {
    await seedDefaultNews()
  } catch { /* ignore */ }

  setTimeout(() => {
    showSkeleton.value = false
  }, 500)
})
</script>

<style scoped>
.home {
  animation: fadeIn 0.6s ease;
}

/* ====== 骨架屏 ====== */
.skeleton-overlay {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px 0;
}

.skeleton-block {
  background: rgba(100, 95, 88, 0.08);
  border-radius: var(--radius);
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-hero {
  height: 260px;
  width: 100%;
}

.skeleton-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.skeleton-card {
  height: 180px;
  width: 100%;
}

.skeleton-manifesto {
  height: 200px;
  width: 100%;
}

@media (max-width: 768px) {
  .skeleton-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .skeleton-hero {
    height: 200px;
  }
  .skeleton-card {
    height: 150px;
  }
  .skeleton-manifesto {
    height: 160px;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ====== Hero区域 ====== */
.hero {
  text-align: center;
  padding: 48px 0 40px;
  position: relative;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Cinzel', serif;
  font-size: 11px;
  letter-spacing: 3px;
  color: var(--text-muted);
  border: 1px solid var(--border-color);
  padding: 6px 18px;
  border-radius: 20px;
  margin-bottom: 28px;
}

.badge-gear {
  color: var(--brass);
  opacity: 0.5;
  animation: spin 6s linear infinite;
}

/* 装饰罗盘 */
.hero-compass-deco {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
  opacity: 0.5;
}

.hero-compass-svg {
  width: 340px;
  height: 340px;
  animation: compassSpin 120s linear infinite;
}

@keyframes compassSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 标题 */
.hero-title {
  font-family: 'Cinzel', serif;
  font-weight: 900;
  font-size: 60px;
  letter-spacing: 8px;
  margin-bottom: 16px;
  line-height: 1.2;
  position: relative;
  text-shadow: 0 0 40px rgba(0, 180, 216, 0.1), 0 0 80px rgba(255, 140, 66, 0.08);
}

.title-compass {
  background: linear-gradient(135deg, #7EC8E3, #0077B6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title-ampersand {
  color: var(--text-muted);
  margin: 0 12px;
  font-size: 48px;
  opacity: 0.5;
}

.title-ark {
  background: linear-gradient(135deg, #FFB347, #E06A2A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-family: 'Cinzel', serif;
  font-size: 13px;
  letter-spacing: 8px;
  color: var(--text-muted);
  margin-bottom: 16px;
  opacity: 0.7;
}

.hero-desc {
  color: var(--text-secondary);
  font-size: 15px;
  line-height: 1.8;
  margin-bottom: 0;
  max-width: 450px;
  margin-left: auto;
  margin-right: auto;
}

/* 分割线 */
.hero-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin: 32px auto;
  max-width: 300px;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--brass), transparent);
  opacity: 0.3;
}

.divider-gear {
  animation: spin 6s linear infinite;
  color: var(--brass);
  opacity: 0.5;
}

/* 按钮 */
.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.hero-actions a {
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-icon {
  transition: transform 0.3s ease;
}

.hero-actions a:hover .btn-icon {
  transform: rotate(20deg);
}

/* ====== 双核卡片 ====== */
.dual-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin: 48px 0;
}

.dual-card {
  display: flex;
  align-items: flex-start;
  gap: 18px;
  padding: 28px 32px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

/* 蒸汽朋克边角装饰 */
.card-corner {
  position: absolute;
  width: 12px;
  height: 12px;
  border-color: var(--brass);
  opacity: 0.2;
}
.top-left { top: 8px; left: 8px; border-top: 1px solid; border-left: 1px solid; }
.top-right { top: 8px; right: 8px; border-top: 1px solid; border-right: 1px solid; }
.bottom-left { bottom: 8px; left: 8px; border-bottom: 1px solid; border-left: 1px solid; }
.bottom-right { bottom: 8px; right: 8px; border-bottom: 1px solid; border-right: 1px solid; }

.dual-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 4px;
  transition: all 0.3s ease;
}

.compass-wrap {
  background: rgba(0, 180, 216, 0.08);
  border: 1px solid rgba(0, 180, 216, 0.2);
}

.ark-wrap {
  background: rgba(255, 140, 66, 0.08);
  border: 1px solid rgba(255, 140, 66, 0.2);
}

.dual-card:hover .compass-wrap {
  box-shadow: 0 0 20px var(--compass-glow);
}

.dual-card:hover .ark-wrap {
  box-shadow: 0 0 20px var(--ark-glow);
}

.dual-content {
  flex: 1;
}

.dual-title {
  font-family: 'Cinzel', serif;
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 2px;
  margin-bottom: 8px;
}

.compass-text { color: var(--compass); }
.ark-text { color: var(--ark); }

.dual-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 12px;
}

.dual-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-size: 10px;
  padding: 3px 10px;
  border-radius: 10px;
  font-family: 'Cinzel', serif;
  letter-spacing: 1px;
}

.compass-tag {
  border: 1px solid var(--compass);
  color: var(--compass);
  background: rgba(0, 180, 216, 0.08);
}

.ark-tag {
  border: 1px solid var(--ark);
  color: var(--ark);
  background: rgba(255, 140, 66, 0.08);
}

.dual-arrow {
  font-size: 20px;
  align-self: center;
  transition: transform 0.3s ease;
  font-family: 'Cinzel', serif;
}

.dual-card:hover .dual-arrow {
  transform: translateX(6px);
}

/* ====== 宣言 ====== */
.manifesto {
  margin: 64px 0 32px;
}

.manifesto-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 32px;
}

.manifesto-item {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  padding: 24px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
  transition: all 0.3s ease;
}

.manifesto-item:hover {
  border-color: var(--border-glow);
  box-shadow: 0 0 20px rgba(0, 180, 216, 0.06);
}

.manifesto-num {
  font-family: 'Cinzel', serif;
  font-weight: 700;
  font-size: 28px;
  flex-shrink: 0;
  line-height: 1;
  opacity: 0.5;
}

.manifesto-item p {
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-secondary);
}

/* 底部装饰 */
.home-footer-deco {
  display: flex;
  justify-content: center;
  margin: 48px 0 0;
  opacity: 0.5;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ====== 响应式 ====== */
@media (max-width: 768px) {
  .hero {
    padding: 24px 0 24px;
  }
  .hero-badge {
    font-size: 10px;
    padding: 4px 14px;
    margin-bottom: 18px;
  }
  .hero-compass-svg {
    width: 180px;
    height: 180px;
  }
  .hero-title {
    font-size: 28px;
    letter-spacing: 3px;
    margin-bottom: 12px;
  }
  .title-ampersand {
    font-size: 22px;
    margin: 0 4px;
  }
  .hero-subtitle {
    font-size: 10px;
    letter-spacing: 4px;
    margin-bottom: 12px;
  }
  .hero-desc {
    font-size: 13px;
    line-height: 1.6;
    padding: 0 16px;
  }
  .hero-divider {
    margin: 20px auto;
    max-width: 200px;
  }
  .hero-actions {
    gap: 12px;
  }
  .hero-actions a {
    font-size: 13px;
    padding: 10px 20px;
  }
  .dual-section {
    grid-template-columns: 1fr;
    gap: 16px;
    margin: 24px 0;
  }
  .dual-card {
    padding: 20px;
    gap: 14px;
  }
  .dual-icon-wrap {
    width: 44px;
    height: 44px;
  }
  .dual-icon-wrap svg {
    width: 22px;
    height: 22px;
  }
  .dual-title {
    font-size: 14px;
  }
  .dual-desc {
    font-size: 12px;
    line-height: 1.6;
  }
  .dual-arrow {
    display: none;
  }
  .manifesto {
    margin: 32px 0 24px;
  }
  .manifesto-grid {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-top: 20px;
  }
  .manifesto-item {
    padding: 16px;
    gap: 12px;
  }
  .manifesto-num {
    font-size: 22px;
  }
  .manifesto-item p {
    font-size: 13px;
  }
  .home-footer-deco {
    margin: 24px 0 0;
  }
  .home-footer-deco svg {
    width: 140px;
    height: 16px;
  }
  .section-title {
    font-size: 16px;
    letter-spacing: 3px;
  }
}
</style>
