import { useRouteContext } from "@tanstack/react-router";

import type { CurrentUser } from "../api/types";

/** The signed-in user from the session token, plus the avatar initial. */
export function useCurrentUser(): CurrentUser & { initial: string } {
  const { auth } = useRouteContext({ from: "__root__" });
  const user: CurrentUser =
    auth.status === "authenticated" ? auth.user : { name: "", email: "" };
  return { ...user, initial: user.name.trim().charAt(0).toUpperCase() };
}
