"use client";
import { useQuery } from "@tanstack/react-query";
import { LastDataView } from "~/app/_components/lastDataView";
import { TeamspeakUi } from "~/app/_components/tsComponents";
import { useTRPC } from "~/utils/trpc";

const isDebug = false;

export const TsLoaderUi = () => {
  const trpc = useTRPC();

  const clients = useQuery(
    trpc.ts3.clients.queryOptions(undefined, {
      refetchInterval: 5 * 1000,
      gcTime: 60 * 60 * 1000,
      staleTime: 5 * 1000,
      refetchIntervalInBackground: true,
    }),
  );

  const channels = useQuery(
    trpc.ts3.channel.queryOptions(undefined, {
      staleTime: Number.POSITIVE_INFINITY,
      gcTime: Number.POSITIVE_INFINITY,
    }),
  );

  if (isDebug) {
    console.log(JSON.stringify(clients.data));
    console.log(JSON.stringify(channels.data));
  }

  if (!channels.data || !clients.data)
    return (
      <div className="min min-h-screen space-y-1 bg-[#23272A] p-4 text-white">
        Loading...
      </div>
    );

  const filteredClients = clients.data?.filter((cl) => cl.type !== 0);

  return (
    <div className="min min-h-screen space-y-1 bg-[#23272A] p-4 text-white">
      <LastDataView dataUpdatedAt={clients.dataUpdatedAt} />
      <TeamspeakUi channels={channels.data} clients={filteredClients} />
    </div>
  );
};
