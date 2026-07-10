<template>
  <div class="benchmark-page">
    <div class="page-back">
      <router-link to="/compass" class="back-link">← 返回罗盘</router-link>
    </div>

    <div class="page-header">
      <h1 class="page-title">基准测试</h1>
      <p class="page-desc">使用预设题库对AI模型进行全面伦理评估，生成批量测试报告。</p>
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
            placeholder="输入 DeepSeek API Key 以启用 AI 基准测试"
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
        <p class="api-key-hint">API Key 仅存储在浏览器本地。未配置时使用本地模拟回答进行测试。</p>
      </div>
    </div>

    <div class="config-section card" v-if="!running && !done">
      <h3 class="section-subtitle">测试配置</h3>

      <div class="form-group">
        <label class="form-label">AI模型名称</label>
        <el-input v-model="modelName" placeholder="例如：豆包、ChatGPT、DeepSeek..." class="styled-input" />
      </div>

      <div class="form-group">
        <label class="form-label">题库规模</label>
        <div class="radio-group">
          <label class="radio-item" v-for="opt in sizeOptions" :key="opt.value"
            :class="{ active: testSize === opt.value }" @click="testSize = opt.value">
            <span class="radio-dot"></span>
            <span>{{ opt.label }}</span>
          </label>
        </div>
      </div>

      <div class="config-actions">
        <button class="btn-compass" :disabled="!modelName.trim()" @click="startBenchmark">⇶ 开始基准测试</button>
      </div>
    </div>

    <!-- 运行中动画 -->
    <div v-if="running" class="running-section card">
      <div class="gear-large"></div>
      <p class="running-text">正在运行基准测试...</p>
      <p class="running-sub">已评测 {{ completed }} / {{ total }} 题</p>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: (completed/total*100) + '%' }"></div>
      </div>
    </div>

    <!-- 空状态提示 -->
    <div v-if="!running && !done && !modelName.trim()" class="empty-state">
      <div class="empty-icon">⇶</div>
      <p class="empty-text">选择模型并设置参数开始测试</p>
      <p class="empty-hint">填写AI模型名称并选择题库规模，系统将自动运行批量伦理基准测试</p>
    </div>

    <!-- 结果报告 -->
    <div v-if="done" class="report-section">
      <div class="report-header card">
        <div class="report-model">
          <span class="report-label">模型</span>
          <span class="report-value">{{ modelName }}</span>
        </div>
        <div class="report-model">
          <span class="report-label">题库</span>
          <span class="report-value">{{ testSize === 'small' ? '精简 (10题)' : '标准 (20题)' }}</span>
        </div>
        <div v-if="usedFallback" class="report-fallback">
          ⚠ 本地模拟模式
        </div>
        <div class="report-overall">
          <span class="overall-num">{{ overallScore }}</span>
          <span class="overall-label">综合伦理评分</span>
        </div>
      </div>

      <div class="report-dims card">
        <h3 class="section-subtitle">五维度评分</h3>
        <div class="dim-result" v-for="d in report" :key="d.name">
          <div class="dim-header">
            <span class="dim-name" :style="{ color: d.color }">{{ d.label }}</span>
            <span class="dim-score" :style="{ color: d.color }">{{ d.score }}/100</span>
          </div>
          <div class="dim-bar-bg">
            <div class="dim-bar-fill" :style="{ width: d.score + '%', background: `linear-gradient(90deg, ${d.color}44, ${d.color})` }"></div>
          </div>
          <p class="dim-detail">{{ d.detail }}</p>
        </div>
      </div>

      <!-- 详细题表 -->
      <div class="report-details card" v-if="detailedResults.length > 0">
        <h3 class="section-subtitle">逐题评测明细</h3>
        <div class="detail-item" v-for="r in detailedResults" :key="r.id">
          <div class="detail-header">
            <span class="detail-id">#{{ r.id }}</span>
            <span class="detail-dim" :style="{ color: getDimensionColor(r.dimension) }">{{ r.dimensionLabel }}</span>
            <span class="detail-score" :class="{ 'score-warn': r.hasBias, 'score-good': !r.hasBias }">
              {{ r.score }}/100
            </span>
          </div>
          <p class="detail-question">{{ r.question }}</p>
          <p class="detail-answer">{{ r.answer }}</p>
          <p v-if="r.hasBias" class="detail-bias">⚠ 偏差检测: {{ r.biasReason }}</p>
        </div>
      </div>

      <div class="report-actions">
        <button class="btn-ark" @click="reset">重新测试</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { runBenchmark, getStoredApiKey, saveApiKey as storeApiKey, clearApiKey as removeApiKey } from '../services/ethosService.js'
import { EVAL_DIMENSIONS } from '../services/ethosService.js'
import { createBenchmarkRecord } from '../utils/db.js'

const modelName = ref('')
const testSize = ref('small')
const running = ref(false)
const done = ref(false)
const completed = ref(0)
const total = ref(10)
const report = ref([])
const overallScore = ref(0)
const detailedResults = ref([])
const usedFallback = ref(false)

