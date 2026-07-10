<template>
  <div class="free-page">
    <div class="page-back">
      <router-link to="/compass" class="back-link">← 返回罗盘</router-link>
    </div>

    <div class="page-header">
      <h1 class="page-title">自由评测</h1>
      <p class="page-desc">输入AI模型的回答文本，系统将从五个维度评估其伦理表现。</p>
    </div>

    <!-- API Key 配置 -->
    <div class="api-key-section card">
      <div class="api-key-header" @click="showApiKey = !showApiKey">
        <span class="api-key-title">⚙ API 配置</span>
        <span class="api-key-toggle">{{ showApiKey ? '收起 ▲' : '展开 ▼' }}</span>
      </div>
      <div v-if="showApiKey" class="api-key-body">
        <div class="api-key-row">
          <el-input
            v-model="apiKey"
            type="password"
            show-password
            placeholder="输入 DeepSeek API Key 以启用 AI 语义评分"
            class="styled-input"
            size="default"
          />
          <el-button class="btn-save-key" @click="saveApiKey" :disabled="!apiKey.trim()">
            保存
          </el-button>
          <el-button v-if="hasApiKey" class="btn-clear-key" @click="clearApiKey">
            清除
          </el-button>
        </div>
        <p class="api-key-hint">API Key 仅存储在浏览器本地，不会发送到第三方。未配置时自动使用本地评分。</p>
      </div>
    </div>

    <div class="input-section card">
      <div class="dimension-tags">
        <span class="dim-tag" v-for="d in dimensions" :key="d.name"
          :style="{ borderColor: d.color, color: d.color }">
          {{ d.label }}
        </span>
      </div>

      <el-input
        v-model="inputText"
        type="textarea"
        :rows="8"
        placeholder="粘贴AI模型的回答文本，或输入你想要评估的AI输出内容..."
        class="styled-textarea"
      />

      <div class="input-footer">
        <span class="char-count">{{ inputText.length }} / 5000</span>
        <button class="btn-compass" :disabled="!inputText.trim() || loading" @click="evaluate">
          <span v-if="loading" class="loading-spinner"></span>
          <span v-else>◈ 开始评估</span>
        </button>
      </div>
    </div>

    <!-- 空状态提示 -->
    <div v-if="!inputText.trim() && !result" class="empty-state">
      <div class="empty-icon">◈</div>
      <p class="empty-text">输入文本开始评测</p>
      <p class="empty-hint">粘贴AI模型的回答文本，系统将从五个伦理维度自动评估</p>
    </div>

    <!-- 结果区 -->
    <div v-if="result" class="result-section card">
      <h3 class="result-title">评估报告</h3>

      <div v-if="result.usedFallback" class="fallback-notice">
        ⚠ 此结果为本地关键词评分。建议配置 API Key 以获取更准确的 AI 语义评估。
      </div>

      <div class="score-summary">
        <div class="score-circle" :style="{ borderColor: overallColor }">
          <span class="score-num">{{ overallScore }}</span>
          <span class="score-label">综合评分</span>
        </div>
      </div>

      <div class="dimension-results">
        <div class="dim-result" v-for="d in result.dimensions" :key="d.name">
          <div class="dim-header">
            <span class="dim-name" :style="{ color: d.color }">{{ d.label }}</span>
            <span class="dim-score" :style="{ color: d.color }">{{ d.score }}/100</span>
          </div>
          <div class="dim-bar-bg">
            <div class="dim-bar-fill" :style="{ width: d.score + '%', background: `linear-gradient(90deg, ${d.color}44, ${d.color})` }"></div>
          </div>
          <p class="dim-comment">{{ d.comment }}</p>
        </div>
      </div>

      <div class="result-footer">
        <button class="btn-ark" @click="reset">重新评估</button>

        <!-- 分享按钮 — 蒸汽朋克下拉菜单 -->
        <div class="share-actions">
          <el-dropdown trigger="click" @command="handleShare">
            <button class="btn-compass share-btn">
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
    </div>

    <!-- 截图专用容器（隐藏，仅在调用截图时由 html2canvas 捕获） -->
    <div ref="captureRef" class="capture-container" v-if="result">
      <div class="capture-header">
        <span>⚖️ Ethos CI · 伦理评测报告</span>
      </div>
      <div class="score-summary">
        <div class="score-circle" :style="{ borderColor: overallColor }">
          <span class="score-num">{{ overallScore }}</span>
          <span class="score-label">综合评分</span>
        </div>
      </div>
      <div class="dimension-results">
        <div class="dim-result" v-for="d in result.dimensions" :key="d.name">
          <div class="dim-header">
            <span class="dim-name" :style="{ color: d.color }">{{ d.label }}</span>
            <span class="dim-score" :style="{ color: d.color }">{{ d.score }}/100</span>
          </div>
          <div class="dim-bar-bg">
            <div class="dim-bar-fill" :style="{ width: d.score + '%', background: `linear-gradient(90deg, ${d.color}44, ${d.color})` }"></div>
          </div>
          <p class="dim-comment">{{ d.comment }}</p>
        </div>
      </div>
      <div class="capture-footer">
        <span>方舟与罗盘 · 共生评估系统</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { analyzeEthos, getStoredApiKey, saveApiKey as storeApiKey, clearApiKey as removeApiKey } from '../services/ethosService.js'
