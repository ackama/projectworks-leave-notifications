import { utcDayRange, utcWeekRange } from '../../src/util/dateRange';

// JS Date objects are not comparable so we convert them to their underlying
// integer representation
const toMillis = (date: Date) => {
  return Number(date);
};

describe('utcWeekRange', () => {
  it.each([
    {
      in: new Date('2021-01-13T00:00:00.000Z'),
      out: [
        new Date('2021-01-10T11:00:00.000Z'),
        new Date('2021-01-17T10:59:59.999Z')
      ]
    },
    {
      in: new Date('2022-06-15T00:00:00.000Z'),
      out: [
        new Date('2022-06-12T12:00:00.000Z'),
        new Date('2022-06-19T11:59:59.999Z')
      ]
    }
  ])(
    'returns Date objects representing the start and end of the week containing the given Date',
    example => {
      expect(utcWeekRange(example.in).map(r => toMillis(r))).toStrictEqual(
        example.out.map(r => toMillis(r))
      );
    }
  );
});

describe('utcDayRange', () => {
  it.each([
    {
      in: new Date('2021-01-13T14:00:00.000Z'),
      out: [
        new Date('2021-01-13T11:00:00.000Z'),
        new Date('2021-01-14T10:59:59.999Z')
      ]
    },
    {
      in: new Date('2022-06-15T00:00:00.000Z'),
      out: [
        new Date('2022-06-14T12:00:00.000Z'),
        new Date('2022-06-15T11:59:59.999Z')
      ]
    }
  ])(
    'returns Date objects representing the start and end of the day containing the given Date',
    example => {
      expect(utcDayRange(example.in).map(r => toMillis(r))).toStrictEqual(
        example.out.map(r => toMillis(r))
      );
    }
  );
});
