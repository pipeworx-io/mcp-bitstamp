interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Bitstamp MCP (public endpoints).
 */


const BASE = 'https://www.bitstamp.net/api/v2';
const UA = 'pipeworx-mcp-bitstamp/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  { name: 'ticker', description: 'Current ticker.', inputSchema: { type: 'object', properties: { currency_pair: { type: 'string' } }, required: ['currency_pair'] } },
  { name: 'ticker_hour', description: 'Last-hour ticker.', inputSchema: { type: 'object', properties: { currency_pair: { type: 'string' } }, required: ['currency_pair'] } },
  { name: 'order_book', description: 'Orderbook.', inputSchema: { type: 'object', properties: { currency_pair: { type: 'string' }, group: { type: 'number' } }, required: ['currency_pair'] } },
  { name: 'transactions', description: 'Recent transactions.', inputSchema: { type: 'object', properties: { currency_pair: { type: 'string' }, time: { type: 'string' } }, required: ['currency_pair'] } },
  { name: 'eur_usd', description: 'EUR/USD rate.', inputSchema: { type: 'object', properties: {} } },
  { name: 'trading_pairs', description: 'Supported pairs.', inputSchema: { type: 'object', properties: {} } },
  {
    name: 'ohlc',
    description: 'OHLC candles.',
    inputSchema: {
      type: 'object',
      properties: { currency_pair: { type: 'string' }, step: { type: 'number' }, limit: { type: 'number' }, start: { type: 'number' }, end: { type: 'number' }, exclude_current_candle: { type: 'boolean' } },
      required: ['currency_pair', 'step', 'limit'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const get = async (path: string, params?: Record<string, unknown>) => {
    const p = new URLSearchParams();
    if (params) for (const [k, v] of Object.entries(params)) if (v != null) p.set(k, String(v));
    const url = `${BASE}${path}${[...p].length ? `?${p}` : ''}`;
    const res = await fetch(url, { headers: { Accept: 'application/json', 'User-Agent': UA } });
    if (!res.ok) throw new Error(`Bitstamp: ${res.status}`);
    return res.json();
  };
  const reqStr = (k: string, ex: string) => {
    const v = args[k];
    if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${k}" is missing. Pass a string like ${ex}.`);
    return v;
  };
  const reqNum = (k: string, ex: string) => {
    const v = args[k];
    if (v == null || typeof v !== 'number') throw new Error(`Required argument "${k}" is missing. Pass a number like ${ex}.`);
    return v;
  };
  switch (name) {
    case 'ticker':
      return get(`/ticker/${encodeURIComponent(reqStr('currency_pair', '"btcusd"'))}/`);
    case 'ticker_hour':
      return get(`/ticker_hour/${encodeURIComponent(reqStr('currency_pair', '"btcusd"'))}/`);
    case 'order_book':
      return get(`/order_book/${encodeURIComponent(reqStr('currency_pair', '"btcusd"'))}/`, { group: args.group });
    case 'transactions':
      return get(`/transactions/${encodeURIComponent(reqStr('currency_pair', '"btcusd"'))}/`, { time: args.time });
    case 'eur_usd':
      return get('/eur_usd/');
    case 'trading_pairs':
      return get('/trading-pairs-info/');
    case 'ohlc':
      return get(`/ohlc/${encodeURIComponent(reqStr('currency_pair', '"btcusd"'))}/`, {
        step: reqNum('step', '3600'),
        limit: reqNum('limit', '24'),
        start: args.start,
        end: args.end,
        exclude_current_candle: args.exclude_current_candle == null ? undefined : args.exclude_current_candle ? 'true' : 'false',
      });
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
