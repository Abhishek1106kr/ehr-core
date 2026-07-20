"use client";

import { Stethoscope } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useDoctors } from "@/lib/queries/doctors";
import { useOrganizationId } from "@/hooks/use-organization";

export default function DoctorsPage() {
  const organizationId = useOrganizationId();
  const { data, isLoading } = useDoctors({ organizationId });

  return (
    <div>
      <PageHeader title="Doctors" description="Clinical staff directory and specialties." />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      ) : !data?.items.length ? (
        <EmptyState icon={Stethoscope} title="No doctors found" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((doctor) => (
            <Card key={doctor.id}>
              <CardContent className="flex items-center gap-4 p-5">
                <Avatar className="h-11 w-11">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {doctor.name
                      .split(" ")
                      .map((p) => p[0])
                      .slice(-2)
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-medium">{doctor.name}</p>
                  <Badge variant="outline" className="mt-1">
                    {doctor.specialty}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
