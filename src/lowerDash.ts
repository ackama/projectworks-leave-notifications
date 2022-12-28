// Utility functions inspired by (but not exactly matching) lodash API
// https://lodash.com/docs/

export const isArray = (thing: unknown): thing is unknown[] => {
  return Array.isArray(thing);
};

export const isObject = (thing: unknown): thing is object => {
  return !!thing && typeof thing === 'object';
};

export const hasIn = (thing: unknown, propName: string): boolean => {
  return isObject(thing) && propName in thing;
};
