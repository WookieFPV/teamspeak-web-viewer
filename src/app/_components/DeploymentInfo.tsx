"use client";

import { useEffect, useState } from "react";

export const DeploymentInfo = () => {
  const [show, setShow] = useState(false);

  // NEXT_PUBLIC_* vars are inlined by Next.js at build time.
  const commit = process.env.NEXT_PUBLIC_DEPLOY_COMMIT || "";
  const message = process.env.NEXT_PUBLIC_DEPLOY_MESSAGE || "";
  const date = process.env.NEXT_PUBLIC_DEPLOY_DATE || "";

  useEffect(() => {
    const stored = localStorage.getItem("deploymentInfoShow");
    if (stored === "false") {
      setShow(false);
    } else {
      setShow(true);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShow(false);
        localStorage.setItem("deploymentInfoShow", "false");
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!commit && !message && !date) {
    return null;
  }

  return (
    <div
      className="fixed right-4 bottom-4 z-50 max-w-xs rounded bg-[#1e2125] px-3 py-2 text-[#c9c9c9] text-xs shadow-lg transition-all duration-300"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(10px)",
      }}
    >
      <div className="flex items-center space-x-2">
        {commit && (
          <span title="Commit hash">
            <kbd className="mr-0.5 rounded bg-[#303337] px-1.5 text-white text-xs">
              {commit.substring(0, 8)}
            </kbd>
          </span>
        )}
        {message && <span title="Commit message">{message}</span>}
        {date && <span title="Deployed at">{date}</span>}
      </div>
      <button
        type="button"
        onClick={() => setShow(false)}
        className="absolute top-0 right-0 text-gray-400 text-xs transition-colors hover:text-white"
        aria-label="Hide deployment info"
      >
        ✕
      </button>
    </div>
  );
};
