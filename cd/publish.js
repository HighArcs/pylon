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
  console.log(chalk_1.default.blueBright("⚙ Bundling script"));
  const file = node_fs_1.default.readFileSync(process.cwd() + path, "utf8");
  if (file) {
    console.log(
      chalk_1.default.blueBright(`📦 Bundle success (${file.length} bytes)`)
    );
  }
  const token = process.env.TOKEN;
  const guildId = process.env.GUILD_ID;
  const api = new wrap_1.Pylon.API(token);
  const available = await api.guildsAvailable();
  const found = available.find((g) => g.id === guildId);
  if (!found) {
    throw new Error("Guild not found");
  }
  const guild = await api.guild(guildId);
  console.log(
    chalk_1.default.blueBright(`💾 Loaded project for guild "${guild.name}"`)
  );
  const { deployments } = guild;
  const currentDeployment = deployments[0];
  if (!currentDeployment) {
    console.error(
      chalk_1.default.redBright(
        "❌ No deployments found, deploy in the Pylon editor first"
      )
    );
    return;
  }
  const deployment = await api.publishDeployment(currentDeployment.id, {
    contents: file,
    project: {
      files: [{ path: "/main.ts", content: "// hi" }],
    },
  });
  console.log(chalk_1.default.green(`✅ Deployed to guild "${guild.name}"`));
  connect(deployment.workbench_url, false);
}
exports.pylon = pylon;
function connect(url, reconnect = false) {
  const ws = new WebSocket(url);
  ws.onopen = () => {
    if (reconnect) {
      console.log(chalk_1.default.green("🔍 Reconnected to Pylon"));
    } else {
      console.log(chalk_1.default.green("🔍 Connected to Pylon"));
    }
  };
  const col = {
    error: chalk_1.default.redBright,
    warn: chalk_1.default.yellowBright,
    info: chalk_1.default.blueBright,
    debug: chalk_1.default.gray,
  };
  ws.onmessage = (event) => {
    const [data] = JSON.parse(event.data);
    console.log(col[data.method](data.data[0]));
  };
  ws.onerror = console.error;
  ws.onclose = () => {
    console.log(chalk_1.default.redBright("🔌 Disconnected from Pylon"));
    setTimeout(() => connect(url, true), 50);
  };
}
pylon("\\dist\\bundle.js");
