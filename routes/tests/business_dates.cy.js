const request = require('supertest')
const app = require('../app') // assuming this is your express app instance

describe('Routes for business dates', () => {

  describe('GET /isBusinessDay', () => {

    it('should return true for a valid business day', async () => {
      const response = await request(app).get('/isBusinessDay?date=2023-04-25')
      expect(response.status).toBe(200)
      expect(response.body.ok).toBe(true)
      expect(response.body.results).toBe(true)
    })

    it('should return false for a weekend day', async () => {
      const response = await request(app).get('/isBusinessDay?date=2023-04-22')
      expect(response.status).toBe(200)
      expect(response.body.ok).toBe(true)
      expect(response.body.results).toBe(false)
    })

    it('should return false for a holiday', async () => {
      const response = await request(app).get('/isBusinessDay?date=2023-07-04&country=US')
      expect(response.status).toBe(200)
      expect(response.body.ok).toBe(true)
      expect(response.body.results).toBe(false)
    })

    it('should return an error message for an invalid date format', async () => {
      const response = await request(app).get('/isBusinessDay?date=2023/04/25')
      expect(response.status).toBe(200)
      expect(response.body.ok).toBe(false)
      expect(response.body.errorMessage).toBe('A valid date is required')
    })

  })

  describe('GET /settlementDate', () => {

    it('should return the expected business date for a valid request', async () => {
      const response = await request(app).get('/settlementDate?initialDate=2023-04-25&delay=5')
      expect(response.status).toBe(200)
      expect(response.body.ok).toBe(true)
      expect(response.body.results.businessDate).toBe('2023-05-02T00:00:00Z')
      expect(response.body.results.holidayDays).toBe(0)
      expect(response.body.results.weekendDays).toBe(2)
      expect(response.body.results.totalDays).toBe(7)
    })

    it('should return the expected business date for a request with a country code', async () => {
      const response = await request(app).get('/settlementDate?initialDate=2023-12-22&delay=3&country=US')
      expect(response.status).toBe(200)
      expect(response.body.ok).toBe(true)
      expect(response.body.results.businessDate).toBe('2023-12-27T00:00:00Z')
      expect(response.body.results.holidayDays).toBe(1)
      expect(response.body.results.weekendDays).toBe(1)
      expect(response.body.results.totalDays).toBe(5)
    })

    it('should return an error message for a request with an invalid initial date format', async () => {
      const response = await request(app).get('/settlementDate?initialDate=2023/04/25&delay=5')
      expect(response.status).toBe(200)
      expect(response.body.ok).toBe(false)
      expect(response.body.errorMessage).toBe('A valid date is required')
    })

    it('should return an error message for a request with an invalid delay format', async () => {
      const response = await request(app).get('/settlementDate?initialDate=2023-04-25&delay=foo')
      expect
