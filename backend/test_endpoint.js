try {
  const res = await fetch('https://dunchesbackend.mazlis.com/api/v1/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  console.log('Backend direct URL status:', res.status);
  console.log('Backend direct URL body:', await res.text());
} catch (error) {
  console.error('Error fetching backend direct:', error);
}

try {
  const res = await fetch('https://dunches.mazlis.com/api/v1/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  console.log('Frontend proxy URL status:', res.status);
  console.log('Frontend proxy URL body:', await res.text());
} catch (error) {
  console.error('Error fetching frontend proxy:', error);
}
