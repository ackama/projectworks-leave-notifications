// @ts-nocheck

module.exports.sortByUser = leaves => {
  return leaves.sort(({ user: userA }, { user: userB }) => {
    return (
      userA.FirstName.localeCompare(userB.FirstName) ||
      userA.LastName.localeCompare(userB.LastName)
    );
  });
};
