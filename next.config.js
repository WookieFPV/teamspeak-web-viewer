/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  // ssh2 (via ts3-nodejs-library) ships native bindings that Turbopack
  // can't bundle into ESM chunks — keep it as a real require() at runtime.
  serverExternalPackages: ["ssh2"],
};

export default config;
