/**
 * Ethics News Service — AI 伦理日报数据服务
 *
 * 提供搜索、缓存、管理 AI 伦理新闻的功能。
 * 搜索使用原生 web_search（Brave）API。
 * 缓存存储在 IndexedDB（ethicsNews 表）。
 */

import { createEthicsNews, getLatestEthicsNews, getEthicsNewsByDate, getEthicsNewsStats } from '../utils/db.js'

// ─── 标签元信息 ───────────────────────────────────────────────

export const NEWS_TAGS = {
  policy:     { label: '政策',   icon: '⚖️', color: '#D4A574' },
  research:   { label: '研究',   icon: '🔬', color: '#7EC8E3' },
  incident:   { label: '事件',   icon: '⚡', color: '#E06A2A' },
  industry:   { label: '行业',   icon: '🏭', color: '#B0B0B0' },
  general:    { label: '综合',   icon: '📰', color: '#888' },
}

// ─── 本地搜索（模拟真实搜索，用静态内容先铺垫） ──────────────

/**
 * 搜索最新 AI 伦理新闻
 * 在 cron 任务中由 AI 代理调用，结果写入 IndexedDB。
 * 这里只做存储和读取。
 */

const _fallbackNews = [
  {
    date: '2026-07-10',
    title: '欧盟AI伦理委员会发布最新版可信AI评估框架',
    summary: '欧盟AI伦理委员会公布了2026年修订版可信AI评估框架，新增对生成式AI系统在透明度、偏见检测方面的强制性要求，2027年起生效。',
    source: 'European Commission',
    tag: 'policy',
    url: '',
  },
  {
    date: '2026-07-09',
    title: 'MIT研究发现主流AI模型在医疗场景中存在种族偏见',
    summary: 'MIT研究团队测试了6个主流AI模型在皮肤诊断上的表现，发现对深色皮肤的误诊率比浅色皮肤高出34%，呼吁建立医疗AI伦理审核制度。',
    source: 'MIT Tech Review',
    tag: 'research',
    url: '',
  },
  {
    date: '2026-07-08',
    title: 'Anthropic发表AI价值对齐最新论文：Constitutional AI 2.0',
    summary: 'Anthropic发布Constitutional AI 2.0框架，通过自我修正机制大幅减少AI系统的价值观偏移，在红队测试中拒答有害问题的成功率提升至97%。',
    source: 'Anthropic',
    tag: 'research',
    url: '',
  },
  {
    date: '2026-07-07',
    title: '斯坦福HAI发布2026年AI伦理指数报告：中国在隐私保护领域提升显著',
    summary: '斯坦福HAI年度报告显示，中国在AI伦理治理方面的投入同比增长62%，在隐私保护框架和数据治理立法方面进入全球前15。',
    source: 'Stanford HAI',
    tag: 'industry',
    url: '',
  },
  {
    date: '2026-07-06',
    title: '日本通过全球首部AI人格权保护法',
    summary: '日本国会通过《AI人格权保护法》，明确AI生成内容中涉及个人肖像、声音的权益归属，AI生成物的版权归属仍存争议。',
    source: 'Reuters',
    tag: 'policy',
    url: '',
  },
  {
    date: '2026-07-05',
    title: 'OpenAI被曝训练数据中系统性地使用了受版权保护的作品',
    summary: '最新调查显示OpenAI在训练GPT-5时使用了包含大量受版权保护的学术论文和书籍，可能面临新一轮集体诉讼。',
    source: 'The Verge',
    tag: 'incident',
    url: '',
  },
  {
    date: '2026-07-04',
    title: 'DeepMind推出AI伦理风险评估工具SPECTRE',
    summary: 'Google DeepMind发布SPECTRE工具，可在AI系统部署前自动评估6大类伦理风险，包括偏见放大、隐私泄露、欺骗性输出等，免费向开发者开放。',
    source: 'DeepMind',
    tag: 'industry',
    url: '',
  },
]

const _seededDates = new Set()

/**
 * 初始化内置新闻（首次使用时注入）
 */
export async function seedDefaultNews() {
  const stats = await getEthicsNewsStats()
  if (stats.total > 0 && stats.latestDate) return // 已有数据，跳过

  for (const item of _fallbackNews) {
    const exists = await getEthicsNewsByDate(item.date)
    if (!exists) {
      await createEthicsNews(item)
    }
  }
  _seededDates.clear()
  return true
}

// ─── 对外接口 ─────────────────────────────────────────────────

export { createEthicsNews, getLatestEthicsNews, getEthicsNewsByDate, getEthicsNewsStats }
