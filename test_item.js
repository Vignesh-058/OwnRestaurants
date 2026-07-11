async function testItem() {
  const url = 'https://backend3.owct.me/item/getItemDetail';
  const data = {
    "itemId": "6a47374f33486b0991abfeee",
    "outletId": "6a47361e1898af1200d559e1"
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  console.log(JSON.stringify(json, null, 2));
}

testItem();
