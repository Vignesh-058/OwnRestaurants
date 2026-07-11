async function testCategory() {
  const url = 'https://backend3.owct.me/category/getCategory';
  const data = {
    "outletId": "6a47361e1898af1200d559e1",
    "belongsTo": "685670e4486951278738864e"
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  console.log(JSON.stringify(json, null, 2));
}

testCategory();
