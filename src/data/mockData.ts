import type { Topic, DutyRecord } from "@/types";

const now = Date.now();
const h = 3600000;
const d = 86400000;

const makeHeatTrend = (baseHeat: number, baseNeg: number, baseGrowth: number, pattern: "rise" | "fall" | "stable" | "spike") => {
  const points = [];
  for (let i = 6; i >= 0; i--) {
    const t = new Date(now - i * 4 * h);
    const factor = (6 - i) / 6;
    let heat: number, neg: number, growth: number;
    if (pattern === "rise") {
      heat = Math.round(baseHeat * (0.4 + 0.6 * factor));
      neg = Math.round(baseNeg * (0.8 + 0.2 * factor));
      growth = +(baseGrowth * (0.3 + 0.7 * factor)).toFixed(1);
    } else if (pattern === "fall") {
      heat = Math.round(baseHeat * (1.2 - 0.5 * factor));
      neg = Math.round(baseNeg * (1.1 - 0.3 * factor));
      growth = +(baseGrowth * (0.5 + 0.5 * factor)).toFixed(1);
    } else if (pattern === "spike") {
      heat = Math.round(baseHeat * (i === 1 ? 1.3 : 0.5 + 0.5 * factor));
      neg = Math.round(baseNeg * (i === 1 ? 1.2 : 0.9 + 0.1 * factor));
      growth = +(i === 1 ? baseGrowth * 2.5 : baseGrowth * (0.3 + 0.7 * factor)).toFixed(1);
    } else {
      heat = Math.round(baseHeat * (0.9 + 0.1 * Math.sin(factor * Math.PI)));
      neg = Math.round(baseNeg * (0.95 + 0.05 * Math.cos(factor * Math.PI)));
      growth = +(baseGrowth * (0.8 + 0.2 * Math.sin(factor * Math.PI))).toFixed(1);
    }
    points.push({
      time: t.toISOString(),
      heat,
      negativeRatio: neg,
      growthRate: growth,
    });
  }
  return points;
};

