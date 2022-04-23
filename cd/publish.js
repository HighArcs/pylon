"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.pylon = void 0;
const chalk_1 = __importDefault(require("chalk"));
const dotenv_1 = __importDefault(require("dotenv"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_process_1 = __importDefault(require("node:process"));
const WebSocket = require("ws");
const wrap_1 = require("./wrap");
dotenv_1.default.config();
async function pylon(path) {
  log("blueBright", "⚙ Bundling script");
  const file = node_fs_1.default.readFileSync(process.cwd() + path, "utf8");
  if (file) {
    log("blueBright", `📦 Bundle success (${file.length} bytes)`);
  }
  const token = process.env.TOKEN;
  const guildId = process.env.GUILD_ID;
  const shown =
    process.env.ENTRY_FILE_DATA ||
    "// Generated externally, uploaded with Arcs' publisher (Arcs#4587, https://github.com/HighArcs/pylon)";
  const api = new wrap_1.Pylon.API(token);
  const available = await api.guildsAvailable();
  const found = available.find((g) => g.id === guildId);
  if (!found) {
    log("redBright", "❌ Guild not found");
  }
  const guild = await api.guild(guildId);
  log("blueBright", `💾 Loaded project for guild "${guild.name}"`);

  const { deployments } = guild;
  const currentDeployment = deployments[0];
  if (!currentDeployment) {
    log("❌ No deployments found, deploy in the Pylon editor first");
    return;
  }
  const deployment = await api.publishDeployment(currentDeployment.id, {
    contents: file,
    project: {
      files: [{ path: "/main.ts", content: shown }],
    },
  });
  log("greenBright", `✅ Deployed to guild "${guild.name}"`);
  if (deployment.msg) {
    log("redBright", `❌ Publish Error: ${deployment.msg}`);
    return;
  }
  connect(deployment.workbench_url, false);
}
exports.pylon = pylon;
function connect(url, reconnect = false) {
  let ws;
  try {
    ws = new WebSocket(url);
  } catch (e) {
    log("redBright", "❌ Failed to connect to Pylon");
    return;
  }
  ws.onopen = () => {
    if (reconnect) {
      log("greenBright", "🔍 Reconnected to Pylon");
    } else {
      log("greenBright", "🔍 Connected to Pylon");
    }
  };
  const col = {
    log: "white",
    error: "redBright",
    warn: "yellowBright",
    info: "blueBright",
    debug: "gray",
  };
  ws.onmessage = (event) => {
    const [data] = JSON.parse(event.data);
    log(col[data.method], data.data[0]);
  };
  ws.onerror = console.error;
  ws.onclose = () => {
    log("redBright", "🔌 Disconnected from Pylon");
    setTimeout(() => connect(url, true), 50);
  };
}
function log(color, ...args) {
  console.log(
    chalk_1.default.grey(`[${new Date().toLocaleTimeString()}]`),
    chalk_1.default[color](...args)
  );
}
pylon("\\dist\\bundle.js");
