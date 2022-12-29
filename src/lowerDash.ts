// Utility functions inspired by (but not exactly matching) lodash API
// https://lodash.com/docs/. Inspired by https://youmightnotneed.com/lodash

export const chunk = <T>(arr: T[], len: number): T[][] => {
  const chunks = [];
  let i = 0;

  while (i < arr.length) {
    chunks.push(arr.slice(i, (i += len)));
  }

  return chunks;
};
