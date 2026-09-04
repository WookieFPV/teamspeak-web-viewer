import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { QueryProtocol, TeamSpeak } from "ts3-nodejs-library";
import type { createCaller } from "~/server/api/root";

const HOST = "127.0.0.1";
const QUERY_PORT = 10011;

let connection: TeamSpeak | undefined;
let caller: ReturnType<typeof createCaller> | undefined;

const getTs = () => {
  if (!connection) throw new Error("no ts3 connection, did beforeAll fail?");
  return connection;
};

const getCaller = () => {
  if (!caller) throw new Error("no router caller, did beforeAll fail?");
  return caller;
};

const readEnvCredentials = async () => {
  const values = new Map<string, string>();
  let text = "";
  try {
    text = await Bun.file(".env.local").text();
  } catch {
    text = "";
  }
  for (const line of text.split("\n")) {
    const match = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
    if (match?.[1] && match[2] !== undefined) values.set(match[1], match[2]);
  }
  return (key: string) => values.get(key) ?? process.env[key] ?? "";
};

beforeAll(async () => {
  const env = await readEnvCredentials();
  for (const key of [
    "TS3_HOST",
    "TS3_PASSWORD",
    "TS3_NICKNAME",
    "TS3_USERNAME",
    "TS3_USER_CID",
  ]) {
    const value = env(key);
    if (value && !process.env[key]) process.env[key] = value;
  }

  const start = Bun.spawn(["bash", "scripts/dev-ts3.sh", "up"], {
    stdout: "ignore",
    stderr: "pipe",
  });
  const exitCode = await start.exited;
  if (exitCode !== 0) {
    const stderr = await new Response(start.stderr).text();
    throw new Error(`failed to start local ts3 server: ${stderr}`);
  }

  connection = await TeamSpeak.connect({
    host: HOST,
    queryport: QUERY_PORT,
    serverport: 9987,
    protocol: QueryProtocol.RAW,
    username: env("TS3_USERNAME"),
    password: env("TS3_PASSWORD"),
    nickname: "bun-test",
  }).catch((error: Error) => {
    throw new Error(
      `could not connect to the local ts3 server on ${HOST}:${QUERY_PORT}, run 'bun run ts3:up': ${error.message}`,
    );
  });

  const { createCaller } = await import("~/server/api/root");
  caller = createCaller({ headers: new Headers() });
});

afterAll(async () => {
  if (connection) await connection.quit().catch(() => {});
});

describe("local ts3 server", () => {
  test("accepts the query connection", async () => {
    const ts = getTs();
    const me = await ts.whoami();
    expect(Number(me.clientId)).toBeGreaterThan(0);
    const clients = await ts.clientList();
    expect(clients.some((c) => c.type === 1)).toBe(true);
  });

  test("channel lifecycle: create, list, edit, delete", async () => {
    const ts = getTs();
    const name = `test-channel-${Date.now()}`;
    const renamed = `${name}-renamed`;

    const channel = await ts.channelCreate(name);
    expect(
      (await ts.channelList()).some(
        (c) => c.cid === channel.cid && c.name === name,
      ),
    ).toBe(true);

    await ts.channelEdit(channel.cid, { channelName: renamed });
    expect(
      (await ts.channelList()).some(
        (c) => c.cid === channel.cid && c.name === renamed,
      ),
    ).toBe(true);

    await ts.channelDelete(channel.cid, true);
    expect((await ts.channelList()).some((c) => c.cid === channel.cid)).toBe(
      false,
    );
  });

  describe("viewer router", () => {
    test("channel query lists the server channels", async () => {
      const ts = getTs();
      const channel = await ts.channelCreate(`test-router-${Date.now()}`);
      const channels = await getCaller().ts3.channel();
      expect(channels.some((c) => c.cid === channel.cid)).toBe(true);
      await ts.channelDelete(channel.cid, true);
    });

    test("clients query only returns real voice clients", async () => {
      const clients = await getCaller().ts3.clients();
      expect(clients.every((c) => c.type === 0)).toBe(true);
      expect(clients).toHaveLength(0);
    });
  });
});
