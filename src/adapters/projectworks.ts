import fetch, { Headers, Response } from 'node-fetch';
import { URLSearchParams } from 'url';
import type { ProjectWorksLeave, ProjectWorksUser } from '../types';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PROJECTWORKS_USERNAME: string;
      PROJECTWORKS_PASSWORD: string;
    }
  }
}

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
  const response = await apiGet(`/api/v1.0/Users/${userId}`);

  if (!response.ok) {
    throw new Error('ProjectWorks responded with error when fetching User');
  }

  return (await response.json()) as ProjectWorksUser;
};

export const fetchLeaves = async (
  params: Record<string, string>
): Promise<ProjectWorksLeave[]> => {
  const response = await apiGet(
    `/api/v1.0/Leaves?${new URLSearchParams(params).toString()}`
  );

  if (!response.ok) {
    throw new Error('ProjectWorks responded with error when fetching Leaves');
  }

  return (await response.json()) as ProjectWorksLeave[];
};
