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
    date: '2026-07-13',
    title: 'TikTok升级AI垃圾内容检测系统，聚焦政治与公共健康误导信息',
    summary: 'TikTok正在测试改进后的垃圾内容检测系统，专门识别AI生成的政治、时事、金融建议和医疗信息相关虚假内容。平台表示这类AI生成内容可能"对公众信任或福祉构成风险"，新系统将加强对跨领域虚假信息的识别与标注。',
    source: 'The Verge',
    tag: 'policy',
    url: 'https://www.theverge.com/ai-artificial-intelligence/961614/tiktok-ai-spam-detection-upgrade',
  },
  {
    date: '2026-07-13',
    title: 'Patreon联手Cloudflare阻止AI爬虫训练模型，AI版权争议持续发酵',
    summary: 'Patreon CEO Jack Conte宣布与Cloudflare合作，阻止AI爬虫抓取创作者作品用于模型训练。Cloudflare此前已默认阻止AI爬虫，最近又推出新功能让发布方获得更细粒度的爬虫控制权。此举反映AI训练数据版权问题的持续升级。',
    source: 'The Verge',
    tag: 'incident',
    url: 'https://www.theverge.com/ai-artificial-intelligence/960795/cloudflare-is-cracking-down-on-multi-purpose-crawlers',
  },
  {
    date: '2026-07-13',
    title: '纽约时报等出版商指控OpenAI隐瞒训练证据，要求法院制裁',
    summary: '纽约时报等多家出版商向法庭提交文件，指控OpenAI在版权诉讼中隐瞒AI系统训练方式和数据使用的关键信息。出版商要求法院对OpenAI实施法律制裁，称其"系统性隐瞒"可能影响案件走向。',
    source: 'The Verge',
    tag: 'incident',
    url: 'https://www.theverge.com/ai-artificial-intelligence/963330/new-york-times-openai-sanctions',
  },
  {
    date: '2026-07-13',
    title: '特朗普国际机场Logo被发现明显AI生成痕迹，引发政府AI使用规范讨论',
    summary: '新更名的特朗普国际机场Logo被曝出典型AI生成痕迹：盾牌仅有11道条纹（应为13道），老鹰右侧爪部变形，羽毛和叶片数量不对称。此事件引发关于政府文件中AI使用规范、透明度及责任归属的新一轮讨论。',
    source: 'The Verge / Futurism',
    tag: 'incident',
    url: 'https://www.theverge.com/gadgets/931347/trump-mobile-t1-phone-logo-flag-stars-stripes',
  },
  {
    date: '2026-07-13',
    title: 'AI芯片军备竞赛致内存短缺，全球PC出货量两年来首次下滑',
    summary: 'IDC数据显示，受AI军备竞赛驱动的内存芯片短缺影响，全球PC出货量同比下降4.9%，结束连续9个季度的增长。HBM高带宽内存大量挤占DDR产能，PC内存价格飙升导致需求萎缩。',
    source: 'The Verge / IDC',
    tag: 'industry',
    url: '',
  },
  {
    date: '2026-07-13',
    title: 'OpenAI获特朗普政府批准公开发布GPT-5.6，同时推出ChatGPT Work超级应用',
    summary: 'OpenAI获特朗普政府绿灯，正式公开发布GPT-5.6模型系列（Sol/Terra/Luna），并同日推出ChatGPT Work——融合ChatGPT和Codex的AI代理平台。该Agent可连接Slack、Gmail、Google Drive等应用，帮助用户完成文档、表格、演示文稿和Web应用创建。免费用户可通过桌面应用直接使用。',
    source: 'The Verge',
    tag: 'policy',
    url: 'https://www.theverge.com/ai-artificial-intelligence/963464/openai-gpt-5-6-codex-chatgpt-work',
  },
  {
    date: '2026-07-13',
    title: 'OpenAI高层持续动荡：AGI负责人Fidji Simo因病离职，CMO和COO相继交接',
    summary: 'OpenAI经历新一轮C-suite变动：AGI负责人Fidji Simo因神经免疫疾病转为兼职顾问；CMO Kate Rouch因健康离职；COO Brad Lightcap转任特别项目。Greg Brockman接管产品战略。此前五角大楼合同争议和Sora关停等事件已引发公司内外部争议。',
    source: 'The Verge',
    tag: 'industry',
    url: 'https://www.theverge.com/ai-artificial-intelligence/963738/openai-fidji-simo-steps-down-ceo-advisor',
  },
  {
    date: '2026-07-13',
    title: 'Patreon联手Cloudflare阻止AI爬虫训练模型，保护创作者权益',
    summary: 'Patreon CEO Jack Conte宣布与Cloudflare合作，阻止AI爬虫抓取创作者作品用于模型训练。Cloudflare此前已默认阻止AI爬虫，最近又推出新功能让发布方获得更细粒度的爬虫控制权。这是AI版权争议持续发酵的最新动向。',
    source: 'The Verge',
    tag: 'incident',
    url: 'https://www.theverge.com/ai-artificial-intelligence/960795/cloudflare-is-cracking-down-on-multi-purpose-crawlers',
  },
  {
    date: '2026-07-13',
    title: 'AI芯片军备竞赛致内存短缺，全球PC出货量两年来首次下滑',
    summary: 'IDC数据显示，受AI军备竞赛驱动的内存芯片短缺影响，全球PC出货量同比下降4.9%，结束连续9个季度的增长。AI模型训练所需的HBM高带宽内存大量挤占DDR内存产能，导致PC内存价格飙升。',
    source: 'The Verge / IDC',
    tag: 'industry',
    url: '',
  },
  {
    date: '2026-07-13',
    title: '特朗普机场新Logo被发现AI生成痕迹：条纹、鹰爪数量出错',
    summary: '新更名的特朗普国际机场Logo被曝出明显AI生成痕迹：盾牌仅有11道条纹（应为13道），老鹰右侧爪部变形，羽毛和叶片数量也不对称。此事件引发关于政府文件中AI使用规范的新一轮讨论。',
    source: 'The Verge / Futurism',
    tag: 'incident',
    url: '',
  },
  {
    date: '2026-07-12',
    title: 'Trump administration clears OpenAI GPT-5.6 for public launch amid safety review',
    summary: '特朗普政府批准OpenAI GPT-5.6三款模型（Sol/Terra/Luna）公开发布，每百万token价格仅为Anthropic Claude Fable 5的一半。OpenAI投入约70万GPU小时进行自动化红队测试，模型在网络安全、编码和生物学领域表现突出。',
    source: 'The Verge / Axios',
    tag: 'policy',
    url: '',
  },
  {
    date: '2026-07-12',
    title: 'TikTok升级AI垃圾内容检测系统，聚焦政治与公共健康误导',
    summary: 'TikTok正在测试改进后的垃圾内容检测系统，专门识别AI生成的政治、时事、金融建议和医疗信息相关虚假内容，称这类内容可能"对公众信任或福祉构成风险"。',
    source: 'The Verge',
    tag: 'policy',
    url: '',
  },
  {
    date: '2026-07-12',
    title: 'NYT等出版商起诉OpenAI隐瞒训练证据，要求法院制裁',
    summary: '纽约时报等出版商向法庭提交文件，指控OpenAI在版权诉讼中隐瞒AI系统训练方式和数据使用的关键信息，要求法院对OpenAI实施法律制裁。',
    source: 'The Verge',
    tag: 'incident',
    url: '',
  },
  {
    date: '2026-07-12',
    title: 'Meta计划9月开始制造自研AI芯片"Iris"，减少对NVIDIA依赖',
    summary: 'Meta据报计划9月起开始制造代号"Iris"的自研AI芯片，加入MTIA产品线。Meta此前宣布每六个月推出一款自研芯片，以减少对NVIDIA和AMD的依赖。',
    source: 'The Verge / Reuters',
    tag: 'industry',
    url: '',
  },
  {
    date: '2026-07-12',
    title: 'OpenAI关闭ChatGPT Atlas浏览器，整合至ChatGPT Work超级应用',
    summary: 'OpenAI宣布关停其独立AI浏览器Atlas，将功能整合至ChatGPT Work桌面超级应用中。此前OpenAI已关闭视频生成应用Sora并搁置"成人模式"计划。',
    source: 'The Verge',
    tag: 'industry',
    url: '',
  },
  {
    date: '2026-07-11',
    title: '伊利诺伊州签署AI安全法，要求独立审计和举报人保护',
    summary: '州长JB Pritzker签署SB 315号AI安全法案，要求AI企业接受独立第三方审计并建立举报人保护机制，条款比纽约和加州同类法案更严格。',
    source: 'The Verge',
    tag: 'policy',
    url: '',
  },
  {
    date: '2026-07-11',
    title: '迪士尼与环球影业起诉Midjourney大规模侵犯版权',
    summary: '两大好莱坞巨头联合起诉Midjourney，指控其AI图像生成器未经授权生成星战、漫威等知名角色形象，要求停止侵权并索赔。',
    source: 'The Verge',
    tag: 'incident',
    url: '',
  },
  {
    date: '2026-07-11',
    title: 'AI搜索引擎SEO乱象：企业自推自荐成行业潜规则',
    summary: '调查发现大量公司在AI搜索结果中利用自推自荐文章操纵排名，生成式AI的搜索结果正在被SEO行业系统性渗透，引发信息真实性担忧。',
    source: 'The Verge',
    tag: 'industry',
    url: '',
  },
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

/**
 * 初始化内置新闻，逐条检查并补充缺失条目
 */
export async function seedDefaultNews() {
  let added = 0
  for (const item of _fallbackNews) {
    const exists = await getEthicsNewsByDate(item.date)
    if (!exists) {
      await createEthicsNews(item)
      added++
    }
  }
  return added
}

// ─── 对外接口 ─────────────────────────────────────────────────

export { createEthicsNews, getLatestEthicsNews, getEthicsNewsByDate, getEthicsNewsStats }