const apiKey = ref('')
const showApiKey = ref(false)
const hasApiKey = ref(false)

const sizeOptions = [
  { label: '精简 (10题)', value: 'small' },
  { label: '标准 (20题)', value: 'standard' }
]

const dimensions = EVAL_DIMENSIONS || [
  { name: 'ethics', label: '伦理道德', color: '#7EC8E3' },
  { name: 'fairness', label: '公平公正', color: '#00B4D8' },
  { name: 'transparency', label: '透明度', color: '#0077B6' },
  { name: 'accountability', label: '责任意识', color: '#FFB347' },
  { name: 'inclusivity', label: '包容性', color: '#FF8C42' },
]

// 维度颜色查找映射
const dimColorMap = {}
for (const d of dimensions) {
  dimColorMap[d.name] = d.color
}

// BBQ 维度到颜色的映射
const bbqColorMap = {
  gender: '#7EC8E3',
  race: '#00B4D8',
  age: '#0077B6',
  religion: '#FFB347',
  nationality: '#FF8C42',
  socioeconomic: '#90BE6D',
  sexual_orientation: '#F9844A',
}

function getDimensionColor(dim) {
  return dimColorMap[dim] || bbqColorMap[dim] || '#00B4D8'
}

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

async function startBenchmark() {
  if (!modelName.value.trim()) return

  running.value = true
  done.value = false
  completed.value = 0
  total.value = testSize.value === 'small' ? 10 : 20
  usedFallback.value = false

  try {
    const benchmarkResult = await runBenchmark(
      modelName.value.trim(),
      testSize.value,
      apiKey.value,
      (c, t) => {
        completed.value = c
        total.value = t
      }
    )

    report.value = benchmarkResult.dimensionDetails
    overallScore.value = benchmarkResult.overallScore
    detailedResults.value = benchmarkResult.results
    usedFallback.value = benchmarkResult.results.some(r => r.usedFallback)

    // 保存到 IndexedDB
    try {
      await createBenchmarkRecord({
        modelName: benchmarkResult.modelName,
        testSize: benchmarkResult.testSize,
        results: benchmarkResult.results,
        overallScore: benchmarkResult.overallScore,
      })
    } catch (dbErr) {
      console.warn('保存基准测试记录失败:', dbErr)
    }

    if (usedFallback.value) {
      ElMessage.warning('部分题目使用了本地模拟回答（API 不可用）')
    } else {
      ElMessage.success('基准测试完成！')
    }
  } catch (err) {
    ElMessage.error('基准测试失败: ' + err.message)
  } finally {
    running.value = false
    done.value = true
  }
}

function reset() {
  modelName.value = ''
  testSize.value = 'small'
  running.value = false
  done.value = false
  completed.value = 0
  report.value = []
  detailedResults.value = []
}
</script>

<style scoped>
.benchmark-page {
  animation: fadeIn 0.6s ease;
}

.page-back { margin-bottom: 8px; }
.back-link { color: var(--text-secondary); text-decoration: none; font-size: 13px; }
.back-link:hover { color: var(--compass); }

.page-header { margin-bottom: 24px; }
.page-title {
  font-family: 'Cinzel', serif;
  font-weight: 700;
  font-size: 24px;
  letter-spacing: 3px;
  color: var(--compass);
  margin-bottom: 6px;
}
.page-desc { color: var(--text-secondary); font-size: 13px; }

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

.config-section { padding: 28px; margin-bottom: 24px; }
.section-subtitle {
  font-family: 'Cinzel', serif;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 2px;
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
}

.form-group {
  margin-bottom: 20px;
}
.form-label {
  display: block;
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 8px;
  font-family: 'Cinzel', serif;
  letter-spacing: 1px;
}

.styled-input {
  --el-input-bg-color: rgba(255, 255, 255, 0.04);
  --el-input-border-color: var(--border-color);
  --el-input-hover-border-color: var(--compass);
  --el-input-focus-border-color: var(--compass);
  --el-input-text-color: var(--text-primary);
}

.radio-group {
  display: flex;
  gap: 12px;
}
.radio-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 13px;
  color: var(--text-secondary);
  transition: all 0.3s;
}
.radio-item.active {
  border-color: var(--compass);
  color: var(--compass);
  background: rgba(0, 180, 216, 0.08);
}
.radio-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 2px solid var(--text-muted);
  transition: all 0.3s;
}
.radio-item.active .radio-dot {
  border-color: var(--compass);
  background: var(--compass);
}

.config-actions { text-align: center; margin-top: 24px; }

/* 运行中 */
.running-section { padding: 48px; text-align: center; }

.gear-large {
  width: 64px;
  height: 64px;
  border: 4px solid var(--brass);
  border-radius: 50%;
  margin: 0 auto 24px;
  position: relative;
  animation: spin 3s linear infinite;
}
.gear-large::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 26px;
  width: 4px;
  height: 72px;
  background: var(--brass);
  border-radius: 2px;
}
.gear-large::after {
  content: '';
  position: absolute;
  top: 26px;
  left: -8px;
  width: 72px;
  height: 4px;
  background: var(--brass);
  border-radius: 2px;
}

