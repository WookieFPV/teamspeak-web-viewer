import type {
  ChannelEntry,
  ClientEntry,
} from "ts3-nodejs-library/lib/types/ResponseTypes";
import { ChevronDownIcon, ChevronRightIcon } from "~/components/tsIcons";
import { TsUser } from "~/components/TsUser";

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
  const hasChildren = channels.some((ch) => ch.pid === channel.cid);

  return (
    <>
      <div className="mt-0 flex">
        <div className="flex items-center">
          {isSpacer ? null : hasChildren ? (
            <ChevronDownIcon className="mr-2 text-red-600" />
          ) : (
            <ChevronRightIcon className="ml-3 mr-2 text-green-500" />
          )}
          <span className="font-sans ">
            {cleanUpSpacerName(channel.channelName)}
          </span>
        </div>
      </div>
      {clients
        .filter((cl) => cl.cid === channel.cid)
        .map((cl) => (
          <TsUser key={cl.clid} client={cl} />
        ))}
      {channels
        .filter((c) => c.pid === channel.cid)
        .map((subCh) => (
          <TsChannel
            key={subCh.cid}
            channel={subCh}
            channels={channels}
            clients={clients}
          />
        ))}
    </>
  );
};

const spacerRegex = new RegExp(/\[.*spacer.*]/);

const cleanUpSpacerName = (name: string) => {
  return name.replace(spacerRegex, "");
};
