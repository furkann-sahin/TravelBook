export function getDefaultRouteForRole(role) {
  if (role === "company") return "/company";
  if (role === "guide") return "/guide";
  if (role === "user") return "/user";
  return "/";
}
