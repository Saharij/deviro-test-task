import { randomUUID } from "crypto";

const validTokens = new Set<string>();

export function issueToken() {
  const token = randomUUID();
  validTokens.add(token);
  return token;
}

export function isTokenValid(token: string) {
  return validTokens.has(token);
}
