

async function testAll() {
  const domain = 'ieyal';
  
  // 1. Org
  console.log('Fetching Org...');
  const orgRes = await fetch('https://backend3.owct.me/organization/get-org', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain })
  });
  const orgText = await orgRes.text();
  console.log('Org status:', orgRes.status);
  
  const orgData = JSON.parse(orgText);
  const belongsTo = orgData.data.organization._id;
  
  // 2. Outlets
  console.log('\nFetching Outlets...', belongsTo);
  const outRes = await fetch('https://backend3.owct.me/organization/outlets/get-all', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ belongsTo })
  });
  const outText = await outRes.text();
  console.log('Outlets status:', outRes.status);
  
  const outData = JSON.parse(outText);
  const outletId = outData.data.outlets[0]._id;
  
  // 3. Settings
  console.log('\nFetching Settings...', belongsTo, outletId);
  const setRes = await fetch('https://backend3.owct.me/setting/get', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ belongsTo, outletId })
  });
  console.log('Settings status:', setRes.status);
  
  // 4. Store Status
  console.log('\nFetching Store Status...');
  const statRes = await fetch(`https://backend3.owct.me/organization/get-store-status/${belongsTo}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ belongsTo, outletId })
  });
  console.log('Store Status status:', statRes.status);
  
  // 5. Banner
  console.log('\nFetching Banners...');
  const banRes = await fetch('https://backend3.owct.me/banner/get-active', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ belongsTo, outletId })
  });
  console.log('Banners status:', banRes.status);
  
  // 6. Categories
  console.log('\nFetching Categories...');
  const catRes = await fetch('https://backend3.owct.me/category/getCategory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ belongsTo, outletId })
  });
  console.log('Categories status:', catRes.status);
}

testAll().catch(console.error);
