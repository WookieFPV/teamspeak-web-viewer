import { useState } from "react";
import { useInterval } from "usehooks-ts";

// min Time to show the Out of sync warning in [s]
const minTimeDiffToShow = 30;

export const LastDataView = ({ dataUpdatedAt }: { dataUpdatedAt: number }) => {
  const [diff, setDiff] = useState<number>(0);

  useInterval(
    () => setDiff(Math.max(Math.floor((Date.now() - dataUpdatedAt) / 1000), 0)),
    1000,
  );
  if (diff < minTimeDiffToShow) return null;

  console.log(JSON.stringify({ diff, dataUpdatedAt }));
  return <p className={"mb-3 text-red-500"}>{`last update: ${diff}s !`}</p>;
};
