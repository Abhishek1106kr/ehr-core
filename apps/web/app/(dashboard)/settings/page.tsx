"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/lib/queries/auth";
import {
  useOrganization,
  useUpdateOrganization,
  type OrganizationDetail,
} from "@/lib/queries/organization";
import { ApiRequestError } from "@/lib/api-client";

export default function SettingsPage() {
  const { data: me } = useCurrentUser();
  const organizationId = me?.user.organizationId ?? undefined;
  const { data: org, isLoading } = useOrganization(organizationId);

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Organization profile, departments, and supported languages."
      />

      {isLoading || !org ? (
        <Skeleton className="h-96 w-full max-w-2xl" />
      ) : (
        // Keyed by org.id so the form's local state initializes fresh from
        // server data without needing a state-syncing effect.
        <OrganizationSettings key={org.id} org={org} organizationId={organizationId} />
      )}
    </div>
  );
}

function OrganizationSettings({
  org,
  organizationId,
}: {
  org: OrganizationDetail;
  organizationId: string | undefined;
}) {
  const updateOrg = useUpdateOrganization(organizationId);
  const [name, setName] = useState(org.name);
  const [address, setAddress] = useState(org.address ?? "");
  const [phone, setPhone] = useState(org.phone ?? "");

  async function onSave() {
    try {
      await updateOrg.mutateAsync({ name, address, phone });
      toast.success("Organization settings saved");
    } catch (err) {
      toast.error("Could not save settings", {
        description: err instanceof ApiRequestError ? err.message : "Please try again.",
      });
    }
  }

  return (
    <div className="grid max-w-2xl gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Organization</CardTitle>
          <CardDescription>Basic details shown across the platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="org-name">Name</Label>
            <Input id="org-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="org-address">Address</Label>
            <Input id="org-address" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="org-phone">Phone</Label>
            <Input id="org-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <Button onClick={onSave} disabled={updateOrg.isPending}>
            {updateOrg.isPending ? "Saving…" : "Save changes"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Departments</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {org.departments.map((d) => (
            <Badge key={d.id} variant="outline">
              {d.name}
            </Badge>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Supported Languages</CardTitle>
          <CardDescription>
            Used by voice intake and multilingual patient greetings.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {org.languages.map((l) => (
            <Badge key={l} variant="outline" className="uppercase">
              {l}
            </Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