export const mockTopics: Topic[] = [
  {
    id: "1",
    title: "中国数字经济发展引发国际关注",
    heat: 9876,
    growthRate: 23.5,
    negativeRatio: 28,
    riskLevel: "medium",
    trend: "rising",
    sources: ["路透社", "BBC", "彭博社", "华尔街日报"],
    region: "全球",
    language: "英语",
    updatedAt: new Date(now - 2 * h).toISOString(),
    articleSummaries: [
      { id: "a1", title: "China's digital economy surges amid global uncertainty", source: "路透社", summary: "文章指出中国数字经济规模已突破50万亿元，占GDP比重超过40%。人工智能、大数据、云计算等新兴技术快速发展，为经济增长注入新动力。分析师认为，中国在数字经济领域的投资力度持续加大，有望在未来几年保持领先地位。", url: "#", publishTime: new Date(now - 5 * h).toISOString(), sentiment: 0.6 },
      { id: "a2", title: "The rise of Chinese tech giants and global implications", source: "BBC", summary: "BBC报道关注中国科技巨头在全球市场的扩张。文章认为，中国企业在电子商务、移动支付、短视频等领域的创新模式正在被全球效仿。同时，数据安全和隐私保护问题也引发了一些国家的担忧。", url: "#", publishTime: new Date(now - 7 * h).toISOString(), sentiment: 0.1 },
      { id: "a3", title: "Digital transformation accelerates across Chinese industries", source: "彭博社", summary: "彭博社分析指出，中国各行业数字化转型步伐加快，制造业、金融业、医疗健康等领域均出现显著变化。政府政策支持和企业积极投入共同推动了这一趋势。", url: "#", publishTime: new Date(now - 1 * d).toISOString(), sentiment: 0.4 },
    ],
    spreadAccounts: [
      { id: "acc1", name: "@ChinaEconWatch", platform: "X (Twitter)", followers: 2350000, postCount: 156, influence: 95 },
      { id: "acc2", name: "Asia Tech Daily", platform: "Facebook", followers: 1890000, postCount: 89, influence: 88 },
      { id: "acc3", name: "@digital_china", platform: "X (Twitter)", followers: 980000, postCount: 234, influence: 76 },
    ],
    narrativeAngles: [
      { id: "n1", angle: "经济机遇", ratio: 45, description: "强调中国数字经济带来的投资和合作机会" },
      { id: "n2", angle: "技术竞争", ratio: 30, description: "聚焦中美在数字技术领域的竞争态势" },
      { id: "n3", angle: "数据安全担忧", ratio: 25, description: "关注数据隐私和国家安全相关议题" },
    ],
    eventTimeline: [
      { id: "t1", time: new Date(now - 5 * d).toISOString().slice(0, 10), event: "中国发布数字经济发展年度报告", type: "official" },
      { id: "t2", time: new Date(now - 3 * d).toISOString().slice(0, 10), event: "国际投行纷纷上调中国科技股评级", type: "media" },
      { id: "t3", time: new Date(now - 1 * d).toISOString().slice(0, 10), event: "社交媒体热议中国数字化转型案例", type: "social" },
      { id: "t4", time: new Date(now - 2 * h).toISOString().slice(0, 10), event: "多家西方主流媒体集中报道", type: "media" },
    ],
    heatTrend: makeHeatTrend(9876, 28, 23.5, "rise"),
  },
  {
    id: "2",
    title: "区域贸易协定谈判进展与影响分析",
    heat: 7654,
    growthRate: 15.2,
    negativeRatio: 35,
    riskLevel: "medium",
    trend: "rising",
    sources: ["金融时报", "经济学人", "南华早报"],
    region: "亚太",
    language: "英语",
    updatedAt: new Date(now - 5 * h).toISOString(),
    articleSummaries: [
      { id: "a4", title: "Regional trade pact talks enter critical phase", source: "金融时报", summary: "金融时报报道，区域全面经济伙伴关系协定的后续谈判进入关键阶段。各方在服务贸易、投资规则等领域仍存在分歧，但普遍对达成共识持乐观态度。", url: "#", publishTime: new Date(now - 8 * h).toISOString(), sentiment: 0.3 },
      { id: "a5", title: "What the new trade deal means for global supply chains", source: "经济学人", summary: "经济学人分析认为，新的区域贸易协定将对全球供应链产生深远影响。文章探讨了原产地规则、关税减免等具体条款对不同行业的影响。", url: "#", publishTime: new Date(now - 1 * d).toISOString(), sentiment: 0.2 },
    ],
    spreadAccounts: [
      { id: "acc4", name: "Global Trade Review", platform: "LinkedIn", followers: 560000, postCount: 45, influence: 82 },
      { id: "acc5", name: "@trade_analyst", platform: "X (Twitter)", followers: 320000, postCount: 112, influence: 75 },
    ],
    narrativeAngles: [
      { id: "n4", angle: "经济一体化", ratio: 40, description: "关注区域经济整合带来的协同效应" },
      { id: "n5", angle: "地缘政治博弈", ratio: 35, description: "分析大国在贸易规则制定中的角力" },
      { id: "n6", angle: "产业冲击", ratio: 25, description: "评估对特定行业的冲击与机遇" },
    ],
    eventTimeline: [
      { id: "t5", time: new Date(now - 7 * d).toISOString().slice(0, 10), event: "新一轮谈判启动", type: "official" },
      { id: "t6", time: new Date(now - 2 * d).toISOString().slice(0, 10), event: "各方就关键条款交换意见", type: "official" },
    ],
    heatTrend: makeHeatTrend(7654, 35, 15.2, "rise"),
  },
  {
    id: "3",
    title: "国际社会关注中国人权议题讨论",
    heat: 8932,
    growthRate: -8.3,
    negativeRatio: 72,
    riskLevel: "high",
    trend: "falling",
    sources: ["纽约时报", "卫报", "法新社", "CNN", "BBC"],
    region: "欧美",
    language: "多语种",
    updatedAt: new Date(now - 6 * h).toISOString(),
    articleSummaries: [
      { id: "a6", title: "Human rights situation in China under international spotlight", source: "纽约时报", summary: "纽约时报报道称，近期国际社会对中国人权议题的关注度有所下降。文章分析了多种因素，包括全球注意力转移到其他地区冲突、经济因素等。", url: "#", publishTime: new Date(now - 10 * h).toISOString(), sentiment: -0.8 },
      { id: "a7", title: "Shifting narratives on China in Western media", source: "卫报", summary: "卫报评论文章指出，西方媒体对中国人权议题的报道角度正在发生变化。从单纯的批评转向更复杂的分析，关注经济发展与人权的关系。", url: "#", publishTime: new Date(now - 1 * d).toISOString(), sentiment: -0.5 },
    ],
    spreadAccounts: [
      { id: "acc6", name: "@humanrights_now", platform: "X (Twitter)", followers: 3120000, postCount: 287, influence: 92 },
      { id: "acc7", name: "Global Justice Network", platform: "Instagram", followers: 2450000, postCount: 156, influence: 85 },
    ],
    narrativeAngles: [
      { id: "n7", angle: "制度差异", ratio: 40, description: "强调中西方制度和价值观的差异" },
      { id: "n8", angle: "发展视角", ratio: 30, description: "从经济社会发展角度看待人权进步" },
      { id: "n9", angle: "双重标准批评", ratio: 30, description: "批评西方国家在人权问题上的双重标准" },
    ],
    eventTimeline: [
      { id: "t7", time: new Date(now - 10 * d).toISOString().slice(0, 10), event: "某国际组织发布年度报告", type: "media" },
      { id: "t8", time: new Date(now - 5 * d).toISOString().slice(0, 10), event: "社交媒体讨论热度达到顶峰", type: "social" },
      { id: "t9", time: new Date(now - 1 * d).toISOString().slice(0, 10), event: "讨论热度开始回落", type: "media" },
    ],
    heatTrend: makeHeatTrend(8932, 72, -8.3, "fall"),
  },
  {
    id: "4",
    title: "中国新能源产业全球领先地位巩固",
    heat: 6543,
    growthRate: 12.1,
    negativeRatio: 18,
    riskLevel: "low",
    trend: "rising",
    sources: ["彭博新能源", "路透社", "日经新闻"],
    region: "全球",
    language: "英语",
    updatedAt: new Date(now - 1 * d).toISOString(),
    articleSummaries: [
      { id: "a8", title: "China leads global renewable energy transition", source: "彭博新能源", summary: "彭博新能源财经报告显示，中国在太阳能、风能、电动汽车等新能源领域持续保持全球领先地位。装机容量、技术创新、成本控制等方面均具有显著优势。", url: "#", publishTime: new Date(now - 1.5 * d).toISOString(), sentiment: 0.7 },
    ],
    spreadAccounts: [
      { id: "acc8", name: "Clean Energy News", platform: "YouTube", followers: 1200000, postCount: 230, influence: 80 },
      { id: "acc9", name: "@green_tech_china", platform: "X (Twitter)", followers: 580000, postCount: 167, influence: 72 },
    ],
    narrativeAngles: [
      { id: "n10", angle: "绿色发展", ratio: 55, description: "积极评价中国在清洁能源领域的贡献" },
      { id: "n11", angle: "市场竞争", ratio: 30, description: "分析中国企业对全球市场的影响" },
      { id: "n12", angle: "供应链风险", ratio: 15, description: "讨论关键矿产供应链的地缘政治风险" },
    ],
    eventTimeline: [
      { id: "t10", time: new Date(now - 6 * d).toISOString().slice(0, 10), event: "中国新能源汽车出口创历史新高", type: "media" },
      { id: "t11", time: new Date(now - 2 * d).toISOString().slice(0, 10), event: "国际能源署发布年度报告", type: "official" },
    ],
    heatTrend: makeHeatTrend(6543, 18, 12.1, "rise"),
  },
  {
    id: "5",
    title: "跨国企业在华投资策略调整",
    heat: 5421,
    growthRate: 5.6,
    negativeRatio: 42,
    riskLevel: "medium",
    trend: "stable",
    sources: ["华尔街日报", "金融时报", "经济学人"],
    region: "全球",
    language: "英语",
    updatedAt: new Date(now - 3 * d).toISOString(),
    articleSummaries: [
      { id: "a9", title: "Multinationals recalibrate China investment strategies", source: "华尔街日报", summary: "华尔街日报调查显示，多数跨国企业仍将中国视为重要市场，但投资策略更加审慎。企业更加关注供应链韧性、合规风险和市场竞争等因素。", url: "#", publishTime: new Date(now - 4 * d).toISOString(), sentiment: -0.1 },
    ],
    spreadAccounts: [
      { id: "acc10", name: "Business China Weekly", platform: "LinkedIn", followers: 890000, postCount: 78, influence: 85 },
    ],
    narrativeAngles: [
      { id: "n13", angle: "市场机遇", ratio: 35, description: "看好中国市场长期增长潜力" },
      { id: "n14", angle: "风险担忧", ratio: 40, description: "关注地缘政治和监管风险" },
      { id: "n15", angle: "本土化战略", ratio: 25, description: "讨论在华企业本土化转型趋势" },
    ],
    eventTimeline: [
      { id: "t12", time: new Date(now - 8 * d).toISOString().slice(0, 10), event: "多家外企发布年度在华投资计划", type: "media" },
      { id: "t13", time: new Date(now - 3 * d).toISOString().slice(0, 10), event: "行业峰会聚焦在华投资策略", type: "media" },
    ],
    heatTrend: makeHeatTrend(5421, 42, 5.6, "stable"),
  },
  {
    id: "6",
    title: "中国文化软实力国际传播效果",
    heat: 4321,
    growthRate: 8.9,
    negativeRatio: 25,
    riskLevel: "low",
    trend: "rising",
    sources: ["BBC", "半岛电视台", "朝日新闻"],
    region: "全球",
    language: "多语种",
    updatedAt: new Date(now - 5 * d).toISOString(),
    articleSummaries: [
      { id: "a10", title: "Chinese cultural exports gain global traction", source: "BBC", summary: "BBC报道指出，中国文化产品在全球范围内的影响力不断提升。影视剧、网络游戏、文学作品等受到越来越多国际受众的喜爱。", url: "#", publishTime: new Date(now - 6 * d).toISOString(), sentiment: 0.5 },
    ],
    spreadAccounts: [
      { id: "acc11", name: "Cultural China", platform: "TikTok", followers: 5600000, postCount: 450, influence: 90 },
    ],
    narrativeAngles: [
      { id: "n16", angle: "文化魅力", ratio: 50, description: "正面评价中国文化的吸引力" },
      { id: "n17", angle: "文化输出疑虑", ratio: 30, description: "讨论文化输出背后的政治意图" },
      { id: "n18", angle: "文化交流", ratio: 20, description: "强调文化交流的双向互动" },
    ],
    eventTimeline: [
      { id: "t14", time: new Date(now - 9 * d).toISOString().slice(0, 10), event: "中国影视剧在多国平台热播", type: "social" },
      { id: "t15", time: new Date(now - 4 * d).toISOString().slice(0, 10), event: "国际文化论坛举办", type: "official" },
    ],
    heatTrend: makeHeatTrend(4321, 25, 8.9, "spike"),
  },
  {
    id: "7",
    title: "全球芯片产业格局变化与中国角色",
    heat: 7123,
    growthRate: -3.2,
    negativeRatio: 55,
    riskLevel: "high",
    trend: "stable",
    sources: ["日经新闻", "华尔街日报", "路透社", "彭博社"],
    region: "亚太",
    language: "多语种",
    updatedAt: new Date(now - 10 * d).toISOString(),
    articleSummaries: [
      { id: "a11", title: "Global chip industry reshuffles amid tech tensions", source: "日经新闻", summary: "日经新闻分析指出，受地缘政治因素影响，全球芯片产业格局正在经历深刻调整。美国、中国、欧盟等主要经济体纷纷加大对半导体产业的投入，产业链重构趋势明显。", url: "#", publishTime: new Date(now - 11 * d).toISOString(), sentiment: -0.3 },
    ],
    spreadAccounts: [
      { id: "acc12", name: "Semiconductor Today", platform: "YouTube", followers: 890000, postCount: 180, influence: 88 },
      { id: "acc13", name: "@tech_politik", platform: "X (Twitter)", followers: 670000, postCount: 230, influence: 82 },
    ],
    narrativeAngles: [
      { id: "n19", angle: "技术竞争", ratio: 45, description: "聚焦中美在芯片领域的技术竞争" },
      { id: "n20", angle: "供应链安全", ratio: 35, description: "讨论全球芯片供应链的安全问题" },
      { id: "n21", angle: "市场影响", ratio: 20, description: "分析产业格局变化对市场的影响" },
    ],
    eventTimeline: [
      { id: "t16", time: new Date(now - 12 * d).toISOString().slice(0, 10), event: "某国出台新的芯片出口管制措施", type: "official" },
      { id: "t17", time: new Date(now - 6 * d).toISOString().slice(0, 10), event: "多家芯片企业发布财报", type: "media" },
      { id: "t18", time: new Date(now - 1 * d).toISOString().slice(0, 10), event: "国际半导体展会召开", type: "media" },
    ],
    heatTrend: makeHeatTrend(7123, 55, -3.2, "stable"),
  },
  {
    id: "8",
    title: "全球气候治理中的中国贡献",
    heat: 5678,
    growthRate: 18.7,
    negativeRatio: 22,
    riskLevel: "low",
    trend: "rising",
    sources: ["卫报", "BBC", "路透社", "国家地理"],
    region: "全球",
    language: "英语",
    updatedAt: new Date(now - 20 * d).toISOString(),
    articleSummaries: [
      { id: "a12", title: "China's role in global climate governance grows", source: "卫报", summary: "卫报报道指出，中国在全球气候治理中扮演着越来越重要的角色。可再生能源投资、碳排放交易体系建设、国际合作等方面都取得了积极进展。", url: "#", publishTime: new Date(now - 21 * d).toISOString(), sentiment: 0.4 },
    ],
    spreadAccounts: [
      { id: "acc14", name: "Climate Action Network", platform: "Instagram", followers: 2100000, postCount: 320, influence: 86 },
    ],
    narrativeAngles: [
      { id: "n22", angle: "积极贡献", ratio: 50, description: "认可中国在气候治理中的积极作用" },
      { id: "n23", angle: "责任与挑战", ratio: 35, description: "讨论中国面临的减排压力和挑战" },
      { id: "n24", angle: "国际合作", ratio: 15, description: "关注气候领域的国际合作进展" },
    ],
    eventTimeline: [
      { id: "t19", time: new Date(now - 11 * d).toISOString().slice(0, 10), event: "中国发布最新气候行动报告", type: "official" },
      { id: "t20", time: new Date(now - 3 * d).toISOString().slice(0, 10), event: "国际气候对话会议召开", type: "official" },
    ],
    heatTrend: makeHeatTrend(5678, 22, 18.7, "rise"),
  },
  {
    id: "9",
    title: "中欧数字经济合作对话成果解读",
    heat: 3890,
    growthRate: 31.2,
    negativeRatio: 15,
    riskLevel: "low",
    trend: "rising",
    sources: ["金融时报", "南华早报", "德国之声"],
    region: "欧洲",
    language: "英语",
    updatedAt: new Date(now - 8 * h).toISOString(),
    articleSummaries: [
      { id: "a13", title: "EU-China digital dialogue yields new agreements", source: "金融时报", summary: "金融时报报道中欧数字经济合作对话取得积极进展，双方在数据跨境流动、人工智能治理等领域达成多项共识。", url: "#", publishTime: new Date(now - 12 * h).toISOString(), sentiment: 0.5 },
    ],
    spreadAccounts: [
      { id: "acc15", name: "EU Digital Watch", platform: "LinkedIn", followers: 420000, postCount: 67, influence: 78 },
    ],
    narrativeAngles: [
      { id: "n25", angle: "合作共赢", ratio: 50, description: "强调中欧合作带来的双赢机遇" },
      { id: "n26", angle: "规则博弈", ratio: 30, description: "讨论数字规则制定中的分歧与妥协" },
      { id: "n27", angle: "安全顾虑", ratio: 20, description: "部分欧洲国家对数据安全的担忧" },
    ],
    eventTimeline: [
      { id: "t21", time: new Date(now - 2 * d).toISOString().slice(0, 10), event: "中欧数字对话会议召开", type: "official" },
      { id: "t22", time: new Date(now - 8 * h).toISOString().slice(0, 10), event: "联合声明发布", type: "official" },
    ],
    heatTrend: makeHeatTrend(3890, 15, 31.2, "spike"),
  },
  {
    id: "10",
    title: "北美华文媒体对华报道倾向分析",
    heat: 3456,
    growthRate: -12.4,
    negativeRatio: 68,
    riskLevel: "high",
    trend: "falling",
    sources: ["世界日报", "星岛日报", "侨报"],
    region: "北美",
    language: "多语种",
    updatedAt: new Date(now - 35 * d).toISOString(),
    articleSummaries: [
      { id: "a14", title: "Chinese-language media in North America shifts coverage", source: "世界日报", summary: "调查显示北美华文媒体对华报道呈现多元化趋势，既有正面关注也有批评声音，整体报道框架受所在国主流媒体影响较大。", url: "#", publishTime: new Date(now - 36 * d).toISOString(), sentiment: -0.2 },
    ],
    spreadAccounts: [
      { id: "acc16", name: "Media Watch NA", platform: "Facebook", followers: 180000, postCount: 45, influence: 62 },
    ],
    narrativeAngles: [
      { id: "n28", angle: "多元视角", ratio: 40, description: "华文媒体呈现多元报道角度" },
      { id: "n29", angle: "身份认同", ratio: 35, description: "华裔社群的身份认同与媒体选择" },
      { id: "n30", angle: "影响力下降", ratio: 25, description: "传统华文媒体影响力持续走低" },
    ],
    eventTimeline: [
      { id: "t23", time: new Date(now - 38 * d).toISOString().slice(0, 10), event: "年度华文媒体论坛举行", type: "official" },
    ],
    heatTrend: makeHeatTrend(3456, 68, -12.4, "fall"),
  },
];

