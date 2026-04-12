"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useStore } from "@/stores/useStore";
import { t, formatNumber, formatPercent } from "@/lib/i18n";

/* ─── helpers ─── */

function seed(s: number) {
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateChartData(basePrice: number, points = 96) {
  const rng = seed(Math.round(basePrice * 100));
  const data: { time: string; price: number }[] = [];
  let price = basePrice * 0.92;
  for (let i = 0; i < points; i++) {
    const hour = Math.floor(i / 4);
    const min = (i % 4) * 15;
    price += (rng() - 0.48) * basePrice * 0.012;
    price = Math.max(price, basePrice * 0.82);
    data.push({
      time: `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`,
      price: +price.toFixed(4),
    });
  }
  // nudge last point toward current price
  data[data.length - 1].price = basePrice;
  return data;
}

function generateOrderbook(basePrice: number) {
  const rng = seed(Math.round(basePrice * 1000 + 7));
  const bids: { price: number; amount: number; total: number }[] = [];
  const asks: { price: number; amount: number; total: number }[] = [];

  let bidTotal = 0;
  for (let i = 0; i < 10; i++) {
    const price = +(basePrice - (i + 1) * basePrice * 0.003 - rng() * basePrice * 0.001).toFixed(4);
    const amount = +(50 + rng() * 500).toFixed(2);
    bidTotal += amount;
    bids.push({ price, amount, total: +bidTotal.toFixed(2) });
  }

  let askTotal = 0;
  for (let i = 0; i < 10; i++) {
    const price = +(basePrice + (i + 1) * basePrice * 0.003 + rng() * basePrice * 0.001).toFixed(4);
    const amount = +(50 + rng() * 500).toFixed(2);
    askTotal += amount;
    asks.push({ price, amount, total: +askTotal.toFixed(2) });
  }

  return { bids, asks };
}

function generateRecentTrades(basePrice: number) {
  const rng = seed(Math.round(basePrice * 777));
  const trades: { price: number; amount: number; time: string; side: "buy" | "sell" }[] = [];
  for (let i = 0; i < 15; i++) {
    const side = rng() > 0.5 ? "buy" : "sell";
    const price = +(basePrice + (rng() - 0.5) * basePrice * 0.01).toFixed(4);
    const amount = +(10 + rng() * 300).toFixed(2);
    const h = Math.floor(rng() * 24);
    const m = Math.floor(rng() * 60);
    const s = Math.floor(rng() * 60);
    trades.push({
      price,
      amount,
      time: `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`,
      side,
    });
  }
  return trades.sort((a, b) => (a.time > b.time ? -1 : 1));
}

/* ─── component ─── */

export default function DexPage() {
  const { lang, tokens, user, connectWallet, placeOrder, orders } = useStore();

  const [activePairId, setActivePairId] = useState(tokens[0]?.id ?? "kkd");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [orderType, setOrderType] = useState<"limit" | "market">("limit");
  const [priceInput, setPriceInput] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [pairSearch, setPairSearch] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const activeToken = tokens.find((tk) => tk.id === activePairId) ?? tokens[0];

  const filteredTokens = useMemo(
    () =>
      tokens.filter(
        (tk) =>
          tk.symbol.toLowerCase().includes(pairSearch.toLowerCase()) ||
          tk.name.toLowerCase().includes(pairSearch.toLowerCase()),
      ),
    [tokens, pairSearch],
  );

  const chartData = useMemo(() => generateChartData(activeToken.price), [activeToken.price]);
  const orderbook = useMemo(() => generateOrderbook(activeToken.price), [activeToken.price]);
  const recentTrades = useMemo(() => generateRecentTrades(activeToken.price), [activeToken.price]);

  const price24hHigh = useMemo(
    () => Math.max(...chartData.map((d) => d.price)),
    [chartData],
  );
  const price24hLow = useMemo(
    () => Math.min(...chartData.map((d) => d.price)),
    [chartData],
  );

  const effectivePrice =
    orderType === "market"
      ? activeToken.price
      : priceInput
        ? parseFloat(priceInput)
        : 0;
  const amount = amountInput ? parseFloat(amountInput) : 0;
  const total = effectivePrice * amount;

  const handlePercentage = useCallback(
    (pct: number) => {
      if (!user.address) return;
      if (side === "buy" && effectivePrice > 0) {
        const maxSpend = user.balance * 2450 * pct; // rough USDT equivalent
        setAmountInput((maxSpend / effectivePrice).toFixed(2));
      } else {
        // sell: use a demo token balance
        const demoBalance = 1250;
        setAmountInput((demoBalance * pct).toFixed(2));
      }
    },
    [side, effectivePrice, user],
  );

  const handlePlaceOrder = useCallback(() => {
    if (!user.address || amount <= 0) return;
    placeOrder({
      type: side,
      token: activeToken.symbol,
      amount,
      price: effectivePrice,
      total,
    });
    setAmountInput("");
    setOrderPlaced(true);
    setTimeout(() => setOrderPlaced(false), 2000);
  }, [user.address, amount, placeOrder, side, activeToken.symbol, effectivePrice, total]);

  // sync price input when switching pairs
  const selectPair = useCallback(
    (id: string) => {
      setActivePairId(id);
      const tk = tokens.find((x) => x.id === id);
      if (tk) setPriceInput(tk.price.toFixed(4));
      setAmountInput("");
    },
    [tokens],
  );

  // initialise price input
  useMemo(() => {
    if (!priceInput && activeToken) setPriceInput(activeToken.price.toFixed(4));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const maxBidTotal = Math.max(...orderbook.bids.map((b) => b.total));
  const maxAskTotal = Math.max(...orderbook.asks.map((a) => a.total));

  return (
    <div className="min-h-screen bg-surface">
      {/* ─── Header bar ─── */}
      <div className="border-b border-outline-ghost bg-surface-low">
        <div className="max-w-[1800px] mx-auto px-3 py-2 flex items-center gap-6 overflow-x-auto">
          <h1 className="text-serif text-lg font-bold text-primary whitespace-nowrap">
            {activeToken.symbol}/USDT
          </h1>
          <span
            className={`font-mono text-xl font-bold ${
              activeToken.change24h >= 0 ? "text-secondary" : "text-error"
            }`}
          >
            ${activeToken.price.toFixed(4)}
          </span>
          <span
            className={`font-mono text-xs ${
              activeToken.change24h >= 0 ? "text-secondary" : "text-error"
            }`}
          >
            {formatPercent(activeToken.change24h)}
          </span>
          <div className="hidden sm:flex items-center gap-4 text-xs text-on-surface-mid font-mono">
            <span>
              24h High{" "}
              <span className="text-on-surface">${price24hHigh.toFixed(4)}</span>
            </span>
            <span>
              24h Low{" "}
              <span className="text-on-surface">${price24hLow.toFixed(4)}</span>
            </span>
            <span>
              24h Vol{" "}
              <span className="text-on-surface">
                {formatNumber(activeToken.volume24h)}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* ─── Main grid ─── */}
      <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-[240px_1fr_320px] xl:grid-cols-[260px_1fr_340px] gap-0 lg:gap-px bg-outline-ghost">
        {/* ─── LEFT: Pair list ─── */}
        <aside className="bg-surface-low order-3 lg:order-1 border-t lg:border-t-0 border-outline-ghost">
          <div className="p-3 border-b border-outline-ghost">
            <input
              type="text"
              value={pairSearch}
              onChange={(e) => setPairSearch(e.target.value)}
              placeholder="Search pairs..."
              className="input-scholar text-xs"
            />
          </div>
          <div className="divide-y divide-outline-ghost max-h-[calc(100vh-200px)] overflow-y-auto">
            {filteredTokens.map((tk) => (
              <button
                key={tk.id}
                onClick={() => selectPair(tk.id)}
                className={`w-full text-left px-3 py-2.5 flex items-center justify-between transition-colors ${
                  tk.id === activePairId
                    ? "bg-primary-dim"
                    : "hover:bg-surface-mid"
                }`}
              >
                <div>
                  <span
                    className={`font-mono text-sm font-semibold ${
                      tk.id === activePairId ? "text-primary" : "text-on-surface"
                    }`}
                  >
                    {tk.symbol}
                  </span>
                  <span className="text-on-surface-dim text-xs ml-1">/USDT</span>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs text-on-surface">
                    ${tk.price.toFixed(2)}
                  </div>
                  <div
                    className={`font-mono text-[10px] ${
                      tk.change24h >= 0 ? "text-secondary" : "text-error"
                    }`}
                  >
                    {formatPercent(tk.change24h)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* ─── CENTER: Chart ─── */}
        <div className="bg-surface order-1 lg:order-2 flex flex-col">
          {/* Chart */}
          <div className="flex-1 min-h-[320px] lg:min-h-[420px] p-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f3bb90" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#f3bb90" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#5A5955", fontSize: 10, fontFamily: "Space Grotesk" }}
                  interval={11}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#5A5955", fontSize: 10, fontFamily: "Space Grotesk" }}
                  orientation="right"
                  width={60}
                  tickFormatter={(v: number) => `$${v.toFixed(2)}`}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1A1A1E",
                    border: "1px solid #4e4542",
                    borderRadius: 0,
                    fontFamily: "Space Grotesk",
                    fontSize: 12,
                    color: "#E8E6E1",
                  }}
                  labelStyle={{ color: "#9B9A95" }}
                  formatter={(value) => [`$${Number(value).toFixed(4)}`, "Price"]}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#f3bb90"
                  strokeWidth={1.5}
                  fill="url(#chartGrad)"
                  animationDuration={800}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* ─── BOTTOM: Orderbook + Recent trades ─── */}
          <div className="border-t border-outline-ghost grid grid-cols-1 md:grid-cols-2 gap-px bg-outline-ghost">
            {/* Order book */}
            <div className="bg-surface-low p-3">
              <h3 className="text-serif text-sm font-bold text-on-surface mb-2">
                {t("trade.orderbook", lang)}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {/* Bids */}
                <div>
                  <div className="grid grid-cols-3 text-[10px] text-on-surface-dim font-mono mb-1">
                    <span>{t("trade.price", lang)}</span>
                    <span className="text-right">{t("trade.amount", lang)}</span>
                    <span className="text-right">{t("trade.total", lang)}</span>
                  </div>
                  {orderbook.bids.map((row, i) => (
                    <div
                      key={i}
                      className="relative grid grid-cols-3 text-[11px] font-mono py-0.5"
                    >
                      <div
                        className="absolute inset-0 bg-secondary opacity-[0.06]"
                        style={{ width: `${(row.total / maxBidTotal) * 100}%` }}
                      />
                      <span className="relative text-secondary">{row.price.toFixed(4)}</span>
                      <span className="relative text-on-surface text-right">
                        {row.amount.toFixed(2)}
                      </span>
                      <span className="relative text-on-surface-dim text-right">
                        {row.total.toFixed(0)}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Asks */}
                <div>
                  <div className="grid grid-cols-3 text-[10px] text-on-surface-dim font-mono mb-1">
                    <span>{t("trade.price", lang)}</span>
                    <span className="text-right">{t("trade.amount", lang)}</span>
                    <span className="text-right">{t("trade.total", lang)}</span>
                  </div>
                  {orderbook.asks.map((row, i) => (
                    <div
                      key={i}
                      className="relative grid grid-cols-3 text-[11px] font-mono py-0.5"
                    >
                      <div
                        className="absolute inset-0 right-0 left-auto bg-error opacity-[0.06]"
                        style={{ width: `${(row.total / maxAskTotal) * 100}%` }}
                      />
                      <span className="relative text-error">{row.price.toFixed(4)}</span>
                      <span className="relative text-on-surface text-right">
                        {row.amount.toFixed(2)}
                      </span>
                      <span className="relative text-on-surface-dim text-right">
                        {row.total.toFixed(0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent trades */}
            <div className="bg-surface-low p-3">
              <h3 className="text-serif text-sm font-bold text-on-surface mb-2">
                Recent Trades
              </h3>
              <div className="grid grid-cols-4 text-[10px] text-on-surface-dim font-mono mb-1">
                <span>{t("trade.price", lang)}</span>
                <span className="text-right">{t("trade.amount", lang)}</span>
                <span className="text-right">{t("trade.total", lang)}</span>
                <span className="text-right">Time</span>
              </div>
              <div className="max-h-[220px] overflow-y-auto">
                {recentTrades.map((tr, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-4 text-[11px] font-mono py-0.5"
                  >
                    <span className={tr.side === "buy" ? "text-secondary" : "text-error"}>
                      {tr.price.toFixed(4)}
                    </span>
                    <span className="text-on-surface text-right">
                      {tr.amount.toFixed(2)}
                    </span>
                    <span className="text-on-surface-dim text-right">
                      {(tr.price * tr.amount).toFixed(0)}
                    </span>
                    <span className="text-on-surface-dim text-right">{tr.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── RIGHT: Trade form ─── */}
        <aside className="bg-surface-low order-2 lg:order-3 border-t lg:border-t-0 border-outline-ghost">
          <div className="p-4 flex flex-col gap-4">
            {/* Buy / Sell tabs */}
            <div className="grid grid-cols-2 gap-0">
              {(["buy", "sell"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSide(s)}
                  className={`relative py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-colors ${
                    side === s
                      ? s === "buy"
                        ? "text-surface bg-secondary"
                        : "text-surface bg-error"
                      : "text-on-surface-mid bg-surface-mid hover:bg-surface-high"
                  }`}
                >
                  {t(s === "buy" ? "trade.buy" : "trade.sell", lang)}
                  {side === s && (
                    <motion.div
                      layoutId="side-indicator"
                      className={`absolute bottom-0 left-0 right-0 h-[2px] ${
                        s === "buy" ? "bg-secondary" : "bg-error"
                      }`}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Limit / Market toggle */}
            <div className="flex gap-2">
              {(["limit", "market"] as const).map((ot) => (
                <button
                  key={ot}
                  onClick={() => setOrderType(ot)}
                  className={`px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider transition-colors ${
                    orderType === ot
                      ? "text-primary border-b border-primary"
                      : "text-on-surface-dim hover:text-on-surface"
                  }`}
                >
                  {ot}
                </button>
              ))}
            </div>

            {/* Price input */}
            <AnimatePresence mode="wait">
              {orderType === "limit" && (
                <motion.div
                  key="limit-price"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <label className="text-[10px] text-on-surface-dim font-mono uppercase tracking-wider">
                    {t("trade.price", lang)} (USDT)
                  </label>
                  <input
                    type="number"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    placeholder="0.00"
                    className="input-scholar text-sm mt-1"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {orderType === "market" && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-on-surface-dim font-mono uppercase tracking-wider">
                  Market Price
                </span>
                <span className="font-mono text-sm text-primary">
                  ${activeToken.price.toFixed(4)}
                </span>
              </div>
            )}

            {/* Amount input */}
            <div>
              <label className="text-[10px] text-on-surface-dim font-mono uppercase tracking-wider">
                {t("trade.amount", lang)} ({activeToken.symbol})
              </label>
              <input
                type="number"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                placeholder="0.00"
                className="input-scholar text-sm mt-1"
              />
            </div>

            {/* Percentage buttons */}
            <div className="grid grid-cols-4 gap-1.5">
              {[0.25, 0.5, 0.75, 1].map((pct) => (
                <button
                  key={pct}
                  onClick={() => handlePercentage(pct)}
                  className="btn-ghost py-1.5 text-[10px] font-mono"
                >
                  {pct * 100}%
                </button>
              ))}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between py-2 border-t border-outline-ghost">
              <span className="text-xs text-on-surface-dim font-mono uppercase">
                {t("trade.total", lang)}
              </span>
              <span className="font-mono text-sm text-on-surface">
                ${total > 0 ? total.toFixed(2) : "0.00"}{" "}
                <span className="text-on-surface-dim text-[10px]">USDT</span>
              </span>
            </div>

            {/* Place order button */}
            {user.address ? (
              <motion.button
                onClick={handlePlaceOrder}
                whileTap={{ scale: 0.97 }}
                disabled={amount <= 0 || (orderType === "limit" && effectivePrice <= 0)}
                className={`w-full py-3 text-xs font-mono font-bold uppercase tracking-wider transition-opacity ${
                  side === "buy"
                    ? "bg-secondary text-surface"
                    : "bg-error text-surface"
                } ${
                  amount <= 0 || (orderType === "limit" && effectivePrice <= 0)
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:opacity-90 cursor-pointer"
                }`}
              >
                <AnimatePresence mode="wait">
                  {orderPlaced ? (
                    <motion.span
                      key="placed"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                    >
                      Order Placed!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="place"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                    >
                      {side === "buy" ? t("trade.buy", lang) : t("trade.sell", lang)}{" "}
                      {activeToken.symbol}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            ) : (
              <button onClick={connectWallet} className="btn-gold w-full py-3 text-xs">
                Connect Wallet to Trade
              </button>
            )}

            {/* Mini account info */}
            {user.address && (
              <div className="mt-2 p-3 bg-surface-mid">
                <div className="flex items-center justify-between text-[10px] font-mono text-on-surface-dim uppercase mb-1.5">
                  <span>Available Balance</span>
                </div>
                <div className="font-mono text-sm text-on-surface">
                  {user.balance.toFixed(4)} ETH
                </div>
                <div className="font-mono text-[10px] text-on-surface-dim mt-0.5">
                  ~ ${(user.balance * 2450).toFixed(2)} USDT
                </div>
              </div>
            )}

            {/* Open orders */}
            <div className="mt-2">
              <h4 className="text-serif text-xs font-bold text-on-surface-mid mb-2">
                Open Orders
              </h4>
              {orders.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-xs text-on-surface-dim font-mono">No open orders</p>
                </div>
              ) : (
                <div className="max-h-[200px] overflow-y-auto divide-y divide-outline-ghost">
                  {orders.map((order, i) => (
                    <div key={i} className="py-2 flex items-center justify-between text-[11px] font-mono">
                      <div>
                        <span className={order.type === "buy" ? "text-secondary" : "text-error"}>
                          {order.type.toUpperCase()}
                        </span>
                        <span className="text-on-surface ml-1.5">{order.token}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-on-surface">{order.amount} @ ${order.price.toFixed(4)}</div>
                        <div className="text-on-surface-dim text-[10px]">${order.total.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
