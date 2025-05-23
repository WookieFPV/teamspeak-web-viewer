"use client";
import { useQuery } from "@tanstack/react-query";
import type { ClientEntry } from "ts3-nodejs-library/lib/types/ResponseTypes";
import { LastDataView } from "~/app/_components/lastDataView";
import { TeamspeakUi } from "~/app/_components/tsComponents";
import { useRefetchInterval } from "~/app/useRefetchInterval";
import { useTRPC } from "~/utils/trpc";

export const TsLoaderUi = () => {
  const trpc = useTRPC();
  const refetchInterval = useRefetchInterval();

  const clients = useQuery(
    trpc.ts3.clients.queryOptions(undefined, {
      refetchInterval,
      refetchIntervalInBackground: true,
      gcTime: 60 * 60 * 1000, // 1 hour
      staleTime: 15 * 1000,
      placeholderData: [] as ClientEntry[],
      select: (clients) => clients.filter((cl) => cl.type !== 0),
    }),
  );

  const channels = useQuery(
    trpc.ts3.channel.queryOptions(undefined, {
      // every hour:
      staleTime: 1000 * 60 * 60,
      gcTime: Number.POSITIVE_INFINITY,
    }),
  );

  if (!channels.data || !clients.data)
    return (
      <div className="min min-h-screen space-y-1 bg-[#23272A] p-4 text-white">
        Loading...
      </div>
    );

  return (
    <div className="min min-h-screen space-y-1 bg-[#23272A] p-4 text-white">
      <LastDataView dataUpdatedAt={clients.dataUpdatedAt} />
      <TeamspeakUi channels={channels.data} clients={clients.data} />
    </div>
  );
};