export const mockDutyRecords: DutyRecord[] = [
  { id: "r1", topicId: "1", topicTitle: "中国数字经济发展引发国际关注", opinion: "该议题热度较高，整体舆情偏正面。建议持续关注，重点跟踪负面报道动向。数字经济是我对外宣传的重要抓手，可考虑组织正面回应稿件。", department: "国际传播处", needReport: false, reporter: "张值班", createdAt: new Date(now - 3 * h).toISOString(), status: "processing" },
  { id: "r2", topicId: "3", topicTitle: "国际社会关注中国人权议题讨论", opinion: "高风险议题，虽然热度有所回落，但仍需密切关注。负面占比较高，建议协调相关部门准备回应口径。", department: "人权研究室", needReport: true, reporter: "李值班", createdAt: new Date(now - 8 * h).toISOString(), status: "pending" },
  { id: "r3", topicId: "7", topicTitle: "全球芯片产业格局变化与中国角色", opinion: "芯片议题涉及核心利益，建议持续跟踪技术竞争态势。可联合科技部门开展深入研判，形成专项报告上报。", department: "科技传播处", needReport: true, reporter: "王值班", createdAt: new Date(now - 2 * d).toISOString(), status: "completed" },
];

export const regions = [
  { value: "all", label: "全部地区" },
  { value: "global", label: "全球" },
  { value: "asia-pacific", label: "亚太" },
  { value: "europe", label: "欧洲" },
  { value: "north-america", label: "北美" },
  { value: "europe-america", label: "欧美" },
];

export const languages = [
  { value: "all", label: "全部语种" },
  { value: "english", label: "英语" },
  { value: "multi", label: "多语种" },
  { value: "japanese", label: "日语" },
  { value: "korean", label: "韩语" },
  { value: "french", label: "法语" },
  { value: "spanish", label: "西班牙语" },
];

export const timeRanges = [
  { value: "all", label: "全部" },
  { value: "24h", label: "近24小时" },
  { value: "7d", label: "近7天" },
  { value: "30d", label: "近30天" },
];

export const departments = [
  "国际传播处", "人权研究室", "科技传播处", "文化交流处",
  "经济传播处", "舆情监测室", "新闻协调处", "新媒体处",
];
