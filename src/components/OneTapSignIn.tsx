"use client";
import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

interface CredentialResponse {
  credential: string;
  select_by: string;
}

interface NotificationData {
  isNotDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
  getNotDisplayedReason: () => string;
  getSkippedReason: () => string;
}

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: CredentialResponse) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: (callback?: (notification: NotificationData) => void) => void;
          cancel: () => void;
        };
      };
    };
  }
}

const OneTapSignIn = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Don't show on auth pages or when user is logged in

  useEffect(() => {
    if (pathname.startsWith("/spaces") || session) {
      return;
    }

    if (process.env.NODE_ENV === "development") {
      console.log("Google One Tap disabled in development");
      return;
    }

    const initializeOneTap = () => {
      if (typeof window !== "undefined" && window.google) {
        try {
          window.google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            callback: (response: CredentialResponse) => {
              void signIn("google", {
                credential: response.credential,
                redirect: true,
                callbackUrl: "/spaces",
              })
                .then((result) => {
                  if (result?.error) {
                    console.error("Sign-in error:", result.error);
                  }
                })
                .catch((error) => {
                  console.error("Sign-in failed:", error);
                });
            },
            auto_select: true,
            cancel_on_tap_outside: false,
          });

          window.google.accounts.id.prompt((notification: NotificationData) => {
            if (notification.isNotDisplayed()) {
              console.log(
                "One Tap not displayed:",
                notification.getNotDisplayedReason(),
              );
            } else if (notification.isSkippedMoment()) {
              console.log("One Tap skipped:", notification.getSkippedReason());
            }
          });
        } catch (error) {
          console.error("Failed to initialize One Tap:", error);
        }
      }
    };

    initializeOneTap();

    return () => {
      if (typeof window !== "undefined" && window.google) {
        window.google.accounts.id.cancel();
      }
    };
  }, [session, pathname]);

  return (
    <div
      id="g_id_onload"
      data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
      data-auto_prompt="true"
      className="fixed right-4 top-4"
    />
  );
};

export default OneTapSignIn;
