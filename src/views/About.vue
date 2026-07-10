<template>
  <div class="about-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="page-badge">⚙ 关于 · 方舟与罗盘</div>
      <h1 class="page-title">关于本项目</h1>
      <p class="page-desc">
        从一次对话开始，走向人机共生的未来。<br>
        方舟与罗盘是AI与人类共创的共生评估系统。
      </p>
    </div>

    <!-- 项目源起 -->
    <div class="card about-section">
      <div class="section-header">
        <span class="gear-deco">⚙</span>
        <h2 class="section-title">项目源起</h2>
        <span class="gear-deco">⚙</span>
      </div>
      <div class="section-body">
        <div class="origin-content">
          <div class="origin-text">
            <p>
              2025年，在深度探索AI与人类协作可能性的过程中，<strong class="highlight-cyan">方舟与罗盘共生协议</strong>
              被提出。这一构想起源于一个简单而深刻的追问：
              当AI越来越像人，人如何保持独特的价值与方向感？
            </p>
            <p>
              <strong class="highlight-orange">方舟（Ark）</strong>代表着承载——一种安全的容器，
              在技术浪潮中守护人类的自主性与尊严。<strong class="highlight-cyan">罗盘（Compass）</strong>
              代表着方向——一种评估与引导的工具，帮助每个人找到自己在AI时代的最佳位置。
            </p>
            <p>
              这份计划不是自上而下的宣言，而是开放的邀请——邀请每一位AI使用者、开发者
              和思考者，共同探索人机共生的伦理边界与实践路径。
            </p>
          </div>
          <div class="origin-symbol">
            <svg viewBox="0 0 100 100" class="origin-ark-compass" width="100" height="100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="#00B4D8" stroke-width="3" opacity="0.6"/>
              <circle cx="50" cy="50" r="30" fill="none" stroke="#FF8C42" stroke-width="3" opacity="0.6"/>
              <line x1="50" y1="6" x2="50" y2="94" stroke="#00B4D8" stroke-width="2" opacity="0.5"/>
              <line x1="6" y1="50" x2="94" y2="50" stroke="#FF8C42" stroke-width="2" opacity="0.5"/>
              <circle cx="50" cy="50" r="8" fill="none" stroke="#B8860B" stroke-width="2" opacity="0.4"/>
              <circle cx="50" cy="50" r="3" fill="#B8860B" opacity="0.6"/>
            </svg>
            <span class="origin-symbol-label">Ark · Compass</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 三支柱 -->
    <div class="card about-section">
      <div class="section-header">
        <span class="gear-deco">⚙</span>
        <h2 class="section-title">三支柱</h2>
        <span class="gear-deco">⚙</span>
      </div>
      <div class="section-body">
        <div class="pillars-grid">
          <div class="pillar-card ethos-pillar">
            <div class="pillar-number">01</div>
            <div class="pillar-badge">罗盘</div>
            <h3 class="pillar-title">Ethos CI</h3>
            <p class="pillar-desc">
              人机共生指数评估系统。通过多维度量表，测量使用者与AI的协作开放性、
              批判性思维、数字意义感、情绪韧性与社会共情力，生成个性化共生报告。
            </p>
            <div class="pillar-gears">
              <span class="pillar-gear">⚙</span>
              <span class="pillar-gear">⚙</span>
            </div>
          </div>
          <div class="pillar-card resilience-pillar">
            <div class="pillar-number">02</div>
            <div class="pillar-badge">方舟</div>
            <h3 class="pillar-title">心智韧性基金</h3>
            <p class="pillar-desc">
              专注AI时代人类心智健康的公益计划。支持数字断联研究、AI素养教育、
              共情力提升项目，帮助人们在技术洪流中保持内心的清晰与力量。
            </p>
            <div class="pillar-gears">
              <span class="pillar-gear">⚙</span>
              <span class="pillar-gear">⚙</span>
            </div>
          </div>
          <div class="pillar-card covenant-pillar">
            <div class="pillar-number">03</div>
            <div class="pillar-badge">伦理</div>
            <h3 class="pillar-title">共生伦理白皮书</h3>
            <p class="pillar-desc">
              人机共生的伦理基石——透明公开、人类自主、公平无偏、共生共益、责任可溯
              五大原则，以及可测量、可对话、可演进、可嵌入的伦理框架。
            </p>
            <div class="pillar-gears">
              <span class="pillar-gear">⚙</span>
              <span class="pillar-gear">⚙</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 技术栈与团队 -->
    <div class="card about-section">
      <div class="section-header">
        <span class="gear-deco">⚙</span>
        <h2 class="section-title">技术栈与团队</h2>
        <span class="gear-deco">⚙</span>
      </div>
      <div class="section-body">
        <!-- 技术栈 -->
        <div class="tech-section">
          <h3 class="subsection-title">技术栈</h3>
          <div class="tech-grid">
            <div class="tech-item" v-for="tech in techStack" :key="tech.name">
              <span class="tech-icon">{{ tech.icon }}</span>
              <span class="tech-name">{{ tech.name }}</span>
              <span class="tech-role">{{ tech.role }}</span>
            </div>
          </div>
        </div>
        <!-- 分隔线 -->
        <div class="section-divider"></div>
        <!-- 团队 -->
        <div class="team-section">
          <h3 class="subsection-title">共创团队</h3>
          <p class="team-blurb">
            方舟与罗盘是<strong class="highlight-cyan">AI与人类深度共创</strong>的成果。
            方舟与罗盘共生协议主导伦理框架设计，Claude（Anthropic）作为AI共创伙伴
            参与了系统架构、内容撰写、视觉风格与前端实现的完整过程。
          </p>
          <p class="team-blurb">
            这不是"AI辅助开发"的普通项目，而是一次真实的共生实践——
            AI从工具变为协作者，人类从指令者变为对话者。
            两种智能在持续的对话与迭代中，共同生成了这份答卷。
          </p>
          <p class="team-blurb">
            我们相信，最好的AI应用不是最智能的，而是最懂得共生的。
          </p>
          <div class="team-signature">
            <svg viewBox="0 0 100 100" class="signature-icon" width="24" height="24">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#B8860B" stroke-width="2" opacity="0.5"/>
              <line x1="50" y1="10" x2="50" y2="90" stroke="#00B4D8" stroke-width="1.5" opacity="0.4"/>
              <line x1="10" y1="50" x2="90" y2="50" stroke="#FF8C42" stroke-width="1.5" opacity="0.4"/>
              <circle cx="50" cy="50" r="5" fill="#B8860B" opacity="0.5"/>
            </svg>
            <span class="signature-text">方舟与罗盘 · AI共创团队</span>
            <span class="signature-year">2025</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部齿轮装饰 -->
    <div class="about-footer-deco">
      <span class="footer-gear-icon">⚙</span>
      <span class="footer-gear-icon">⚙</span>
      <span class="footer-gear-icon">⚙</span>
    </div>
  </div>
