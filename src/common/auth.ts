export function getAuthHeader(headers: {
  [key: string]: string | string[] | undefined;
}) {
  const authHeader = headers["authorization"] as string;
  if (!authHeader) {
    return "header must inclue auth";
    // res.status(403).json({ error: "header must inclue auth" });
  }

  return authHeader.split(" ")[1];
}
