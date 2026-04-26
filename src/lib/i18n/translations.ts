/**
 * Translation dictionary. Add a key here, then use `t("key")` in components.
 * Both `en` and `ko` must define every key — TypeScript enforces this.
 */
export const translations = {
  // ──────────────────────────────────────────────
  // Common / shared
  // ──────────────────────────────────────────────
  "common.connectWallet": { en: "Connect Wallet", ko: "지갑 연결" },
  "common.connect": { en: "Connect", ko: "연결" },
  "common.cancel": { en: "Cancel", ko: "취소" },
  "common.confirm": { en: "Confirm", ko: "확인" },
  "common.back": { en: "Back to Portfolio", ko: "포트폴리오로 돌아가기" },
  "common.network": { en: "Wrong Network", ko: "잘못된 네트워크" },
  "common.viewAll": { en: "View All", ko: "전체 보기" },
  "common.loading": { en: "Loading…", ko: "불러오는 중…" },
  "common.empty": { en: "No items yet.", ko: "항목이 없습니다." },

  // ──────────────────────────────────────────────
  // Layout — Navbar
  // ──────────────────────────────────────────────
  "nav.market": { en: "Market", ko: "마켓" },
  "nav.exchange": { en: "Exchange", ko: "거래소" },
  "nav.vault": { en: "Vault", ko: "보관소" },
  "nav.history": { en: "History", ko: "내역" },

  // ──────────────────────────────────────────────
  // Layout — Sidebar
  // ──────────────────────────────────────────────
  "sidebar.collections": { en: "Collections", ko: "컬렉션" },
  "sidebar.myKura": { en: "My Kura", ko: "내 보관소" },
  "sidebar.governance": { en: "Governance", ko: "거버넌스" },
  "sidebar.adminPanel": { en: "Admin Panel", ko: "관리자 패널" },
  "sidebar.dashboard": { en: "Dashboard", ko: "대시보드" },
  "sidebar.tokens": { en: "Tokens", ko: "토큰" },
  "sidebar.nftInventory": { en: "NFT Inventory", ko: "NFT 인벤토리" },
  "sidebar.liquidity": { en: "Liquidity", ko: "유동성" },
  "sidebar.orders": { en: "Orders", ko: "주문" },
  "sidebar.kuraMaster": { en: "Kura Master", ko: "쿠라 마스터" },
  "sidebar.collector": { en: "Collector", ko: "수집가" },
  "sidebar.admin": { en: "Admin", ko: "관리자" },
  "sidebar.vintageCurator": { en: "Vintage Curator", ko: "빈티지 큐레이터" },
  "sidebar.newMint": { en: "New Mint", ko: "신규 발행" },
  "sidebar.quickTrade": { en: "Quick Trade", ko: "빠른 거래" },
  "sidebar.kycStatus": { en: "KYC Status", ko: "KYC 상태" },
  "sidebar.adminStatus": { en: "Admin Status", ko: "관리자 상태" },
  "sidebar.tier2": { en: "Tier 2 Verified", ko: "Tier 2 인증" },
  "sidebar.authorized": { en: "Authorized", ko: "권한 보유" },

  // ──────────────────────────────────────────────
  // Footer
  // ──────────────────────────────────────────────
  "footer.tagline": {
    en: "© 2024 KKIKDAGEO. The Digital Kura for Vintage Pu'er.",
    ko: "© 2024 끽다거. 골동보이차의 디지털 보관소.",
  },
  "footer.provenance": { en: "Provenance Protocol", ko: "프로비넌스 프로토콜" },
  "footer.whitepaper": { en: "Whitepaper", ko: "백서" },
  "footer.terms": { en: "Terms of Service", ko: "이용약관" },
  "footer.audit": { en: "Security Audit", ko: "보안 감사" },

  // ──────────────────────────────────────────────
  // Home (/)
  // ──────────────────────────────────────────────
  "home.title": { en: "Portfolio Overview", ko: "포트폴리오 개요" },
  "home.subtitle": {
    en: "Managing your curated collection of Vintage Pu'er and digital liquidity positions.",
    ko: "엄선된 골동보이차와 디지털 유동성 포지션을 한곳에서 관리하세요.",
  },
  "home.globalBalance": { en: "Global Wallet Balance", ko: "통합 지갑 잔액" },
  "home.totalPnl": { en: "Total Profit & Loss", ko: "총 손익" },
  "home.monthlyTarget": { en: "Monthly Growth Target", ko: "월간 성장 목표" },
  "home.stakingAccrual": { en: "Staking Accrual", ko: "스테이킹 누적 보상" },
  "home.annualYield": { en: "Est. Annual Yield", ko: "연 환산 수익률" },
  "home.claimRewards": { en: "Claim Rewards", ko: "보상 수령" },
  "home.compound": { en: "Compound", ko: "재투자" },
  "home.securityStatus": { en: "Security Status", ko: "보안 상태" },
  "home.tier2Verification": { en: "Tier 2 Verification", ko: "Tier 2 인증 완료" },
  "home.tier3Pitch": {
    en: "Upgrade to Tier 3 for institutional limits and priority auction access.",
    ko: "Tier 3로 업그레이드하면 기관 한도와 경매 우선권을 받을 수 있습니다.",
  },
  "home.startUpgrade": { en: "Start Upgrade", ko: "업그레이드 시작" },
  "home.digitalAssets": { en: "Digital Assets Portfolio", ko: "디지털 자산 포트폴리오" },
  "home.allAssets": { en: "All Assets", ko: "전체" },
  "home.teaCakes": { en: "Vintage Pu'er", ko: "골동보이차" },
  "home.liquidity": { en: "Liquidity", ko: "유동성" },
  "home.assetClass": { en: "Asset Class", ko: "자산 종류" },
  "home.allocation": { en: "Allocation", ko: "보유 수량" },
  "home.marketValue": { en: "Market Value", ko: "시장 가치" },
  "home.pnl24h": { en: "P&L (24h)", ko: "손익 (24시간)" },
  "home.action": { en: "Action", ko: "작업" },
  "home.heritageToken": { en: "$KKDA Heritage Token", ko: "$KKDA 헤리티지 토큰" },
  "home.utilityToken": { en: "Native Utility Token", ko: "기본 유틸리티 토큰" },
  "home.lpProvision": { en: "Liquidity Provision", ko: "유동성 공급" },
  "home.vintageNftCake": { en: "Vintage Pu'er NFT", ko: "골동보이차 NFT" },
  "home.provenanceTimeline": { en: "Provenance Timeline", ko: "이력 타임라인" },
  "home.curatorInsight": { en: "Curator's Insight", ko: "큐레이터의 인사이트" },
  "home.curatorQuote": {
    en: "Your portfolio's concentration in 80s Vintage Pu'er shows strong preservation of value. Market trends suggest a 12% uptick in liquidity for aged Menghai varieties next quarter.",
    ko: "1980년대 골동보이차에 집중된 포트폴리오가 가치를 잘 보존하고 있습니다. 시장 흐름을 보면 다음 분기에 숙성 멍하이 계열의 유동성이 약 12% 상승할 것으로 예상됩니다.",
  },
  "home.heritageAdvisory": { en: "Heritage Advisory", ko: "헤리티지 자문단" },
  "home.timeline.acquisitionTitle": {
    en: "Acquisition: 1980s Menghai Raw",
    ko: "취득: 1980년대 멍하이 생차",
  },
  "home.timeline.acquisitionDesc": {
    en: "Verified blockchain transfer from Master Curator #004. Storage moved to HK-Vault 02.",
    ko: "마스터 큐레이터 #004에서 검증된 블록체인 이전. 보관처는 홍콩 보관소 02번으로 이동되었습니다.",
  },
  "home.timeline.kycTitle": {
    en: "KYC Tier 2 Verification Completed",
    ko: "KYC Tier 2 인증 완료",
  },
  "home.timeline.kycDesc": {
    en: "Identity verified for global transactions up to $250,000 USD equivalent.",
    ko: "USD 환산 $250,000까지의 글로벌 거래에 대한 신원이 인증되었습니다.",
  },
  "home.timeline.ledgerTitle": {
    en: "Ledger Account Initialized",
    ko: "원장 계정 생성",
  },
  "home.timeline.ledgerDesc": {
    en: "Welcome to Heritage Ledger. Genesis wallet binding successful.",
    ko: "헤리티지 원장에 오신 것을 환영합니다. 제네시스 지갑이 성공적으로 연결되었습니다.",
  },

  // ──────────────────────────────────────────────
  // NFT Marketplace (/nft)
  // ──────────────────────────────────────────────
  "nft.titlePrefix": { en: "The Marketplace of", ko: "프로비넌스의" },
  "nft.titleAccent": { en: "Provenance", ko: "마켓플레이스" },
  "nft.subtitle": {
    en: "Explore the world's most rare and authenticated Vintage Pu'er. Every token represents a physical cake held in our climate-controlled Kura, verified by the blockchain.",
    ko: "세계에서 가장 희귀하고 인증된 골동보이차를 만나보세요. 모든 토큰은 항온 보관소에 실재하는 골동보이차를 나타내며 블록체인으로 검증됩니다.",
  },
  "nft.sortVintage": { en: "Sort by Vintage", ko: "빈티지 기준 정렬" },
  "nft.sortPrice": { en: "Sort by Price", ko: "가격 기준 정렬" },
  "nft.oldestFirst": { en: "Oldest First", ko: "오래된 순" },
  "nft.newestFirst": { en: "Newest First", ko: "최신 순" },
  "nft.highToLow": { en: "Highest to Lowest", ko: "높은 가격 순" },
  "nft.lowToHigh": { en: "Lowest to Highest", ko: "낮은 가격 순" },
  "nft.masterpiece": { en: "Masterpiece Collection", ko: "마스터피스 컬렉션" },
  "nft.appraisedBy": { en: "Appraised by Master", ko: "마스터 감정" },
  "nft.currentAppraisal": { en: "Current Appraisal", ko: "현재 감정가" },
  "nft.acquireNow": { en: "Acquire Now", ko: "바로 구매" },
  "nft.vintage": { en: "Vintage", ko: "빈티지" },
  "nft.weight": { en: "Weight", ko: "무게" },
  "nft.viewProvenance": { en: "View Provenance", ko: "이력 보기" },
  "nft.placeBid": { en: "Buy Now", ko: "구매하기" },
  "nft.buy": { en: "Buy Now", ko: "구매하기" },
  "nft.buyTitle": { en: "Buy Vintage Pu'er NFT", ko: "골동보이차 NFT 구매" },
  "nft.quantity": { en: "Quantity", ko: "수량" },
  "nft.unitPrice": { en: "Unit price", ko: "단가" },
  "nft.totalPrice": { en: "Total", ko: "합계" },
  "nft.available": { en: "Available", ko: "구매 가능" },
  "nft.sold": { en: "Sold", ko: "판매됨" },
  "nft.payTo": { en: "Pay to (treasury)", ko: "수취 주소 (트레저리)" },
  "nft.confirmPurchase": { en: "Confirm Purchase", ko: "구매 확정" },
  "nft.processingPayment": { en: "Sending USDT…", ko: "USDT 송금 중…" },
  "nft.purchaseSuccess": { en: "Purchase Confirmed", ko: "구매 확정됨" },
  "nft.purchaseSuccessMsg": {
    en: "USDT received. NFT delivery typically completes within 24h.",
    ko: "USDT가 수취되었습니다. NFT는 일반적으로 24시간 내 배송됩니다.",
  },
  "nft.deliveryNote": {
    en: "After payment confirms, the corresponding NFT(s) are transferred to your wallet by the protocol admin. Track delivery status in the order ledger.",
    ko: "결제가 확정되면 해당 NFT가 관리자에 의해 지갑으로 전송됩니다. 배송 상태는 주문 원장에서 확인할 수 있습니다.",
  },
  "nft.connectToBuy": { en: "Connect Wallet", ko: "지갑 연결" },
  "nft.cancel": { en: "Cancel", ko: "취소" },
  "nft.outOfStock": { en: "Sold out", ko: "품절" },
  "nft.selectedProvenance": { en: "Selected Provenance", ko: "선택된 이력" },
  "nft.inquireSale": { en: "Inquire for Private Sale", ko: "프라이빗 판매 문의" },
  "nft.category": { en: "Category", ko: "분류" },
  "nft.gradeLabel": { en: "Grade", ko: "등급" },
  "nft.catAll": { en: "All", ko: "전체" },
  "nft.catRaw": { en: "Raw 청차", ko: "청차" },
  "nft.catRipe": { en: "Ripe 숙차", ko: "숙차" },
  "nft.catAged": { en: "Aged 골동", ko: "골동" },
  "nft.catWhite": { en: "White 백차", ko: "백차" },
  "nft.gradeAll": { en: "All", ko: "전체" },
  "nft.resultsCount": { en: "results", ko: "개 결과" },
  "nft.noResults": {
    en: "No products match the selected filters.",
    ko: "선택한 조건에 맞는 상품이 없습니다.",
  },
  "nft.clearFilters": { en: "Clear filters", ko: "필터 초기화" },

  // ──────────────────────────────────────────────
  // DEX (/dex)
  // ──────────────────────────────────────────────
  "dex.pair": { en: "Vintage $KKDA / USDT", ko: "빈티지 $KKDA / USDT" },
  "dex.provenanceVerified": { en: "PROVENANCE VERIFIED", ko: "프로비넌스 검증 완료" },
  "dex.instantExchange": { en: "Instant Exchange", ko: "즉시 스왑" },
  "dex.youPay": { en: "You Pay", ko: "지급" },
  "dex.youReceive": { en: "You Receive", ko: "수령" },
  "dex.balance": { en: "Balance", ko: "잔액" },
  "dex.minReceived": { en: "Minimum Received", ko: "최소 수령량" },
  "dex.slippage": { en: "Slippage Tolerance", ko: "슬리피지 허용치" },
  "dex.router": { en: "Router", ko: "라우터" },
  "dex.network": { en: "Network", ko: "네트워크" },
  "dex.networkValue": {
    en: "BSC · BEP-20",
    ko: "BSC · BEP-20",
  },
  "dex.routing": { en: "Routing", ko: "라우팅 경로" },
  "dex.routeKkdaUsdt": {
    en: "KKDA ↔ WBNB ↔ USDT (PancakeSwap multi-hop)",
    ko: "KKDA ↔ WBNB ↔ USDT (PancakeSwap 다중 경유)",
  },
  "dex.poolKkdaUsdt": { en: "KKDA · USDT Pool", ko: "KKDA · USDT 풀" },
  "dex.poolStatusPending": {
    en: "Liquidity pending — awaiting admin seed",
    ko: "유동성 대기 중 — 관리자 풀 시딩 필요",
  },
  "dex.poolStatusLive": { en: "Live · trading enabled", ko: "활성 · 거래 가능" },
  "dex.poolNote": {
    en: "Once the admin seeds liquidity, swaps execute against the on-chain LP via PancakeSwap V2. WBNB is BSC's native wrapped-BNB used by the router for multi-hop routing — it is not a token issued by KKIKDAGEO.",
    ko: "관리자가 유동성을 추가하면 PancakeSwap V2의 온체인 LP를 통해 스왑이 실행됩니다. WBNB는 BSC의 기본 래핑 BNB로 라우터의 다중 경유에만 사용되며, 끽다거가 발행한 토큰이 아닙니다.",
  },
  "dex.executeTrade": { en: "Execute Trade", ko: "거래 실행" },
  "dex.awaitingSig": { en: "Awaiting signature…", ko: "서명 대기 중…" },
  "dex.confirming": { en: "Confirming on-chain…", ko: "온체인 확인 중…" },
  "dex.approving": { en: "Approving…", ko: "승인 중…" },
  "dex.approveBtn": { en: "Approve", ko: "승인" },
  "dex.confirmingApproval": { en: "Confirming approval…", ko: "승인 확인 중…" },
  "dex.noLiquidity": {
    en: "No liquidity for this pair on PancakeSwap.",
    ko: "PancakeSwap에 이 페어의 유동성이 없습니다.",
  },
  "dex.invalidAmount": { en: "Invalid Amount", ko: "잘못된 금액" },
  "dex.invalidAmountMsg": {
    en: "Enter a valid amount and wait for the quote.",
    ko: "유효한 금액을 입력하고 견적을 기다려주세요.",
  },
  "dex.swapConfirmed": { en: "Swap Confirmed", ko: "스왑 완료" },
  "dex.swapConfirmedMsg": {
    en: "Your trade was executed on PancakeSwap.",
    ko: "PancakeSwap에서 거래가 체결되었습니다.",
  },
  "dex.performanceIndex": { en: "Performance Index", ko: "성과 지수" },
  "dex.liquidityReservoirs": { en: "Liquidity Reservoirs", ko: "유동성 풀" },
  "dex.apy": { en: "APY", ko: "연 수익률" },
  "dex.mastersNote": { en: "The Master's Note", ko: "마스터의 노트" },
  "dex.mastersNoteText": {
    en: "Like a fine 1990s Menghai cake, $KKDA liquidity matures through patient holding. Each transaction is recorded on the perpetual scroll of the blockchain, ensuring your vintage remains untarnished.",
    ko: "1990년대 멍하이 빈티지처럼 $KKDA 유동성도 인내 있는 보유 속에서 숙성됩니다. 모든 거래는 블록체인의 영속 원장에 기록되어 빈티지의 가치를 변하지 않게 보존합니다.",
  },
  "dex.chiefCurator": { en: "Chief Curator", ko: "수석 큐레이터" },
  "dex.walletNotConnected": { en: "Wallet Not Connected", ko: "지갑 미연결" },
  "dex.walletNotConnectedMsg": {
    en: "Connect your wallet to swap.",
    ko: "스왑하려면 지갑을 연결하세요.",
  },

  // ──────────────────────────────────────────────
  // RWA Vault (/rwa)
  // ──────────────────────────────────────────────
  "rwa.kicker": { en: "Redemption Protocol", ko: "실물 인수 프로토콜" },
  "rwa.title": { en: "The Physical Release.", ko: "실물로의 인수." },
  "rwa.step.select": { en: "Select", ko: "선택" },
  "rwa.step.confirm": { en: "Confirm", ko: "확인" },
  "rwa.step.release": { en: "Release", ko: "인수" },
  "rwa.step.done": { en: "Done", ko: "완료" },
  "rwa.vaultSpecs": { en: "Vault Specifications", ko: "보관소 사양" },
  "rwa.specWeight": { en: "Weight", ko: "무게" },
  "rwa.specStorage": { en: "Storage Conditions", ko: "보관 환경" },
  "rwa.specInspection": { en: "Last Inspection", ko: "최근 점검일" },
  "rwa.specHash": { en: "Blockchain Hash", ko: "블록체인 해시" },
  "rwa.burnTitle": { en: "Burn to Redeem", ko: "소각하여 인수" },
  "rwa.burnDesc": {
    en: "Burning this NFT permanently destroys the digital token and triggers the physical release from our vault.",
    ko: "이 NFT를 소각하면 디지털 토큰이 영구 소멸되고 보관소에서 실물 인수가 시작됩니다.",
  },
  "rwa.initiateRedemption": { en: "Initiate Redemption", ko: "인수 시작" },
  "rwa.vaultStatus": { en: "Vault Status", ko: "보관 상태" },
  "rwa.verifiedInVault": { en: "Verified in Vault", ko: "보관 검증 완료" },
  "rwa.collateralization": { en: "Collateralization", ko: "담보율" },
  "rwa.thirdPartyAudited": {
    en: "Third-party audited reserves",
    ko: "외부 감사 보유고",
  },
  "rwa.auditReport": { en: "Report", ko: "보고서" },
  "rwa.climateControl": {
    en: "Climate-controlled preservation",
    ko: "항온항습 보존",
  },
  "rwa.optimalAging": { en: "Status: Optimal Aging", ko: "상태: 최적 숙성" },
  "rwa.activeDeliveries": { en: "Active Deliveries", ko: "진행 중인 배송" },
  "rwa.carrier": { en: "Carrier", ko: "배송사" },
  "rwa.inTransit": { en: "In Transit", ko: "배송 중" },
  "rwa.outForDelivery": { en: "Out for delivery", ko: "오늘 배송 예정" },
  "rwa.customsCleared": { en: "Customs clearance completed", ko: "통관 완료" },
  "rwa.dispatch": { en: "Vault exit & dispatch", ko: "보관소 출고 및 발송" },
  "rwa.viewTracking": { en: "View Full Tracking", ko: "전체 배송 조회" },
  "rwa.quote": {
    en: "True tea is only realized when it transitions from the vault of memory to the vessel of presence.",
    ko: "진정한 차는 기억의 보관소에서 현재의 잔으로 옮겨질 때 비로소 완성됩니다.",
  },
  "rwa.guide": { en: "Redemption Guide", ko: "인수 안내서" },

  // ──────────────────────────────────────────────
  // Dashboard (/dashboard) — transaction history
  // ──────────────────────────────────────────────
  "dashboard.title": { en: "Transaction History", ko: "거래 내역" },
  "dashboard.subtitle": {
    en: "A complete ledger of your trading activity across the Heritage Exchange.",
    ko: "헤리티지 거래소에서의 모든 거래 내역을 한눈에 확인하세요.",
  },
  "dashboard.totalTrades": { en: "Total Trades", ko: "총 거래" },
  "dashboard.totalVolume": { en: "Total Volume", ko: "총 거래액" },
  "dashboard.avgTradeSize": { en: "Avg Trade Size", ko: "평균 거래 규모" },
  "dashboard.winRate": { en: "Win Rate", ko: "수익 거래율" },
  "dashboard.orderHistory": { en: "Order History", ko: "주문 내역" },
  "dashboard.col.time": { en: "Time", ko: "시각" },
  "dashboard.col.type": { en: "Type", ko: "유형" },
  "dashboard.col.asset": { en: "Asset", ko: "자산" },
  "dashboard.col.amount": { en: "Amount", ko: "수량" },
  "dashboard.col.price": { en: "Price", ko: "가격" },
  "dashboard.col.total": { en: "Total", ko: "합계" },
  "dashboard.col.status": { en: "Status", ko: "상태" },
  "dashboard.col.txHash": { en: "Tx Hash", ko: "트랜잭션 해시" },
  "dashboard.empty": {
    en: "No transactions yet. Start trading to see your history.",
    ko: "거래 내역이 없습니다. 거래를 시작하면 여기에 표시됩니다.",
  },
  "dashboard.recentActivity": { en: "Recent Activity", ko: "최근 활동" },
  "dashboard.bought": { en: "Bought", ko: "매수" },
  "dashboard.sold": { en: "Sold", ko: "매도" },
  "dashboard.noActivity": {
    en: "No activity to display yet.",
    ko: "표시할 활동이 없습니다.",
  },

  // ──────────────────────────────────────────────
  // Staking (/staking)
  // ──────────────────────────────────────────────
  "staking.kicker": { en: "YIELD PROTOCOL", ko: "이자 프로토콜" },
  "staking.title": { en: "Staking & Liquidity", ko: "스테이킹 및 유동성" },
  "staking.totalStaked": { en: "Total Staked", ko: "총 예치액" },
  "staking.avgApy": { en: "Average APY", ko: "평균 연 수익률" },
  "staking.yourStaked": { en: "Your Staked", ko: "내 예치액" },
  "staking.rewardsEarned": { en: "Rewards Earned", ko: "획득 보상" },
  "staking.tvl": { en: "TVL", ko: "총 예치액" },
  "staking.minStake": { en: "Min Stake", ko: "최소 예치" },
  "staking.lock": { en: "Lock", ko: "잠금 기간" },
  "staking.lockDays": { en: "days", ko: "일" },
  "staking.reward": { en: "Reward", ko: "보상 토큰" },
  "staking.stakeNow": { en: "Stake Now", ko: "지금 스테이킹" },
  "staking.poolUtilization": { en: "Pool Utilization", ko: "풀 사용률" },
  "staking.howItWorks": { en: "How Staking Works", ko: "스테이킹 작동 방식" },
  "staking.step1Title": { en: "Select a Pool", ko: "풀 선택" },
  "staking.step1Desc": {
    en: "Browse available staking pools. Each pool has different APY, lock periods, and reward tokens.",
    ko: "이용 가능한 스테이킹 풀을 살펴보세요. 풀마다 APY, 잠금 기간, 보상 토큰이 다릅니다.",
  },
  "staking.step2Title": { en: "Stake Your Tokens", ko: "토큰 예치" },
  "staking.step2Desc": {
    en: "Deposit tokens into the pool. Your funds are locked for the specified period to earn rewards.",
    ko: "풀에 토큰을 예치하세요. 정해진 기간 동안 잠긴 자금이 보상을 발생시킵니다.",
  },
  "staking.step3Title": { en: "Earn Rewards", ko: "보상 수령" },
  "staking.step3Desc": {
    en: "Rewards accrue in real-time and can be claimed after the lock period expires.",
    ko: "보상은 실시간으로 누적되며 잠금 기간이 끝난 후 수령할 수 있습니다.",
  },
  "staking.live": { en: "Live · BSC", ko: "활성 · BSC" },
  "staking.comingSoon": { en: "Coming Soon", ko: "출시 예정" },
  "staking.contractPending": {
    en: "LP staking contract deployment pending",
    ko: "LP 스테이킹 컨트랙트 배포 대기 중",
  },
  "staking.connect": { en: "Connect to stake", ko: "스테이킹하려면 연결" },
  "staking.stakeAmount": { en: "Stake amount", ko: "스테이킹 수량" },
  "staking.approve": { en: "Approve KKDA", ko: "KKDA 승인" },
  "staking.confirmingApprove": { en: "Approving…", ko: "승인 중…" },
  "staking.confirmingStake": { en: "Staking…", ko: "스테이킹 중…" },
  "staking.signing": { en: "Signing…", ko: "서명 중…" },
  "staking.unstake": { en: "Unstake", ko: "언스테이킹" },
  "staking.claim": { en: "Claim Rewards", ko: "보상 수령" },
  "staking.viewContract": { en: "View Contract", ko: "컨트랙트 보기" },
  "staking.notConnected": { en: "—", ko: "—" },
  "staking.successTitle": { en: "Stake Confirmed", ko: "스테이킹 완료" },
  "staking.successMsg": {
    en: "Your stake is now earning rewards.",
    ko: "스테이킹이 시작되어 보상이 누적되고 있습니다.",
  },
  "staking.tokenomicsTitle": { en: "APY Policy", ko: "APY 정책" },
  "staking.tokenomicsLine1": {
    en: "5-year emission program: 5% of total supply (50M KKDA / ~$2.5M FDV) → ≈$500K/year distributed to stakers.",
    ko: "5년 배출 프로그램: 총 발행량의 5% (50M KKDA · FDV $2.5M) → 연 약 $500K가 스테이커에게 분배됩니다.",
  },
  "staking.tokenomicsLine2": {
    en: "Base APY 12% (single-side, no IL risk). LP pools earn an IL premium and lock-duration premium on top.",
    ko: "베이스 APY 12% (단일 자산 · IL 위험 없음). LP 풀은 IL 프리미엄과 락업 기간 프리미엄을 추가로 받습니다.",
  },
  "staking.tokenomicsLine3": {
    en: "Pool-1 APY is read live from STAKING.apy() on-chain. Pool-2/3 use these defaults until their LP-staking contracts deploy.",
    ko: "Pool-1 APY는 온체인의 STAKING.apy()에서 실시간으로 읽습니다. Pool-2/3은 LP 스테이킹 컨트랙트가 배포될 때까지 이 기본값을 사용합니다.",
  },
  "staking.formulaTitle": { en: "Formula", ko: "산출 공식" },
  "staking.formula": {
    en: "APY = annual_emission_USD ÷ pool_TVL_USD — diluted as TVL grows",
    ko: "APY = 연간 배출액(USD) ÷ 풀 TVL(USD) — TVL 증가 시 자연 희석",
  },

  // ──────────────────────────────────────────────
  // Redeem (/redeem)
  // ──────────────────────────────────────────────
  "redeem.kicker": { en: "PHYSICAL REDEMPTION", ko: "실물 인수" },
  "redeem.title": { en: "Redeem Your Asset", ko: "자산 인수하기" },
  "redeem.body": {
    en: "To redeem a tokenized Vintage Pu'er for its physical counterpart, visit the",
    ko: "토큰화된 골동보이차를 실물로 받으시려면 다음 페이지를 방문하세요:",
  },
  "redeem.vaultPage": { en: "Vault page", ko: "보관소 페이지" },

  // ──────────────────────────────────────────────
  // Admin Dashboard (/admin)
  // ──────────────────────────────────────────────
  "admin.executiveDashboard": { en: "Executive Dashboard", ko: "관리자 대시보드" },
  "admin.executiveSubtitle": {
    en: "Overseeing the provenance and minting of Vintage Pu'er assets.",
    ko: "골동보이차 자산의 이력과 발행을 관리합니다.",
  },
  "admin.networkStatus": { en: "NETWORK STATUS", ko: "네트워크 상태" },
  "admin.synchronized": { en: "SYNCHRONIZED", ko: "동기화됨" },
  "admin.totalMintedValue": { en: "Total Minted Value", ko: "총 발행 가치" },
  "admin.assetsBurned": { en: "Assets Burned (Redeemed)", ko: "소각 자산 (인수 완료)" },
  "admin.activeLedgerTokens": { en: "Active Ledger Tokens", ko: "활성 원장 토큰" },
  "admin.units": { en: "Units", ko: "개" },
  "admin.thisMonth": { en: "THIS MONTH", ko: "이번 달" },
  "admin.stable": { en: "STABLE", ko: "안정" },
  "admin.systemOptimal": { en: "System Status: Optimal", ko: "시스템 상태: 최적" },
  "admin.protocolFees": { en: "Protocol Fees", ko: "프로토콜 수수료" },
  "admin.feeNftMinting": { en: "NFT Minting Fee", ko: "NFT 발행 수수료" },
  "admin.feeLiquidity": { en: "Liquidity Swap Fee", ko: "유동성 스왑 수수료" },
  "admin.feeRedemption": { en: "Redemption (Burn) Fee", ko: "인수(소각) 수수료" },
  "admin.updateConfig": { en: "Update Configuration", ko: "설정 업데이트" },
  "admin.recentMintHistory": { en: "Recent Mint History", ko: "최근 발행 내역" },
  "admin.viewLedger": { en: "View Full Ledger", ko: "전체 원장 보기" },
  "admin.col.txHash": { en: "Tx Hash", ko: "트랜잭션 해시" },
  "admin.col.assetName": { en: "Asset Name", ko: "자산명" },
  "admin.col.tokenId": { en: "Token ID", ko: "토큰 ID" },
  "admin.col.value": { en: "Value", ko: "가치" },
  "admin.col.timestamp": { en: "Timestamp", ko: "시각" },
  "admin.col.status": { en: "Status", ko: "상태" },
  "admin.col.vintage": { en: "Vintage", ko: "빈티지" },
  "admin.col.quantity": { en: "Quantity", ko: "수량" },
  "admin.tokenizedInventory": { en: "Tokenized Inventory", ko: "토큰화 인벤토리" },
  "admin.tokenManagement": { en: "Token Management", ko: "토큰 관리" },
  "admin.tokenMgmtDesc": {
    en: "Create, pause, and manage token supply",
    ko: "토큰 생성, 일시중지, 발행량 관리",
  },
  "admin.nftAssetManagement": { en: "NFT / Asset Management", ko: "NFT / 자산 관리" },
  "admin.nftAssetDesc": {
    en: "Manage tokenized Vintage Pu'er inventory",
    ko: "토큰화된 골동보이차 인벤토리 관리",
  },
  "admin.batch": { en: "Batch", ko: "배치" },
  "admin.id": { en: "ID", ko: "ID" },
  "admin.appraisal": { en: "Appraisal", ko: "감정가" },
  "admin.quality": { en: "Quality", ko: "등급" },
  "admin.confirmed": { en: "Confirmed", ko: "확정" },
  "admin.processing": { en: "Processing", ko: "처리 중" },
  "admin.failed": { en: "Failed", ko: "실패" },

  // ──────────────────────────────────────────────
  // Admin NFT Manage (/admin/nft-manage)
  // ──────────────────────────────────────────────
  "adminNft.title": { en: "Tokenized Inventory", ko: "토큰화 인벤토리" },
  "adminNft.mintNew": { en: "Mint New Asset", ko: "신규 발행" },
  "adminNft.cancel": { en: "Cancel", ko: "취소" },
  "adminNft.formTitle": { en: "Mint New NFT", ko: "신규 NFT 발행" },
  "adminNft.name": { en: "Name", ko: "이름" },
  "adminNft.subtitle": { en: "Subtitle / Description", ko: "부제목 / 설명" },
  "adminNft.subtitlePh": { en: "Short description", ko: "간단한 설명" },
  "adminNft.vintageYear": { en: "Vintage Year", ko: "빈티지 연도" },
  "adminNft.weight": { en: "Weight", ko: "무게" },
  "adminNft.factory": { en: "Factory", ko: "제조사" },
  "adminNft.grade": { en: "Grade", ko: "등급" },
  "adminNft.category": { en: "Category", ko: "분류" },
  "adminNft.priceUsd": { en: "Price in USDT", ko: "USDT 가격" },
  "adminNft.tags": { en: "Tags", ko: "태그" },
  "adminNft.tagsPh": { en: "Audited, Rare, Certified", ko: "감사, 희귀, 인증" },
  "adminNft.connectWalletWarn": {
    en: "Connect your wallet to mint on BSC.",
    ko: "BSC에서 발행하려면 지갑을 연결하세요.",
  },
  "adminNft.noMinterRole": { en: "No MINTER_ROLE", ko: "MINTER_ROLE 없음" },
  "adminNft.noMinterRoleMsg": {
    en: "does not hold the MINTER_ROLE on the NFT contract. The transaction will revert. Ask the contract admin to grant this role.",
    ko: "지갑이 NFT 컨트랙트의 MINTER_ROLE을 보유하고 있지 않습니다. 트랜잭션이 실패합니다. 컨트랙트 관리자에게 권한 부여를 요청하세요.",
  },
  "adminNft.mintBtn": { en: "Mint NFT on BSC", ko: "BSC에서 NFT 발행" },
  "adminNft.totalAssets": { en: "Total Assets", ko: "총 자산" },
  "adminNft.totalValue": { en: "Total Value", ko: "총 가치" },
  "adminNft.avgVintage": { en: "Avg Vintage", ko: "평균 빈티지" },
  "adminNft.grid": { en: "Grid", ko: "그리드" },
  "adminNft.list": { en: "List", ko: "리스트" },
  "adminNft.onChain": { en: "On-chain", ko: "온체인" },
  "adminNft.remove": { en: "Remove", ko: "제거" },
  "adminNft.confirmBurn": {
    en: "Burn",
    ko: "소각",
  },
  "adminNft.confirmBurnSuffix": {
    en: "This action is permanent.",
    ko: "이 작업은 되돌릴 수 없습니다.",
  },
  "adminNft.burnSuccess": { en: "NFT Burned", ko: "NFT 소각 완료" },

  // ──────────────────────────────────────────────
  // Admin Tokens (/admin/tokens)
  // ──────────────────────────────────────────────
  "adminTok.title": { en: "Token Management", ko: "토큰 관리" },
  "adminTok.createNew": { en: "Create New Token", ko: "신규 토큰 생성" },
  "adminTok.cancel": { en: "Cancel", ko: "취소" },
  "adminTok.newToken": { en: "New Token", ko: "신규 토큰" },
  "adminTok.name": { en: "Name", ko: "이름" },
  "adminTok.symbol": { en: "Symbol", ko: "심볼" },
  "adminTok.maxSupply": { en: "Max Supply", ko: "최대 공급량" },
  "adminTok.initialSupply": { en: "Initial Supply", ko: "초기 발행량" },
  "adminTok.price": { en: "Price", ko: "가격" },
  "adminTok.category": { en: "Category", ko: "분류" },
  "adminTok.catRwa": { en: "RWA", ko: "실물자산" },
  "adminTok.catUtility": { en: "Utility", ko: "유틸리티" },
  "adminTok.catGov": { en: "Governance", ko: "거버넌스" },
  "adminTok.createBtn": { en: "Create Token", ko: "토큰 생성" },
  "adminTok.detail": { en: "Token Detail", ko: "토큰 상세" },
  "adminTok.col.price": { en: "Price", ko: "가격" },
  "adminTok.col.change": { en: "24h Change", ko: "24시간 변동" },
  "adminTok.col.cap": { en: "Market Cap", ko: "시가총액" },
  "adminTok.col.cat": { en: "Category", ko: "분류" },
  "adminTok.supply": { en: "Supply", ko: "공급량" },
  "adminTok.mintAdditional": { en: "Mint Additional Supply", ko: "추가 발행" },
  "adminTok.onChain": { en: "on-chain", ko: "온체인" },
  "adminTok.mintAmount": { en: "Amount", ko: "수량" },
  "adminTok.mintBtn": { en: "Mint", ko: "발행" },
  "adminTok.signBtn": { en: "Sign…", ko: "서명…" },
  "adminTok.confirmBtn": { en: "Confirm…", ko: "확인…" },
  "adminTok.remaining": { en: "Remaining", ko: "남은 수량" },
  "adminTok.tokensAvailable": { en: "tokens available", ko: "토큰 사용 가능" },
  "adminTok.minterWarn": {
    en: "⚠ Your wallet lacks MINTER_ROLE on this token contract — tx will revert.",
    ko: "⚠ 이 토큰 컨트랙트에 MINTER_ROLE이 없습니다 — 트랜잭션이 실패합니다.",
  },
  "adminTok.contract": { en: "Contract", ko: "컨트랙트" },
  "adminTok.pause": { en: "Pause Token", ko: "토큰 일시중지" },
  "adminTok.resume": { en: "Resume Token", ko: "토큰 재개" },
  "adminTok.delete": { en: "Delete Token", ko: "토큰 삭제" },
  "adminTok.selectMsg": {
    en: "Select a token to view details",
    ko: "토큰을 선택하면 상세 정보가 표시됩니다",
  },
  "adminTok.active": { en: "Active", ko: "활성" },
  "adminTok.paused": { en: "Paused", ko: "일시중지" },
  "adminTok.vol24h": { en: "Vol 24h", ko: "24시간 거래량" },

  // ──────────────────────────────────────────────
  // Admin Orders / Fulfillment (/admin/orders)
  // ──────────────────────────────────────────────
  "orders.title": { en: "Purchase Orders", ko: "구매 주문" },
  "orders.subtitle": {
    en: "Track on-chain USDT payments from marketplace buyers and dispatch the corresponding NFTs.",
    ko: "마켓플레이스 구매자의 온체인 USDT 결제를 추적하고 해당 NFT를 발송합니다.",
  },
  "orders.totalRevenue": { en: "Lifetime Revenue", ko: "누적 매출" },
  "orders.totalOrders": { en: "Total Orders", ko: "전체 주문" },
  "orders.pending": { en: "Pending", ko: "배송 대기" },
  "orders.delivered": { en: "Delivered", ko: "배송 완료" },
  "orders.pendingFulfillment": { en: "Pending Fulfillment", ko: "배송 대기 주문" },
  "orders.deliveredLedger": { en: "Delivered Ledger", ko: "배송 완료 원장" },
  "orders.noPending": {
    en: "No pending orders. All buyers have been fulfilled.",
    ko: "대기 중인 주문이 없습니다. 모든 구매자에게 발송 완료.",
  },
  "orders.viewPayment": { en: "Payment Tx", ko: "결제 트랜잭션" },
  "orders.buyer": { en: "Buyer Wallet", ko: "구매자 지갑" },
  "orders.suggestedTokenIds": { en: "Suggested tokenIds to deliver", ko: "배송할 tokenId 제안" },
  "orders.deliveryHelp": {
    en: "Open the NFT contract on BSCScan and call safeTransferFrom for each suggested tokenId, sending to the buyer wallet. Then mark this order as delivered.",
    ko: "BSCScan에서 NFT 컨트랙트를 열고 각 제안된 tokenId에 대해 safeTransferFrom을 호출하여 구매자 지갑으로 전송한 뒤 이 주문을 배송 완료로 표시하세요.",
  },
  "orders.openContract": { en: "Open Contract", ko: "컨트랙트 열기" },
  "orders.markDelivered": { en: "Mark Delivered", ko: "배송 완료 표시" },
  "orders.col.time": { en: "Time", ko: "시각" },
  "orders.col.product": { en: "Product", ko: "상품" },
  "orders.col.qty": { en: "Qty", ko: "수량" },
  "orders.col.total": { en: "Total", ko: "합계" },
  "orders.col.buyer": { en: "Buyer", ko: "구매자" },
  "orders.col.tokens": { en: "Token IDs", ko: "토큰 ID" },

  // ──────────────────────────────────────────────
  // Admin Liquidity Seeding (/admin/liquidity)
  // ──────────────────────────────────────────────
  "liq.title": { en: "Liquidity Management", ko: "유동성 관리" },
  "liq.subtitle": {
    en: "Seed and manage the KKDA-USDT pool on PancakeSwap V2 directly from this panel. The first deposit sets the initial price.",
    ko: "이 패널에서 PancakeSwap V2의 KKDA-USDT 풀을 직접 시딩하고 관리합니다. 최초 예치 비율이 초기 가격을 결정합니다.",
  },
  "liq.amount": { en: "Amount", ko: "수량" },
  "liq.seedInitial": { en: "Seed Initial Liquidity", ko: "초기 유동성 시딩" },
  "liq.addMore": { en: "Add Liquidity", ko: "유동성 추가" },
  "liq.seedShort": { en: "Seed Pool", ko: "풀 시딩" },
  "liq.addMoreShort": { en: "Add", ko: "추가" },
  "liq.approveKkda": { en: "Approve KKDA", ko: "KKDA 승인" },
  "liq.approveUsdt": { en: "Approve USDT", ko: "USDT 승인" },
  "liq.approved": { en: "Approved", ko: "승인됨" },
  "liq.priceWillBe": { en: "Initial price will be", ko: "초기 가격" },
  "liq.priceImplied": { en: "Implied price", ko: "암묵 가격" },
  "liq.reserveKkda": { en: "KKDA reserve", ko: "KKDA 예치량" },
  "liq.reserveUsdt": { en: "USDT reserve", ko: "USDT 예치량" },
  "liq.viewPair": { en: "View Pair", ko: "페어 보기" },
  "liq.addSuccess": { en: "Liquidity Added", ko: "유동성 추가 완료" },
  "liq.addSuccessMsg": {
    en: "Pool reserves updated on PancakeSwap V2.",
    ko: "PancakeSwap V2의 풀 예치량이 업데이트되었습니다.",
  },
  "liq.helpText": {
    en: "After this transaction confirms, swaps on /dex execute against this pool. Initial seed sets the price (e.g. 1,000,000 KKDA + 50,000 USDT → $0.05/KKDA). Subsequent additions must match the current ratio within slippage.",
    ko: "트랜잭션이 확정되면 /dex 페이지의 스왑이 이 풀을 통해 실행됩니다. 초기 시딩 비율이 가격을 결정합니다 (예: 1,000,000 KKDA + 50,000 USDT → $0.05/KKDA). 이후 추가 시에는 현재 비율과 일치해야 합니다.",
  },

  // ──────────────────────────────────────────────
  // AdminGuard
  // ──────────────────────────────────────────────
  "guard.restricted": { en: "Restricted Area", ko: "제한 구역" },
  "guard.adminOnly": { en: "Admin Access Only", ko: "관리자 전용" },
  "guard.adminPitch": {
    en: "This section manages tokenized assets and protocol parameters. Connect a wallet that holds the admin role to continue.",
    ko: "이 영역에서는 토큰화된 자산과 프로토콜 설정을 관리합니다. 관리자 권한을 가진 지갑을 연결하세요.",
  },
  "guard.verifying": { en: "Verifying admin role on-chain…", ko: "온체인에서 관리자 권한을 확인 중…" },
  "guard.denied": { en: "Access Denied", ko: "접근 거부" },
  "guard.insufficient": { en: "Insufficient Privileges", ko: "권한 부족" },
  "guard.notAdminMsg": {
    en: "The connected wallet does not hold the admin role on this protocol. Token issuance, NFT minting, and configuration tools are restricted to authorized curators.",
    ko: "연결된 지갑은 이 프로토콜의 관리자 권한이 없습니다. 토큰 발행, NFT 민팅, 설정 변경은 권한을 가진 큐레이터만 사용할 수 있습니다.",
  },
  "guard.connected": { en: "Connected Wallet", ko: "연결된 지갑" },

  // ──────────────────────────────────────────────
  // TxStatus
  // ──────────────────────────────────────────────
  "tx.status": { en: "Transaction Status", ko: "트랜잭션 상태" },
  "tx.awaiting": { en: "Awaiting wallet signature…", ko: "지갑 서명 대기 중…" },
  "tx.confirming": { en: "Confirming on-chain…", ko: "온체인 확인 중…" },
  "tx.confirmed": { en: "Transaction confirmed", ko: "트랜잭션 완료" },
  "tx.failed": { en: "Transaction failed", ko: "트랜잭션 실패" },
  "tx.viewBscscan": { en: "View on BSCScan", ko: "BSCScan에서 보기" },
} as const;

export type TranslationKey = keyof typeof translations;
