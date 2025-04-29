import { TsLoaderUi } from "~/app/_components/TeamspeakUi";
import { HydrateClient, api } from "~/trpc/server";

export default async function Home() {
  // void api.ts3.clients.prefetch();
  // void api.ts3.channel.prefetch();

  return (
    <HydrateClient>
      <TsLoaderUi />
    </HydrateClient>
  );
}
