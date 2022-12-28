import fetch, { Headers, Response } from 'node-fetch';
import { URLSearchParams } from 'url';
import type { ProjectWorksLeave, ProjectWorksUser } from './types';

const PW_URL = 'https://api.projectworksapp.com';
const PW_USERNAME = process.env.PROJECTWORKS_USERNAME;
const PW_PASSWORD = process.env.PROJECTWORKS_PASSWORD;

interface Params {
  [key: string]: string;
}

const apiGet = async (path: string): Promise<Response> => {
  const headers = new Headers();

  headers.append('Accept', 'application/json');
  headers.append(
    'Authorization',
    `Basic ${Buffer.from(
      `${PW_USERNAME as string}:${PW_PASSWORD as string}`
    ).toString('base64')}`
  );

  return fetch(`${PW_URL}${path}`, { headers });
};

const isValidUser = (maybeUser: unknown): maybeUser is ProjectWorksUser => {
  if (!maybeUser) {
    return false;
  }

  if (typeof maybeUser !== 'object') {
    return false;
  }

  if (!('UserID' in maybeUser)) {
    return false;
  }

  return true;
};

const isValidLeaves = (
  maybeLeaves: unknown
): maybeLeaves is ProjectWorksLeave[] => {
  if (!maybeLeaves) {
    return false;
  }

  if (!Array.isArray(maybeLeaves)) {
    return false;
  }

  // if maybeLeaves has any elements, check that the first element is an object
  // with a 'LeaveID' property
  if (maybeLeaves.length > 0) {
    if (typeof maybeLeaves[0] !== 'object') {
      return false;
    }

    if (!('LeaveID' in maybeLeaves[0])) {
      return false;
    }
  }

  return true;
};

export const fetchUser = async (userId: number): Promise<ProjectWorksUser> => {
  const rawUser = await apiGet(`/api/v1.0/Users/${userId}`);

  const user: unknown = await rawUser.json();

  if (isValidUser(user)) {
    return user;
  }

  throw new Error('Failed to get User');
};

export const fetchLeaves = async (
  params: Params
): Promise<ProjectWorksLeave[]> => {
  const rawLeaves = await apiGet(
    `/api/v1.0/Leaves?${new URLSearchParams(params).toString()}`
  );

  const leaves: unknown = await rawLeaves.json();

  if (isValidLeaves(leaves)) {
    return leaves;
  }

  throw new Error('Failed to get leave from ProjectWorks');
};
