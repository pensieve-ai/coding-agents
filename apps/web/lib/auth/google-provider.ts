import "server-only";

import type { GoogleProfile } from "better-auth/social-providers";
import { deriveAuthUsername } from "@/lib/auth/username";

function mapGoogleProfileToUser(profile: GoogleProfile): { username: string } {
  return {
    username: deriveAuthUsername({
      id: profile.sub,
      email: profile.email,
      name: profile.name,
    }),
  };
}

export const googleSocialProvider = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    prompt: "select_account" as const,
    mapProfileToUser: mapGoogleProfileToUser,
  },
};
