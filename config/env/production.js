'use strict';
/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

var fs = require('fs');
const orgins = process.env.ONLY_ALLOW_ORIGINS || "http://localhost:1337";
let allowOrigins = orgins.split(",")
module.exports = {
  // hookTimeout: process.env.KONGA_HOOK_TIMEOUT || 60000,

  // kong_admin_url : process.env.KONG_ADMIN_URL || 'http://127.0.0.1:8001',

  // models: {
  //   connection: 'someMysqlServer'
  // },

  /***************************************************************************
   * Set the port in the production environment to 80                        *
   ***************************************************************************/

  port: process.env.PORT || 1337,

  explicitHost: process.env.HOST || "0.0.0.0",

  ssl: {
    key: process.env.SSL_KEY_PATH ? fs.readFileSync(process.env.SSL_KEY_PATH) : null,
    cert: process.env.SSL_CRT_PATH ? fs.readFileSync(process.env.SSL_CRT_PATH) : null
  },

  /***************************************************************************
   * Set the log level in production environment to "warn"                   *
   ***************************************************************************/
  log: {
      level: process.env.KONGA_LOG_LEVEL || "warn"
  },
  sockets: {
    onlyAllowOrigins: allowOrigins 
 },
  // Keep data of response errors in production mode
  keepResponseErrors : true


};
