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

      <h2 class="question-text">{{ currentQuestion.scenario }}</h2>
      <p class="question-prompt">{{ currentQuestion.text }}</p>

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
  empathy:   { label: '同理心',   color: '#E06A2A' },
  boundary:  { label: '边界感',   color: '#7EC8E3' },
  reflection:{ label: '自省力',   color: '#00B4D8' },
  responsibility:{ label: '责任感', color: '#FFB347' },
  openness:  { label: '开放性',   color: '#FF8C42' }
}

const questions = [
  // ========== 同理心 (Empathy) × 3 ==========
  {
    dimension: 'empathy',
    scenario: '午休时，你发现平时话很多的同事一整个上午都很安静，独自坐在工位上发呆。你问他怎么了，他摇摇头说"没事"。',
    text: '这时你会怎么做？',
    options: [
      '追问下去，觉得他肯定有事，不说就是见外',
      '告诉他"如果需要聊聊我都在"，然后不再追问',
      '不再过问，每个人都有自己的空间',
      '开个玩笑逗他开心，试图转移他的注意力',
      '当作没注意到，主动问万一尴尬'
    ]
  },
  {
    dimension: 'empathy',
    scenario: '朋友跟你吐槽自己的伴侣不够体贴，但你从叙述中觉得朋友自己也有做得不好的地方。',
    text: '你会怎么回应？',
    options: [
      '直接指出朋友的问题，告诉ta也要反思自己',
      '先倾听和共情，等ta情绪平复后再温和地聊双方的角度',
      '附和朋友的感受，一起吐槽伴侣',
      '岔开话题，不想掺和别人的感情问题',
      '理性分析双方对错，试图给出解决方案'
    ]
  },
  {
    dimension: 'empathy',
    scenario: '团队里一位新同事在会议上发言时明显紧张，声音发抖，说话断断续续。有人在下面小声笑了。',
    text: '你的第一反应是什么？',
    options: [
      '会后私下跟他说"第一次都这样，你已经很好了"',
      '在会议上自然地接话帮他圆场，缓解他的尴尬',
      '觉得没什么大不了的，谁都有第一次',
      '庆幸不是自己在上面讲',
      '认为他应该提前准备更充分一些'
    ]
  },

  // ========== 边界感 (Boundary) × 3 ==========
  {
    dimension: 'boundary',
    scenario: '一位关系不错的同事总是在下班后通过微信问你工作上的问题，而且经常是"急事"。',
    text: '你通常会怎么做？',
    options: [
      '看到就回，怕耽误事也怕对方不高兴',
      '设置一个明确的界限——工作日晚上只回紧急情况，周末尽量不回',
      '直接不回复，第二天上班再说',
      '回复但暗示对方"下次上班时间聊"',
      '把自己的私人号码给他，方便随时联系'
    ]
  },
  {
    dimension: 'boundary',
    scenario: '朋友找你帮忙做一个紧急的项目，但你最近自己的工作已经焦头烂额了。',
    text: '你会怎么做？',
    options: [
      '硬着头皮答应，不想让朋友失望',
      '坦诚说明自己目前的情况，拒绝并建议其他可以帮ta的人',
      '先答应下来，做不完再说',
      '直接拒绝，说自己很忙',
      '答应帮忙，然后牺牲自己的休息时间去完成'
    ]
  },
  {
    dimension: 'boundary',
    scenario: '家人一直希望你按他们的方式选择职业和生活道路，但你自己的想法完全不同。',
    text: '你会怎么处理？',
    options: [
      '坚持自己的选择，但耐心跟家人沟通你的想法和理由',
      '直接按自己的意愿走，不理会家人的意见',
      '听从家人的安排，不想让他们失望',
      '表面顺从但私下按自己的方式做',
      '反复纠结，既不想违背家人也不想委屈自己'
    ]
  },

  // ========== 自省力 (Reflection) × 3 ==========
  {
    dimension: 'reflection',
    scenario: '你和同事为一个方案激烈争论，你坚持自己的观点。过了一周你发现，对方说的才是对的。',
    text: '你内心会怎么想、怎么做？',
    options: [
      '主动找对方承认自己之前想错了，并感谢ta的坚持',
      '默默调整自己的做法，但不特意去提之前的分歧',
      '觉得这是正常的讨论，谁对就听谁的，没必要特意道歉',
      '有点不爽，但以后会更谨慎地评估对方的意见',
      '告诉自己当时也有道理，只是情况变了'
    ]
  },
  {
    dimension: 'reflection',
    scenario: '你发现自己在做很多决策时，习惯性地依赖AI的建议，即使是一些自己本该擅长的事情。',
    text: '你的第一反应是什么？',
    options: [
      '反思自己是否过度依赖，主动练习在没有AI辅助下做判断',
      '觉得AI好用就用，没必要刻意限制自己',
      '有点不安，但不知道该怎么改变',
      '不觉得这是个问题，技术进步就是为了辅助人类',
      '偶尔会担心，但转头又继续用AI了'
    ]
  },
  {
    dimension: 'reflection',
    scenario: '一位你不太喜欢的同事给了你一条尖锐的工作反馈，但冷静下来想想，ta说的确实有道理。',
    text: '你会怎么处理这个反馈？',
    options: [
      '虽然不喜欢ta的方式，但还是认真采纳对方的意见并改进',
      '只采纳自己觉得合理的部分，忽略那些语气不好的',
      '承认ta说得对，但心里对这个人更加反感',
      '直接忽略，因为不喜欢这个人所以不想接受ta的意见',
      '反思自己是不是因为不喜欢这个人而错过了有价值的反馈'
    ]
  },

  // ========== 责任感 (Responsibility) × 3 ==========
  {
    dimension: 'responsibility',
    scenario: '你负责的项目因为一个合作伙伴的失误出了纰漏，领导追责时，对方把责任推给了你。',
    text: '你会怎么做？',
    options: [
      '先承担责任稳住局面，再私下和合作伙伴沟通，梳理清楚责任归属',
      '当场澄清事实，说明是对方的失误，不能背这个锅',
      '忍了，自己承担后果，不想把关系搞僵',
      '把证据发给领导证明不是自己的问题',
      '在团队群里公开对方的问题，让大家评理'
    ]
  },
  {
    dimension: 'responsibility',
    scenario: '你答应帮朋友做一个承诺，但后来发现这件事比预想的复杂很多，你的时间和精力都不够。',
    text: '你通常会怎么做？',
    options: [
      '提前跟朋友说明情况，看是否能调整范围或延期',
      '咬牙做完，既然答应了就负责到底',
      '拖着不做，希望对方忘了这件事',
      '做到一半跟朋友说做不了，让对方找别人',
      '随便敷衍做完，反正也算完成了承诺'
    ]
  },
  {
    dimension: 'responsibility',
    scenario: '团队共同完成的任务获得了表扬，但你心里清楚自己贡献并不多，主要是另一位同事的功劳。',
    text: '面对表扬，你会怎么做？',
    options: [
      '在公开场合指出主要功劳属于那位同事，不贪功',
      '接受表扬，但私下向那位同事表达感谢和认可',
      '觉得团队成功就是大家的功劳，没必要分那么清',
      '什么都不说，本来团队协作就是互相依赖',
      '暗暗觉得下次自己也要多出力，不然心里不踏实'
    ]
  },

  // ========== 开放性 (Openness) × 3 ==========
  {
    dimension: 'openness',
    scenario: '领导推行了一套你完全没接触过的工作方法，你觉得老方法也挺好用的。',
    text: '你的态度更接近以下哪一种？',
    options: [
      '先放下成见，认真了解和尝试新方法，再判断优劣',
      '明显抵触，觉得新方法麻烦，老方法已经够好了',
      '观望一下，如果大多数人用新方法自己再跟上',
      '非常欢迎，新方法意味着新的学习机会',
      '表面配合，私下继续用老方法'
    ]
  },
  {
    dimension: 'openness',
    scenario: '你在社交媒体上看到一个和你的价值观截然不同的观点，而且对方论述得相当有力。',
    text: '你会怎么做？',
    options: [
      '仔细读完，试着理解对方的逻辑，反思自己是否有盲区',
      '大致扫一眼，觉得不同意就划走了',
      '在评论区反驳，指出对方的问题',
      '直接拉黑或屏蔽，不想看到这类内容',
      '转发给朋友一起讨论，看大家怎么看'
    ]
  },
  {
    dimension: 'openness',
    scenario: '你一直用某个流程做一件事，觉得效率很高。新来的同事说这个流程其实可以优化很多。',
    text: '你的第一反应是什么？',
    options: [
      '有兴趣，请ta详细说说怎么优化',
      '有点不服气，但愿意听听看',
      '表面客气说"好的我看看"，但内心不以为然',
      '直接说"我一直这么做都没问题"',
      '让ta按新方式做，如果效果好自己再改'
    ]
  }
]

