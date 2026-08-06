# Position Pro 📊

An offline-first position size calculator for leveraged trading. Enter the amount you're willing to lose, your entry price and your stop-loss — it tells you how large a position to open.

**One codebase, two targets:** installable PWA *and* Chrome extension popup.

> 中文說明見下方 [中文](#中文說明)

---

## The idea

Position sizing is the one calculation that decides whether a losing streak is survivable, and it's the one traders most often eyeball. The rule is simple — risk a fixed amount per trade, not a fixed position size — but doing the arithmetic under time pressure, on a phone, with an eight-decimal altcoin price, is exactly when people get it wrong.

```
price distance   = |entry − stop loss|
position size    = risk amount / price distance
direction        = entry > stop loss ? LONG : SHORT
```

Worked example: risk 200 USDT, entry 100, stop 95 → distance 5, LONG, size **40.0000**.

## Design decisions

- **Arbitrary-precision arithmetic.** Uses [bignumber.js](https://github.com/MikeMcl/bignumber.js) rather than JS floats. `0.1 + 0.2 !== 0.3` is a curiosity in most apps; in a tool that sizes real money against eight-decimal prices, it is a bug waiting to happen.
- **Rounds down, never up.** Position size floors to 4 decimals (`ROUND_FLOOR`). Rounding up would risk fractionally *more* than the amount you specified — the one direction of error this tool must never make.
- **Offline first.** A cache-first service worker precaches every asset. The calculator is most needed on a phone, on the move, on bad signal.
- **Environment-adaptive storage.** `storage.js` detects `chrome.storage` and falls back to `localStorage`, so the same source runs as a PWA and as an extension popup with no build step and no branching in the app code.
- **No build, no dependencies to install.** Plain HTML/CSS/JS. Clone and serve.

## Run it

Static files — but service workers need `http(s)` or `localhost`, so `file://` won't work:

```bash
python -m http.server 8080   # or: npx serve .
```

Then open `http://localhost:8080/`.

**Install as a PWA:** open in Chrome/Edge → install icon in the address bar → runs standalone, works offline.

**Install as a Chrome extension:** `chrome://extensions` → enable Developer mode → *Load unpacked* → select this folder. `manifest.json` is the MV3 extension manifest; `manifest.webmanifest` is the PWA one. Two different files, both intentional.

## Files

| File | Role |
|---|---|
| `index.html` / `style.css` | UI (glassmorphism, dark) |
| `calculator.js` | calculation + validation |
| `storage.js` | `chrome.storage` ⇄ `localStorage` adapter |
| `sw.js` | cache-first service worker (`position-pro-v2`) |
| `manifest.webmanifest` | PWA manifest — 128/192/512 icons, 512 marked `any maskable` |
| `manifest.json` | Chrome MV3 extension manifest |
| `bignumber.js` | vendored [bignumber.js](https://github.com/MikeMcl/bignumber.js) (MIT, © Michael Mclaughlin) |

## Known limitations

- The webfont loads from Google Fonts and is **not** precached, so offline the UI falls back to the system sans-serif. Layout and every calculation still work.
- Single pair at a time, manual price entry — no exchange price feed.
- Fixed-fractional sizing only. No Kelly, no volatility-scaled sizing.
- Not audited, not financial advice. Check the number before you send the order.

## License

MIT — see [LICENSE](LICENSE). Vendored `bignumber.js` is MIT, © Michael Mclaughlin.

---

## 中文說明

**離線優先的交易倉位計算機。** 輸入「這筆最多願意賠多少」「入場價」「止損價」，算出該開多大的倉位。同一份程式碼同時是 **PWA** 和 **Chrome 擴充功能**。

**為什麼做這個**：倉位大小是決定一段連敗撐不撐得過去的關鍵計算，卻也是最多人用目測的。規則本身很簡單——每筆固定賠固定金額，而不是固定開一樣大的倉——但在盤中、用手機、面對一個小數點後八位的幣價時手算，正好就是最容易算錯的時候。

```
價格距離 = |入場價 − 止損價|
開倉數量 = 止損金額 / 價格距離
方向     = 入場價 > 止損價 ? 做多 : 做空
```

**幾個刻意的設計**：

- **用 bignumber.js 而不是 JS 原生浮點數**。`0.1 + 0.2 !== 0.3` 在多數應用裡只是趣聞，但在拿真錢對八位小數報價算倉位的工具裡，它就是等著發生的 bug。
- **只無條件捨去，絕不進位**。開倉數量捨去到小數點後 4 位（`ROUND_FLOOR`）。進位會讓實際風險**超過**你設定的金額——這是這支工具唯一不能犯的方向性錯誤。
- **離線優先**。cache-first service worker 預快取所有資源，因為最需要它的場合就是手機、移動中、訊號差的時候。
- **環境自適應儲存**。`storage.js` 偵測 `chrome.storage`，沒有就退回 `localStorage`，所以同一份原始碼不用打包、不用在應用邏輯裡分支，就能同時當 PWA 和擴充功能跑。

**執行**：純靜態檔案，但 Service Worker 需要 `http(s)` 或 `localhost`，不能直接 `file://` 開。

```bash
python -m http.server 8080   # 或 npx serve .
```

**已知限制**：字型從 Google Fonts 載入且未被快取，離線時會退回系統字型（版面與計算功能均正常）；單一標的、手動輸入價格，無交易所報價；只支援固定風險金額模型，沒有凱利公式。**非投資建議，送單前請自己再確認一次數字。**
