// Utility functions inspired by (but not exactly matching) lodash API
// https://lodash.com/docs/. Copied from https://github.com/eoinkelly/lowerdash

export const chunk = <T>(arr: T[], len: number): T[][] => {
  const chunks = [];
  let i = 0;

  while (i < arr.length) {
    chunks.push(arr.slice(i, (i += len)));
  }

  return chunks;
};
