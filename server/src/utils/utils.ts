import { WebSocket } from "ws";

export function formatString(str: string) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

export function hasIntersection(arr1: string[], arr2: string[]): boolean {
  return arr1.some((skill) => arr2.includes(skill));
}

export const clients: Map<string, WebSocket> = new Map();
