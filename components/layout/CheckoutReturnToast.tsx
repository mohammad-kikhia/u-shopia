"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/components/layout/CartProvider";
import { useNotification } from "@/components/layout/NotificationsProvider";
import { useTranslation } from "@/components/layout/DictionaryProvider";

/**
 * Handles Stripe return query params (?success=true | ?canceled=true) on the client only.
 * Clears cart on success, shows notifications, then strips params from the URL.
 */

/** Short window to dedupe React Strict Mode double-invoke in dev (same URL within ~1s). */
const STRICT_MODE_DEDUPE_MS = 1200;
let lastHandledSignature = "";
let lastHandledAt = 0;

function shouldSkipStrictDuplicate(signature: string): boolean {
  const now = Date.now();
  if (
    signature === lastHandledSignature &&
    now - lastHandledAt < STRICT_MODE_DEDUPE_MS
  ) {
    return true;
  }
  lastHandledSignature = signature;
  lastHandledAt = now;
  return false;
}

export default function CheckoutReturnToast() {
  const pathname = usePathname();
  const router = useRouter();
  const { hydrated, clear } = useCart();
  const addNotification = useNotification();
  const t = useTranslation();

  useEffect(() => {
    if (!hydrated || typeof window === "undefined" || !pathname) return;

    const search = window.location.search;
    if (!search || search === "?") return;

    const params = new URLSearchParams(search);
    const success = params.get("success");
    const canceled = params.get("canceled");
    if (success === null && canceled === null) {
      return;
    }

    const signature = `${pathname}${search}`;

    if (shouldSkipStrictDuplicate(signature)) {
      router.replace(pathname, { scroll: false });
      return;
    }

    if (success !== null) {
      clear();
      addNotification({
        message: t("home:payment_successful"),
        status: "success",
      });
    } else if (canceled !== null) {
      addNotification({
        message: t("home:payment_unsuccessful"),
        status: "info",
      });
    }

    router.replace(pathname, { scroll: false });
  }, [hydrated, pathname, router, clear, addNotification, t]);

  return null;
}
