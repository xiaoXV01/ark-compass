<template>
  <div class="ark-page">
    <div class="page-header">
      <div class="page-badge">◆ 方舟 · SQ测评</div>
      <h1 class="page-title">共生指数测试</h1>
      <p class="page-desc">
        10道选择题，从五个维度了解你在AI时代的人机共生姿态。<br>
        没有对错之分，只有真实的自己。
      </p>
      <div class="dimension-summary">
        <span class="dim-item" v-for="d in dimensions" :key="d.name"
          :style="{ '--dim-color': d.color }">
          {{ d.label }}
        </span>
      </div>
      <router-link to="/ark/quiz" class="btn-ark start-btn">
        ◆ 开始测评
      </router-link>
      <p class="time-hint">约需3分钟 · 10道选择题</p>
    </div>
  </div>
</template>

<script setup>
const dimensions = [
  { name: 'openness', label: '人机协作开放性', color: '#7EC8E3' },
  { name: 'critical', label: '批判性思维', color: '#00B4D8' },
  { name: 'meaning', label: '数字意义感', color: '#FFB347' },
  { name: 'resilience', label: '情绪韧性', color: '#FF8C42' },
  { name: 'empathy', label: '社会共情力', color: '#E06A2A' }
]
</script>

<style scoped>
.ark-page {
  text-align: center;
  animation: fadeIn 0.6s ease;
  padding-top: 40px;
}

.page-badge {
  display: inline-block;
  font-family: 'Cinzel', serif;
  font-size: 12px;
  letter-spacing: 3px;
  color: var(--ark);
  border: 1px solid var(--ark);
  padding: 4px 16px;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 140, 66, 0.06);
}

.page-title {
  font-family: 'Cinzel', serif;
  font-weight: 700;
  font-size: 28px;
  letter-spacing: 4px;
  color: var(--ark);
  margin-bottom: 16px;
}

.page-desc {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.8;
  max-width: 480px;
  margin: 0 auto 28px;
}

.dimension-summary {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 36px;
}

.dim-item {
  font-size: 11px;
  padding: 4px 12px;
  border-radius: 12px;
  border: 1px solid var(--dim-color);
  color: var(--dim-color);
  background: color-mix(in srgb, var(--dim-color) 8%, transparent);
  font-family: 'Cinzel', serif;
  letter-spacing: 1px;
}

.start-btn {
  display: inline-block;
  text-decoration: none;
  font-size: 15px;
  padding: 14px 48px;
}

.time-hint {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 12px;
}
</style>
