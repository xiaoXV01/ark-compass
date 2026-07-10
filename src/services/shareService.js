/**
 * 分享服务 — 方舟与罗盘 · 共生评估系统
 *
 * 提供两种分享方式：
 *   1. copyShareText(type, data) — 生成精美文案并复制到剪贴板
 *   2. downloadResultCard(type, data, elementRef) — 基于 DOM 截图生成 PNG 下载
 */

import { ElMessage } from 'element-plus'
import html2canvas from 'html2canvas'

// =============================================
// 日期格式化
// =============================================
function todayStr() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// =============================================
// 1. 生成分享文本
// =============================================

/**
 * 生成 Ethos（自由评测）分享文本
 * @param {Object} data — { overall, dimensions }
 * @returns {string}
 */
function buildEthosText(data) {
  if (!data) return ''

  const overall = data.overall ?? '--'
  const dims = data.dimensions || []

  const dimLines = dims
    .map((d) => `${d.label} ${d.score}`)
    .join(' · ')

  // 找到最高分维度作为评语参考
  const bestDim = dims.reduce((a, b) => (a.score >= b.score ? a : b), dims[0])
  const worstDim = dims.reduce((a, b) => (a.score <= b.score ? a : b), dims[0])
  let verdict = ''
  if (overall >= 80) {
    verdict = `出色的伦理框架，尤其在「${bestDim.label}」上表现优异。`
  } else if (overall >= 60) {
    verdict = `负责任的伦理框架，在「${worstDim.label}」上仍有提升空间。`
  } else if (overall >= 40) {
    verdict = `具备基础伦理意识，建议重点关注「${worstDim.label}」维度的提升。`
  } else {
    verdict = `伦理评估得分偏低，亟需系统性审视各维度表现。`
  }

  return [
    `⚖️ Ethos CI · 伦理评测报告`,
    `━━━━━━━━━━━━━━━━━`,
    `综合评分：${overall}/100`,
    dimLines ? `${dimLines}` : '',
    ``,
    `"${verdict}"`,
    `━━━━━━━━━━━━━━━━━`,
    `方舟与罗盘 · 共生评估系统`,
  ]
    .filter(Boolean)
    .join('\n')
}

/**
 * 生成 SQ（共生指数）分享文本
 * @param {Object} data — { title, subtitle, totalScore, dimScores, description }
 * @returns {string}
 */
function buildSQText(data) {
  if (!data) return ''

  const { title, totalScore, dimScores } = data
  const dimLabels = {
    empathy: '同理心',
    boundary: '边界感',
    reflection: '自省力',
    responsibility: '责任感',
    openness: '开放性',
  }

  const dimLines = Object.entries(dimScores || {})
    .map(([key, score]) => {
      const label = dimLabels[key] || key
      const barLen = Math.round(score / 10)
      const bar = '█'.repeat(barLen) + '░'.repeat(10 - barLen)
      return `${label} ${bar} ${score}`
    })
    .join('\n')

  return [
    `🧭 方舟 SQ · 共生指数测评报告`,
    `━━━━━━━━━━━━━━━━━`,
    `称号：${title || '--'}`,
    `共生指数：${totalScore ?? '--'}/100`,
    ``,
    dimLines,
    `━━━━━━━━━━━━━━━━━`,
    `方舟与罗盘 · 共生评估系统`,
    `http://150.158.36.130/ark/`,
  ]
    .filter(Boolean)
    .join('\n')
}

// =============================================
// 2. 复制到剪贴板
// =============================================

/**
 * 复制分享文本到剪贴板
 * @param {'ethos'|'sq'} type — 评测类型
 * @param {Object} data — 评测结果数据
 * @returns {Promise<boolean>} 是否成功
 */
export async function copyShareText(type, data) {
  let text = ''
  if (type === 'ethos') {
    text = buildEthosText(data)
  } else if (type === 'sq') {
    text = buildSQText(data)
  } else {
    console.warn('[shareService] 未知分享类型:', type)
    return false
  }

  if (!text) {
    ElMessage.warning('暂无分享内容')
    return false
  }

  try {
    // 优先使用 Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      // 降级：传统 execCommand
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.left = '-9999px'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    ElMessage.success('📋 分享文案已复制到剪贴板')
    return true
  } catch (err) {
    console.error('[shareService] 复制失败:', err)
    ElMessage.error('复制失败，请手动复制')
    return false
  }
}

// =============================================
// 3. 下载截图
// =============================================

/**
 * 基于 DOM 元素生成截图并下载
 * @param {'ethos'|'sq'} type — 评测类型
 * @param {Object} data — 评测结果数据（仅用于文件名）
 * @param {HTMLElement|string} elementRef — DOM 元素或模板 ref
 * @returns {Promise<boolean>} 是否成功
 */
export async function downloadResultCard(type, data, elementRef) {
  // 支持传入 ref 对象（.value）或原生元素
  const el = elementRef?.$el ?? elementRef?.value ?? elementRef
  if (!el || !(el instanceof HTMLElement)) {
    ElMessage.warning('无法获取截图区域')
    return false
  }

  const prefix = type === 'ethos' ? 'Ethos-评测' : 'SQ-共生指数'
  const filename = `${prefix}-${todayStr()}.png`

  try {
    const canvas = await html2canvas(el, {
      scale: 2, // 2x 高清输出
      backgroundColor: '#2A2D30',
      allowTaint: false,
      useCORS: true,
      logging: false,
    })

    // 触发下载
    const link = document.createElement('a')
    link.download = filename
    link.href = canvas.toDataURL('image/png')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    ElMessage.success(`📸 截图已保存: ${filename}`)
    return true
  } catch (err) {
    console.error('[shareService] 截图生成失败:', err)
    ElMessage.error('截图生成失败，请尝试使用复制文本分享')
    return false
  }
}
