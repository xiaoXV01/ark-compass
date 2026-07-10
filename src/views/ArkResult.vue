<template>
  <div class="result-page" v-if="result">
    <div class="page-back">
      <router-link to="/ark/quiz" class="back-link">← 重新测评</router-link>
    </div>

    <!-- 称号卡片 -->
    <div class="title-section card">
      <div class="title-badge" :class="result.totalScore >= 80 ? 'gold' : result.totalScore >= 60 ? 'silver' : ''">
        <span class="title-icon" v-if="result.totalScore >= 80">🏆</span>
        <span class="title-icon" v-else-if="result.totalScore >= 60">🌟</span>
        <span class="title-icon" v-else-if="result.totalScore >= 40">🌱</span>
        <span class="title-icon" v-else>🧭</span>
      </div>

      <h1 class="result-title">{{ result.title }}</h1>
      <p class="result-subtitle">{{ result.subtitle }}</p>

      <div class="score-display">
        <div class="score-ring">
          <svg viewBox="0 0 120 120" class="score-svg">
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="8"/>
            <circle cx="60" cy="60" r="54" fill="none" :stroke="scoreColor" stroke-width="8"
              stroke-linecap="round"
              :stroke-dasharray="339.292"
              :stroke-dashoffset="339.292 - (339.292 * result.totalScore / 100)"
              transform="rotate(-90, 60, 60)"
              class="score-arc"
            />
          </svg>
          <div class="score-inner">
            <span class="score-value">{{ result.totalScore }}</span>
            <span class="score-unit">/ 100</span>
          </div>
        </div>
      </div>

      <p class="result-description">{{ result.description }}</p>

      <div v-if="result.bonusMsg" class="bonus-note">
        {{ result.bonusMsg }}
      </div>
    </div>

    <!-- 五维度 -->
    <div class="dimensions-section card">
      <h3 class="section-subtitle">五维度分析</h3>
      <div class="dim-result" v-for="d in dimData" :key="d.name">
        <div class="dim-header">
          <span class="dim-name" :style="{ color: d.color }">{{ d.label }}</span>
          <span class="dim-score" :style="{ color: d.color }">{{ d.score }}<span class="dim-max">/100</span></span>
        </div>
        <div class="dim-bar-bg">
          <div class="dim-bar-fill" :style="{ width: d.score + '%', background: `linear-gradient(90deg, ${d.color}44, ${d.color})` }"></div>
        </div>
        <p class="dim-comment">{{ d.comment }}</p>
      </div>
    </div>

    <!-- 分享区 -->
    <div class="share-section">
      <p class="share-hint">分享你的共生称号，邀请更多人加入这场探索</p>
      <div class="share-buttons">
        <el-dropdown trigger="click" @command="handleShare">
          <button class="btn-ark">
            ◈ 分享结果
          </button>
          <template #dropdown>
            <el-dropdown-menu class="steampunk-dropdown">
              <el-dropdown-item command="copy">
                <span class="dropdown-icon">📋</span> 复制分享文案
              </el-dropdown-item>
              <el-dropdown-item command="screenshot">
                <span class="dropdown-icon">📸</span> 下载截图
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 截图专用容器（隐藏，由 html2canvas 捕获） -->
    <div ref="captureRef" class="capture-container">
      <div class="capture-header">
        <span>🧭 方舟 SQ · 共生态势能测评报告</span>
      </div>
      <div class="title-section capture-card">
        <div class="title-badge" :class="result.totalScore >= 80 ? 'gold' : result.totalScore >= 60 ? 'silver' : ''">
          <span class="title-icon" v-if="result.totalScore >= 80">🏆</span>
          <span class="title-icon" v-else-if="result.totalScore >= 60">🌟</span>
          <span class="title-icon" v-else-if="result.totalScore >= 40">🌱</span>
          <span class="title-icon" v-else>🧭</span>
        </div>
        <h1 class="capture-title">{{ result.title }}</h1>
        <div class="score-display">
          <div class="score-ring">
            <svg viewBox="0 0 120 120" class="score-svg">
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="8"/>
              <circle cx="60" cy="60" r="54" fill="none" :stroke="scoreColor" stroke-width="8"
                stroke-linecap="round"
                :stroke-dasharray="339.292"
                :stroke-dashoffset="339.292 - (339.292 * result.totalScore / 100)"
                transform="rotate(-90, 60, 60)"
              />
            </svg>
            <div class="score-inner">
              <span class="score-value">{{ result.totalScore }}</span>
              <span class="score-unit">/ 100</span>
            </div>
          </div>
        </div>
        <p class="capture-desc">{{ result.description }}</p>
      </div>
      <div class="dimensions-section capture-card">
        <h3 class="section-subtitle">五维度分析</h3>
        <div class="dim-result" v-for="d in dimData" :key="d.name">
          <div class="dim-header">
            <span class="dim-name" :style="{ color: d.color }">{{ d.label }}</span>
            <span class="dim-score" :style="{ color: d.color }">{{ d.score }}<span class="dim-max">/100</span></span>
          </div>
          <div class="dim-bar-bg">
            <div class="dim-bar-fill" :style="{ width: d.score + '%', background: `linear-gradient(90deg, ${d.color}44, ${d.color})` }"></div>
          </div>
        </div>
      </div>
      <div class="capture-footer">
        <span>方舟与罗盘 · SQ共生态势能评估系统 · http://150.158.36.130/ark/</span>
      </div>
    </div>
  </div>

  <div v-else class="no-result">
    <p>未找到测评结果</p>
    <router-link to="/ark/quiz" class="btn-ark">开始测评</router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { copyShareText, downloadResultCard } from '../services/shareService.js'

