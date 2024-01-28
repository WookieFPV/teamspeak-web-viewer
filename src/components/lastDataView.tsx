import { useInterval } from "usehooks-ts";
import { useState } from "react";

// min Time to show the Out of sync warning in [s]
const minTimeDiffToShow = 30;

export const LastDataView = ({ dataUpdatedAt }: { dataUpdatedAt: number }) => {
  const [diff, setDiff] = useState<number>(() => Date.now());

  //useInterval(() => setDate(Date.now()), 1000);
  useInterval(
    () => setDiff(Math.max(Math.floor((Date.now() - dataUpdatedAt) / 1000), 0)),
    1000,
  );
  if (diff < minTimeDiffToShow) return null;

  return <p className={"mb-3 text-red-500"}>{`last update: ${diff}s !`}</p>;
};
