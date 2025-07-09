chrome.storage.local.get(null, (data) => {
  const output = document.getElementById('output');
  Object.entries(data).forEach(([site, ms]) => {
    const li = document.createElement('li');
    li.textContent = `${site}: ${(ms / 60000).toFixed(2)} min`;
    output.appendChild(li);
  });
});