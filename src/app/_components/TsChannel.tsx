"use client";
import { useState } from "react";
import type {
  ChannelEntry,
  ClientEntry,
} from "ts3-nodejs-library/lib/types/ResponseTypes";
import { TsUser } from "~/app/_components/TsUser";
import { ChevronDownIcon, ChevronRightIcon } from "~/app/_components/tsIcons";

export const TsChannel = ({
  channel,
  channels,
  clients,
}: {
  channel: ChannelEntry;
  channels: ChannelEntry[];
  clients: ClientEntry[];
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const clientsInChannel = clients.filter((cl) => cl.cid === channel.cid);
  const subChannels = channels.filter((c) => c.pid === channel.cid);
  const hasChildren = subChannels.length !== 0;
  return (
    <>
      <button
        className="mt-0 flex"
        type={"button"}
        onClick={() => setIsCollapsed((old) => !old)}
      >
        <div className="flex items-center">
          {isSpacer(channel.channelName) ? null : hasChildren ? (
            <ChevronDownIcon className="mr-2 text-red-600" />
          ) : (
            <ChevronRightIcon className="mr-2 text-green-500" />
          )}
          <span className="font-sans">
            {cleanUpSpacerName(channel.channelName)}
          </span>
        </div>
      </button>
      {!isCollapsed &&
        clientsInChannel.map((cl) => <TsUser key={cl.clid} client={cl} />)}
      {!isCollapsed && (
        <div className="ml-2">
          {subChannels.map((subCh) => (
            <TsChannel
              key={subCh.cid}
              channel={subCh}
              channels={channels}
              clients={clients}
            />
          ))}
        </div>
      )}
    </>
  );
};

const spacerRegex = new RegExp(/\[.*spacer.*]/);

const cleanUpSpacerName = (name: string) => {
  return name.replace(spacerRegex, "");
};

const isSpacer = (name: string) =>
  name.includes("[cspacer") || name.includes("[*spacer");
