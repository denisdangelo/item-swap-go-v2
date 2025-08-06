import type { ChartConfig } from "./chart";

export function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (!payload || typeof payload !== "object") return undefined;
  // @ts-ignore
  const item = payload;
  return config[key] || (item && config[item.dataKey]) || undefined;
}
