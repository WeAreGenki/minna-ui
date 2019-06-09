import { name } from './valid';

test('target', () => {
  expect.assertions(2);
  expect(typeof name).toEqual('string');
  expect(name).toEqual('text');
});
