"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pylon = void 0;
const pariah_1 = require("pariah");
var Pylon;
(function (Pylon) {
  Pylon.Url = new URL("https://pylon.bot/api/");
  class API extends pariah_1.Pariah {
    token;
    constructor(token) {
      super(Pylon.Url, { headers: { Authorization: token } });
      this.token = token;
    }
    async user() {
      return this.get.json("/user");
    }
    async guildStats(guildId) {
      return this.get.json("/guilds/:guildId/stats", {
        ":guildId": guildId,
      });
    }
    async guild(guildId) {
      return this.get.json("/guilds/:guildId", {
        ":guildId": guildId,
      });
    }
    async deployment(deploymentId) {
      return this.get.json("/deployments/:deploymentId", {
        ":deploymentId": deploymentId,
      });
    }
    async guilds() {
      return this.get.json("/user/guilds");
    }
    async guildsAvailable() {
      return this.get.json("/user/guilds/available");
    }
    async publishDeployment(deploymentId, project) {
      return this.post.json(
        "/deployments/:deploymentId",
        {
          ":deploymentId": deploymentId,
        },
        {
          body: JSON.stringify({ script: project }),
        }
      );
    }
  }
  Pylon.API = API;
})((Pylon = exports.Pylon || (exports.Pylon = {})));
