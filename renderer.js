async function fetchPrices() {
  const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,litecoin,ethereum,dogecoin&vs_currencies=usd');
  const data = await response.json();

  const btc = data.bitcoin.usd;
  const ltc = data.litecoin.usd;
  const eth = data.ethereum.usd;
  const doge = data.dogecoin.usd;

  document.getElementById('btc-price').textContent = `BTC: $${btc}`;
  document.getElementById('ltc-price').textContent = `LTC: $${ltc}`;
  document.getElementById('eth-price').textContent = `ETH: $${eth}`;
  document.getElementById('doge-price').textContent = `DOGE: $${doge}`;

  document.getElementById('btc-ltc-ratio').textContent = `BTC/LTC: ${(btc / ltc).toFixed(2)}`;
  document.getElementById('eth-ltc-ratio').textContent = `ETH/LTC: ${(eth / ltc).toFixed(2)}`;
  document.getElementById('doge-ltc-ratio').textContent = `DOGE/LTC: ${(doge / ltc).toFixed(4)}`;

  document.getElementById('ltc-btc-ratio').textContent = `LTC/BTC: ${(ltc / btc).toFixed(4)}`;
  document.getElementById('ltc-eth-ratio').textContent = `LTC/ETH: ${(ltc / eth).toFixed(4)}`;
  document.getElementById('ltc-doge-ratio').textContent = `LTC/DOGE: ${(ltc / doge).toFixed(2)}`;
}

// Initial fetch + repeat every 60 seconds
fetchPrices();
setInterval(fetchPrices, 60000);
