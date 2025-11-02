import pkg from "../package.json" with { type: "json" };
import { ColumnOptions, DialogHelper } from "zotero-plugin-toolkit";
import hooks from "./hooks.js";
import { createZToolkit } from "./utils/ztoolkit.js";

const config = (pkg as any).config as {
  addonName: string;
  addonID: string;
  addonRef: string;
  addonInstance: string;
  prefsPrefix: string;
};

class Addon {
  public data: {
    alive: boolean;
    config: typeof config;
    // Env type, see build.js
    env: "development" | "production";
    initialized?: boolean;
    ztoolkit: ZToolkit;
    locale?: {
      current: any;
    };
    prefs?: {
      window: Window;
      columns: Array<ColumnOptions>;
      rows: Array<{ [dataKey: string]: string }>;
    };
    dialog?: DialogHelper;
  };
  // Lifecycle hooks
  public hooks: typeof hooks;
  // APIs
  public api: object;

  constructor() {
    this.data = {
      alive: true,
      config,
      env: __env__,
      initialized: false,
      ztoolkit: createZToolkit(),
    };
    this.hooks = hooks;
    this.api = {};
  }
}

export default Addon;
