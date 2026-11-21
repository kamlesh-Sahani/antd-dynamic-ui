const fs = require("fs");
const path = require("path");

module.exports = {
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  external: [
    "react",
    "react-dom",
    "antd",
    "dayjs",
    "react-hook-form",
    "zod",
  ],
  async onSuccess() {
    const esmPath = path.resolve(__dirname, "dist/index.js");
    const cjsPath = path.resolve(__dirname, "dist/index.cjs");
    if (fs.existsSync(esmPath)) {
      const content = fs.readFileSync(esmPath, "utf-8");
      if (!content.startsWith('"use client";')) {
        fs.writeFileSync(esmPath, '"use client";\n' + content);
      }
    }
    if (fs.existsSync(cjsPath)) {
      const content = fs.readFileSync(cjsPath, "utf-8");
      if (!content.startsWith('"use client";')) {
        fs.writeFileSync(cjsPath, '"use client";\n' + content);
      }
    }
  },
};
