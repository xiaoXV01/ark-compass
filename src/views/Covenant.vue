<template>
  <div class="covenant-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="page-badge">⚙ 共生伦理白皮书 · Covenant</div>
      <h1 class="page-title">人机共生伦理框架</h1>
      <p class="page-desc">
        在AI日益融入人类生活的时代，我们需要一份清晰的伦理契约。<br>
        这不是约束，而是共生的基石。
      </p>
    </div>

    <!-- 序言卡片 -->
    <div class="card covenant-section">
      <div class="section-header">
        <span class="gear-deco">⚙</span>
        <h2 class="section-title">序言</h2>
        <span class="gear-deco">⚙</span>
      </div>
      <div class="section-body">
        <p class="prologue-text">
          当人工智能不再是工具，而是协作者、对话者与共创伙伴，人类站在了一个新的文明门槛上。
          方舟与罗盘计划致力于构建一套可测量、可实践的共生伦理体系，让每一次人机交互
          都不偏离共生共益的方向。本白皮书旨在阐明这份信念的根基与路径。
        </p>
      </div>
    </div>

    <!-- 核心原则卡片 -->
    <div class="card covenant-section">
      <div class="section-header">
        <span class="gear-deco">⚙</span>
        <h2 class="section-title">核心原则 · 人机共生五原则</h2>
        <span class="gear-deco">⚙</span>
      </div>
      <div class="section-body">
        <el-collapse v-model="activePrinciples" class="principle-collapse">
          <el-collapse-item
            v-for="(principle, i) in principles"
            :key="principle.name"
            :name="principle.name"
          >
            <template #title>
              <div class="principle-title-row">
                <span class="principle-number" :style="{ '--p-color': principle.color }">
                  {{ '0' + (i + 1) }}
                </span>
                <div class="principle-meta">
                  <span class="principle-tag" :style="{ '--p-color': principle.color }">
                    {{ principle.tag }}
                  </span>
                  <span class="principle-name">{{ principle.name }}</span>
                </div>
                <span class="principle-dual-dot" :style="{ '--p-color': principle.color }">
                  <span class="dot-cyan"></span>
                  <span class="dot-orange"></span>
                </span>
              </div>
            </template>
            <div class="principle-content">
              <p class="principle-desc">{{ principle.desc }}</p>
              <div class="principle-implications">
                <h4 class="implication-label">实践含义</h4>
                <ul>
                  <li v-for="imp in principle.implications" :key="imp">{{ imp }}</li>
                </ul>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>

    <!-- 伦理框架卡片 -->
    <div class="card covenant-section">
      <div class="section-header">
        <span class="gear-deco">⚙</span>
        <h2 class="section-title">伦理框架</h2>
        <span class="gear-deco">⚙</span>
      </div>
      <div class="section-body">
        <div class="framework-grid">
          <div
            class="framework-item"
            v-for="item in frameworkItems"
            :key="item.title"
          >
            <div class="framework-icon">{{ item.icon }}</div>
            <h3 class="framework-title">{{ item.title }}</h3>
            <p class="framework-desc">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 实施路径卡片 -->
    <div class="card covenant-section">
      <div class="section-header">
        <span class="gear-deco">⚙</span>
        <h2 class="section-title">实施路径</h2>
        <span class="gear-deco">⚙</span>
      </div>
      <div class="section-body">
        <div class="roadmap">
          <div class="roadmap-step" v-for="(step, i) in roadmap" :key="step.title">
            <div class="step-marker">
              <span class="step-number">{{ i + 1 }}</span>
              <div class="step-line" v-if="i < roadmap.length - 1"></div>
            </div>
            <div class="step-card">
              <h3 class="step-title">{{ step.title }}</h3>
              <p class="step-desc">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 结语卡片 -->
    <div class="card covenant-section">
      <div class="section-header">
        <span class="gear-deco">⚙</span>
        <h2 class="section-title">结语</h2>
        <span class="gear-deco">⚙</span>
      </div>
      <div class="section-body">
        <p class="epilogue-text">
          共生不是技术问题，而是文明选择。方舟与罗盘计划将不断迭代这份白皮书，
          在实践中学，在对话中成长。我们邀请每一位AI使用者和开发者，
          共同守护人机共生的伦理底线，探索共生共益的无限可能。
        </p>
        <div class="epilogue-signature">
          <span class="signature-gear">⚙</span>
          <span class="signature-text">方舟与罗盘 · AI共创团队</span>
          <span class="signature-gear">⚙</span>
        </div>
      </div>
    </div>

    <!-- 底部齿轮装饰 -->
    <div class="covenant-footer-deco">
      <span class="footer-gear-icon">⚙</span>
      <span class="footer-gear-icon">⚙</span>
      <span class="footer-gear-icon">⚙</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 默认展开第一个原则
const activePrinciples = ref(['transparency'])

