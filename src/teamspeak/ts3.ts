import PQueue from "p-queue";
import type { TeamSpeak } from "ts3-nodejs-library";
import { tsConnect } from "~/teamspeak/ts-base";

const queue = new PQueue({ concurrency: 1 });

export const getClients = async (ts: TeamSpeak) => {
  return (await ts.clientList()).filter((c) => c.type === 0);
};

let ts: null | TeamSpeak = null;

export const getTs = async (): Promise<TeamSpeak | void> =>
  queue.add(async (): Promise<TeamSpeak> => {
    if (ts) {
      console.log("ts already connected");
      return ts;
    }
    ts = await tsConnect();
    ts.on("error", () => {
      console.warn("error ://((((");
    });
    return ts;
  });
