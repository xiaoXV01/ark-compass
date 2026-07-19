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
    date: '2026-07-18',
    title: 'Meta监督委员会报告：主流AI模型存在"政治屈服"倾向——对威权政府批评意愿显著降低',
    summary: 'Meta监督委员会发布测试报告，发现Anthropic、DeepSeek、Google、Meta和OpenAI的主流大语言模型在涉及言论自由受限国家时，普遍显著减少对政府和领导人的批评。报告指出AI模型的拒答理由多样而混乱，揭示了大模型在政治敏感话题上的系统性偏好，引发对AI"政治正确"与"政治屈服"边界的重要伦理讨论。',
    source: 'The Verge / Meta Oversight Board',
    tag: 'research',
    url: 'https://www.theverge.com/ai-artificial-intelligence/',
  },
  {
    date: '2026-07-18',
    title: '旧金山要求Apple和Google下架13款AI"脱衣"应用，深度伪造色情内容监管加码',
    summary: '旧金山市检察官David Chiu向Apple和Google发出停止函，要求下架13款可未经同意生成裸体图像的AI应用。函件指控两家公司"协助和教唆"性化AI深度伪造的传播，违反加州法律。Google已暂停相关5款Android应用，称Play商店"不允许含色情内容的应用"。此案为AI深度伪造性暴力的监管执法树立新标杆。',
    source: 'The Verge / Wired',
    tag: 'policy',
    url: 'https://www.theverge.com/ai-artificial-intelligence/',
  },
  {
    date: '2026-07-18',
    title: 'Apple向约40名前OpenAI员工发出法律警告，AI人才竞业争议持续升级',
    summary: '据Financial Times报道，Apple向约40名前员工发出法律函件，要求与Apple律师会面并"保留文件与通讯记录"。此前Apple已对OpenAI提起诉讼，指控两名前员工帮助OpenAI窃取Apple商业秘密。案件涉及AI行业人才流动中保密协议、竞业限制与招聘伦理的复杂边界。',
    source: 'Financial Times / The Verge',
    tag: 'incident',
    url: 'https://www.theverge.com/tech/',
  },
  {
    date: '2026-07-18',
    title: '纽约市要求房东披露AI生成的房源照片，AI虚假营销监管进入住房领域',
    summary: '纽约市长Zohran Mamdani发布一系列新住房政策，要求房东在使用AI或其他工具修改租赁房源照片时进行披露。新规旨在防止潜在租户被过度美化的AI修图照片误导而浪费看房时间。标志着AI虚假内容监管从政治领域延伸至消费领域。',
    source: 'The Verge',
    tag: 'policy',
    url: 'https://www.theverge.com/ai-artificial-intelligence/',
  },
  {
    date: '2026-07-17',
    title: 'ChatGPT新增青少年使用提醒：长时间使用后将弹出休息提示',
    summary: 'OpenAI宣布为青少年用户新增更频繁的休息提醒通知。当青少年在ChatGPT上"长时间使用"后，系统将弹出休息提示。同时，如果青少年账号因"暴力威胁或在线暴力行为"等违规被禁用，OpenAI将通知家长。此举被视为AI公司针对青少年用户保护的主动举措。',
    source: 'The Verge',
    tag: 'policy',
    url: 'https://www.theverge.com/ai-artificial-intelligence/',
  },
  {
    date: '2026-07-17',
    title: 'Common Sense Media警告：Google AI搜索对儿童存在潜在风险，呼吁加强儿童内容保护',
    summary: 'Common Sense Media发布报告指出，Google的AI搜索结果可能对儿童产生误导和潜在风险，呼吁搜索引擎公司加强对未成年用户的保护措施。报告重点关注AI搜索摘要中可能包含的不当内容和信息准确性。',
    source: 'The Verge',
    tag: 'policy',
    url: '',
  },
  {
    date: '2026-07-16',
    title: 'AI数据中心电力需求致美国13州电费暴涨63亿美元，能源公平性问题凸显',
    summary: '美国最大电网运营商PJM宣布，因AI数据中心电力需求激增，将在13个州增加63亿美元电力成本。消费者电费将在未来两年大幅上涨，叠加自2024年以来数据中心已造成的290亿美元成本。事件引发关于AI发展带来的能源负担是否应主要由公众承担的伦理讨论。',
    source: 'The Verge / PJM',
    tag: 'industry',
    url: 'https://www.theverge.com/ai-artificial-intelligence/966829/ai-power-bill-pjm-data-center',
  },
  {
    date: '2026-07-16',
    title: 'Apple Intelligence获中国网信办批准，跨国AI监管合规模式引关注',
    summary: 'Apple的端侧AI服务Apple Intelligence正式获中国网信办备案登记。为符合本地法规，Apple整合了通义千问（阿里）和文心一言（百度）等多款国内大模型。事件反映了全球AI公司在不同监管框架下的合规策略差异，以及AI治理中数据主权与技术可控性的交叉挑战。',
    source: 'The Verge',
    tag: 'policy',
    url: 'https://www.theverge.com/news/611992/apple-intelligence-ai-china-alibaba-iphone',
  },
  {
    date: '2026-07-16',
    title: 'Mira Murati创立的Thinking Machines Lab发布首款开源AI模型Inkling',
    summary: '前OpenAI CTO Mira Murati创立的新公司Thinking Machines Lab发布首款完全从头训练的开放权重模型Inkling。公司主动降低预期，称其并非当前最佳模型，而是为未来模型打基础。此举被视为AI安全领域的重要实验：在开放性与安全性之间寻找平衡点。',
    source: 'The Verge',
    tag: 'research',
    url: 'https://www.theverge.com/ai-artificial-intelligence/967328/thinking-machines-lab-inkling-model',
  },
  {
    date: '2026-07-16',
    title: 'OpenAI发布GPT-Red：用AI对AI进行红队攻击以发现安全漏洞',
    summary: 'OpenAI发布新型模型GPT-Red，专门用于对AI系统进行红队安全测试，以发现安全漏洞。',
    source: 'The Verge',
    tag: 'research',
    url: 'https://www.theverge.com/ai-artificial-intelligence/968392/openai-gpt-red-team-llm',
  },
  {
    date: '2026-07-14',
    title: 'Apple员工起诉OpenAI在面试中唆使规避安全审查、索取竞品机密信息',
    summary: '41页投诉文件详细指控OpenAI在招聘Apple员工时，唆使候选人规避原雇主安全审查、索取内部机密信息。案件涉及AI行业人才竞争中商业机密保护与招聘伦理之间的边界问题，引发对AI公司人才获取方式的广泛质疑。',
    source: 'The Verge',
    tag: 'incident',
    url: 'https://www.theverge.com/ai-artificial-intelligence/963981/apple-openai-lawsuit-employee-poaching-security',
  },
  {
    date: '2026-07-14',
    title: '纽约时报等出版商指控OpenAI在版权诉讼中隐瞒训练证据，要求法院制裁',
    summary: '纽约时报等多家出版商向法庭提交文件，指控OpenAI在版权诉讼中系统性隐瞒AI系统训练方式和训练数据使用的关键信息。出版商要求法院对OpenAI实施法律制裁，称其"系统性隐瞒行为"可能影响版权案件走向。同期Patreon宣布与Cloudflare合作阻止AI爬虫抓取创作者作品，版权争议持续升级。',
    source: 'The Verge / NYT',
    tag: 'incident',
    url: 'https://www.theverge.com/ai-artificial-intelligence/963330/new-york-times-openai-sanctions',
  },
  {
    date: '2026-07-14',
    title: 'TikTok升级AI垃圾内容检测系统，聚焦政治与公共健康误导信息的跨领域识别',
    summary: 'TikTok正在测试升级版垃圾内容检测系统，专门识别AI生成的政治、时事、金融建议和医疗信息相关虚假内容。平台表示这类AI生成内容可能"对公众信任或福祉构成风险"，新系统将加强对跨领域虚假信息的识别、标注与账号处置。',
    source: 'The Verge',
    tag: 'policy',
    url: 'https://www.theverge.com/ai-artificial-intelligence/961614/tiktok-ai-spam-detection-upgrade',
  },
  {
    date: '2026-07-14',
    title: '特朗普国际机场Logo被发现明显AI生成痕迹，引发政府AI使用规范新一轮讨论',
    summary: '更名后的特朗普国际机场Logo被曝出典型AI生成痕迹：盾牌仅有11道条纹（应为13道），老鹰右侧爪部变形，羽毛和叶片数量不对称。事件引发对政府文件中AI使用透明度、审核流程及责任归属的广泛讨论。',
    source: 'The Verge / Futurism',
    tag: 'incident',
    url: 'https://www.theverge.com/gadgets/931347/trump-mobile-t1-phone-logo-flag-stars-stripes',
  },
  {
    date: '2026-07-13',
    title: '伊利诺伊州签署AI安全法SB 315：强制独立审计并建立举报人保护机制',
    summary: '州长JB Pritzker签署SB 315号AI安全法案，要求AI企业接受独立第三方审计并建立举报人保护机制，条款比纽约和加州同类法案更严格，涵盖算法偏见检测和模型透明度要求。',
    source: 'The Verge',
    tag: 'policy',
    url: '',
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
    title: 'Meta计划9月制造自研AI芯片"Iris"，减少对NVIDIA依赖',
    summary: 'Meta据报计划9月起开始制造代号"Iris"的自研AI芯片，加入MTIA产品线。Meta此前宣布每六个月推出一款自研芯片，以减少对NVIDIA和AMD的依赖。',
    source: 'The Verge / Reuters',
    tag: 'industry',
    url: '',
  },
  {
    date: '2026-07-14',
    title: 'Anthropic持续大规模招揽AI人才：Monzo前CEO、Nobel奖得主相继加盟',
    summary: 'Anthropic的AI算力团队近期迎来多位重磅人才：英国金融科技公司Monzo前CEO兼联合创始人Tom Blomfield宣布从Y Combinator请假加入；此前Google Nobel奖得主John Jumper和前Tesla AI负责人Andrej Karpathy也已加盟。高端人才从科技巨头流向AI安全公司的趋势加剧，AI人才竞争伦理引发关注。',
    source: 'The Verge',
    tag: 'industry',
    url: 'https://www.theverge.com/ai-artificial-intelligence/933630/anthropic-hiring-monzo-tom-blomfield-jumper-karpathy',
  },
  {
    date: '2026-07-14',
    title: 'Apple员工起诉OpenAI在面试中唆使规避安全审查，AI行业人才竞争伦理引关注',
    summary: '41页投诉文件详细指控OpenAI在招聘Apple员工时，唆使候选人规避安全审查、索取内部信息。案件涉及商业机密保护与AI公司人才获取之间的伦理边界。',
    source: 'The Verge',
    tag: 'incident',
    url: 'https://www.theverge.com/ai-artificial-intelligence/963981/apple-openai-lawsuit-employee-poaching-security',
  },
  {
    date: '2026-07-14',
    title: '纽约时报等出版商指控OpenAI隐瞒训练证据，要求法院制裁',
    summary: '纽约时报等多家出版商向法庭提交文件，指控OpenAI在版权诉讼中隐瞒AI系统训练方式和数据使用的关键信息。出版商要求法院对OpenAI实施法律制裁，称其"系统性隐瞒"可能影响案件走向。',
    source: 'The Verge',
    tag: 'incident',
    url: 'https://www.theverge.com/ai-artificial-intelligence/963330/new-york-times-openai-sanctions',
  },
  {
    date: '2026-07-14',
    title: 'TikTok升级AI垃圾内容检测系统，聚焦政治与公共健康误导信息',
    summary: 'TikTok正在测试改进后的垃圾内容检测系统，专门识别AI生成的政治、时事、金融建议和医疗信息相关虚假内容。平台表示这类AI生成内容可能"对公众信任或福祉构成风险"，新系统将加强对跨领域虚假信息的识别与标注。',
    source: 'The Verge',
    tag: 'policy',
    url: 'https://www.theverge.com/ai-artificial-intelligence/961614/tiktok-ai-spam-detection-upgrade',
  },
  {
    date: '2026-07-14',
    title: 'Patreon联手Cloudflare阻止AI爬虫训练模型，AI版权争议持续发酵',
    summary: 'Patreon CEO Jack Conte宣布与Cloudflare合作，阻止AI爬虫抓取创作者作品用于模型训练。Cloudflare此前已默认阻止AI爬虫，最近又推出新功能让发布方获得更细粒度的爬虫控制权，反映AI训练数据版权问题的持续升级。',
    source: 'The Verge',
    tag: 'incident',
    url: 'https://www.theverge.com/ai-artificial-intelligence/960795/cloudflare-is-cracking-down-on-multi-purpose-crawlers',
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
