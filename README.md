# Teamspeak web viewer

This is a web viewer that shows your Teamspeak channels & connected clients

# Development

Requires [bun](https://bun.sh).

```bash
bun install
bun run ts3:up   # start a local TeamSpeak 3 server on 127.0.0.1
bun run dev
```

`scripts/dev-ts3.sh` downloads a sandboxed TeamSpeak 3 server (free 32-slot
license) into `.ts3/` (gitignored) on first run, starts it and writes the
query credentials to `.env.local`, which `bun run dev` picks up
automatically. No real TeamSpeak server or credentials are needed for
local development, and CI only needs placeholder values.

| Command | Description |
| --- | --- |
| `bun run ts3:up` | start the server (downloads on first run) |
| `bun run ts3:down` | stop the server |
| `bun run ts3:status` | show whether the server is running |
| `bun run ts3:reset` | stop the server and delete all its data |

The app only talks to the ServerQuery port (10011). The admin privilege
key for the TeamSpeak client is printed on the server's first start and
can be found in `.ts3/server/logs/`.

# Related projects

- Teamspeak3 Viewer for browsers: [teamspeak-web-viewer]( https://github.com/WookieFPV/teamspeak-web-viewer)
- Teamspeak3 Viewer for Elgato Streamdeck: [teamspeak-streamdeck-viewer](https://github.com/WookieFPV/teamspeak-streamdeck-viewer)
- add Rest & Websocket Teamspeak3 APIs to your Teamspeak: [teamspeak-api-server](https://github.com/WookieFPV/teamspeak-api-server)
