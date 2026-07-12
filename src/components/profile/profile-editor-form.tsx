"use client";

import { useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { InputForm } from "@/components/form/InputForm";
import { MessageForm } from "@/components/form/MessageForm";
import type { ParticipantProfileEditorData } from "@/lib/profile/profile-editor";
import { profileSchema, type ProfileFormData } from "@/schemas/profile.schema";
import { getProfileFormDefaults } from "@/lib/profile/profile-form-defaults";
import { saveProfile } from "@/app/(protected)/app/profile/actions";

const roleOptions = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "fullstack", label: "Fullstack" },
  { value: "design", label: "Design" },
  { value: "product", label: "Product" },
] as const;

type ProfileEditorFormProps = {
  profile: ParticipantProfileEditorData;
};

export function ProfileEditorForm({ profile }: ProfileEditorFormProps) {
  const initialValues = getProfileFormDefaults(profile);
  const [savedProfile, setSavedProfile] = useState<ProfileFormData>(initialValues);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { isSubmitting, errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: "onBlur",
    defaultValues: initialValues,
  });
  const currentValues = useWatch({ control });
  const hasUnsavedChanges = useMemo(
    () =>
      (currentValues.fullName ?? "") !== savedProfile.fullName ||
      (currentValues.preferredRole ?? "") !== savedProfile.preferredRole ||
      (currentValues.timezone ?? "") !== savedProfile.timezone ||
      (currentValues.portfolioUrl ?? "") !== savedProfile.portfolioUrl ||
      (currentValues.bio ?? "") !== savedProfile.bio,
    [currentValues, savedProfile],
  );

  async function onSubmit(data: ProfileFormData) {
    clearErrors("root");
    setSuccessMessage(null);

    const result = await saveProfile(data);

    if ("error" in result) {
      setError("root", {
        type: "server",
        message: result.error,
      });
      return;
    }

    reset(result.profile);
    setSavedProfile(result.profile);
    setSuccessMessage("Profile saved successfully.");
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onChange={() => {
        if (successMessage) {
          setSuccessMessage(null);
        }
      }}
      className="mt-10 space-y-10"
    >
      {successMessage && <MessageForm type="success" message={successMessage} />}
      {errors.root && <MessageForm type="error" message={errors.root.message} />}

      <FieldGroup className="grid gap-6 md:grid-cols-2">
        <InputForm
          name="fullName"
          control={control}
          label="Full name"
          placeholder="Your full name"
          disabled={isSubmitting}
          autoComplete="name"
        />

        <Field>
          <FieldLabel htmlFor="profile-email">Email</FieldLabel>
          <Input
            id="profile-email"
            value={profile.email}
            readOnly
            className="bg-input/40 text-muted-foreground"
          />
          <FieldDescription>Email is managed through your account settings.</FieldDescription>
        </Field>

        <Controller
          name="preferredRole"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="profile-role">Preferred role</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="profile-role"
                  className="h-11 w-full rounded-xl px-4"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <InputForm
          name="timezone"
          control={control}
          label="Timezone"
          placeholder="Europe/Berlin"
          disabled={isSubmitting}
          autoComplete="off"
        />
      </FieldGroup>

      <InputForm
        name="portfolioUrl"
        control={control}
        label="Portfolio / GitHub"
        placeholder="https://github.com/yourusername"
        disabled={isSubmitting}
        autoComplete="url"
      />

      <Controller
        name="bio"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Bio</FieldLabel>
            <Textarea
              {...field}
              id={field.name}
              rows={5}
              disabled={isSubmitting}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-medium text-foreground/90">Skills</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your current saved skills are shown here. Editing them comes in the next step.
          </p>
        </div>

        {profile.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center rounded-lg border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border px-4 py-5 text-sm text-muted-foreground">
            No skills saved yet.
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          className="h-11 px-4"
          disabled={!hasUnsavedChanges || isSubmitting}
          onClick={() => reset(savedProfile)}
        >
          Reset
        </Button>
        <Button type="submit" disabled={!hasUnsavedChanges || isSubmitting} className="h-11 px-4">
          Save profile
        </Button>
      </div>
    </form>
  );
}
