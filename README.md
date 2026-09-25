# @pipeworx/bitstamp

[Bitstamp](https://www.bitstamp.net/api/) MCP — keyless public market endpoints.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1683+ live data sources.

## Tools

- `ticker(currency_pair)` — current ticker (e.g. `btcusd`)
- `ticker_hour(currency_pair)` — last-hour aggregated ticker
- `order_book(currency_pair, group?)` — orderbook
- `transactions(currency_pair, time?)` — recent transactions
- `eur_usd()` — EUR/USD conversion rate
- `trading_pairs()` — supported pairs
- `ohlc(currency_pair, step, limit, start?, end?, exclude_current_candle?)` — OHLC candles (step in seconds)

## Data source

`https://www.bitstamp.net/api/v2`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "bitstamp": {
      "url": "https://gateway.pipeworx.io/bitstamp/mcp"
    }
  }
}
```

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/bitstamp/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1683+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## No MCP client? Call it over HTTP

```bash
curl -X POST https://gateway.pipeworx.io/v1/tools/bitstamp_ticker \
  -H 'Content-Type: application/json' \
  -d '{"currency_pair":"btcusd"}'
```

No account needed for the first calls. Inspect any tool: `GET https://gateway.pipeworx.io/v1/tools/bitstamp_ticker`. Find one: `POST https://gateway.pipeworx.io/v1/tools/search_packs` with `{"query":"..."}`.

## Standalone (no gateway account)

This package also runs as a local stdio MCP server — no Pipeworx account, no
gateway round-trip:

```json
{
  "mcpServers": {
    "bitstamp": {
      "command": "npx",
      "args": ["-y", "@pipeworx/mcp-bitstamp"]
    }
  }
}
```

Or run it directly to confirm it starts:

```bash
npx -y @pipeworx/mcp-bitstamp
```

It speaks MCP over stdin/stdout and answers `initialize`/`tools/list`/`tools/call`
for **only** this pack's tools — none of the shared meta-tools the gateway
connection above adds. Same source, same tools, no ask_pipeworx routing.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Bitstamp data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
