<template>
  <div class="dashboard-page">
    <!-- 顶部标题 -->
    <div class="page-header">
      <div class="header-decoration">
        <span class="decoration-gear">⚙</span>
        <span class="decoration-line"></span>
      </div>
      <h1 class="page-title">📊 数据看板</h1>
      <p class="page-subtitle">你的共生评估全记录</p>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-gear">⚙</div>
      <span>加载中...</span>
    </div>

    <template v-else>
      <!-- 统计概览 -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🔄</div>
          <div class="stat-value">{{ stats.totalAssessments }}</div>
          <div class="stat-label">总评测次数</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🧭</div>
          <div class="stat-value">{{ stats.totalSQ }}</div>
          <div class="stat-label">SQ 测评完成</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⚖️</div>
          <div class="stat-value">{{ stats.avgEthos }}</div>
          <div class="stat-label">平均 Ethos 评分</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🏆</div>
          <div class="stat-value">{{ stats.highestSQ }}</div>
          <div class="stat-label">最高共生指数</div>
        </div>
      </div>

      <!-- 最近记录区域 -->
      <div class="section">
        <h2 class="section-title">📋 最近评测记录</h2>

        <div class="records-grid">
          <!-- 自由评测 -->
          <div class="record-card">
            <div class="record-card-header">
              <span class="record-icon">⚖️</span>
              <span>Ethos 自由评测</span>
            </div>
            <div v-if="freeRecords.length === 0" class="empty-tip">暂无记录</div>
            <div v-for="r in freeRecords.slice(0, 10)" :key="r.id" class="record-item" @click="viewFreeDetail(r)">
              <div class="record-date">{{ formatDate(r.timestamp) }}</div>
              <div class="record-score" :class="scoreClass(r.overallScore)">{{ r.overallScore }}</div>
            </div>
          </div>

          <!-- 基准测试 -->
          <div class="record-card">
            <div class="record-card-header">
              <span class="record-icon">🔬</span>
              <span>BBQ 基准测试</span>
            </div>
            <div v-if="benchmarkRecords.length === 0" class="empty-tip">暂无记录</div>
            <div v-for="r in benchmarkRecords.slice(0, 5)" :key="r.id" class="record-item" @click="viewBenchmarkDetail(r)">
              <div class="record-date">{{ formatDate(r.timestamp) }}</div>
              <div class="record-score" :class="scoreClass(r.overallScore)">{{ r.overallScore }}</div>
            </div>
          </div>

          <!-- SQ 测评 -->
          <div class="record-card">
            <div class="record-card-header">
              <span class="record-icon">🧭</span>
              <span>方舟 SQ</span>
            </div>
            <div v-if="sqRecords.length === 0" class="empty-tip">暂无记录</div>
            <div v-for="r in sqRecords.slice(0, 5)" :key="r.id" class="record-item" @click="viewSQDetail(r)">
              <div class="record-date">{{ formatDate(r.timestamp) }}</div>
              <div class="record-score" :class="scoreClass(r.totalScore)">{{ r.totalScore }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 趋势图表 -->
      <div class="section">
        <h2 class="section-title">📈 Ethos 评分趋势</h2>
        <div v-if="trendData.length < 2" class="empty-tip">数据不足，继续评测即可生成趋势</div>
        <div v-else class="trend-chart">
          <svg :viewBox="`0 0 ${chartWidth} ${chartHeight}`" class="trend-svg">
            <!-- 网格线 -->
            <line v-for="i in 4" :key="'g'+i" :x1="40" :y1="20 + (i-1)*40" :x2="chartWidth-20" :y2="20 + (i-1)*40" stroke="#3A3D42" stroke-width="1" />
            <!-- Y轴标签 -->
            <text v-for="i in 5" :key="'y'+i" x="35" :y="25 + (i-1)*40" text-anchor="end" fill="#888" font-size="10">{{ 100 - (i-1)*25 }}</text>
            <!-- X轴标签 -->
            <text v-for="(d, i) in trendData" :key="'x'+i" :x="50 + i * barWidth" :y="chartHeight - 5" text-anchor="middle" fill="#888" font-size="8">{{ formatShortDate(d.timestamp) }}</text>
            <!-- 柱状图 -->
            <rect
              v-for="(d, i) in trendData"
              :key="'b'+i"
              :x="50 + i * barWidth - barWidth/3"
              :y="chartHeight - 20 - (d.overallScore/100) * 160"
              :width="barWidth * 0.5"
              :height="(d.overallScore/100) * 160"
              :fill="scoreColor(d.overallScore)"
              rx="3"
            />
            <!-- 折线 -->
            <polyline
              :points="trendData.map((d, i) => `${50 + i * barWidth},${chartHeight - 20 - (d.overallScore/100) * 160}`).join(' ')"
              fill="none"
              stroke="#D4A853"
              stroke-width="2"
            />
            <!-- 数据点 -->
            <circle
              v-for="(d, i) in trendData"
              :key="'c'+i"
              :cx="50 + i * barWidth"
              :cy="chartHeight - 20 - (d.overallScore/100) * 160"
              r="4"
              :fill="scoreColor(d.overallScore)"
              stroke="#D4A853"
              stroke-width="1.5"
            />
          </svg>
        </div>
      </div>

      <!-- SQ 各维度对比 -->
      <div class="section">
        <h2 class="section-title">🎯 SQ 各维度平均分</h2>
        <div v-if="sqRecords.length === 0" class="empty-tip">暂无 SQ 测评记录</div>
        <div v-else class="dimension-chart">
          <div v-for="(score, dim) in avgDimScores" :key="dim" class="dim-bar-row">
            <span class="dim-label">{{ dimLabels[dim] || dim }}</span>
            <div class="dim-bar-track">
              <div class="dim-bar-fill" :style="{ width: score + '%', background: dimColors[dim] || '#D4A853' }"></div>
            </div>
            <span class="dim-value">{{ Math.round(score) }}</span>
          </div>
        </div>
      </div>

      <!-- 数据管理 -->
      <div class="section">
        <h2 class="section-title">⚙️ 数据管理</h2>
        <div class="data-actions">
          <el-button type="warning" plain @click="exportData">📦 导出数据（JSON）</el-button>
          <el-button type="danger" plain @click="confirmClear">🗑️ 清除所有数据</el-button>
        </div>
      </div>
    </template>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="评测详情" width="90%" class="detail-dialog">
      <pre class="detail-json">{{ JSON.stringify(selectedDetail, null, 2) }}</pre>
    </el-dialog>

    <!-- 清除确认弹窗 -->
    <el-dialog v-model="clearVisible" title="确认清除" width="80%" class="clear-dialog">
      <p>⚠️ 此操作将删除所有本地评测数据，且不可恢复。</p>
      <p>确定要继续吗？</p>
      <template #footer>
        <el-button @click="clearVisible = false">取消</el-button>
        <el-button type="danger" @click="doClear">确认清除</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAllFreeEthosRecords, getAllBenchmarkRecords, getAllSQAssessments, clearAllData } from '../utils/db.js'