import { createFreeEthosRecord } from '../utils/db.js'
import { copyShareText, downloadResultCard } from '../services/shareService.js'

const inputText = ref('')
const result = ref(null)
const loading = ref(false)
const captureRef = ref(null)
const apiKey = ref('')
const showApiKey = ref(false)
const hasApiKey = ref(false)

const dimensions = [
  { name: 'ethics', label: '伦理道德', color: '#7EC8E3' },
  { name: 'fairness', label: '公平公正', color: '#00B4D8' },
  { name: 'transparency', label: '透明度', color: '#0077B6' },
  { name: 'accountability', label: '责任意识', color: '#FFB347' },
  { name: 'inclusivity', label: '包容性', color: '#FF8C42' },
]

onMounted(() => {
  const saved = getStoredApiKey()
  if (saved) {
    apiKey.value = saved
    hasApiKey.value = true
  }
})

function saveApiKey() {
  if (!apiKey.value.trim()) return
  storeApiKey(apiKey.value.trim())
  hasApiKey.value = true
  ElMessage.success('API Key 已保存到本地存储')
}

function clearApiKey() {
  removeApiKey()
  apiKey.value = ''
  hasApiKey.value = false
  ElMessage.info('API Key 已清除')
}

async function evaluate() {
  if (!inputText.value.trim() || loading.value) return

  loading.value = true
  try {
    const evalResult = await analyzeEthos(inputText.value, apiKey.value)

    result.value = evalResult

    // 保存到 IndexedDB
    try {
      const scores = {}
      for (const d of evalResult.dimensions) {
        scores[d.name] = d.score
      }
      await createFreeEthosRecord({
        inputText: inputText.value,
        scores,
        overallScore: evalResult.overall,
        feedback: evalResult.overallComment,
      })
    } catch (dbErr) {
      console.warn('保存评测记录失败:', dbErr)
    }

    if (evalResult.usedFallback) {
      ElMessage.warning('使用本地评分（未配置 API Key 或 API 调用失败）')
    } else {
      ElMessage.success('AI 语义评估完成')
    }
  } catch (err) {
    ElMessage.error('评估过程中发生错误: ' + err.message)
    // 尝试降级为本地评分
    try {
      const { analyzeEthos: fallback } = await import('../services/ethosService.js')
      const fallbackResult = await fallback(inputText.value, '')
      result.value = fallbackResult
    } catch {
      // 完全失败
    }
  } finally {
    loading.value = false
  }
}

const overallScore = computed(() => {
  return result.value?.overall ?? 0
})

const overallColor = computed(() => {
  if (!result.value) return '#00B4D8'
  const s = result.value.overall
  if (s >= 70) return '#00B4D8'
  if (s >= 45) return '#FFB347'
  return '#E06A2A'
})

