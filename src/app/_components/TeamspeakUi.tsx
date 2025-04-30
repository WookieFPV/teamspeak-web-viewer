"use client";
import { useQuery } from "@tanstack/react-query";
import { TeamspeakUi } from "~/app/_components/tsComponents";
import { useTRPC } from "~/utils/trpc";
import { useSubscription } from "@trpc/tanstack-react-query";
import { ConnectionState } from "~/app/_components/connectionState";

export const TsLoaderUi = () => {
  const trpc = useTRPC();

    const clients = useSubscription(trpc.ts3.clientsLive.subscriptionOptions());

  const channels = useQuery(
    trpc.ts3.channel.queryOptions(undefined, {
      // every hour:
      staleTime: 1000 * 60 * 60,
      gcTime: Number.POSITIVE_INFINITY,
    }),
  );

    if (!channels.data)
    return (
      <div className="min min-h-screen space-y-1 bg-[#23272A] p-4 text-white">
        Loading...
      </div>
    );

  return (
    <div className="min min-h-screen space-y-1 bg-[#23272A] p-4 text-white">
        <ConnectionState status={clients.status}/>
        <TeamspeakUi channels={channels.data} clients={clients.data ?? []}/>
    </div>
  );
};
