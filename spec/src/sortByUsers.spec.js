const { sortByUser } = require('../../src/sortByUsers');

describe('sortByUser', () => {
  it('sorts by first name then by last name', () => {
    const sortedLeaves = sortByUser([
      { user: { FirstName: 'Jean', LastName: 'Grey' } },
      { user: { FirstName: 'Charles', LastName: 'Xavier' } },
      { user: { FirstName: 'James', LastName: 'Madrox' } },
      { user: { FirstName: 'Scott', LastName: 'Summers' } },
      { user: { FirstName: 'Kevin', LastName: 'Sydney' } },
      { user: { FirstName: 'Armando', LastName: 'Muñoz' } },
      { user: { FirstName: 'James', LastName: 'Proudstar' } },
      { user: { FirstName: 'Alexander', LastName: 'Summers' } },
      { user: { FirstName: 'Gabriel', LastName: 'Summers' } },
      { user: { FirstName: 'James', LastName: 'Howlett' } }
    ]);

    expect(sortedLeaves.map(({ user }) => `${user.FirstName} ${user.LastName}`))
      .toMatchInlineSnapshot(`
      [
        "Alexander Summers",
        "Armando Muñoz",
        "Charles Xavier",
        "Gabriel Summers",
        "James Howlett",
        "James Madrox",
        "James Proudstar",
        "Jean Grey",
        "Kevin Sydney",
        "Scott Summers",
      ]
    `);
  });
});
