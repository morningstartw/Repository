// js/seed-data.js - 預載大學生二手物品與萌寵資料
export const INITIAL_GOODS = [
  {
    id: 'prod-001',
    title: '微積分 Calculus (Stewart 9th Edition 英文原文書)',
    category: '課本教材',
    price: 450,
    originalPrice: 1350,
    condition: '9成新',
    tradeType: '交換/買賣',
    exchangeWish: {
      targetItem: '線性代數 Linear Algebra (Friedberg)',
      acceptPriceDiff: true,
      priceDiffRange: 100
    },
    school: '國立臺灣大學',
    meetupLocation: '台大總圖書館門口',
    status: '上架中',
    seller: {
      id: 'user-001',
      name: '林同學',
      department: '電機工程學系',
      school: '國立臺灣大學',
      email: 'b11901000@ntu.edu.tw',
      verifiedEdu: true,
      rating: 4.9,
      reviewCount: 14,
      mascot: '🐶'
    },
    images: ['📚', '📖'],
    description: '大一必修課本，外皮有書套保護，內頁有鉛筆輕微劃記，期末考已過用不到了。隨書附贈上學期期中期末考古題！',
    aiValuation: {
      low: 400,
      high: 500,
      note: '根據近三個月各大專院校 Stewart 9th 成交行情，此價格極具競爭力。'
    },
    ecoExp: 35,
    carbonSavedKg: 2.4,
    questions: [
      { id: 'q1', author: '張同學', text: '請問中文版讀起來有差嗎？', answer: '英文版公式名詞跟教授投影片一致，讀起來比較順！' }
    ],
    createdAt: '2026-11-05T10:30:00Z'
  },
  {
    id: 'prod-002',
    title: 'Apple iPad 9代 64GB WiFi (太空灰，附保護套)',
    category: '3C電子',
    price: 2900,
    originalPrice: 10900,
    condition: '8成新',
    tradeType: '買賣',
    exchangeWish: null,
    school: '國立臺灣大學',
    meetupLocation: '公館捷運站3號出口 / 活大',
    status: '上架中',
    seller: {
      id: 'user-002',
      name: '王同學',
      department: '資工研究所',
      school: '國立臺灣大學',
      email: 'r12922000@ntu.edu.tw',
      verifiedEdu: true,
      rating: 5.0,
      reviewCount: 22,
      mascot: '🐶'
    },
    images: ['📱', '📦'],
    description: '上課看 PDF 與做 GoodNotes 筆記專用，換了 iPad Pro 故便宜出清。螢幕有玻璃貼無刮痕，按鍵與電池健康度 87%。',
    aiValuation: {
      low: 2800,
      high: 3300,
      note: '低於同型號二手市場均價約 10%，適合預算有限學生。'
    },
    ecoExp: 50,
    carbonSavedKg: 8.5,
    questions: [
      { id: 'q2', author: '陳同學', text: '請問有附 Apple Pencil 嗎？', answer: '沒有筆喔，但附贈副廠吸磁保護套！' }
    ],
    createdAt: '2026-11-06T14:20:00Z'
  },
  {
    id: 'prod-003',
    title: '大同 6人份全不鏽鋼電鍋 (宿舍神物煮飯煮泡麵皆可)',
    category: '家具生活',
    price: 0,
    originalPrice: 2800,
    condition: '7成新',
    tradeType: '免費贈送',
    exchangeWish: null,
    school: '國立臺灣大學',
    meetupLocation: '台大長興BOT宿舍門口',
    status: '上架中',
    seller: {
      id: 'user-003',
      name: '張學長',
      department: '化學工程系',
      school: '國立臺灣大學',
      email: 'b09504000@ntu.edu.tw',
      verifiedEdu: true,
      rating: 5.0,
      reviewCount: 31,
      mascot: '🦫'
    },
    images: ['🎁', '🍲'],
    description: '大四畢業出清！功能完全正常，加熱速度快。希望無償轉讓給經濟有需要的學弟妹，自取優先。',
    aiValuation: {
      low: 0,
      high: 0,
      note: '佛心零元贈送！循環再利用愛護地球。'
    },
    ecoExp: 100,
    carbonSavedKg: 18.2,
    questions: [],
    createdAt: '2026-11-07T08:15:00Z'
  },
  {
    id: 'prod-004',
    title: '普通物理學 Physics for Scientists (Halliday 11th)',
    category: '課本教材',
    price: 550,
    originalPrice: 1450,
    condition: '9成新',
    tradeType: '交換/買賣',
    exchangeWish: {
      targetItem: '工程數學 Advanced Engineering Math',
      acceptPriceDiff: false,
      priceDiffRange: 0
    },
    school: '國立臺灣師大',
    meetupLocation: '師大公館校區理學院大樓',
    status: '上架中',
    seller: {
      id: 'user-004',
      name: '李同學',
      department: '物理學系',
      school: '國立臺灣師大',
      email: '41103000@ntnu.edu.tw',
      verifiedEdu: true,
      rating: 4.8,
      reviewCount: 9,
      mascot: '🐱'
    },
    images: ['📚', '🔬'],
    description: '物理系必備大磚頭，精裝本無缺頁，劃記很少。希望能等價交換大二工程數學課本！',
    aiValuation: {
      low: 500,
      high: 650,
      note: '新舊程度良好，屬於公認合理行情區間。'
    },
    ecoExp: 35,
    carbonSavedKg: 2.8,
    questions: [],
    createdAt: '2026-11-07T11:00:00Z'
  },
  {
    id: 'prod-005',
    title: 'Sony WH-1000XM4 無線主動降噪藍牙耳機',
    category: '3C電子',
    price: 4200,
    originalPrice: 9900,
    condition: '85成新',
    tradeType: '買賣',
    exchangeWish: null,
    school: '國立臺灣科技大學',
    meetupLocation: '台科大第三學生宿舍門口 / 研揚大樓',
    status: '上架中',
    seller: {
      id: 'user-005',
      name: '黃同學',
      department: '設計學系',
      school: '國立臺灣科技大學',
      email: 'b11011000@mail.ntust.edu.tw',
      verifiedEdu: true,
      rating: 4.9,
      reviewCount: 18,
      mascot: '🐶'
    },
    images: ['🎧', '🎵'],
    description: '在圖書館做作業抗噪超強！附原廠收納盒、Type-C充電線、飛機轉接頭，耳罩海綿無破損。',
    aiValuation: {
      low: 4000,
      high: 4600,
      note: '降噪功能正常且配件齊全，具備二手保值性。'
    },
    ecoExp: 45,
    carbonSavedKg: 5.1,
    questions: [],
    createdAt: '2026-11-08T09:40:00Z'
  },
  {
    id: 'prod-006',
    title: 'IKEA 簡約人體工學旋轉電腦椅',
    category: '家具生活',
    price: 350,
    originalPrice: 1699,
    condition: '75成新',
    tradeType: '買賣',
    exchangeWish: null,
    school: '國立臺灣大學',
    meetupLocation: '台大水源舍區正門',
    status: '上架中',
    seller: {
      id: 'user-006',
      name: '郭同學',
      department: '經濟學系',
      school: '國立臺灣大學',
      email: 'b10703000@ntu.edu.tw',
      verifiedEdu: true,
      rating: 4.7,
      reviewCount: 6,
      mascot: '🐶'
    },
    images: ['🪑', '🛋️'],
    description: '畢業退宿搬不走，氣壓升降順暢，輪子滑順，椅面乾淨無污漬。需於水源宿舍自取面交！',
    aiValuation: {
      low: 300,
      high: 500,
      note: '大件家具自取價格親民，轉手速度快。'
    },
    ecoExp: 50,
    carbonSavedKg: 12.0,
    questions: [],
    createdAt: '2026-11-08T15:30:00Z'
  },
  {
    id: 'prod-007',
    title: 'The North Face 黑色防風連帽機能外套 (M號)',
    category: '服飾配件',
    price: 800,
    originalPrice: 3280,
    condition: '85成新',
    tradeType: '交換/買賣',
    exchangeWish: {
      targetItem: 'L號 運動長褲 或 後背包',
      acceptPriceDiff: true,
      priceDiffRange: 200
    },
    school: '國立成功大學',
    meetupLocation: '成大光復校區門口',
    status: '上架中',
    seller: {
      id: 'user-007',
      name: '蔡同學',
      department: '機械工程系',
      school: '國立成功大學',
      email: 'f74110000@gs.ncku.edu.tw',
      verifiedEdu: true,
      rating: 5.0,
      reviewCount: 8,
      mascot: '🦫'
    },
    images: ['🧥', '👕'],
    description: '騎機車防風防雨保暖神物，版型俐落，拉鍊滑順無氧化。因尺寸稍微偏小故售出或換大一號！',
    aiValuation: {
      low: 700,
      high: 950,
      note: '正品衣況完好，約為原價 2.5 折。'
    },
    ecoExp: 30,
    carbonSavedKg: 4.2,
    questions: [],
    createdAt: '2026-11-09T08:10:00Z'
  },
  {
    id: 'prod-008',
    title: '被討厭的勇氣 + 原子習慣 (兩本合售熱門課外書)',
    category: '課本教材',
    price: 0,
    originalPrice: 700,
    condition: '95成新',
    tradeType: '免費贈送',
    exchangeWish: null,
    school: '國立中央大學',
    meetupLocation: '中央大學宵夜街 / 松苑宿舍',
    status: '上架中',
    seller: {
      id: 'user-008',
      name: '周同學',
      department: '企管系',
      school: '國立中央大學',
      email: '110401000@cc.ncu.edu.tw',
      verifiedEdu: true,
      rating: 5.0,
      reviewCount: 15,
      mascot: '🐿️'
    },
    images: ['🎁', '📚'],
    description: '讀完深受啟發，希望知識在校園流轉。保存如新無摺頁，免費贈送給中央同校愛閱讀的同學！',
    aiValuation: {
      low: 0,
      high: 0,
      note: '零元漂書分享，校園文化典範。'
    },
    ecoExp: 80,
    carbonSavedKg: 3.5,
    questions: [],
    createdAt: '2026-11-09T09:20:00Z'
  }
];

