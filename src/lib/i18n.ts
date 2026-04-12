import type { Lang } from "@/stores/useStore";

const T: Record<string, Record<Lang, string>> = {
  "nav.home": { en: "Home", ko: "홈", zh: "首页", ja: "ホーム", es: "Inicio" },
  "nav.dex": { en: "DEX", ko: "DEX", zh: "DEX", ja: "DEX", es: "DEX" },
  "nav.nft": { en: "NFT", ko: "NFT", zh: "NFT", ja: "NFT", es: "NFT" },
  "nav.rwa": { en: "RWA Market", ko: "RWA 마켓", zh: "RWA市场", ja: "RWAマーケット", es: "Mercado RWA" },
  "nav.staking": { en: "Staking", ko: "스테이킹", zh: "质押", ja: "ステーキング", es: "Staking" },
  "nav.redeem": { en: "Redeem", ko: "교환", zh: "兑换", ja: "引換", es: "Canjear" },
  "nav.dashboard": { en: "Dashboard", ko: "대시보드", zh: "仪表盘", ja: "ダッシュ", es: "Panel" },
  "nav.admin": { en: "Admin", ko: "관리", zh: "管理", ja: "管理", es: "Admin" },
  "nav.connect": { en: "Connect Wallet", ko: "지갑 연결", zh: "连接钱包", ja: "ウォレット接続", es: "Conectar" },
  "nav.disconnect": { en: "Disconnect", ko: "연결 해제", zh: "断开连接", ja: "切断", es: "Desconectar" },

  "hero.tag": { en: "KKIKDAGEO — RWA Exchange", ko: "끽다거 — RWA 거래소", zh: "KKIKDAGEO — RWA交易所", ja: "KKIKDAGEO — RWA取引所", es: "KKIKDAGEO — Exchange RWA" },
  "hero.title1": { en: "Vintage Pu'er tea", ko: "골동보이차의 가치를", zh: "古董普洱茶", ja: "骨董プーアル茶", es: "Té Pu'er vintage" },
  "hero.title2": { en: "meets blockchain", ko: "블록체인으로 연결", zh: "连接区块链", ja: "ブロックチェーンへ", es: "en blockchain" },
  "hero.desc": { en: "The world's first RWA exchange for authenticated vintage tea. Trade, stake, and redeem real-world assets on-chain.", ko: "인증된 빈티지 차를 위한 세계 최초의 RWA 거래소. 실물 자산을 온체인에서 거래, 스테이킹, 교환하세요.", zh: "全球首个认证古董茶RWA交易所。链上交易、质押和兑换实物资产。", ja: "認証済みヴィンテージ茶のための世界初のRWA取引所。", es: "El primer exchange RWA del mundo para té vintage autenticado." },
  "hero.cta1": { en: "START TRADING", ko: "거래 시작", zh: "开始交易", ja: "取引開始", es: "COMENZAR" },
  "hero.cta2": { en: "EXPLORE RWA", ko: "RWA 탐색", zh: "探索RWA", ja: "RWA探索", es: "EXPLORAR RWA" },

  "stats.tvl": { en: "Total Value Locked", ko: "총 예치 금액", zh: "总锁定价值", ja: "総ロック額", es: "Valor Total Bloqueado" },
  "stats.volume": { en: "24h Volume", ko: "24시간 거래량", zh: "24小时交易量", ja: "24h取引量", es: "Volumen 24h" },
  "stats.apy": { en: "Max APY", ko: "최대 APY", zh: "最大APY", ja: "最大APY", es: "APY Máximo" },
  "stats.users": { en: "Active Users", ko: "활성 사용자", zh: "活跃用户", ja: "アクティブユーザー", es: "Usuarios Activos" },

  "featured.title": { en: "Featured Vintage Cakes", ko: "추천 빈티지 차", zh: "精选古董茶饼", ja: "注目のヴィンテージ", es: "Tés Vintage Destacados" },
  "featured.view": { en: "View Collection", ko: "컬렉션 보기", zh: "查看收藏", ja: "コレクション", es: "Ver Colección" },

  "cta.enter": { en: "Enter the Kura", ko: "쿠라에 입장하기", zh: "进入仓库", ja: "蔵に入る", es: "Entrar al Kura" },
  "cta.desc": { en: "Join the world's most exclusive vintage tea exchange. Verified provenance. Blockchain-secured ownership.", ko: "세계에서 가장 독점적인 빈티지 차 거래소에 참여하세요.", zh: "加入世界上最独特的古董茶交易所。", ja: "世界で最も限定的なヴィンテージ茶取引所に参加。", es: "Únete al exchange de té vintage más exclusivo del mundo." },

  "trade.buy": { en: "Buy", ko: "매수", zh: "买入", ja: "購入", es: "Comprar" },
  "trade.sell": { en: "Sell", ko: "매도", zh: "卖出", ja: "売却", es: "Vender" },
  "trade.swap": { en: "Swap", ko: "스왑", zh: "兑换", ja: "スワップ", es: "Intercambiar" },
  "trade.amount": { en: "Amount", ko: "수량", zh: "数量", ja: "数量", es: "Cantidad" },
  "trade.price": { en: "Price", ko: "가격", zh: "价格", ja: "価格", es: "Precio" },
  "trade.total": { en: "Total", ko: "합계", zh: "总计", ja: "合計", es: "Total" },
  "trade.orderbook": { en: "Order Book", ko: "호가창", zh: "订单簿", ja: "オーダーブック", es: "Libro de Órdenes" },

  "staking.stake": { en: "Stake", ko: "스테이킹", zh: "质押", ja: "ステーク", es: "Apostar" },
  "staking.unstake": { en: "Unstake", ko: "언스테이킹", zh: "解质押", ja: "アンステーク", es: "Retirar" },
  "staking.rewards": { en: "Rewards", ko: "보상", zh: "奖励", ja: "報酬", es: "Recompensas" },
  "staking.claim": { en: "Claim Rewards", ko: "보상 수령", zh: "领取奖励", ja: "報酬受取", es: "Reclamar" },

  "admin.title": { en: "Admin Panel", ko: "관리자 패널", zh: "管理面板", ja: "管理パネル", es: "Panel Admin" },
  "admin.tokens": { en: "Token Management", ko: "토큰 관리", zh: "代币管理", ja: "トークン管理", es: "Gestión de Tokens" },
  "admin.nfts": { en: "NFT Management", ko: "NFT 관리", zh: "NFT管理", ja: "NFT管理", es: "Gestión NFT" },
  "admin.site": { en: "Site Settings", ko: "사이트 설정", zh: "站点设置", ja: "サイト設定", es: "Configuración" },
  "admin.mint": { en: "Mint", ko: "발행", zh: "铸造", ja: "発行", es: "Acuñar" },
  "admin.burn": { en: "Burn", ko: "소각", zh: "销毁", ja: "焼却", es: "Quemar" },
  "admin.pause": { en: "Pause", ko: "정지", zh: "暂停", ja: "一時停止", es: "Pausar" },
  "admin.unpause": { en: "Unpause", ko: "재개", zh: "恢复", ja: "再開", es: "Reanudar" },

  "footer.rights": { en: "All rights reserved.", ko: "모든 권리 보유.", zh: "版权所有。", ja: "全著作権所有。", es: "Todos los derechos reservados." },
  "footer.audit": { en: "Smart contracts audited by CertiK", ko: "CertiK 스마트 컨트랙트 감사 완료", zh: "智能合约经CertiK审计", ja: "CertiKによるスマートコントラクト監査済み", es: "Contratos auditados por CertiK" },
};

export function t(key: string, lang: Lang): string {
  return T[key]?.[lang] || T[key]?.en || key;
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

export function formatPercent(n: number): string {
  const sign = n >= 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

export function shortenAddress(addr: string): string {
  if (addr.length <= 10) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
