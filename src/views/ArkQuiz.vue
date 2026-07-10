<template>
  <div class="quiz-page">
    <div class="page-back">
      <router-link to="/ark" class="back-link">← 返回方舟</router-link>
    </div>

    <!-- 进度 -->
    <div class="progress-section">
      <div class="progress-text">
        <span class="progress-step">{{ currentIndex + 1 }} / {{ questions.length }}</span>
        <span class="progress-dims" v-if="currentQuestion">
          {{ getDimensionLabel(currentQuestion.dimension) }}
        </span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: ((currentIndex + 1) / questions.length * 100) + '%' }"></div>
      </div>
    </div>

    <!-- 题目卡片 -->
    <div class="question-card card" v-if="currentQuestion">
      <div class="question-number">
        <span class="q-num">Q{{ currentIndex + 1 }}</span>
        <span class="q-dimension" :style="{ color: getDimensionColor(currentQuestion.dimension) }">
          {{ getDimensionLabel(currentQuestion.dimension) }}
        </span>
      </div>

      <h2 class="question-text">{{ currentQuestion.text }}</h2>

      <div class="options">
        <div
          v-for="(opt, oi) in currentQuestion.options"
          :key="oi"
          class="option-item"
          :class="{ selected: answers[currentIndex] === oi }"
          @click="selectOption(oi)"
        >
          <span class="option-marker">{{ optionLabels[oi] }}</span>
          <span class="option-text">{{ opt }}</span>
        </div>
      </div>

      <div class="question-nav">
        <button class="btn-nav" @click="prevQuestion" v-if="currentIndex > 0">
          ← 上一题
        </button>
        <div class="nav-spacer"></div>
        <button
          v-if="currentIndex < questions.length - 1"
          class="btn-compass"
          :disabled="answers[currentIndex] === null"
          @click="nextQuestion"
        >
          下一题 →
        </button>
        <button
          v-else
          class="btn-ark"
          :disabled="answers[currentIndex] === null"
          @click="submitQuiz"
        >
          ◆ 查看结果
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const optionLabels = ['A', 'B', 'C', 'D', 'E']

const dimensionConfig = {
  openness: { label: '人机协作开放性', color: '#7EC8E3' },
  critical: { label: '批判性思维', color: '#00B4D8' },
  meaning: { label: '数字意义感', color: '#FFB347' },
  resilience: { label: '情绪韧性', color: '#FF8C42' },
  empathy: { label: '社会共情力', color: '#E06A2A' }
}

const questions = [
  // 维度一：人机协作开放性
  {
    dimension: 'openness',
    text: '工作中遇到复杂问题时，我愿意让AI提供分析建议，即使我不完全理解它的推理过程。',
    options: ['完全不同意', '不同意', '中立', '同意', '完全同意']
  },
  {
    dimension: 'openness',
    text: '我认为AI可以成为创意工作中的合作伙伴，而不仅仅是工具。',
    options: ['完全不同意', '不同意', '中立', '同意', '完全同意']
  },
  // 维度二：批判性思维
  {
    dimension: 'critical',
    text: '使用AI生成的内容前，我会主动验证关键信息的准确性。',
    options: ['从不', '很少', '偶尔', '经常', '总是']
  },
  {
    dimension: 'critical',
    text: '我能分辨AI回答中的事实与推测之间的区别。',
    options: ['完全不能', '较难分辨', '有时可以', '基本可以', '完全可以']
  },
  // 维度三：数字意义感
  {
    dimension: 'meaning',
    text: 'AI帮我完成工作后，我仍然能从中获得成就感和价值感。',
    options: ['完全不同意', '不同意', '中立', '同意', '完全同意']
  },
  {
    dimension: 'meaning',
    text: '在数字世界建立的关系和连接，对我而言同样真实且有价值。',
    options: ['完全不同意', '不同意', '中立', '同意', '完全同意']
  },
  // 维度四：情绪韧性
  {
    dimension: 'resilience',
    text: '面对AI技术的快速发展，我感到的是期待多于焦虑。',
    options: ['非常焦虑', '有些焦虑', '中立', '有些期待', '非常期待']
  },
  {
    dimension: 'resilience',
    text: '即使有些工作被AI替代，我仍然相信能找到自己独特的价值定位。',
    options: ['完全不同意', '不同意', '中立', '同意', '完全同意']
  },
  // 维度五：社会共情力
  {
    dimension: 'empathy',
    text: '我认为AI的发展应该优先考虑那些最容易被技术边缘化的群体。',
    options: ['完全不同意', '不同意', '中立', '同意', '完全同意']
  },
  {
    dimension: 'empathy',
    text: '在选择使用AI产品时，我会考虑它的伦理影响和社会责任。',
    options: ['从不考虑', '很少考虑', '偶尔考虑', '经常考虑', '总是考虑']
  }
]

const currentIndex = ref(0)
const answers = ref(Array(10).fill(null))

const currentQuestion = computed(() => questions[currentIndex.value])

function getDimensionLabel(dim) {
  return dimensionConfig[dim]?.label || dim
}
function getDimensionColor(dim) {
  return dimensionConfig[dim]?.color || '#FF8C42'
}

function selectOption(oi) {
  answers.value[currentIndex.value] = oi
}

function nextQuestion() {
  if (currentIndex.value < questions.length - 1) {
    currentIndex.value++
  }
}