const route = useRoute()
const result = ref(null)
const captureRef = ref(null)

const dimensionConfig = {
  empathy:        { label: '同理心',       color: '#E06A2A' },
  boundary:       { label: '边界感',       color: '#7EC8E3' },
  reflection:     { label: '自省力',       color: '#00B4D8' },
  responsibility: { label: '责任感',       color: '#FFB347' },
  openness:       { label: '开放性',       color: '#FF8C42' }
}

onMounted(() => {
  try {
    if (route.query.data) {
      result.value = JSON.parse(route.query.data)
    }
  } catch (e) {
    console.error('解析结果失败', e)
  }
})

const scoreColor = computed(() => {
  if (!result.value) return '#FF8C42'
  if (result.value.totalScore >= 70) return '#00B4D8'
  if (result.value.totalScore >= 45) return '#FFB347'
  return '#E06A2A'
})

const dimData = computed(() => {
  if (!result.value) return []
  return Object.entries(result.value.dimScores).map(([name, score]) => {
    const config = dimensionConfig[name] || { label: name, color: '#FF8C42' }
    let comment
    if (score >= 75) comment = '表现突出，这是你的优势维度'
    else if (score >= 50) comment = '表现良好，有进一步提升空间'
    else comment = '值得关注，可以多留意这个方向'
    return { name, score, ...config, comment }
  })
})

/**
 * 处理分享命令
 * @param {'copy'|'screenshot'} cmd
 */
async function handleShare(cmd) {
  if (!result.value) return

  if (cmd === 'copy') {
    await copyShareText('sq', result.value)
  } else if (cmd === 'screenshot') {
    await downloadResultCard('sq', result.value, captureRef)
  }
}
</script>

<style scoped>
.result-page {
  animation: fadeIn 0.6s ease;
  max-width: 680px;
  margin: 0 auto;
}

.page-back { margin-bottom: 16px; }
.back-link { color: var(--text-secondary); text-decoration: none; font-size: 13px; }
.back-link:hover { color: var(--ark); }

/* 称号 */
.title-section {
  text-align: center;
  padding: 40px 32px;
  margin-bottom: 20px;
}

.title-badge {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  border: 2px solid var(--text-muted);
  background: rgba(255, 255, 255, 0.04);
}

.title-badge.gold {
  border-color: var(--ark);
  box-shadow: 0 0 20px var(--ark-glow);
}

.title-badge.silver {
  border-color: var(--compass);
  box-shadow: 0 0 20px var(--compass-glow);
}

.title-icon {
  font-size: 28px;
}

.result-title {
  font-family: 'Cinzel', serif;
  font-weight: 700;
  font-size: 28px;
  letter-spacing: 4px;
  color: var(--ark);
  margin-bottom: 6px;
}

.result-subtitle {
  font-size: 13px;
  color: var(--text-muted);
  letter-spacing: 2px;
  margin-bottom: 24px;
}

