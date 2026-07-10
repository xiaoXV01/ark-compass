<template>
  <div class="ethics-bar card" v-if="news.length > 0">
    <div class="card-corner top-left"></div>
    <div class="card-corner top-right"></div>
    <div class="card-corner bottom-left"></div>
    <div class="card-corner bottom-right"></div>

    <!-- 标题栏 -->
    <div class="bar-header">
      <div class="bar-title-wrap">
        <svg class="bar-icon" viewBox="0 0 24 24" width="18" height="18">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/>
          <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="1.5"/>
          <line x1="12" y1="4" x2="12" y2="8" stroke="currentColor" stroke-width="1.5"/>
          <line x1="12" y1="16" x2="12" y2="20" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        <span class="bar-title">AI 伦理日报</span>
        <span class="bar-badge">{{ currentIndex + 1 }}/{{ news.length }}</span>
      </div>
      <div class="bar-nav">
        <button class="bar-btn" @click="prev" :disabled="currentIndex <= 0">
          <svg viewBox="0 0 24 24" width="14" height="14"><polyline points="15 4 7 12 15 20" fill="none" stroke="currentColor" stroke-width="2"/></svg>
        </button>
        <button class="bar-btn" @click="next" :disabled="currentIndex >= news.length - 1">
          <svg viewBox="0 0 24 24" width="14" height="14"><polyline points="9 4 17 12 9 20" fill="none" stroke="currentColor" stroke-width="2"/></svg>
        </button>
      </div>
    </div>

    <!-- 当前新闻卡片 -->
    <div class="news-item" :key="currentItem.id">
      <div class="news-meta">
        <span class="news-tag" :style="{ background: tagInfo.color + '22', color: tagInfo.color, borderColor: tagInfo.color + '44' }">
          {{ tagInfo.icon }} {{ tagInfo.label }}
        </span>
        <span class="news-date">{{ currentItem.date }}</span>
        <span v-if="currentItem.source" class="news-source">{{ currentItem.source }}</span>
      </div>
      <h4 class="news-title">{{ currentItem.title }}</h4>
      <p class="news-summary">{{ currentItem.summary }}</p>
      <div class="news-footer">
        <div class="news-progress">
          <div class="progress-track">
            <div class="progress-bar" :style="{ width: ((currentIndex + 1) / news.length * 100) + '%' }"></div>
          </div>
        </div>
        <button class="news-close" @click="$emit('close')" title="收起">
          <svg viewBox="0 0 24 24" width="12" height="12"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getLatestEthicsNews } from '../services/ethicsNewsService.js'
import { NEWS_TAGS } from '../services/ethicsNewsService.js'

const emit = defineEmits(['close'])

const news = ref([])
const currentIndex = ref(0)

const currentItem = computed(() => news.value[currentIndex.value] || {})
const tagInfo = computed(() => NEWS_TAGS[currentItem.value.tag] || NEWS_TAGS.general)

onMounted(async () => {
  try {
    const items = await getLatestEthicsNews(7)
    if (items && items.length > 0) {
      news.value = items
    }
  } catch {
    // 静默降级
  }
})

function prev() {
  if (currentIndex.value > 0) currentIndex.value--
}
function next() {
  if (currentIndex.value < news.value.length - 1) currentIndex.value++
}

// 自动轮播（5秒后自动下一则，循环）
let autoTimer = null
onMounted(() => {
  autoTimer = setInterval(() => {
    if (news.value.length > 1) {
      currentIndex.value = (currentIndex.value + 1) % news.value.length
    }
  }, 8000)
})

// 用户交互时重置计时器
import { onUnmounted } from 'vue'
onUnmounted(() => {
  if (autoTimer) clearInterval(autoTimer)
})
</script>

<style scoped>
.ethics-bar {
  margin: 40px 0 0;
  padding: 20px 24px 16px;
  position: relative;
  border-color: var(--border-color);
}

.card-corner {
  position: absolute;
  width: 10px;
  height: 10px;
  border-color: var(--brass);
  opacity: 0.15;
}
.top-left { top: 6px; left: 6px; border-top: 1px solid; border-left: 1px solid; }
.top-right { top: 6px; right: 6px; border-top: 1px solid; border-right: 1px solid; }
.bottom-left { bottom: 6px; left: 6px; border-bottom: 1px solid; border-left: 1px solid; }
.bottom-right { bottom: 6px; right: 6px; border-bottom: 1px solid; border-right: 1px solid; }

.bar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.bar-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bar-icon {
  color: var(--brass);
  opacity: 0.7;
  animation: compassSpin 30s linear infinite;
}

.bar-title {
  font-family: 'Cinzel', serif;
  font-size: 13px;
  letter-spacing: 2px;
  color: var(--text-primary);
}

.bar-badge {
  font-size: 10px;
  color: var(--text-muted);
  background: rgba(184, 134, 11, 0.1);
  padding: 2px 8px;
  border-radius: 8px;
  font-family: 'Cinzel', serif;
}

.bar-nav {
  display: flex;
  gap: 4px;
}

.bar-btn {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  width: 28px;
  height: 28px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.bar-btn:hover:not(:disabled) {
  background: rgba(184, 134, 11, 0.1);
  border-color: var(--brass);
  color: var(--brass);
}
.bar-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* 新闻卡片 */
.news-item {
  animation: newsFadeIn 0.4s ease;
}

.news-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.news-tag {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid;
  font-family: 'Cinzel', serif;
  letter-spacing: 0.5px;
}

.news-date {
  font-size: 11px;
  color: var(--text-muted);
  font-family: monospace;
}

.news-source {
  font-size: 11px;
  color: var(--text-muted);
  opacity: 0.7;
}

.news-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  line-height: 1.5;
}

.news-summary {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.7;
  margin: 0;
}

.news-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
}

.news-progress {
  flex: 1;
  margin-right: 12px;
}

.progress-track {
  height: 3px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--compass), var(--ark));
  border-radius: 2px;
  transition: width 0.5s ease;
}

.news-close {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  opacity: 0.5;
  transition: all 0.2s;
}
.news-close:hover {
  opacity: 1;
  color: var(--text-primary);
}

@keyframes newsFadeIn {
  from { opacity: 0; transform: translateX(8px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes compassSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 响应式 */
@media (max-width: 768px) {
  .ethics-bar {
    margin: 24px 0 0;
    padding: 16px;
  }
  .bar-title {
    font-size: 12px;
  }
  .news-title {
    font-size: 14px;
  }
  .news-summary {
    font-size: 12px;
  }
  .news-source {
    display: none;
  }
}
</style>
