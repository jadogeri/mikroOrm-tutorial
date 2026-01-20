import { jest, beforeEach } from '@jest/globals';

beforeEach(() => {
  jest.restoreAllMocks();
  jest.setTimeout(15000);
});
