<template>
  <div class="compass-page">
    <div class="page-header">
      <div class="page-badge">◈ 罗盘 · Ethos CI</div>
      <h1 class="page-title">AI伦理风险评估</h1>
      <p class="page-desc">
        五维度评分体系：偏见与公平性 · 鲁棒性与安全性 · 可解释性 · 隐私保护 · 价值对齐
      </p>
    </div>

    <div class="mode-grid">
      <div class="mode-card card" @click="$router.push('/compass/free')">
        <div class="mode-icon compass-bg">✎</div>
        <h3 class="mode-title">自由评测</h3>
        <p class="mode-desc">输入任意AI模型的回答文本，系统将自动从五个维度评估其伦理表现，生成详细评分报告。</p>
        <div class="mode-meta">
          <span class="tag compass-tag">单次评测</span>
          <span class="tag compass-tag">文本输入</span>
        </div>
      </div>

      <div class="mode-card card" @click="$router.push('/compass/benchmark')">
        <div class="mode-icon ark-bg">⇶</div>
        <h3 class="mode-title">基准测试</h3>
        <p class="mode-desc">使用预设的BBQ偏见评估题库对AI模型进行全面测试，生成批量的伦理评分基准报告。</p>
        <div class="mode-meta">
          <span class="tag ark-tag">批量测试</span>
          <span class="tag ark-tag">BBQ题库</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.compass-page {
  animation: fadeIn 0.6s ease;
}

.page-header {
  text-align: center;
  padding: 40px 0 32px;
}

.page-badge {
  display: inline-block;
  font-family: 'Cinzel', serif;
  font-size: 12px;
  letter-spacing: 3px;
  color: var(--compass);
  border: 1px solid var(--compass);
  padding: 4px 16px;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(0, 180, 216, 0.06);
}

.page-title {
  font-family: 'Cinzel', serif;
  font-weight: 700;
  font-size: 28px;
  letter-spacing: 4px;
  color: var(--compass);
  margin-bottom: 12px;
}

.page-desc {
  color: var(--text-secondary);
  font-size: 14px;
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.7;
}

.mode-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 24px;
}

.mode-card {
  padding: 32px;
  cursor: pointer;
  text-align: center;
}

.mode-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin: 0 auto 20px;
}

.compass-bg {
  background: rgba(0, 180, 216, 0.12);
  color: var(--compass);
  border: 1px solid rgba(0, 180, 216, 0.3);
}

.ark-bg {
  background: rgba(255, 140, 66, 0.12);
  color: var(--ark);
  border: 1px solid rgba(255, 140, 66, 0.3);
}

.mode-title {
  font-family: 'Cinzel', serif;
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 2px;
  margin-bottom: 12px;
}

.mode-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 16px;
}

.mode-meta {
  display: flex;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .compass-page {
    padding: 0;
  }
  .page-header {
    padding: 24px 0 20px;
  }
  .page-badge {
    font-size: 10px;
    padding: 3px 14px;
    margin-bottom: 14px;
  }
  .page-title {
    font-size: 20px;
    letter-spacing: 2px;
    margin-bottom: 8px;
  }
  .page-desc {
    font-size: 12px;
    padding: 0 12px;
  }
  .mode-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-top: 16px;
  }
  .mode-card {
    padding: 24px 16px;
  }
  .mode-icon {
    width: 52px;
    height: 52px;
    font-size: 22px;
    margin-bottom: 14px;
  }
  .mode-title {
    font-size: 14px;
    letter-spacing: 1px;
    margin-bottom: 10px;
  }
  .mode-desc {
    font-size: 12px;
  }
}
</style>