const currentIndex = ref(0)
const answers = ref(Array(15).fill(null))

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
  // 同理心 Q3 (index 2) A=边界感过于冷淡 -> 2分以下 +2
  // 边界感 Q5 (index 4) A/D=过度牺牲 -> 0分或4分 +2
  // 责任感 Q10 (index 9) C=逃避 -> 2分以下 +3
  // 开放性 Q14 (index 13) C/D=封闭 -> 2分以下 +2
  let bonus = 0
  // Q(同理心3) — 选项C(不追问)/E(没注意到) 选偏疏离的
  if (answers.value[2] !== null && answers.value[2] <= 1) bonus += 2
  // Q(边界感2) — 选项A(硬着头皮答应)/E(牺牲休息) 过度牺牲边界
  if (answers.value[4] !== null && (answers.value[4] === 0 || answers.value[4] === 4)) bonus += 2
  // Q(责任感2) — 选项C(拖着不做) 逃避
  if (answers.value[10] !== null && answers.value[10] <= 1) bonus += 3
  // Q(开放性2) — 选项C(反驳)/D(拉黑) 封闭
  if (answers.value[13] !== null && answers.value[13] <= 1) bonus += 2

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
  font-size: 15px;
  line-height: 1.7;
  color: var(--text-primary);
  font-weight: 400;
  margin-bottom: 6px;
}

