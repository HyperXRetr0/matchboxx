import { WebSocket } from "ws";

export function formatString(str: string) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

export const clients: Map<string, WebSocket> = new Map();
