"use client";

import { useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Code2, ExternalLink, Mail, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
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
import { normalizeSkillKey } from "@/lib/applications/skill-normalization";

const roleOptions = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "fullstack", label: "Fullstack" },
  { value: "design", label: "Design" },
  { value: "product", label: "Product" },
] as const;

const roleLabelByValue = new Map(roleOptions.map((role) => [role.value, role.label]));

type ProfileEditorFormProps = {
  profile: ParticipantProfileEditorData;
};

function getInitials(name: string, email: string): string {
  const source = name.trim() || email;
  const initials = source
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return initials || "U";
}

function ProfileCard({
  title,
  icon,
  children,
  className = "",
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`overflow-hidden rounded-2xl border border-border bg-card shadow-sm ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-border/80 px-6 py-4 text-sm font-semibold text-foreground">
        {icon}
        {title}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

export function ProfileEditorForm({ profile }: ProfileEditorFormProps) {
  const initialValues = getProfileFormDefaults(profile);
  const [savedProfile, setSavedProfile] = useState<ProfileFormData>(initialValues);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { isSubmitting, errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: "onBlur",
    defaultValues: initialValues,
  });
  const currentValues = useWatch({ control });
  const watchedSkills = currentValues.skills;
  const currentSkills = useMemo(() => watchedSkills ?? [], [watchedSkills]);
  const displayName = currentValues.fullName?.trim() || "Your profile";
  const portfolioUrl = currentValues.portfolioUrl?.trim() ?? "";
  const initials = getInitials(displayName, profile.email);
  const hasUnsavedChanges = useMemo(
    () =>
      (currentValues.fullName ?? "") !== savedProfile.fullName ||
      (currentValues.preferredRole ?? "") !== savedProfile.preferredRole ||
      (currentValues.timezone ?? "") !== savedProfile.timezone ||
      (currentValues.portfolioUrl ?? "") !== savedProfile.portfolioUrl ||
      (currentValues.bio ?? "") !== savedProfile.bio ||
      currentSkills.map(normalizeSkillKey).sort().join(",") !==
        savedProfile.skills.map(normalizeSkillKey).sort().join(","),
    [currentValues, currentSkills, savedProfile],
  );

  function addSkill(skill: string) {
    const trimmedSkill = skill.trim();
    const skillKey = normalizeSkillKey(trimmedSkill);

    if (
      !trimmedSkill ||
      !skillKey ||
      currentSkills.length >= 15 ||
      currentSkills.some((currentSkill) => normalizeSkillKey(currentSkill) === skillKey)
    ) {
      return;
    }

    setValue("skills", [...currentSkills, trimmedSkill], {
      shouldDirty: true,
      shouldValidate: true,
    });
    setSkillInput("");
  }

  function removeSkill(skillToRemove: string) {
    setValue(
      "skills",
      currentSkills.filter(
        (currentSkill) => normalizeSkillKey(currentSkill) !== normalizeSkillKey(skillToRemove),
      ),
      { shouldDirty: true, shouldValidate: true },
    );
  }

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
    setSkillInput("");
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
      className="space-y-6"
    >
      <div className="flex flex-col gap-5 pb-8 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 gap-5">
          <div className="relative shrink-0">
            <div className="flex size-[86px] items-center justify-center rounded-full bg-indigo-500/20 text-2xl font-bold text-indigo-400 ring-1 ring-indigo-400/10">
              {initials}
            </div>
          </div>

          <div className="min-w-0 pt-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="truncate font-outfit text-3xl font-semibold tracking-tight text-foreground">
                {displayName}
              </h1>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-lg text-muted-foreground">
              <span className="truncate">{profile.email}</span>
              <Mail className="size-4" />
            </div>
          </div>
        </div>

        {portfolioUrl ? (
          <a
            href={portfolioUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-muted/60 px-5 text-sm font-semibold text-foreground transition hover:bg-muted md:mt-2"
          >
            Portfolio
            <ExternalLink className="size-4" />
          </a>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <ProfileCard title="Profile details" icon={<User className="size-4" />}>
            <div className="space-y-6">
              {successMessage && <MessageForm type="success" message={successMessage} />}
              {errors.root && <MessageForm type="error" message={errors.root.message} />}

              <FieldGroup className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <InputForm
                    name="fullName"
                    control={control}
                    label="Full name"
                    placeholder="Your full name"
                    disabled={isSubmitting}
                    autoComplete="name"
                  />
                </div>

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
                label="Portfolio"
                placeholder="https://your-portfolio.example"
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
            </div>
          </ProfileCard>
        </div>

        <div className="space-y-6 lg:col-span-5">
          <ProfileCard title="Skills" icon={<Code2 className="size-4" />}>
            <div className="space-y-4">
              <p className="text-sm leading-6 text-muted-foreground">
                Add or remove your current skills, then save the profile once.
              </p>

              {currentSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {currentSkills.map((skill) => (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => removeSkill(skill)}
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/70 px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
                    >
                      {skill}
                      <span
                        aria-hidden="true"
                        className="text-sm leading-none text-muted-foreground"
                      >
                        &times;
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border px-4 py-5 text-sm text-muted-foreground">
                  No skills saved yet.
                </div>
              )}

              <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
                <Input
                  value={skillInput}
                  onChange={(event) => setSkillInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addSkill(skillInput);
                    }
                  }}
                  disabled={isSubmitting || currentSkills.length >= 15}
                  placeholder="Add a skill and press Enter"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 px-4"
                  disabled={isSubmitting || currentSkills.length >= 15 || !skillInput.trim()}
                  onClick={() => addSkill(skillInput)}
                >
                  Add skill
                </Button>
              </div>
              {errors.skills && <FieldError errors={[errors.skills]} />}
            </div>
          </ProfileCard>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="h-11 px-4"
              disabled={!hasUnsavedChanges || isSubmitting}
              onClick={() => {
                reset(savedProfile);
                setSkillInput("");
              }}
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={!hasUnsavedChanges || isSubmitting}
              className="h-11 px-4"
            >
              Save profile
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
