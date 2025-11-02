declare const _globalThis: {
  [key: string]: any;
  // Use any to avoid strict dependency on zotero-types specific member exports
  // 使用 any 避免强依赖 zotero-types 某个成员导出导致的类型错误
  Zotero: any;
  ztoolkit: ZToolkit;
  addon: typeof addon;
};

declare type ZToolkit = ReturnType<
  typeof import("../src/utils/ztoolkit").createZToolkit
>;

declare const ztoolkit: ZToolkit;

declare const rootURI: string;

declare const addon: import("../src/addon").default;

declare const __env__: "production" | "development";

// External module declarations to satisfy TypeScript during development
// 外部模块声明：用于在未安装依赖时通过类型检查
declare module "turndown";
declare module "sha.js";
