#!/bin/env node
// Merges config from ENV, secrets.env, & bcoin.env
// with ENV being highest priority

const fs = require('fs');
const url = require('url');
const path = require('path');
const dotenv = require('dotenv');

const temp = {};
const config = {};
const bcoinEnv = path.resolve(__dirname, '../bcoin.env');
const secretsEnv = path.resolve(__dirname, '../secrets.env');

// Load env files into temp
for (const f of [bcoinEnv, secretsEnv]) {
  if (fs.existsSync(f)) {
    Object.assign(temp, dotenv.parse(fs.readFileSync(f)));
  }
}

// Convert temp ENV vars that start with "BCOIN_"
Object.assign(temp, process.env);
for (let key in temp) {
  if (key.indexOf('BCOIN_') > -1) {
    const separatorIndex = key.indexOf('_');
    const value = temp[key];
    let configKey = key.slice(separatorIndex + 1).toLowerCase();
    // change underscore to camelcase for config file
    configKey = configKey.replace(/_([a-z])/gi, (match, p1) =>
      p1.toUpperCase()
    );
    config[configKey] = value;
  }
}

// Update URI with port, host, and protocol from ENV
let { port, hostname, protocol } = url.parse(config.uri);
if (config.port) port = config.port;
if (config.host) hostname = config.host;
if (config.protocol) protocol = config.protocol;

Object.assign(config, {
  uri: url.format({
    port,
    protocol,
    hostname
  }),
  port: port || '8332',
  host: hostname || 'localhost',
  protocol: protocol || 'http'
});

// console.debug({ config })
module.exports = config;
