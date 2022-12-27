import { sortByUser } from '../../src/sortByUsers';

describe('sortByUser', () => {
  it('sorts by first name then by last name', () => {
    const sortedLeaves = sortByUser([
      { days: [], user: { FirstName: 'Jean', LastName: 'Grey' } },
      { days: [], user: { FirstName: 'Charles', LastName: 'Xavier' } },
      { days: [], user: { FirstName: 'James', LastName: 'Madrox' } },
      { days: [], user: { FirstName: 'Scott', LastName: 'Summers' } },
      { days: [], user: { FirstName: 'Kevin', LastName: 'Sydney' } },
      { days: [], user: { FirstName: 'Armando', LastName: 'Muñoz' } },
      { days: [], user: { FirstName: 'James', LastName: 'Proudstar' } },
      { days: [], user: { FirstName: 'Alexander', LastName: 'Summers' } },
      { days: [], user: { FirstName: 'Gabriel', LastName: 'Summers' } },
      { days: [], user: { FirstName: 'James', LastName: 'Howlett' } }
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
