export function getAuthHeader(headers: {
  [key: string]: string | string[] | undefined;
}): string | null {
  const authHeader = headers["authorization"] as string;
  if (!authHeader) {
    return null;
  }
  return authHeader.split(" ")[1];
}
