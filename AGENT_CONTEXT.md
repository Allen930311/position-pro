# AGENT_CONTEXT — position-pro

> Fresh-agent entrypoint. Classification: **UTILITY**.

## Purpose

Offline-first fixed-risk position-size calculator delivered as a PWA and Chrome
extension.

## Authority / invariants

`README.md` owns usage and documented design decisions.
`calculator.js` owns calculation behavior.

Preserve these safety-critical invariants unless a bounded task explicitly
changes the model:
- arbitrary-precision arithmetic;
- position size rounds down, not up;
- calculation remains inspectable/offline-first.

There is no standing roadmap. Do not add exchange execution, live trading,
portfolio automation or a different risk model merely because they are adjacent
features.

## Safety boundary

This tool is a calculator, not order authority or financial advice. Any change
to sizing math requires explicit tests/examples against the intended formula.

## Remote vs local truth

Remote `main` is shared source truth. Installed extension/PWA state,
localStorage/chrome.storage and user-entered trading values are local runtime
facts.
