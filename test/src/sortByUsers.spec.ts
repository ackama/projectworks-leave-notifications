import { sortByUser } from '../../src/util/sortByUsers';

describe('sortByUser', () => {
  it('sorts by first name then by last name', () => {
    const sortedLeaves = sortByUser([
      { days: [], user: { UserID: 1, FirstName: 'Jean', LastName: 'Grey' } },
      {
        days: [],
        user: { UserID: 2, FirstName: 'Charles', LastName: 'Xavier' }
      },
      { days: [], user: { UserID: 3, FirstName: 'James', LastName: 'Madrox' } },
      {
        days: [],
        user: { UserID: 4, FirstName: 'Scott', LastName: 'Summers' }
      },
      { days: [], user: { UserID: 5, FirstName: 'Kevin', LastName: 'Sydney' } },
      {
        days: [],
        user: { UserID: 6, FirstName: 'Armando', LastName: 'Muñoz' }
      },
      {
        days: [],
        user: { UserID: 7, FirstName: 'James', LastName: 'Proudstar' }
      },
      {
        days: [],
        user: { UserID: 8, FirstName: 'Alexander', LastName: 'Summers' }
      },
      {
        days: [],
        user: { UserID: 9, FirstName: 'Gabriel', LastName: 'Summers' }
      },
      {
        days: [],
        user: { UserID: 10, FirstName: 'James', LastName: 'Howlett' }
      }
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
