var Scratch = require('scratch-api');
class CloudError extends Error {
  // I have no clue what to put here. ;)
}
class User {
  constructor (username, password) {
    this.username = username;
    this.password = password;
  }
  async createCloudSession (project) {
    var r;
    var re;
    var p = new Promise(function(resolve, reject) {
      r = resolve;
      re = reject;
    });
    try {
      Scratch.UserSession.create(this.username, this.password, (err, session) => {
        try {
          session.cloudSession(project, (err, cloud) => {
            r(new CloudSession(cloud));
          });
        } catch (err) {
          console.error(err);
          re(new CloudError(`Cloud.js Error: Failed to create a cloud session with username '${this.username}'.`));
        }
      });
      return p;
    } catch (err) {
      console.error(err);
      throw new CloudError(`Cloud.js Error: Failed to login with the username '${this.username}'.`);
    }
  }
}
class CloudSession {
  constructor (session) {
    this.session = session;
    this.variables = {};
    this.on("set", (name, value) => {
      this.variables[name.substring(2)] = value;
    });
  }
  end () {
    this.session.end();
  }
  variable (variable) {
    return new CloudVar(variable, this.session);
    /* DeprecationWarning: CloudVar is deprecated!!! */
  }
  get (variable) {
    return this.variables[variable];
  }
  set (variable, value) {
    this.session.set("☁ " + variable, value);
    //this.session.emit('set', "☁ " + variable, value);
  }
  on (event, callback) {
    this.session.on(event, callback);
  }
}
class CloudVar {
  constructor (variable, session) {
    this.oldvar = variable;
    this.variable = "☁ " + variable;
    this.session = session;
    console.warn("DeprecationWarning: new CloudVar() is deprecated!!!");
  }
  get value () {
    return this.session.get(this.oldvar);
  }
  set value (data) {
    return this.session.set(this.variable, data);
  }
  getValue () {
    return this.value;
  }
  setValue (data) {
    return this.value = data;
  }
}
module.exports = {
  CloudError: CloudError,
  CloudVar: CloudVar,
  User: User,
  CloudSession: CloudSession,
}