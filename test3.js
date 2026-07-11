async function test() {
  const url = 'http://localhost:5173/api/banner/get-active';
  const data = { belongsTo: "685670e4486951278738864e", outletId: "68e50210e60db7f4187e031e" };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Origin': 'http://localhost:5173',
      'Referer': 'http://localhost:5173/'
    },
    body: JSON.stringify(data)
  });
  console.log(res.status);
  console.log(await res.text());
}
test();