const loading = ref(true)
const freeRecords = ref([])
const benchmarkRecords = ref([])
const sqRecords = ref([])
const detailVisible = ref(false)
const clearVisible = ref(false)
const selectedDetail = ref(null)

const dimLabels = {
  empathy: '同理心',
  boundary: '边界感',
  reflection: '自省力',
  responsibility: '责任感',
  openness: '开放性'
}

const dimColors = {
  empathy: '#E06A2A',
  boundary: '#7EC8E3',
  reflection: '#00B4D8',
  responsibility: '#D4A853',
  openness: '#9B59B6'
}

const chartWidth = 420
const chartHeight = 200

const stats = computed(() => {
  const ethosCount = freeRecords.value.length + benchmarkRecords.value.length
  const avgEthos = (() => {
    const all = [...freeRecords.value, ...benchmarkRecords.value]
    if (all.length === 0) return '--'
    return Math.round(all.reduce((s, r) => s + (r.overallScore || 0), 0) / all.length)
  })()
  const highestSQ = (() => {
    if (sqRecords.value.length === 0) return '--'
    return Math.max(...sqRecords.value.map(r => r.totalScore || 0))
  })()
  return {
    totalAssessments: ethosCount + sqRecords.value.length,
    totalSQ: sqRecords.value.length,
    avgEthos,
    highestSQ
  }
})

const trendData = computed(() => {
  return [...freeRecords.value, ...benchmarkRecords.value]
    .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
    .slice(-10)
})

const barWidth = computed(() => {
  if (trendData.value.length <= 1) return 60
  return Math.min(60, (chartWidth - 60) / (trendData.value.length - 1))
})

const avgDimScores = computed(() => {
  if (sqRecords.value.length === 0) return {}
  const sums = {}
  const counts = {}
  sqRecords.value.forEach(r => {
    if (r.dimScores) {
      Object.entries(r.dimScores).forEach(([dim, score]) => {
        sums[dim] = (sums[dim] || 0) + score
        counts[dim] = (counts[dim] || 0) + 1
      })
    }
  })
  const result = {}
  Object.keys(sums).forEach(dim => {
    result[dim] = sums[dim] / counts[dim]
  })
  return result
})

