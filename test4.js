async function test() {
  const url = 'https://backend3.owct.me/setting/get';
  const data = { belongsTo: "685670e4486951278738864e", outletId: "6a47361e1898af1200d559e1" };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  console.log(await res.text());
}
test();