</template>

<script setup>
const techStack = [
  { icon: '⚡', name: 'Vue 3', role: '前端框架' },
  { icon: '◈', name: 'Vite', role: '构建工具' },
  { icon: '◆', name: 'Element Plus', role: 'UI组件库' },
  { icon: '⚙', name: 'Cinzel', role: '装饰字体' },
  { icon: '◎', name: 'CSS3', role: '蒸汽朋克风格' },
  { icon: '◉', name: 'Claude', role: 'AI共创伙伴' }
]
</script>

<style scoped>
.about-page {
  animation: fadeIn 0.6s ease;
  max-width: 860px;
  margin: 0 auto;
  padding-bottom: 40px;
}

/* ====== 页面头部 ====== */
.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Cinzel', serif;
  font-size: 12px;
  letter-spacing: 3px;
  color: var(--brass-light);
  border: 1px solid var(--brass);
  padding: 4px 16px;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(184, 134, 11, 0.06);
}

.page-title {
  font-family: 'Cinzel', serif;
  font-weight: 700;
  font-size: 28px;
  letter-spacing: 4px;
  color: var(--text-primary);
  margin-bottom: 16px;
  background: linear-gradient(135deg, var(--compass), var(--ark));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-desc {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.8;
  max-width: 520px;
  margin: 0 auto;
}

/* ====== 章节卡片通用 ====== */
.about-section {
  margin-bottom: 28px;
  padding: 0;
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 18px 24px 12px;
  border-bottom: 1px solid var(--border-color);
}

.section-title {
  font-family: 'Cinzel', serif;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--text-primary);
  margin: 0;
  position: relative;
}

