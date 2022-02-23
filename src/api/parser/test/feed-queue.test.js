const { feedQueue } = require('../src/feed/queue');

// Bull will hold the redis connection open unless we shutdown the queue,
// which will block jest from completing.  After all tests are done, close it.
afterEach(() => feedQueue.empty());

/**
 * feedQueue.add() returns a promise which is usually true unless the Redis server is offline.
 */
describe('Testing feedQueue', () => {
  test('able to add a job to the feed queue', () =>
    feedQueue.add('http://ajhooper.blogspot.com/feeds/posts/default'));

  test('feedQueue.add() should have the same number of jobs added', async () => {
    const test_ids = ['1', '2', '3', '4', '5'];
    // How to add job to queue https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#queueadd
    // In parser service, each job has
    await Promise.all(
      test_ids.map(async (test_id) => {
        const job = await feedQueue.add(test_id);
      })
    );
    expect(await feedQueue.count()).toBe(test_ids.length);
  });
});
