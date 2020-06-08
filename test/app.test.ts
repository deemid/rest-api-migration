import request from 'supertest';
import mongoose from 'mongoose';
import server from '../src/index';

describe('GET /users', () => {
  it('Returns an array of users', async (done) => {
    const res = await request(server).get('/users');
    expect(res.body).toEqual([]);
    expect(res.status).toEqual(200);
    done();
  });
});

afterAll((done) => {
  mongoose.disconnect();
  server.close();
  done();
});
