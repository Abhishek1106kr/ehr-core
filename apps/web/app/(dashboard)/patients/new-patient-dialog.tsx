"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreatePatient } from "@/lib/queries/patients";
import { ApiRequestError } from "@/lib/api-client";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  preferredLanguage: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function NewPatientDialog({
  open,
  onOpenChange,
  organizationId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string | undefined;
}) {
  const createPatient = useCreatePatient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { preferredLanguage: "en" },
  });

  async function onSubmit(values: FormValues) {
    if (!organizationId) return;
    try {
      await createPatient.mutateAsync({
        organizationId,
        name: values.name,
        phone: values.phone || undefined,
        email: values.email || undefined,
        preferredLanguage: values.preferredLanguage,
      });
      toast.success("Patient registered", { description: `${values.name} has been added.` });
      reset();
      onOpenChange(false);
    } catch (err) {
      toast.error("Could not register patient", {
        description: err instanceof ApiRequestError ? err.message : "Please try again.",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register new patient</DialogTitle>
          <DialogDescription>
            Basic details now — full identity verification runs through Smart Patient Intake.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" {...register("name")} autoFocus />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register("phone")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createPatient.isPending}>
              {createPatient.isPending ? "Saving…" : "Register patient"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