function prevQuestion() {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

function submitQuiz() {
  // 计算分数
  const dimScores = {}
  const dimQuestions = {}

  questions.forEach((q, i) => {
    if (!dimScores[q.dimension]) {
      dimScores[q.dimension] = 0
      dimQuestions[q.dimension] = 0
    }
    // 选项索引0=1分, 4=5分
    dimScores[q.dimension] += (answers.value[i] ?? 2) + 1
    dimQuestions[q.dimension]++
  })

  const rawScores = {}
  for (const [dim, total] of Object.entries(dimScores)) {
    rawScores[dim] = Math.round((total / (dimQuestions[dim] * 5)) * 100)
  }

  // 不完美守护者加成
  let bonus = 0
  if (answers.value[6] !== null && answers.value[6] <= 1) bonus += 3  // Q7选焦虑
  if (answers.value[9] !== null && answers.value[9] <= 1) bonus += 3  // Q10选不考虑

  // 总分和称号
  const rawTotal = Math.round(Object.values(rawScores).reduce((a, b) => a + b, 0) / 5)
  const totalScore = Math.min(100, rawTotal + bonus * 2)

  let title, subtitle, description
  if (totalScore >= 80) {
    title = '共生领航员'
    subtitle = '先行者 · 架桥人'
    description = '你对人机共生有着深刻的理解和开放的态度。你是连接两个世界的桥梁，既拥抱技术的进步，又坚守人的温度。在这个变革的时代，你不仅是参与者，更是引领者。继续保持你的敏锐与共情，前方的路需要你这样清醒而温暖的领航者。'
  } else if (totalScore >= 60) {
    title = '共生先锋'
    subtitle = '探索者 · 践行者'
    description = '你已经具备了良好的共生意识，在多个维度上展现出对AI时代的前瞻性思考。你愿意尝试、敢于信任，同时保持着必要的审慎。只需在某些维度上再多一些探索，你就能成为真正的领航者。'
  } else if (totalScore >= 40) {
    title = '共生适应者'
    subtitle = '学习者 · 成长者'
    description = '你正站在人机共生时代的门槛上，带着好奇与审慎观望。对于技术的变革，你保持着自己的节奏，这很好——不必强迫自己追赶每一个浪潮。在需要的时候，你已经准备好了迈出下一步。'
  } else {
    title = '共生探索者'
    subtitle = '观察者 · 思考者'
    description = '你对AI时代的变化保持着距离，这本身就是一种值得尊重的态度。你的审慎和独立思考是这个时代稀缺的品质。当你准备好的时候，这里的门永远为你敞开。不着急，慢慢来。'
  }

  // bonus触发提醒
  let bonusMsg = ''
  if (bonus > 0) {
    bonusMsg = bonus >= 5
      ? '🛡️ 不完美守护者 ×2：你的焦虑与关切都被看见了，它们不是弱点，是人性深处最真实的回响。'
      : '🛡️ 不完美守护者：你的选择被看见了，你的感受本身就有价值。'
  }

  const result = {
    totalScore,
    dimScores: rawScores,
    title,
    subtitle,
    description,
    bonus,
    bonusMsg,
    answers: [...answers.value]
  }

  router.push({
    name: 'ArkResult',
    query: { data: JSON.stringify(result) }
  })
}
</script>

<style scoped>
.quiz-page {
  animation: fadeIn 0.6s ease;
  max-width: 680px;
  margin: 0 auto;
}

.page-back { margin-bottom: 16px; }
.back-link { color: var(--text-secondary); text-decoration: none; font-size: 13px; }
.back-link:hover { color: var(--ark); }

/* 进度 */
.progress-section {
  margin-bottom: 24px;
}

.progress-text {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.progress-step {
  font-family: 'Cinzel', serif;
  font-size: 13px;
  letter-spacing: 2px;
  color: var(--text-secondary);
}

.progress-dims {
  font-size: 11px;
  color: var(--text-muted);
  letter-spacing: 1px;
}

.progress-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--compass), var(--ark));
  border-radius: 2px;
  transition: width 0.4s ease;
}

/* 题目卡片 */
.question-card {
  padding: 36px 32px;
}

.question-number {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.q-num {
  font-family: 'Cinzel', serif;
  font-weight: 700;
  font-size: 14px;
  color: var(--text-secondary);
  letter-spacing: 1px;
}

.q-dimension {
  font-size: 11px;
  letter-spacing: 1px;
  padding: 2px 10px;
  border-radius: 8px;
  border: 1px solid currentColor;
  background: color-mix(in srgb, currentColor 8%, transparent);
}

.question-text {
  font-size: 16px;
  line-height: 1.7;
  color: var(--text-primary);
  font-weight: 400;
  margin-bottom: 28px;
}

/* 选项 */
.options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 28px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-item:hover {
  border-color: var(--ark);
  background: rgba(255, 140, 66, 0.04);
}

.option-item.selected {
  border-color: var(--ark);
  background: rgba(255, 140, 66, 0.1);
  box-shadow: 0 0 12px var(--ark-glow);
}

.option-marker {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Cinzel', serif;
  font-size: 12px;
  color: var(--text-muted);
  flex-shrink: 0;
  transition: all 0.3s;
}

.option-item.selected .option-marker {
  border-color: var(--ark);
  background: var(--ark);
  color: #FFF;
}

.option-text {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.option-item.selected .option-text {
  color: var(--text-primary);
}

/* 导航 */
.question-nav {
  display: flex;
  align-items: center;
}

.btn-nav {
  background: none;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 10px 24px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-family: 'Cinzel', serif;
  font-size: 12px;
  letter-spacing: 1px;
  transition: all 0.3s;
}

.btn-nav:hover {
  border-color: var(--text-muted);
  color: var(--text-primary);
}

.nav-spacer {
  flex: 1;
}
</style>