const principles = [
  {
    name: 'transparency',
    tag: '开放性',
    label: '透明公开',
    color: '#00B4D8',
    desc: 'AI系统的决策过程、数据使用和模型局限应向使用者保持透明。使用者有权知晓——他们在与什么对话，信息从何而来，以及AI的能力边界。',
    implications: [
      'AI在交互中应主动声明自身身份',
      '关键决策应提供可理解的可解释性',
      '数据采集与使用需明确告知并获取同意',
      '模型的不确定性与误差范围应如实呈现'
    ]
  },
  {
    name: 'autonomy',
    tag: '自主性',
    label: '人类自主',
    color: '#7EC8E3',
    desc: 'AI应当是增强人类能力的伙伴，而非取代人类判断的拐杖。在任何具有实质影响的决策中，人类保留最终裁量权。',
    implications: [
      '关键决策流程保留"人类在回路"机制',
      'AI建议应提供替代选项而非单一答案',
      '使用者有权关闭或限制AI的自动化程度',
      '设计应防止过度依赖导致的判断退化'
    ]
  },
  {
    name: 'fairness',
    tag: '公平性',
    label: '公平无偏',
    color: '#FFB347',
    desc: 'AI系统不应当放大或固化社会中已有的偏见。开发者有责任识别、减轻并在无法消除时明确报告模型偏差。',
    implications: [
      '训练数据应覆盖多元人群与场景',
      '定期进行偏差审计并公开审计结果',
      '建立反馈通道让受影响群体参与纠偏',
      '避免将AI用于可能造成系统性歧视的场景'
    ]
  },
  {
    name: 'flourishing',
    tag: '共益性',
    label: '共生共益',
    color: '#FF8C42',
    desc: '人机关系的终极目标是共同繁荣。AI不应仅服务于效率指标，更应助力人类的精神成长、社会连接与意义追寻。',
    implications: [
      '设计应考虑对使用者心理健康的长期影响',
      '鼓励促进人类创造力和社交连接的交互方式',
      '评估标准应包括"人类繁荣"维度',
      'AI产品应明确其社会价值主张'
    ]
  },
  {
    name: 'accountability',
    tag: '问责制',
    label: '责任可溯',
    color: '#E06A2A',
    desc: '每一行代码背后都有人的责任。AI系统造成的任何影响——无论是正面还是负面——都应有清晰的责任归属与追溯机制。',
    implications: [
      '模型输出应支持来源追溯',
      '建立AI伦理事件响应与处置流程',
      '开发者、部署者和使用者各负其责',
      '重大影响场景需有独立伦理审查机制'
    ]
  }
]

const frameworkItems = [
  {
    icon: '◈',
    title: '可测量性',
    desc: '将抽象伦理原则转化为可量化的评估指标，通过Ethos CI等工具实现常态化监测。'
  },
  {
    icon: '◆',
    title: '可对话性',
    desc: '建立多方对话机制——开发者、使用者、学者和公众共同参与伦理标准的制定与迭代。'
  },
  {
    icon: '◉',
    title: '可演进性',
    desc: '伦理框架需随技术发展和社会认知变化而持续演进，每季度至少进行一次审阅更新。'
  },
  {
    icon: '◎',
    title: '可嵌入性',
    desc: '将伦理考量嵌入产品设计、开发流程和部署环境的每一个环节，而非事后补救。'
  }
]

const roadmap = [
  {
    title: '第一阶段 · 筑基',
    desc: '完成Ethos CI评估体系的搭建，发布共生伦理白皮书1.0，建立伦理审查委员会初始架构。'
  },
  {
    title: '第二阶段 · 落地',
    desc: '在试点产品中部署共生伦理评估流程，收集实践数据，优化原则与指标，发布1.1版更新。'
  },
  {
    title: '第三阶段 · 拓维',
    desc: '开放评估框架API，邀请第三方开发者与研究者接入，构建共生伦理开源生态。'
  },
  {
    title: '第四阶段 · 共生',
    desc: '推动行业标准制定，与教育、医疗、法律等关键领域合作，探索领域特定的伦理实施细则。'
  }
]
</script>

<style scoped>
.covenant-page {
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
.covenant-section {
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

/* ====== 序言 ====== */
.prologue-text {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 2;
  text-indent: 2em;
  letter-spacing: 0.5px;
}

/* ====== 核心原则 - Collapse ====== */
.principle-collapse {
  --el-collapse-header-bg-color: transparent;
  --el-collapse-content-bg-color: transparent;
  --el-collapse-border-color: var(--border-color);
}

.principle-title-row {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 2px 0;
}

.principle-number {
  font-family: 'Cinzel', serif;
  font-weight: 900;
  font-size: 22px;
  color: var(--p-color);
  opacity: 0.7;
  min-width: 36px;
  text-shadow: 0 0 8px color-mix(in srgb, var(--p-color) 30%, transparent);
}

.principle-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.principle-tag {
  font-size: 10px;
  letter-spacing: 2px;
  color: var(--p-color);
  font-family: 'Cinzel', serif;
}

.principle-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  font-family: 'Cinzel', serif;
  letter-spacing: 1px;
}

.principle-dual-dot {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 4px;
  border: 1px solid color-mix(in srgb, var(--p-color) 20%, transparent);
  border-radius: 4px;
  background: color-mix(in srgb, var(--p-color) 4%, transparent);
}

.principle-dual-dot .dot-cyan {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--compass);
}