/* 分数环 */
.score-display {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.score-ring {
  position: relative;
  width: 140px;
  height: 140px;
}

.score-svg {
  width: 100%;
  height: 100%;
}

.score-arc {
  transition: stroke-dashoffset 1.5s ease;
}

.score-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.score-value {
  display: block;
  font-family: 'Cinzel', serif;
  font-weight: 700;
  font-size: 36px;
  color: var(--text-primary);
  line-height: 1;
}

.score-unit {
  font-size: 10px;
  color: var(--text-muted);
  letter-spacing: 1px;
}

.result-description {
  font-size: 14px;
  line-height: 1.8;
  color: var(--text-secondary);
  max-width: 500px;
  margin: 0 auto;
}

.bonus-note {
  margin-top: 20px;
  padding: 12px 20px;
  border: 1px solid var(--ark);
  border-radius: var(--radius-sm);
  color: var(--ark-light);
  font-size: 13px;
  line-height: 1.6;
  background: rgba(255, 140, 66, 0.06);
}

/* 维度 */
.dimensions-section {
  padding: 28px;
  margin-bottom: 20px;
}

.section-subtitle {
  font-family: 'Cinzel', serif;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 2px;
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
}

.dim-result {
  margin-bottom: 18px;
}

.dim-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.dim-name {
  font-family: 'Cinzel', serif;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 1px;
}

.dim-score {
  font-weight: 700;
  font-size: 14px;
}

.dim-max {
  font-size: 10px;
  color: var(--text-muted);
  font-weight: 400;
}

.dim-bar-bg {
  height: 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 4px;
}

.dim-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 1s ease;
}

.dim-comment {
  font-size: 12px;
  color: var(--text-muted);
}

/* 分享 */
.share-section {
  text-align: center;
  padding: 20px;
}

.share-hint {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.share-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
}

/* 截图容器（隐藏，仅由 html2canvas 捕获） */
.capture-container {
  position: fixed;
  left: -9999px;
  top: 0;
  width: 520px;
  padding: 24px;
  background: #2A2D30;
  border: 1px solid rgba(100, 95, 88, 0.2);
  border-radius: 12px;
  z-index: -1;
}

.capture-header {
  text-align: center;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid rgba(100, 95, 88, 0.2);
  font-family: 'Cinzel', serif;
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 2px;
  color: var(--text-primary);
}

.capture-card {
  padding: 24px;
  background: rgba(50, 53, 56, 0.85);
  border: 1px solid rgba(100, 95, 88, 0.2);
  border-radius: 12px;
  margin-bottom: 16px;
}

.capture-title {
  font-family: 'Cinzel', serif;
  font-weight: 700;
  font-size: 22px;
  letter-spacing: 4px;
  color: var(--ark);
  margin-bottom: 16px;
}

.capture-desc {
  font-size: 13px;
  color: var(--text-secondary);
  max-width: 400px;
  margin: 0 auto;
}

.capture-footer {
  text-align: center;
  padding-top: 16px;
  font-size: 11px;
  color: var(--text-muted);
  letter-spacing: 2px;
}

.capture-container .dim-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.capture-container .dim-name {
  font-family: 'Cinzel', serif;
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 1px;
}

.capture-container .dim-score {
  font-weight: 700;
  font-size: 13px;
}

.capture-container .dim-bar-bg {
  height: 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 4px;
}

.capture-container .dim-bar-fill {
  height: 100%;
  border-radius: 3px;
}

.capture-container .dim-max {
  font-size: 10px;
  color: var(--text-muted);
  font-weight: 400;
}

/* 蒸汽朋克下拉菜单 */
.steampunk-dropdown {
  background: #3A3D40;
  border: 1px solid rgba(100, 95, 88, 0.3);
  border-radius: 6px;
  padding: 4px;
}

.steampunk-dropdown :deep(.el-dropdown-menu__item) {
  color: var(--text-primary);
  font-family: 'Cinzel', serif;
  font-size: 12px;
  letter-spacing: 1px;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.steampunk-dropdown :deep(.el-dropdown-menu__item:hover) {
  background: rgba(255, 140, 66, 0.15);
  color: var(--ark-light);
}

.steampunk-dropdown :deep(.el-dropdown-menu__item:focus) {
  background: rgba(255, 140, 66, 0.15);
  color: var(--ark-light);
}

.dropdown-icon {
  margin-right: 6px;
  font-size: 14px;
}

/* 空状态 */
.no-result {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-muted);
}
.no-result p {
  margin-bottom: 20px;
}
.no-result a {
  display: inline-block;
  text-decoration: none;
}
</style>
