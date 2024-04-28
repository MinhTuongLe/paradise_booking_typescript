import { API_URL } from "@/const";
import { RouteKey, apiRoutes } from "@/routes";

export const getApiRoute = (
  routeName: RouteKey,
  params?: Record<string, any>
) => {
  const routePath = apiRoutes.find((route) => route.name === routeName);

  if (!routePath) {
    throw new Error(`Route '${routeName}' not found.`);
  }

  let path = routePath.path;

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      path = path.replace(`:${key}`, params[key]);
    }
  }

  return API_URL + path;
};