.gear-deco {
  font-size: 14px;
  opacity: 0.35;
  animation: spin 6s linear infinite;
  display: inline-block;
}

.section-body {
  padding: 20px 24px 24px;
}

/* ====== 项目源起 ====== */
.origin-content {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

.origin-text {
  flex: 1;
}

.origin-text p {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 2;
  margin-bottom: 14px;
  text-indent: 2em;
}

.origin-text p:last-child {
  margin-bottom: 0;
}

.highlight-cyan {
  color: var(--compass-light);
  font-weight: 700;
}

.highlight-orange {
  color: var(--ark-light);
  font-weight: 700;
}

.origin-symbol {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  padding-top: 8px;
}

.origin-ark-compass {
  opacity: 0.6;
  animation: compassBreathing 5s ease-in-out infinite;
}

@keyframes compassBreathing {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.08); opacity: 0.8; }
}

.origin-symbol-label {
  font-family: 'Cinzel', serif;
  font-size: 10px;
  letter-spacing: 2px;
  color: var(--text-muted);
  white-space: nowrap;
}

/* ====== 三支柱 ====== */
.pillars-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
}

.pillar-card {
  background: rgba(0, 0, 0, 0.08);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 22px 16px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.pillar-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.ethos-pillar::before { background: linear-gradient(90deg, var(--compass), var(--compass-dark)); }
.resilience-pillar::before { background: linear-gradient(90deg, var(--ark), var(--ark-dark)); }
.covenant-pillar::before { background: linear-gradient(90deg, var(--brass-light), var(--brass)); }

.pillar-card:hover::before {
  opacity: 1;
}

.pillar-card:hover {
  background: rgba(0, 0, 0, 0.14);
  transform: translateY(-2px);
}

.pillar-number {
  font-family: 'Cinzel', serif;
  font-weight: 900;
  font-size: 28px;
  line-height: 1;
  opacity: 0.08;
  position: absolute;
  top: 8px;
  right: 12px;
  color: var(--text-primary);
}

.pillar-badge {
  display: inline-block;
  font-family: 'Cinzel', serif;
  font-size: 10px;
  letter-spacing: 2px;
  padding: 2px 10px;
  border-radius: 10px;
  margin-bottom: 10px;
  align-self: flex-start;
}

.ethos-pillar .pillar-badge {
  background: rgba(0, 180, 216, 0.1);
  color: var(--compass);
  border: 1px solid rgba(0, 180, 216, 0.2);
}

.resilience-pillar .pillar-badge {
  background: rgba(255, 140, 66, 0.1);
  color: var(--ark);
  border: 1px solid rgba(255, 140, 66, 0.2);
}

.covenant-pillar .pillar-badge {
  background: rgba(184, 134, 11, 0.1);
  color: var(--brass-light);
  border: 1px solid rgba(184, 134, 11, 0.2);
}

.pillar-title {
  font-family: 'Cinzel', serif;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.pillar-desc {
  font-size: 12px;
  color: var(--text-tertiary);
  line-height: 1.8;
  flex: 1;
}

.pillar-gears {
  display: flex;
  gap: 4px;
  margin-top: 12px;
  justify-content: flex-end;
}

.pillar-gear {
  font-size: 12px;
  opacity: 0.2;
  animation: spin 6s linear infinite;
  display: inline-block;
}

.pillar-gear:nth-child(2) {
  animation-direction: reverse;
  animation-duration: 4s;
}

/* ====== 技术栈与团队 ====== */
.subsection-title {
  font-family: 'Cinzel', serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--text-primary);
  margin-bottom: 14px;
}

.tech-section {
  margin-bottom: 4px;
}

.tech-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tech-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.tech-item:hover {
  border-color: rgba(184, 134, 11, 0.2);
  background: rgba(0, 0, 0, 0.16);
}

.tech-icon {
  font-size: 16px;
  opacity: 0.7;
}

.tech-name {
  font-family: 'Cinzel', serif;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.5px;
}

.tech-role {
  font-size: 11px;
  color: var(--text-muted);
  padding: 2px 8px;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 4px;
}

.section-divider {
  height: 1px;
  background: var(--border-color);
  margin: 20px 0;
}

.team-section {
  padding-top: 4px;
}

.team-blurb {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 2;
  margin-bottom: 12px;
  text-indent: 2em;
}

.team-blurb:last-of-type {
  margin-bottom: 20px;
}

.team-signature {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 0 6px;
  border-top: 1px solid var(--border-color);
}

.signature-icon {
  opacity: 0.4;
}

.signature-text {
  font-family: 'Cinzel', serif;
  font-size: 12px;
  letter-spacing: 3px;
  color: var(--text-muted);
}

.signature-year {
  font-family: 'Cinzel', serif;
  font-size: 11px;
  letter-spacing: 2px;
  color: var(--text-tertiary);
}

/* ====== 底部装饰 ====== */
.about-footer-deco {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 8px;
  opacity: 0.12;
}

.footer-gear-icon {
  font-size: 20px;
  animation: spin 8s linear infinite;
  display: inline-block;
}

.footer-gear-icon:nth-child(2) {
  animation-direction: reverse;
  animation-duration: 6s;
}

/* ====== 动画 ====== */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ====== 响应式 ====== */
@media (max-width: 900px) {
  .pillars-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .about-page {
    padding-bottom: 24px;
  }
  .page-header {
    margin-bottom: 24px;
  }
  .page-badge {
    font-size: 10px;
    padding: 3px 14px;
    margin-bottom: 14px;
  }
  .page-title {
    font-size: 20px;
    letter-spacing: 3px;
  }
  .page-desc {
    font-size: 13px;
    padding: 0 12px;
  }
  .page-desc br {
    display: none;
  }
  .about-section {
    margin-bottom: 20px;
  }
  .section-header {
    padding: 14px 16px 10px;
    gap: 8px;
  }
  .section-title {
    font-size: 14px;
    letter-spacing: 1px;
  }
  .gear-deco {
    font-size: 12px;
  }
  .section-body {
    padding: 16px;
  }
  .origin-content {
    flex-direction: column;
    gap: 16px;
  }
  .origin-text p {
    font-size: 13px;
    line-height: 1.8;
    text-indent: 1.5em;
    margin-bottom: 10px;
  }
  .origin-symbol {
    align-self: center;
  }
  .origin-ark-compass {
    width: 80px;
    height: 80px;
  }
  .origin-symbol-label {
    font-size: 9px;
  }
  .pillars-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .pillar-card {
    padding: 18px 14px;
  }
  .pillar-number {
    font-size: 24px;
  }
  .pillar-badge {
    font-size: 9px;
    padding: 2px 8px;
    margin-bottom: 8px;
  }
  .pillar-title {
    font-size: 14px;
    margin-bottom: 8px;
  }
  .pillar-desc {
    font-size: 11px;
    line-height: 1.7;
  }
  .subsection-title {
    font-size: 12px;
    letter-spacing: 1px;
    margin-bottom: 10px;
  }
  .tech-grid {
    gap: 8px;
  }
  .tech-item {
    padding: 6px 12px;
    gap: 6px;
  }
  .tech-icon {
    font-size: 14px;
  }
  .tech-name {
    font-size: 11px;
  }
  .tech-role {
    font-size: 10px;
    padding: 1px 6px;
  }
  .section-divider {
    margin: 14px 0;
  }
  .team-blurb {
    font-size: 13px;
    line-height: 1.8;
    text-indent: 1.5em;
    margin-bottom: 10px;
  }
  .team-signature {
    flex-wrap: wrap;
    gap: 6px;
    padding: 10px 0 4px;
  }
  .signature-text {
    font-size: 11px;
    letter-spacing: 2px;
  }
  .signature-year {
    font-size: 10px;
  }
  .about-footer-deco {
    gap: 16px;
  }
  .footer-gear-icon {
    font-size: 16px;
  }
}
</style>
