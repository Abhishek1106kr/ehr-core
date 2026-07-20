import { useCurrentUser } from "@/lib/queries/auth";

/** The signed-in user's organization — every list/query scopes to this. */
export function useOrganizationId(): string | undefined {
  const { data } = useCurrentUser();
  return data?.user.organizationId ?? undefined;
}
