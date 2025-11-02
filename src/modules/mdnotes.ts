import { getString } from "../utils/locale.js";

export class MdnotesUIFactory {
  static registerMenus(win: Window) {
    // 右键菜单：将“创建文件”提升为一级菜单项 / Context menu: promote "Create File" to a top-level item
    ztoolkit.Menu.register("item", {
      tag: "menuitem",
      label: getString("mdnotes-menu-create-file"),
      commandListener: () => addon.hooks.onMdnotesCommand("create-file"),
    });

    // File 菜单：直接添加一级菜单项 / File menu: add a top-level item directly
    ztoolkit.Menu.register("menuFile", {
      tag: "menuitem",
      label: getString("mdnotes-menu-create-file"),
      commandListener: () => addon.hooks.onMdnotesCommand("create-file"),
    });
  }
}
