"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "deploymentInfoExpanded";

const formatDateDe = (value: string): string => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const readStoredExpanded = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

const storeExpanded = (value: boolean): void => {
  try {
    localStorage.setItem(STORAGE_KEY, value ? "true" : "false");
  } catch {
    // Storage unavailable (e.g. private mode) — non-critical.
  }
};

export const DeploymentInfo = () => {
  const [expanded, setExpanded] = useState(false);

  // NEXT_PUBLIC_* vars are inlined by Next.js at build time.
  const commit = process.env.NEXT_PUBLIC_DEPLOY_COMMIT || "";
  const message = process.env.NEXT_PUBLIC_DEPLOY_MESSAGE || "";
  const date = process.env.NEXT_PUBLIC_DEPLOY_DATE || "";
  const shortHash = commit.slice(0, 7);
  const formattedDate = date ? formatDateDe(date) : "";

  useEffect(() => {
    if (readStoredExpanded()) {
      setExpanded(true);
    }
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setExpanded(false);
        storeExpanded(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [expanded]);

  if (!commit && !message && !date) {
    return null;
  }

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    storeExpanded(next);
  };

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-expanded="false"
        aria-label="Show deployment info"
        title={
          [shortHash, message, formattedDate].filter(Boolean).join(" · ") ||
          "Deployment info"
        }
        className="fixed right-3 bottom-3 z-50 rounded-full bg-[#1e2125]/60 px-2 py-0.5 font-mono text-[10px] text-gray-500 opacity-40 shadow transition-all duration-300 hover:text-gray-300 hover:opacity-90"
      >
        {shortHash || "i"}
      </button>
    );
  }

  return (
    <div className="fixed right-3 bottom-3 z-50 w-64 rounded-lg bg-[#1e2125] px-3 py-2 text-[#c9c9c9] text-xs shadow-lg">
      <div className="mb-1 flex items-center justify-between">
        <span className="font-medium text-white">Deployment</span>
        <button
          type="button"
          onClick={toggle}
          aria-expanded="true"
          aria-label="Hide deployment info"
          className="text-gray-400 transition-colors hover:text-white"
        >
          ✕
        </button>
      </div>
      <dl className="space-y-1">
        {shortHash && (
          <div className="flex items-center gap-2">
            <dt className="w-14 shrink-0 text-gray-500">Commit</dt>
            <dd title={commit}>
              <kbd className="rounded bg-[#303337] px-1.5 text-white">
                {shortHash}
              </kbd>
            </dd>
          </div>
        )}
        {message && (
          <div className="flex items-start gap-2">
            <dt className="w-14 shrink-0 text-gray-500">Message</dt>
            <dd className="break-words">{message}</dd>
          </div>
        )}
        {formattedDate && (
          <div className="flex items-center gap-2">
            <dt className="w-14 shrink-0 text-gray-500">Deployed</dt>
            <dd title={date}>{formattedDate}</dd>
          </div>
        )}
      </dl>
    </div>
  );
};
