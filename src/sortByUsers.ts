import type { Leave } from './types';

export const sortByUser = (leaves: Leave[]): Leave[] => {
  return leaves.sort(({ user: userA }, { user: userB }) => {
    return (
      userA.FirstName.localeCompare(userB.FirstName) ||
      userA.LastName.localeCompare(userB.LastName)
    );
  });
};
