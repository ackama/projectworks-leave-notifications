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

export const chunk = <T>(arr: T[], len: number): T[][] => {
  const chunks = [];
  let i = 0;

  while (i < arr.length) {
    chunks.push(arr.slice(i, (i += len)));
  }

  return chunks;
};
