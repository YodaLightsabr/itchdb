/* ================================================= *\
|* ItchDB is a database that interacts with Scratch. *|
|* YodaLightsabr, the "Creator" of ItchDB, is not    *|
|* responsible for anything you do with ItchDB.      *|
|*                                                   *|
|*       Visit https://yodacode.repl.co/itchdb       *|
|*           YodaLightsabr#6565 on Discord           *|
|*              YodaLightsabr on GitHub              *|
|*                YodaCode on Repl.it                *|
|*                                                   *|
\* ================================================= */

//* =============================================== *\\
//*  © YodaLightsabr 2021 - MUST KEEP CREDITS UPON  *\\
//*  RE-DISTRIBUTION OF SOFTWARE!                   *\\
//* =============================================== *\\

const fetch = require('node-fetch');
const Scratch = require('scratch-api');
const Cloud = require('./cloud.js');
const Util = require('./util.js');
var util = new Util.Util({
  charmap: "abcdefghijklmnopqrstuvwxyz`1234567890-=~!@#$%^&*()_+[]\\{}|;':\",./<>? ❓ABCDEFGHIJKLMNOPQRSTUVWXYZ"
});
var express = require('express');
const db = require('quick.db');
class ItchError extends Error {
  // I have no clue what to put here. ;)
}
class RichDB {
  constructor (innerdb) {
    this.innerdb = innerdb;
  }
  get (path) {
    return this.innerdb.get(path);
  }
  set (path, data) {
    return this.innerdb.set(path, data);
  }
  push (path, data) {
    return this.innerdb.push(path, data);
  }
  delete (path) {
    return this.innerdb.delete(path);
  }
}
class Database {
  constructor (config) {
    if (!config) {
      throw new ItchError("ItchError: You must sepcify a configuration object.");
    }
    if (!config.username) {
      throw new ItchError("ItchError: Your configuration object must have a username.");
    }
    if (!config.password) {
      throw new ItchError("ItchError: Your configuration object must have a password.");
    }
    if (!config.project) {
      throw new ItchError("ItchError: Your configuration object must have a project.");
    }
    this.config = config;
  }
  async start () {
    console.log("ItchDB has started.");
    if (this.config.webserver) {
      this.webserver = {};
      this.webserver.app = express();
      this.webserver.app.get('*', (req, res) => {
        res.send("ItchDB - The database for Scratch");
      });
      if (!this.config.port) {
        throw new ItchError("ItchError: Your configuration requested a webserver, but did not provide a port.");
      }
      this.webserver.app.listen(this.config.port, () => {
        console.log("ItchDB Webserver has started.");
      });
    }
    var user = new Cloud.User(this.config.username, this.config.password);
    var session = await user.createCloudSession(this.config.project);
    await session.set('Status','0');
    session.on('set', async (name, value) => {
      console.log(name + " was set to " + value);
      console.log(session.variables);
      var key = name.substring(2);
      if (key == "Status" && value == "1") {
        if (session.get("Queue") !== "") {
          setTimeout(async () => {
            var current = getBody(session);
            await until(getBody(session) !== current);
            var decoded = util.decode(value);
            var list = decoded.split(".");
            console.log(list);
            var current = list[0];
            var user = current.substring(0, current.length - 1);
            console.log(user);
            var body = getBody(session);
            console.log(util.decode(body), "body");
            try {
              var json = JSON.parse(util.decode(body));
            } catch {
              session.set("status", 3);
            }
            console.log(json, "hi");
            console.log(json.body.params);
            if (json.type == "http") {
              var website = await fetch(json.body.url, json.body.params).catch((err) => {
                session.set("Status","4");
              });
              var text = await website.text();
              console.log(text);
              var encoded = util.encode(text);
              console.log(encoded);
              console.log(util.decode(encoded));
              var split = util.splitInto(encoded, 165);
              console.log(split);
              for (var i = 0; i < split.length && i < 10; i++) {
                if (split.length >= i + 1) {
                  console.log("☁ " + (i + 1));
                  //session.set((i + 1) + "", split[i]);
                  console.log(split[i]);
                  session.set("" + (i + 1), split[i]);
                  await util.sleep(300);
                }
              }
              //for (var i = 0; i < 8; i++) {
              //  session.set((split.length-i-1)+"",split[split.length-i-1] || "");
              //}
              session.set('Status','2');
            }
          }, 1000);
        }
      }
    });
    session.set("1", Date.now());
    setTimeout(() => {
      console.log(session.variables);
    }, 1000);
  }
  get query() {
    return new RichDB(db);
  }
}
module.exports = {
  Database: Database
}
function getBody(session) {
  var body = "";
  for (var i = 0; i < 8; i++) {
    if (session.get((i+1)+"") !== "" && session.get((i+1)+"") !== "0") {
      body = body + session.get(i+1);
    }
  }
  return body;
}
async function until(expression) {
  var p = new Promise((resolve, reject) => {
    var go = () => {
      if (expression) {
        resolve();
        return;
      } else {
        setTimeout(go, 100)
      }
    };
  });
}
