import { ChevronDownIcon, ChevronRightIcon } from "~/components/tsIcons";
import {
  type ChannelEntry,
  type ClientEntry,
} from "ts3-nodejs-library/lib/types/ResponseTypes";
import { TsUser } from "~/components/TsUser";

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

/**
 * The current implementation of TsChannel doesn't cover edge cases and only works in a 2 level deep structure.
 * My Teamspeak is using such a structure but this should be reworked to a recursive Component
 */
export const TsChannel = ({
  channel,
  channels,
  clients,
}: {
  channel: ChannelEntry;
  channels: ChannelEntry[];
  clients: ClientEntry[];
}) => {
  const clientName: string = channel.channelName;
  const isSpacer =
    clientName.includes("[cspacer") || clientName.includes("[*spacer");
  const cleanedName = clientName
    .replace("[cspacer]", "")
    .replace("[*spacer1]", "")
    .replace("[*spacer2]", "")
    .replace("[*spacer3]", "");

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {isSpacer ? null : <ChevronDownIcon className="mr-2 text-red-600" />}
          <span className="font-bold">{cleanedName}</span>
        </div>
      </div>
      {channels
        .filter((c) => c.pid === channel.cid)
        .map((subCh) => (
          <>
            <div
              key={subCh.cid}
              className="mb-1 ml-5 flex flex-row items-center"
            >
              <ChevronRightIcon className="mr-2 text-green-500" />
              <span>{subCh.channelName}</span>
            </div>
            {clients
              .filter((cl) => cl.cid === subCh.cid)
              .map((cl) => (
                <TsUser key={cl.clid} client={cl} />
              ))}
          </>
        ))}
    </>
  );
};
