"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Message = { title: string; description: string };

const ERROR_MESSAGES: Record<string, Message> = {
  EMAIL_NOT_ALLOWED: {
    title: "Sign-in not allowed",
    description:
      "Your email is not on the allowlist for this app. Please sign in with an authorized account or contact an administrator.",
  },
};

const DEFAULT_MESSAGE: Message = {
  title: "Sign-in failed",
  description:
    "We couldn't complete your sign-in. Please try again, or contact an administrator if the issue persists.",
};

export function AuthErrorDialog() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error");
  const [open, setOpen] = useState(false);

  const message = useMemo<Message | null>(() => {
    if (!errorCode) {
      return null;
    }
    return ERROR_MESSAGES[errorCode] ?? DEFAULT_MESSAGE;
  }, [errorCode]);

  useEffect(() => {
    if (errorCode) {
      setOpen(true);
    }
  }, [errorCode]);

  function handleClose() {
    setOpen(false);

    const params = new URLSearchParams(searchParams);
    params.delete("error");
    params.delete("error_description");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  if (!message) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          handleClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{message.title}</DialogTitle>
          <DialogDescription>{message.description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleClose}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
