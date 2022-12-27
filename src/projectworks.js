// @ts-nocheck

const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

const PW_URL = 'https://api.projectworksapp.com';
const PW_USERNAME = process.env.PROJECTWORKS_USERNAME;
const PW_PASSWORD = process.env.PROJECTWORKS_PASSWORD;

const apiGet = path => {
  const headers = new fetch.Headers();

  headers.append('Accept', 'application/json');
  headers.append(
    'Authorization',
    `Basic ${Buffer.from(`${PW_USERNAME}:${PW_PASSWORD}`).toString('base64')}`
  );

  return fetch(`${PW_URL}${path}`, { headers });
};

module.exports.fetchUser = async userId =>
  apiGet(`/api/v1.0/Users/${userId}`).then(r => r.json());

module.exports.fetchLeaves = async params =>
  apiGet(`/api/v1.0/Leaves?${new URLSearchParams(params).toString()}`);
