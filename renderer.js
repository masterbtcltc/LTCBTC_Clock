async function fetchPrices() {
  try {
    const btcRes = await fetch('https://api.coinbase.com/v2/prices/BTC-USD/spot');
    const ltcRes = await fetch('https://api.coinbase.com/v2/prices/LTC-USD/spot');
    const ethRes = await fetch('https://api.coinbase.com/v2/prices/ETH-USD/spot');
    const dogeRes = await fetch('https://api.coinbase.com/v2/prices/DOGE-USD/spot');

    const btc = parseFloat((await btcRes.json()).data.amount);
    const ltc = parseFloat((await ltcRes.json()).data.amount);
    const eth = parseFloat((await ethRes.json()).data.amount);
    const doge = parseFloat((await dogeRes.json()).data.amount);

    document.getElementById('btc-price').textContent = `BTC: $${btc.toFixed(2)}`;
    document.getElementById('ltc-price').textContent = `LTC: $${ltc.toFixed(2)}`;
    document.getElementById('eth-price').textContent = `ETH: $${eth.toFixed(2)}`;
    document.getElementById('doge-price').textContent = `DOGE: $${doge.toFixed(4)}`;

    document.getElementById('btc-ltc-ratio').textContent = `BTC/LTC: ${(btc / ltc).toFixed(2)}`;
    document.getElementById('eth-ltc-ratio').textContent = `ETH/LTC: ${(eth / ltc).toFixed(2)}`;
    document.getElementById('doge-ltc-ratio').textContent = `DOGE/LTC: ${(doge / ltc).toFixed(4)}`;

    document.getElementById('ltc-btc-ratio').textContent = `LTC/BTC: ${(ltc / btc).toFixed(4)}`;
    document.getElementById('ltc-eth-ratio').textContent = `LTC/ETH: ${(ltc / eth).toFixed(4)}`;
    document.getElementById('ltc-doge-ratio').textContent = `LTC/DOGE: ${(ltc / doge).toFixed(2)}`;
  } catch (error) {
    console.error('Error fetching prices:', error);
  }
}

fetchPrices();
setInterval(fetchPrices, 60000);
