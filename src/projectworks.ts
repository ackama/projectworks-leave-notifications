import fetch, { Headers, Response } from 'node-fetch';
import { URLSearchParams } from 'url';
import type { ProjectWorksLeave, ProjectWorksUser } from './types';

const PW_URL = 'https://api.projectworksapp.com';
const PW_USERNAME = process.env.PROJECTWORKS_USERNAME;
const PW_PASSWORD = process.env.PROJECTWORKS_PASSWORD;

const isObjectWithPropName = (ob: unknown, propName: string): boolean => {
  if (!ob) {
    return false;
  }

  if (typeof ob !== 'object') {
    return false;
  }

  if (!(propName in ob)) {
    return false;
  }

  return true;
};

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
  return isObjectWithPropName(maybeUser, 'UserID');
};

const isValidLeaves = (
  maybeLeaves: unknown
): maybeLeaves is ProjectWorksLeave[] => {
  if (!Array.isArray(maybeLeaves)) {
    return false;
  }

  if (maybeLeaves[0] && !isObjectWithPropName(maybeLeaves[0], 'LeaveID')) {
    return false;
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
  params: Record<string, string>
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
