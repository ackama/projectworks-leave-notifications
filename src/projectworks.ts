import fetch, { Headers, Response } from 'node-fetch';
import { URLSearchParams } from 'url';
import type { ProjectWorksLeave, ProjectWorksUser } from './types';

const PW_URL = 'https://api.projectworksapp.com';
const PW_USERNAME = process.env.PROJECTWORKS_USERNAME;
const PW_PASSWORD = process.env.PROJECTWORKS_PASSWORD;

const apiGet = async (path: string): Promise<Response> => {
  const headers = new Headers();

  headers.append('Accept', 'application/json');
  headers.append(
    'Authorization',
    `Basic ${Buffer.from(`${PW_USERNAME}:${PW_PASSWORD}`).toString('base64')}`
  );

  return fetch(`${PW_URL}${path}`, { headers });
};

export const fetchUser = async (userId: number): Promise<ProjectWorksUser> => {
  const rawUser = await apiGet(`/api/v1.0/Users/${userId}`);

  return rawUser.json() as Promise<ProjectWorksUser>; // TODO do better
};

interface Params {
  [key: string]: string;
}

export const fetchLeaves = async (
  params: Params
): Promise<ProjectWorksLeave[]> => {
  const rawLeaves = await apiGet(
    `/api/v1.0/Leaves?${new URLSearchParams(params).toString()}`
  );

  return rawLeaves.json() as Promise<ProjectWorksLeave[]>; // TODO: do better
};