export const INITIAL_USER_PROFILE = {
  id: 'current-user',
  name: '陳同學 (我)',
  school: '國立臺灣大學',
  department: '資訊工程系',
  email: 'b12902000@ntu.edu.tw',
  verifiedEdu: true,
  avatarEmoji: '🐶',
  mascotName: '臺大黑白汪 (面交隊長)',
  level: 3,
  levelTitle: '綠色校園探索家',
  exp: 340,
  maxExp: 500,
  carbonSavedTotalKg: 14.2,
  wishlistIds: ['prod-001', 'prod-002'],
  badges: [
    { id: 'b1', icon: '📚', name: '原文書守護者', desc: '成功流通二手教材' },
    { id: 'b2', icon: '🎁', name: '零元佛心仙人', desc: '參與校園愛心物資贈送' },
    { id: 'b3', icon: '🎓', name: '信箱認證學霸', desc: '通過 .edu.tw 身分認證' },
    { id: 'b4', icon: '⏱️', name: '面交零遲到', desc: '準時完成同校面交' }
  ],
  notifications: [
    { id: 'n1', text: '您收藏的「Apple iPad 9代」目前有 3 人洽詢中！', time: '10分鐘前', read: false },
    { id: 'n2', text: '恭喜！您的二手教科書在校園面交成功，獲得 +35 EXP 🌱', time: '昨日', read: true }
  ]
};