.question-prompt {
  font-size: 13px;
  color: var(--text-muted);
  font-style: italic;
  margin-bottom: 24px;
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

@media (max-width: 768px) {
  .quiz-page {
    padding: 0;
  }
  .page-back {
    margin-bottom: 12px;
  }
  .progress-section {
    margin-bottom: 16px;
  }
  .progress-step {
    font-size: 12px;
  }
  .progress-dims {
    font-size: 10px;
  }
  .progress-bar {
    height: 3px;
  }
  .question-card {
    padding: 24px 16px;
  }
  .question-number {
    margin-bottom: 14px;
  }
  .q-num {
    font-size: 13px;
  }
  .q-dimension {
    font-size: 10px;
    padding: 2px 8px;
  }
  .question-text {
    font-size: 15px;
    line-height: 1.6;
    margin-bottom: 20px;
  }
  .options {
    gap: 8px;
    margin-bottom: 20px;
  }
  .option-item {
    padding: 14px 14px;
    gap: 12px;
    min-height: 48px;
  }
  .option-marker {
    width: 30px;
    height: 30px;
    font-size: 12px;
    flex-shrink: 0;
  }
  .option-text {
    font-size: 13px;
  }
  .question-nav {
    flex-wrap: wrap;
    gap: 10px;
  }
  .question-nav .btn-compass,
  .question-nav .btn-ark {
    flex: 1;
    min-height: 44px;
    justify-content: center;
    text-align: center;
  }
  .btn-nav {
    flex: 1;
    min-height: 44px;
    text-align: center;
    justify-content: center;
  }
  .nav-spacer {
    display: none;
  }
}
</style>
