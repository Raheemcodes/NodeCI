const query = Person.find({ occupation: /host/ })
  .where('name.last')
  .equals('Ghost')
  .where('age')
  .gt(17)
  .lt(66)
  .where('likes')
  .in(['vaporizing', 'talking'])
  .limit(10)
  .sort('-occupation')
  .select('name occupation')
  .exec(callback);

//  CHECK TO SEE IF THIS QUERY HAS ALREADY BEEN FETCHED IN REDIS
query.exec = function () {
  // check to see if the query has already been executed and if it has return the result right away
  client.get('query key');
  if (res) return res;

  // otherwise retuen the query *as normal*
  runTheOriginalExecFunction();

  // then save value in redis
  client.set('query key', res);

  return res;
};

query.exec((err, res) => console.log(res));
// Same as...
query.then((err, res) => console.log(res));
// Same as...
const res = await query;

// Temporary file to createa new blog post

fetch('/api/post', {
  method: 'POST',
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'My Title',
    content: 'My Content',
  }),
});