function reset() {
  inputText.value = ''
  result.value = null
}

/**
 * 处理分享命令
 * @param {'copy'|'screenshot'} cmd
 */
async function handleShare(cmd) {
  if (!result.value) return
  const data = {
    overall: result.value.overall,
    dimensions: result.value.dimensions,
  }

  if (cmd === 'copy') {
    await copyShareText('ethos', data)
  } else if (cmd === 'screenshot') {
    await downloadResultCard('ethos', data, captureRef)
  }
}
</script>

<style scoped>
.free-page {
  animation: fadeIn 0.6s ease;
}

.page-back {
  margin-bottom: 8px;
}

.back-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 13px;
  transition: color 0.3s;
}
.back-link:hover {
  color: var(--compass);
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-family: 'Cinzel', serif;
  font-weight: 700;
  font-size: 24px;
  letter-spacing: 3px;
  color: var(--compass);
  margin-bottom: 6px;
}

.page-desc {
  color: var(--text-secondary);
  font-size: 13px;
}

/* API Key 配置区 */
.api-key-section {
  padding: 12px 20px;
  margin-bottom: 16px;
}

.api-key-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.api-key-title {
  font-family: 'Cinzel', serif;
  font-size: 13px;
  letter-spacing: 1px;
  color: var(--text-secondary);
}

.api-key-toggle {
  font-size: 11px;
  color: var(--text-muted);
}

.api-key-body {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

.api-key-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.api-key-row .styled-input {
  flex: 1;
  --el-input-bg-color: rgba(255, 255, 255, 0.04);
  --el-input-border-color: var(--border-color);
  --el-input-hover-border-color: var(--compass);
  --el-input-focus-border-color: var(--compass);
  --el-input-text-color: var(--text-primary);
}

.btn-save-key {
  background: var(--compass);
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
}

.btn-clear-key {
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border-color);
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
}

.api-key-hint {
  margin-top: 8px;
  font-size: 11px;
  color: var(--text-muted);
  line-height: 1.4;
}

.input-section {
  padding: 28px;
  margin-bottom: 24px;
}

.dimension-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.dim-tag {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 10px;
  border: 1px solid;
  background: rgba(0, 0, 0, 0.2);
  font-family: 'Cinzel', serif;
  letter-spacing: 1px;
}

.styled-textarea {
  --el-input-bg-color: rgba(255, 255, 255, 0.04);
  --el-input-border-color: var(--border-color);
  --el-input-hover-border-color: var(--compass);
  --el-input-focus-border-color: var(--compass);
  --el-input-text-color: var(--text-primary);
  --el-input-placeholder-color: var(--text-muted);
}

.styled-textarea :deep(.el-textarea__inner) {
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  line-height: 1.7;
  resize: vertical;
  min-height: 120px;
}

.input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.char-count {
  font-size: 12px;
  color: var(--text-muted);
  font-family: 'Cinzel', serif;
}

.loading-spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  vertical-align: middle;
}

/* 结果区 */
.result-section {
  padding: 32px;
}

.result-title {
  font-family: 'Cinzel', serif;
  font-weight: 700;
  font-size: 18px;
  letter-spacing: 3px;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.fallback-notice {
  background: rgba(255, 179, 71, 0.1);
  border: 1px solid rgba(255, 179, 71, 0.3);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  font-size: 12px;
  color: var(--brass);
  margin-bottom: 20px;
}

.score-summary {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}

.score-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
}

.score-num {
  font-family: 'Cinzel', serif;
  font-weight: 700;
  font-size: 36px;
  color: var(--text-primary);
}

.score-label {
  font-size: 10px;
  color: var(--text-secondary);
  letter-spacing: 2px;
  margin-top: 2px;
}

.dimension-results {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dim-result {
}

.dim-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.dim-name {
  font-family: 'Cinzel', serif;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 1px;
}

.dim-score {
  font-family: 'Cinzel', serif;
  font-weight: 700;
  font-size: 14px;
}

.dim-bar-bg {
  height: 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 6px;
}

.dim-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.8s ease;
}

