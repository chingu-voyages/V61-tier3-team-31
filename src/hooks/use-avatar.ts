import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const DEFAULT_AVATAR = "/avatar.png";

export function useAvatar(userId?: string, avatarName?: string | null) {
  const supabase = useMemo(() => createClient(), []);

  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR);

  useEffect(() => {
    if (!userId || !avatarName) {
      setAvatarUrl(DEFAULT_AVATAR);
      return;
    }

    let isMounted = true;

    async function loadAvatar() {
      const path = `${userId}/${avatarName}`;

      const { data, error } = await supabase.storage.from("avatars").createSignedUrl(path, 3600);

      if (!isMounted) return;

      if (!data?.signedUrl) {
        setAvatarUrl(DEFAULT_AVATAR);
        return;
      }

      setAvatarUrl(data.signedUrl);
    }

    loadAvatar();

    return () => {
      isMounted = false;
    };
  }, [userId, avatarName, supabase]);

  return avatarUrl;
}
