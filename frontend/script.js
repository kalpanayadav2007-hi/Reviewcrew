fetch('http://localhost:3000/api/health')
  .then(res => res.json())
  .then(data => {
    document.getElementById('status').textContent =
      `Backend connected ✅ (status: ${data.status})`;
  })
  .catch(err => {
    document.getElementById('status').textContent =
      'Backend NOT connected ❌';
  });