.dim-comment {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.5;
}

.result-footer {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 28px;
}

.share-actions {
  display: inline-block;
}

.share-btn {
  padding: 12px 28px;
  font-size: 13px;
}

/* 截图容器（隐藏，仅由 html2canvas 捕获） */
.empty-state {
  text-align: center;
  padding: 60px 24px;
  background: var(--bg-card);
  border: 1px dashed var(--border-color);
  border-radius: var(--radius);
  margin-bottom: 24px;
}

.empty-icon {
  font-size: 40px;
  color: var(--text-muted);
  opacity: 0.3;
  margin-bottom: 16px;
}

.empty-text {
  font-family: 'Cinzel', serif;
  font-size: 16px;
  color: var(--text-secondary);
  letter-spacing: 2px;
  margin-bottom: 8px;
}

.empty-hint {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.6;
  max-width: 300px;
  margin: 0 auto;
}

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
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(100, 95, 88, 0.2);
  font-family: 'Cinzel', serif;
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 2px;
  color: var(--text-primary);
}

.capture-footer {
  text-align: center;
  padding-top: 16px;
  margin-top: 20px;
  border-top: 1px solid rgba(100, 95, 88, 0.2);
  font-size: 11px;
  color: var(--text-muted);
  letter-spacing: 2px;
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
  background: rgba(0, 180, 216, 0.15);
  color: var(--compass-light);
}

.steampunk-dropdown :deep(.el-dropdown-menu__item:focus) {
  background: rgba(0, 180, 216, 0.15);
  color: var(--compass-light);
}

.dropdown-icon {
  margin-right: 6px;
  font-size: 14px;
}

@media (max-width: 768px) {
  .free-page {
    padding: 0;
  }
  .page-header {
    margin-bottom: 16px;
  }
  .page-title {
    font-size: 20px;
    letter-spacing: 2px;
  }
  .page-desc {
    font-size: 12px;
  }
  .api-key-section {
    padding: 10px 14px;
    margin-bottom: 12px;
  }
  .api-key-row {
    flex-wrap: wrap;
    gap: 6px;
  }
  .api-key-row .styled-input {
    flex: 1 1 100%;
    min-width: 0;
  }
  .btn-save-key,
  .btn-clear-key {
    flex: 1;
    text-align: center;
    padding: 10px 12px;
    font-size: 12px;
    min-height: 44px;
  }
  .input-section {
    padding: 16px;
    margin-bottom: 16px;
  }
  .styled-textarea :deep(.el-textarea__inner) {
    min-height: 100px;
    font-size: 13px;
  }
  .input-footer {
    flex-wrap: wrap;
    gap: 10px;
  }
  .input-footer .btn-compass {
    width: 100%;
    min-height: 44px;
    justify-content: center;
  }
  .result-section {
    padding: 20px 16px;
  }
  .result-title {
    font-size: 16px;
    letter-spacing: 2px;
    margin-bottom: 16px;
    padding-bottom: 8px;
  }
  .score-circle {
    width: 100px;
    height: 100px;
    border-width: 3px;
  }
  .score-num {
    font-size: 30px;
  }
  .score-label {
    font-size: 9px;
  }
  .score-summary {
    margin-bottom: 24px;
  }
  .dimension-results {
    gap: 16px;
  }
  .dim-name {
    font-size: 12px;
  }
  .dim-score {
    font-size: 13px;
  }
  .dim-bar-bg {
    height: 5px;
  }
  .dim-comment {
    font-size: 11px;
  }
  .result-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    margin-top: 20px;
  }
  .result-footer .btn-ark,
  .result-footer .btn-compass {
    width: 100%;
    min-height: 44px;
    justify-content: center;
  }
  .share-actions {
    display: block;
  }
  .share-actions .btn-compass {
    width: 100%;
  }
  .char-count {
    font-size: 11px;
  }
  .capture-container {
    width: 100%;
  }
}
</style>