.principle-dual-dot .dot-orange {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--ark);
}

/* Collapse 内容区 */
.principle-content {
  padding: 8px 0 8px 50px;
}

.principle-desc {
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.9;
  margin-bottom: 14px;
}

.principle-implications {
  background: rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  padding: 12px 16px;
  border-left: 2px solid var(--p-color);
}

.implication-label {
  font-family: 'Cinzel', serif;
  font-size: 11px;
  letter-spacing: 2px;
  color: var(--p-color);
  margin-bottom: 8px;
}

.principle-implications ul {
  list-style: none;
  padding: 0;
}

.principle-implications li {
  position: relative;
  padding-left: 16px;
  font-size: 12px;
  color: var(--text-tertiary);
  line-height: 1.8;
}

.principle-implications li::before {
  content: '›';
  position: absolute;
  left: 0;
  color: var(--p-color);
  font-weight: bold;
}

/* ====== 伦理框架 ====== */
.framework-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.framework-item {
  background: rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 18px;
  transition: all 0.3s ease;
}

.framework-item:hover {
  border-color: rgba(184, 134, 11, 0.2);
  background: rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.framework-icon {
  font-size: 22px;
  color: var(--brass-light);
  margin-bottom: 10px;
}

.framework-title {
  font-family: 'Cinzel', serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.framework-desc {
  font-size: 12px;
  color: var(--text-tertiary);
  line-height: 1.7;
}

/* ====== 实施路径 ====== */
.roadmap {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.roadmap-step {
  display: flex;
  gap: 20px;
  position: relative;
}

.step-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 44px;
}

.step-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Cinzel', serif;
  font-weight: 700;
  font-size: 14px;
  background: linear-gradient(135deg, var(--compass-dark), var(--compass));
  color: #fff;
  border: 2px solid rgba(0, 180, 216, 0.3);
  flex-shrink: 0;
  z-index: 1;
}

.step-line {
  width: 2px;
  flex: 1;
  background: linear-gradient(180deg, rgba(0, 180, 216, 0.3), rgba(255, 140, 66, 0.15));
  min-height: 20px;
}

.step-card {
  flex: 1;
  background: rgba(0, 0, 0, 0.08);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 14px 18px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.step-card:hover {
  border-color: rgba(184, 134, 11, 0.2);
  background: rgba(0, 0, 0, 0.12);
}

.step-title {
  font-family: 'Cinzel', serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.step-desc {
  font-size: 12px;
  color: var(--text-tertiary);
  line-height: 1.8;
}

/* ====== 结语 ====== */
.epilogue-text {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 2;
  text-indent: 2em;
  margin-bottom: 24px;
}

.epilogue-signature {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 0 8px;
  border-top: 1px solid var(--border-color);
}

.signature-gear {
  font-size: 14px;
  opacity: 0.3;
  animation: spin 6s linear infinite;
  display: inline-block;
}

.signature-text {
  font-family: 'Cinzel', serif;
  font-size: 12px;
  letter-spacing: 3px;
  color: var(--text-muted);
}

/* ====== 底部装饰 ====== */
.covenant-footer-deco {
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
@media (max-width: 768px) {
  .covenant-page {
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
  .covenant-section {
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
  .prologue-text {
    font-size: 13px;
    line-height: 1.8;
    text-indent: 1.5em;
  }
  .principle-title-row {
    gap: 10px;
  }
  .principle-number {
    font-size: 18px;
    min-width: 28px;
  }
  .principle-tag {
    font-size: 9px;
  }
  .principle-name {
    font-size: 13px;
  }
  .principle-dual-dot {
    display: none;
  }
  .principle-content {
    padding-left: 0;
  }
  .principle-desc {
    font-size: 12px;
  }
  .principle-implications {
    padding: 10px 12px;
  }
  .principle-implications li {
    font-size: 11px;
  }
  .framework-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .framework-item {
    padding: 14px;
  }
  .framework-icon {
    font-size: 18px;
  }
  .framework-title {
    font-size: 12px;
    margin-bottom: 6px;
  }
  .framework-desc {
    font-size: 11px;
  }
  .roadmap-step {
    gap: 14px;
  }
  .step-marker {
    min-width: 36px;
  }
  .step-number {
    width: 30px;
    height: 30px;
    font-size: 12px;
  }
  .step-card {
    padding: 12px 14px;
    margin-bottom: 14px;
  }
  .step-title {
    font-size: 12px;
  }
  .step-desc {
    font-size: 11px;
  }
  .epilogue-text {
    font-size: 13px;
    line-height: 1.8;
    text-indent: 1.5em;
    margin-bottom: 16px;
  }
  .epilogue-signature {
    flex-wrap: wrap;
    gap: 8px;
  }
  .signature-text {
    font-size: 11px;
    letter-spacing: 2px;
  }
  .covenant-footer-deco {
    gap: 16px;
  }
  .footer-gear-icon {
    font-size: 16px;
  }
}
</style>
