# @pipeworx/bitstamp

[Bitstamp](https://www.bitstamp.net/api/) MCP — keyless public market endpoints.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Bitstamp data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