function formatDate(ts) {
  if (!ts) return '--'
  const d = new Date(ts)
  return `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

function formatShortDate(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return `${d.getMonth()+1}/${d.getDate()}`
}

function scoreClass(score) {
  if (!score && score !== 0) return ''
  if (score >= 80) return 'score-high'
  if (score >= 60) return 'score-mid'
  return 'score-low'
}

function scoreColor(score) {
  if (score >= 80) return '#4CAF50'
  if (score >= 60) return '#D4A853'
  return '#E06A2A'
}

function viewFreeDetail(r) {
  selectedDetail.value = r
  detailVisible.value = true
}

function viewBenchmarkDetail(r) {
  selectedDetail.value = r
  detailVisible.value = true
}

function viewSQDetail(r) {
  selectedDetail.value = r
  detailVisible.value = true
}

async function exportData() {
  const data = {
    exportedAt: new Date().toISOString(),
    version: '0.1.0',
    freeEthosRecords: freeRecords.value,
    benchmarkRecords: benchmarkRecords.value,
    sqAssessments: sqRecords.value
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ark-compass-data-${new Date().toISOString().slice(0,10)}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  ElMessage.success('数据已导出')
}

function confirmClear() {
  clearVisible.value = true
}

async function doClear() {
  try {
    await clearAllData()
    freeRecords.value = []
    benchmarkRecords.value = []
    sqRecords.value = []
    clearVisible.value = false
    ElMessage.success('所有数据已清除')
  } catch (err) {
    ElMessage.error('清除失败: ' + err.message)
  }
}

onMounted(async () => {
  try {
    const [free, bench, sq] = await Promise.all([
      getAllFreeEthosRecords(),
      getAllBenchmarkRecords(),
      getAllSQAssessments()
    ])
    freeRecords.value = (free || []).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    benchmarkRecords.value = (bench || []).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    sqRecords.value = (sq || []).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
  } catch (err) {
    console.error('加载数据失败:', err)
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.dashboard-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px 0;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.header-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 8px;
}

.decoration-gear {
  font-size: 24px;
  animation: spin 4s linear infinite;
}

.decoration-line {
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #D4A853, transparent);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.page-title {
  font-size: 24px;
  color: #E8E0D0;
  letter-spacing: 3px;
  margin: 0;
}

.page-subtitle {
  font-size: 13px;
  color: #888;
  margin: 6px 0 0;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 80px 0;
  color: #888;
}

.loading-gear {
  font-size: 36px;
  animation: spin 1s linear infinite;
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.stat-card {
  background: #2A2D30;
  border: 1px solid #3A3D42;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  transition: transform 0.2s, border-color 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  border-color: #D4A853;
}

.stat-icon {
  font-size: 24px;
  margin-bottom: 6px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #D4A853;
  font-family: 'Courier New', monospace;
}

.stat-label {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}

/* 区块标题 */
.section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  color: #E8E0D0;
  letter-spacing: 2px;
  margin: 0 0 12px;
  padding-bottom: 6px;
  border-bottom: 1px solid #3A3D42;
}

/* 记录卡片 */
.records-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.record-card {
  background: #2A2D30;
  border: 1px solid #3A3D42;
  border-radius: 8px;
  padding: 12px;
}

.record-card-header {
  font-size: 13px;
  color: #E8E0D0;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.record-icon {
  font-size: 16px;
}

.empty-tip {
  color: #666;
  font-size: 12px;
  padding: 12px 0;
  text-align: center;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 4px;
  border-bottom: 1px solid #333;
  cursor: pointer;
  transition: background 0.15s;
}

.record-item:last-child {
  border-bottom: none;
}

.record-item:hover {
  background: #333;
}

.record-date {
  font-size: 11px;
  color: #888;
  font-family: monospace;
}

.record-score {
  font-size: 14px;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  padding: 2px 8px;
  border-radius: 4px;
}

.score-high { color: #4CAF50; background: rgba(76,175,80,0.1); }
.score-mid { color: #D4A853; background: rgba(212,168,83,0.1); }
.score-low { color: #E06A2A; background: rgba(224,106,42,0.1); }

/* 趋势图表 */
.trend-chart {
  background: #2A2D30;
  border: 1px solid #3A3D42;
  border-radius: 8px;
  padding: 16px;
}

.trend-svg {
  width: 100%;
  height: auto;
}

/* 维度对比 */
.dimension-chart {
  background: #2A2D30;
  border: 1px solid #3A3D42;
  border-radius: 8px;
  padding: 16px;
}

.dim-bar-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.dim-bar-row:last-child {
  margin-bottom: 0;
}

.dim-label {
  width: 60px;
  font-size: 12px;
  color: #B8B0A0;
  flex-shrink: 0;
}

.dim-bar-track {
  flex: 1;
  height: 18px;
  background: #333;
  border-radius: 9px;
  overflow: hidden;
}

.dim-bar-fill {
  height: 100%;
  border-radius: 9px;
  transition: width 0.5s ease;
  min-width: 4px;
}

.dim-value {
  width: 30px;
  font-size: 12px;
  color: #D4A853;
  font-family: monospace;
  text-align: right;
}

/* 数据管理 */
.data-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.detail-dialog :deep(.el-dialog__body) {
  padding: 16px;
}

.detail-json {
  background: #1A1D20;
  color: #B8B0A0;
  padding: 12px;
  border-radius: 6px;
  font-size: 11px;
  max-height: 400px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

.clear-dialog :deep(.el-dialog__body) {
  color: #B8B0A0;
  font-size: 14px;
  text-align: center;
}

/* 响应式 */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .records-grid {
    grid-template-columns: 1fr;
  }
  .page-title {
    font-size: 20px;
  }
  .stat-value {
    font-size: 22px;
  }
}
</style>
