import { getString, initLocale } from "./utils/locale.js";
import { registerPrefsScripts } from "./modules/preferenceScript.js";
import { createZToolkit } from "./utils/ztoolkit.js";
import { MdnotesUIFactory } from "./modules/mdnotes.js";
import { MdnotesService } from "./modules/mdnotesService.js";
import { migrateMdnotesToSynapse } from "./utils/prefs.js";

async function onStartup() {
  await Promise.all([
    Zotero.initializationPromise,
    Zotero.unlockPromise,
    Zotero.uiReadyPromise,
  ]);

  // Migrate preferences to the new prefix to preserve user settings
  await migrateMdnotesToSynapse();

  initLocale();

  // 注册 Mdnotes 首选项面板 / Register Mdnotes preferences pane
  Zotero.PreferencePanes.register({
    pluginID: addon.data.config.addonID,
    src: rootURI + "content/preferences.xhtml",
    label: getString("mdnotes-menu-label"),
    image: `chrome://${addon.data.config.addonRef}/content/icons/synapse-logo.a.svg`,
  });

  await Promise.all(
    Zotero.getMainWindows().map((win) => onMainWindowLoad(win)),
  );

  // Mark initialized as true to confirm plugin loading status
  addon.data.initialized = true;
}

async function onMainWindowLoad(win: _ZoteroTypes.MainWindow): Promise<void> {
  // Create ztoolkit for every window
  addon.data.ztoolkit = createZToolkit();

  win.MozXULElement.insertFTLIfNeeded(
    `${addon.data.config.addonRef}-mainWindow.ftl`,
  );

  const popupWin = new ztoolkit.ProgressWindow(addon.data.config.addonName, {
    closeOnClick: true,
    closeTime: -1,
  })
    .createLine({
      text: getString("startup-begin"),
      type: "default",
      progress: 0,
    })
    .show();

  await Zotero.Promise.delay(500);
  popupWin.changeLine({
    progress: 60,
    text: `[60%] ${getString("startup-begin")}`,
  });

  // Register Mdnotes menus in main window and item context menu
  MdnotesUIFactory.registerMenus(win);

  await Zotero.Promise.delay(300);

  popupWin.changeLine({
    progress: 100,
    text: `[100%] ${getString("startup-finish")}`,
  });
  popupWin.startCloseTimer(3000);
}

async function onMainWindowUnload(win: Window): Promise<void> {
  ztoolkit.unregisterAll();
  addon.data.dialog?.window?.close();
}

function onShutdown(): void {
  ztoolkit.unregisterAll();
  addon.data.dialog?.window?.close();
  // Remove addon object
  addon.data.alive = false;
  // @ts-expect-error - Plugin instance is not typed
  delete Zotero[addon.data.config.addonInstance];
}

/**
 * This function is just an example of dispatcher for Notify events.
 * Any operations should be placed in a function to keep this funcion clear.
 */
async function onNotify(
  event: string,
  type: string,
  ids: Array<string | number>,
  extraData: { [key: string]: any },
) {
  // You can add your code to the corresponding notify type
  ztoolkit.log("notify", event, type, ids, extraData);
}

/**
 * This function is just an example of dispatcher for Preference UI events.
 * Any operations should be placed in a function to keep this funcion clear.
 * @param type event type
 * @param data event data
 */
async function onPrefsEvent(type: string, data: { [key: string]: any }) {
  switch (type) {
    case "load":
      registerPrefsScripts(data.window);
      break;
    default:
      return;
  }
}

// Mdnotes commands dispatcher
async function onMdnotesCommand(type: "create-file") {
  const pane = Zotero.getActiveZoteroPane();
  const items = pane?.getSelectedItems() || [];
  if (items.length === 0) return;

  switch (type) {
    case "create-file": {
      for (const item of items) {
        try {
          if (item?.isRegularItem?.()) {
            await MdnotesService.createMdnotesFile(item);
          }
        } catch (e) {
          ztoolkit.log("create-file failed for item", item?.id, e);
        }
      }
      break;
    }
  }
}

export default {
  onStartup,
  onShutdown,
  onMainWindowLoad,
  onMainWindowUnload,
  onNotify,
  onPrefsEvent,
  onMdnotesCommand,
};
