import type {
  ChannelEntry,
  ClientEntry,
} from "ts3-nodejs-library/lib/types/ResponseTypes";
import { TsChannel } from "~/app/_components/TsChannel";

export const TeamspeakUi = ({
  channels,
  clients,
}: {
  channels: ChannelEntry[];
  clients: ClientEntry[];
}) => {
  const filteredChannels = channels.filter((ch) => ch.pid === "0");
  return filteredChannels.map((ch) => (
    <TsChannel
      key={ch.cid}
      channel={ch}
      channels={channels}
      clients={clients}
    />
  ));
};
