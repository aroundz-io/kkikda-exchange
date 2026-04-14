@AGENTS.md

# KKIKDAGEO (끽다거) - Digital Kura Exchange

## Project Overview
빈티지 보이차 RWA 크립토 거래소. BSC(BNB Smart Chain) 기반으로 실물 보이차를 토큰화하여 거래.
- **도메인**: kkikdageo.io
- **배포**: Vercel (자동 배포, master push 시 트리거)
- **GitHub**: aroundz-io/kkikda-exchange

## Tech Stack
- Next.js 16.2.3 (App Router, Turbopack)
- Tailwind CSS v4 (`@theme inline` 필수 - Next.js용)
- Zustand (persist middleware) - 상태관리
- Framer Motion - 애니메이션
- wagmi v2.19.5 + @rainbow-me/rainbowkit v2.2.10 - 지갑 연결
- BSC Testnet (Chain ID: 97)

## Design System (Heritage Ledger)
- **폰트**: Noto Serif (headline) + Manrope (body) + Space Grotesk (label)
- **Primary**: #f3bb90, **Surface**: #131315, **Secondary**: #b7ccb9
- **Border Radius**: 0px (전체), **Border**: 0.5px hairline
- **Material Design 3** surface token 네이밍 컨벤션
- 7개 참조 HTML/CSS 디자인을 픽셀 단위로 포팅함

## Layout Architecture
- `layout.tsx`: 고정 TopNav + 고정 Sidebar(w-64) + main(`ml-0 lg:ml-64 pt-20 overflow-x-hidden`)
- **중요**: 각 페이지에서 절대 `<main>` 태그 중첩 금지, `max-w-*` + `mx-auto` 사용 금지
- 모든 페이지 래퍼: `<div className="p-6 lg:p-10">`

## Pages (Routes)
| Route | 설명 |
|-------|------|
| `/` | Portfolio Overview - 자산 현황, P&L, 스테이킹, 보안 상태 |
| `/dex` | DEX Exchange - 스왑 위젯, 가격 차트, 유동성 풀 |
| `/nft` | NFT Marketplace - 보이차 NFT 마켓플레이스, 입찰 |
| `/rwa` | RWA Vault - 실물 교환(Burn to Redeem), 보관 상태 |
| `/admin` | Admin Dashboard - 민팅 현황, 수수료 설정, 재고 |
| `/dashboard` | Transaction History - 거래 내역, 활동 타임라인 |
| `/staking` | Staking & Liquidity - 풀 목록, APY, 스테이킹 |

## Key Files
- `src/app/globals.css` - 전체 디자인 토큰 (@theme inline)
- `src/stores/useStore.ts` - Zustand 스토어 (6개 데모 보이차, 2 토큰, 3 풀)
- `src/components/layout/` - Navbar, Sidebar, Footer
- `src/lib/web3/` - wagmi config, provider

## Known Issues / TODO
- 스마트 컨트랙트 실제 연동 (현재 데모 데이터)
- BSCScan 컨트랙트 검증
- 모바일 반응형 세부 조정

## Commands
```bash
npm run dev      # 개발서버 (port 3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint
```
