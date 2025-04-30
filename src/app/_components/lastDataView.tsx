"use client";
import { useState } from "react";
import { useInterval } from "usehooks-ts";

// min Time to show the Out of sync warning in [s]
const minTimeDiffToShow = 120;

export const LastDataView = ({ dataUpdatedAt }: { dataUpdatedAt: number }) => {
  const [diff, setDiff] = useState<number>(0);

  useInterval(() => {
    const diffTime = Math.floor((Date.now() - dataUpdatedAt) / 1000);
    if (diffTime < minTimeDiffToShow) {
      setDiff(0);
    } else {
      setDiff(diffTime);
    }
  }, 1000);

  if (!diff) return null;

  return (
    <div className="absolute top-0 left-0 z-[1000]">
      <p className={"mb-3 text-red-500"}>{`last update: ${diff}s !`}</p>
    </div>
  );
};
