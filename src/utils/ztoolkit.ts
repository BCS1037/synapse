import {
  ZoteroToolkit,
  BasicTool,
  UITool,
  unregister,
} from "zotero-plugin-toolkit";
import pkg from "../../package.json" with { type: "json" };

export { createZToolkit };

const config = (pkg as any).config as {
  addonName: string;
  addonID: string;
  addonRef: string;
  addonInstance: string;
  prefsPrefix: string;
};

function createZToolkit() {
  const _ztoolkit = new ZoteroToolkit();
  /**
   * Alternatively, import toolkit modules you use to minify the plugin size.
   * You can add the modules under the `MyToolkit` class below and uncomment the following line.
   */
  // const _ztoolkit = new MyToolkit();
  initZToolkit(_ztoolkit);
  return _ztoolkit;
}

function initZToolkit(_ztoolkit: ReturnType<typeof createZToolkit>) {
  const env = __env__;
  _ztoolkit.basicOptions.log.prefix = `[${config.addonName}]`;
  _ztoolkit.basicOptions.log.disableConsole = env === "production";
  _ztoolkit.UI.basicOptions.ui.enableElementJSONLog = __env__ === "development";
  _ztoolkit.UI.basicOptions.ui.enableElementDOMLog = __env__ === "development";
  // Getting basicOptions.debug will load global modules like the debug bridge.
  // since we want to deprecate it, should avoid using it unless necessary.
  // _ztoolkit.basicOptions.debug.disableDebugBridgePassword =
  //   __env__ === "development";
  _ztoolkit.basicOptions.api.pluginID = config.addonID;
  _ztoolkit.ProgressWindow.setIconURI(
    "default",
    `chrome://${config.addonRef}/content/icons/synapse-logo.a.svg`,
  );
}

class MyToolkit extends BasicTool {
  UI: UITool;

  constructor() {
    super();
    this.UI = new UITool(this);
  }

  unregisterAll() {
    unregister(this);
  }
}
