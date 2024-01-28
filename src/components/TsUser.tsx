import { CircleIcon, MicMute, SoundMute } from "~/components/tsIcons";
import { type ClientEntry } from "ts3-nodejs-library/lib/types/ResponseTypes";

export const TsUser = ({ client }: { client: ClientEntry }) => {
  const idleTimeMins = Math.floor(client.clientIdleTime / 1000 / 60);
  const idleText = idleTimeMins > 10 ? `  [${idleTimeMins}min idle]` : "";
  return (
    <div className="ml-10 flex items-center">
      <TsUserIcon client={client} />
      <span>{client.clientNickname + idleText}</span>
    </div>
  );
};

const clientStateToColor = (client: ClientEntry) => {
  // if (client.clientFlagTalking) return "cyan"
  if (client.clientOutputMuted) return "red";
  if (client.clientInputMuted || !client.clientInputHardware) return "orange";
  return "blue";
};

const TsUserIcon = ({ client }: { client: ClientEntry }) => {
  if (client.clientOutputMuted) return <SoundMute className="mr-2" />;
  if (client.clientInputMuted || !client.clientInputHardware)
    return <MicMute className="mr-2" />;
  return <CircleIcon className="mr-2" fill={clientStateToColor(client)} />;
};
