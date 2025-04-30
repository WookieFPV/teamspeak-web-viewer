import type { ChannelEntry, ClientEntry, } from "ts3-nodejs-library/lib/types/ResponseTypes";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getClients, getTs } from "~/teamspeak/ts3";
import { observable } from "@trpc/server/observable";

export const ts3Router = createTRPCRouter({
  clients: publicProcedure.query(async () => {
    console.log("query clients");
    const ts = await getTs();
    if (!ts) throw Error("ts connection error");
    const clients = (await getClients(ts)) as unknown as ClientEntry[];
    // console.log(clients.map((c) => c.nickname));
    return clients;
  }),
  clientsLive: publicProcedure.subscription(() => {
    console.log("start query clientsLive");
    return observable<ClientEntry[]>((emit) => {
      (async () => {
        const ts = await getTs();
        if (!ts) {
          emit.error(new Error("ts connection error"));
          return;
        }

        const pushUpdate = async () => {
          try {
            const updatedClients = (await getClients(ts)) as unknown as ClientEntry[];
            emit.next(updatedClients);
          } catch (error) {
            emit.error(error);
          }
        };

        // Emit initial clients
        pushUpdate()

        // Register event listeners
        ts.on("clientconnect", pushUpdate);
        ts.on("clientdisconnect", pushUpdate);
        ts.on("clientmoved", pushUpdate);

        // Cleanup on unsubscribe
        return () => {
          ts.off("clientconnect", pushUpdate);
          ts.off("clientdisconnect", pushUpdate);
          ts.off("clientmoved", pushUpdate);
        };
      })();
    });
  }),
  channel: publicProcedure.query(async () => {
    console.log("query channel");
    const ts = await getTs();
    if (!ts) throw Error("ts connection error");
    const channel = (await ts.channelList()) as unknown as ChannelEntry[];
    // console.log(channel.map((c) => c.name));
    return channel;
  }),
  /*
    create: publicProcedure
      .input(z.object({name: z.string().min(1)}))
      .mutation(async ({input}) => {
        // simulate a slow db call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        ts3Data = {id: ts3Data.id + 1, name: input.name};
        return ts3Data;
      }),

    getLatest: publicProcedure.query(() => {
      return ts3Data;
    }),*/
});

