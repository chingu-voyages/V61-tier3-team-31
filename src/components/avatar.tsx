"use client";

import { useAvatar } from "@/hooks/use-avatar";

const DEFAULT_AVATAR = "/avatar.png";

type Props = {
  userId?: string;
  avatarName?: string | null;
  alt?: string;
  className?: string;
};

export function Avatar({ userId, avatarName, alt = "avatar", className = "size-10" }: Props) {
  const avatarUrl = useAvatar(userId, avatarName);

  return (
    <img
      src={avatarUrl}
      alt={alt}
      className={`${className} rounded-full object-cover`}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = DEFAULT_AVATAR;
      }}
    />
  );
}
