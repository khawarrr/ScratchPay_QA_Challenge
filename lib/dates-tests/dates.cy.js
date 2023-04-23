const { expect } = require('chai');
const sinon = require('sinon');
const dates = require('./dates');
const { DateTime } = require('luxon');

describe('dates', () => {

  describe('isWeekendDay', () => {
    it('should return true if the given date is a weekend day', () => {
      const date = DateTime.fromISO('2023-04-22T00:00:00.000Z');
      expect(dates.isWeekendDay(date)).to.be.true;
    });

    it('should return false if the given date is not a weekend day', () => {
      const date = DateTime.fromISO('2023-04-24T00:00:00.000Z');
      expect(dates.isWeekendDay(date)).to.be.false;
    });
  });

  describe('isHolidayDay', () => {
    let holidaysInitStub;

    before(() => {
      holidaysInitStub = sinon.stub(dates.holidays, 'init');
      holidaysInitStub.withArgs('US').returns();
      holidaysInitStub.withArgs('UK').returns();
    });

    afterEach(() => {
      holidaysInitStub.resetHistory();
    });

    after(() => {
      holidaysInitStub.restore();
    });

    it('should return true if the given date is a holiday', () => {
      const date = DateTime.fromISO('2023-01-01T00:00:00.000Z');
      holidaysInitStub.withArgs('US').returns();
      expect(dates.isHolidayDay(date, 'US')).to.be.true;
    });

    it('should return false if the given date is not a holiday', () => {
      const date = DateTime.fromISO('2023-04-22T00:00:00.000Z');
      holidaysInitStub.withArgs('US').returns();
      expect(dates.isHolidayDay(date, 'US')).to.be.false;
    });
  });

  describe('getTotalDelay', () => {
    let isWeekendDayStub;
    let isHolidayDayStub;

    before(() => {
      isWeekendDayStub = sinon.stub(dates, 'isWeekendDay');
      isHolidayDayStub = sinon.stub(dates, 'isHolidayDay');
    });

    afterEach(() => {
      isWeekendDayStub.resetHistory();
      isHolidayDayStub.resetHistory();
    });

    after(() => {
      isWeekendDayStub.restore();
      isHolidayDayStub.restore();
    });

    it('should return the correct delay for business days and holidays', () => {
      const initialDate = DateTime.fromISO('2023-04-19T10:10:10Z');
      isWeekendDayStub.withArgs(initialDate).returns(false);
      isHolidayDayStub.withArgs(initialDate, 'US').returns(false);
      isWeekendDayStub.withArgs(initialDate.plus({ days: 1 })).returns(false);
      isHolidayDayStub.withArgs(initialDate.plus({ days: 1 }), 'US').returns(true);
      isWeekendDayStub.withArgs(initialDate.plus({ days: 2 })).returns(true);
      isHolidayDayStub.withArgs(initialDate.plus({ days: 2 }), 'US').returns(false);
      isWeekendDayStub.withArgs(initialDate.plus({ days: 3 })).returns(false);
      isHolidayDayStub.withArgs(initialDate.plus({ days: 3 }), 'US').returns(false);
      isWeekendDayStub.withArgs(initialDate.plus({ days: 4 })).returns(true);
      isHolidayDayStub.withArgs(initialDate.plus({ days: 4 }), 'US').returns
