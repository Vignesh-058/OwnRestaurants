async function test() {
  const url = 'http://localhost:5173/api/banner/get-active';
  const data = { belongsTo: "685670e4486951278738864e", outletId: "68e50210e60db7f4187e031e" };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/plain, */*',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Dest': 'empty',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    body: JSON.stringify(data)
  });
  console.log(res.status);
  console.log(await res.text());
}
test();
