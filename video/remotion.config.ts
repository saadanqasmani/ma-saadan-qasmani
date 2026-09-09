import path from "path";
import fs from "fs";
import { Config } from "@remotion/cli/config";

/**
 * The compositions import the site's own rig and scene through its "@/"
 * alias, so the bundler has to resolve it the way Next does. Nothing here is
 * a copy of the site's art: it is the same files, rendered a second way.
 *
 * The path is taken from the working directory rather than __dirname, which
 * is not defined when this config is loaded as a module.
 */
const SITE_SRC = path.resolve(process.cwd(), "..", "src");

Config.overrideWebpackConfig((current) => ({
  ...current,
  resolve: {
    ...current.resolve,
    alias: {
      ...(current.resolve?.alias ?? {}),
      "@": SITE_SRC,
    },
    extensions: Array.from(
      new Set([...(current.resolve?.extensions ?? []), ".ts", ".tsx", ".js", ".jsx"])
    ),
  },
}));

// This machine already carries a headless shell (Playwright's), so Remotion
// is pointed at it rather than downloading a second copy of Chromium.
const SHELL = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
if (fs.existsSync(SHELL)) Config.setBrowserExecutable(SHELL);

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
