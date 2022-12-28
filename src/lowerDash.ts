// Utility functions inspired by (but not exactly matching) lodash API https://lodash.com/docs/

export const isArray = (thing: unknown): thing is unknown[] => {
  return Array.isArray(thing);
};

export const isObject = (thing: unknown): thing is object => {
  if (!thing) {
    return false;
  }

  if (typeof thing !== 'object') {
    return false;
  }

  return true;
};

export const hasIn = (thing: unknown, propName: string): boolean => {
  if (!thing) {
    return false;
  }

  if (typeof thing !== 'object') {
    return false;
  }

  if (!(propName in thing)) {
    return false;
  }

  return true;
};
