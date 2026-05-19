const fetch = globalThis.fetch;
fetch('http://localhost:3000/api/courses')
  .then(res => res.json())
  .then(data => console.log(data.map(c => ({ id: c.id, title: c.title, isUpcoming: c.isUpcoming }))))
  .catch(console.error);