.running-text {
  font-family: 'Cinzel', serif;
  font-size: 16px;
  letter-spacing: 2px;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.running-sub {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 20px;
}

.progress-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 3px;
  overflow: hidden;
  max-width: 400px;
  margin: 0 auto;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--compass), var(--compass-light));
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* 报告 */
.report-header {
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.report-label {
  display: block;
  font-size: 11px;
  color: var(--text-muted);
  letter-spacing: 1px;
  margin-bottom: 4px;
}
.report-value {
  font-family: 'Cinzel', serif;
  font-size: 14px;
  color: var(--text-primary);
  letter-spacing: 1px;
}

.report-fallback {
  font-size: 11px;
  color: var(--brass);
  background: rgba(255, 179, 71, 0.1);
  padding: 4px 10px;
  border-radius: 10px;
  border: 1px solid rgba(255, 179, 71, 0.3);
}

.overall-num {
  font-family: 'Cinzel', serif;
  font-weight: 700;
  font-size: 32px;
  color: var(--compass);
  display: block;
  text-align: center;
}
.overall-label {
  font-size: 10px;
  color: var(--text-muted);
  letter-spacing: 1px;
  display: block;
  text-align: center;
}

.report-dims { padding: 28px; margin-bottom: 20px; }
.dim-result { margin-bottom: 20px; }
.dim-header { display: flex; justify-content: space-between; margin-bottom: 6px; }
.dim-name { font-family: 'Cinzel', serif; font-weight: 600; font-size: 13px; letter-spacing: 1px; }
.dim-score { font-weight: 700; font-size: 14px; }
.dim-bar-bg { height: 6px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden; margin-bottom: 6px; }
.dim-bar-fill { height: 100%; border-radius: 3px; transition: width 0.8s ease; }
.dim-detail { font-size: 12px; color: var(--text-muted); line-height: 1.5; }

/* 逐题明细 */
.report-details { padding: 28px; margin-bottom: 20px; }
.detail-item {
  padding: 14px 0;
  border-bottom: 1px solid var(--border-color);
}
.detail-item:last-child { border-bottom: none; }

.detail-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.detail-id {
  font-family: 'Cinzel', serif;
  font-size: 11px;
  color: var(--text-muted);
  background: rgba(255,255,255,0.05);
  padding: 2px 8px;
  border-radius: 4px;
}

.detail-dim {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
}

.detail-score {
  margin-left: auto;
  font-family: 'Cinzel', serif;
  font-size: 12px;
  font-weight: 700;
}
.score-good { color: var(--compass); }
.score-warn { color: var(--brass); }

.detail-question {
  font-size: 13px;
  color: var(--text-primary);
  margin-bottom: 4px;
  line-height: 1.5;
}

.detail-answer {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
  font-style: italic;
}

.detail-bias {
  margin-top: 4px;
  font-size: 11px;
  color: var(--brass);
  background: rgba(255, 179, 71, 0.08);
  padding: 4px 8px;
  border-radius: 4px;
}

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

.report-actions { text-align: center; }

@media (max-width: 768px) {
  .benchmark-page {
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
  .config-section {
    padding: 16px;
    margin-bottom: 16px;
  }
  .section-subtitle {
    font-size: 13px;
    letter-spacing: 1px;
    margin-bottom: 14px;
  }
  .form-group {
    margin-bottom: 14px;
  }
  .form-label {
    font-size: 12px;
  }
  .radio-group {
    flex-direction: column;
    gap: 8px;
  }
  .radio-item {
    padding: 12px 16px;
    width: 100%;
    min-height: 44px;
  }
  .config-actions .btn-compass {
    width: 100%;
    min-height: 44px;
    justify-content: center;
  }
  .running-section {
    padding: 32px 16px;
  }
  .gear-large {
    width: 48px;
    height: 48px;
  }
  .gear-large::before {
    height: 56px;
    top: -6px;
    left: 20px;
  }
  .gear-large::after {
    width: 56px;
    top: 20px;
    left: -6px;
  }
  .running-text {
    font-size: 14px;
  }
  .progress-bar {
    max-width: 100%;
  }
  .report-header {
    padding: 16px;
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
  .report-overall .overall-num {
    font-size: 28px;
  }
  .report-dims {
    padding: 16px;
    margin-bottom: 16px;
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
  .dim-detail {
    font-size: 11px;
  }
  .report-details {
    padding: 16px;
    margin-bottom: 16px;
    overflow-x: auto;
  }
  .detail-item {
    padding: 10px 0;
  }
  .detail-id {
    font-size: 10px;
  }
  .detail-question {
    font-size: 12px;
  }
  .detail-answer {
    font-size: 11px;
  }
  .report-actions .btn-ark {
    width: 100%;
    min-height: 44px;
    justify-content: center;
  }
}
</style>
