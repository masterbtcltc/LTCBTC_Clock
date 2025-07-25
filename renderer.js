// Previous variables...
let lastLTCPrice = null;
let lastBTCPrice = null;
let lastETHPrice = null;
let lastRatioBTCtoLTC = null;
let lastRatioLTCtoBTC = null;
let lastRatioETHtoLTC = null;
let lastRatioLTCtoETH = null;

function addCommas(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatBTCPrice(price) {
  return Math.round(price).toString();
}

function formatLTCPrice(price) {
  return price.toFixed(2);
}

function formatETHPrice(price) {
  return price.toFixed(2);
}

async function fetchPrices() {
  try {
    const [ltcRes, btcRes, ethRes] = await Promise.all([
      fetch("https://api.coinbase.com/v2/prices/LTC-USD/spot"),
      fetch("https://api.coinbase.com/v2/prices/BTC-USD/spot"),
      fetch("https://api.coinbase.com/v2/prices/ETH-USD/spot")
    ]);

    const ltcPrice = parseFloat((await ltcRes.json()).data.amount);
    const btcPrice = parseFloat((await btcRes.json()).data.amount);
    const ethPrice = parseFloat((await ethRes.json()).data.amount);

    const ltcDisplay = formatLTCPrice(ltcPrice);
    const btcDisplay = formatBTCPrice(btcPrice);
    const ethDisplay = formatETHPrice(ethPrice);

    // Elements
    const ltcElem = document.getElementById("ltc-price");
    const btcElem = document.getElementById("btc-price");
    const ethElem = document.getElementById("eth-price");
    const btcLtcElem = document.getElementById("btc-ltc-ratio");
    const ltcBtcElem = document.getElementById("ltc-btc-ratio");
    const ethLtcElem = document.getElementById("eth-ltc-ratio");
    const ltcEthElem = document.getElementById("ltc-eth-ratio");

    // Set price texts
    ltcElem.textContent = `${addCommas(ltcDisplay)} LTC`;
    btcElem.textContent = `${addCommas(btcDisplay)} BTC`;
    ethElem.textContent = `${addCommas(ethDisplay)} ETH`;

    // Ratios
    const ratioBTCtoLTC = (btcPrice / ltcPrice).toFixed(0);
    const ratioLTCtoBTC = (ltcPrice / btcPrice).toFixed(6);
    const ratioETHtoLTC = (ethPrice / ltcPrice).toFixed(2);
    const ratioLTCtoETH = (ltcPrice / ethPrice).toFixed(6);

    btcLtcElem.textContent = `${ratioBTCtoLTC} BTC/LTC`;
    ltcBtcElem.textContent = `${ratioLTCtoBTC} LTC/BTC`;
    ethLtcElem.textContent = `${ratioETHtoLTC} ETH/LTC`;
    ltcEthElem.textContent = `${ratioLTCtoETH} LTC/ETH`;

    // Color logic — BTC and LTC existing, add ETH

    // LTC price color
    if (lastLTCPrice !== null) {
      ltcElem.style.color = parseFloat(ltcDisplay) > parseFloat(lastLTCPrice) ? "yellow" : "#00A0FF";
    }
    lastLTCPrice = ltcDisplay;

    // BTC price color
    if (lastBTCPrice !== null) {
      btcElem.style.color = parseInt(btcDisplay) > parseInt(lastBTCPrice) ? "yellow" : "orange";
    }
    lastBTCPrice = btcDisplay;

    // ETH price color
    if (lastETHPrice !== null) {
      ethElem.style.color = parseFloat(ethDisplay) > parseFloat(lastETHPrice) ? "yellow" : "#9b59b6"; // purple-ish for ETH
    }
    lastETHPrice = ethDisplay;

    // BTC/LTC ratio color
    if (lastRatioBTCtoLTC !== null) {
      btcLtcElem.style.color = ratioBTCtoLTC > lastRatioBTCtoLTC ? "orange" : "#00A0FF";
    }
    lastRatioBTCtoLTC = ratioBTCtoLTC;

    // LTC/BTC ratio color
    if (lastRatioLTCtoBTC !== null) {
      ltcBtcElem.style.color = ratioLTCtoBTC > lastRatioLTCtoBTC ? "#00A0FF" : "orange";
    }
    lastRatioLTCtoBTC = ratioLTCtoBTC;

    // ETH/LTC ratio color
    if (lastRatioETHtoLTC !== null) {
      ethLtcElem.style.color = ratioETHtoLTC > lastRatioETHtoLTC ? "yellow" : "#9b59b6";
    }
    lastRatioETHtoLTC = ratioETHtoLTC;

    // LTC/ETH ratio color
    if (lastRatioLTCtoETH !== null) {
      ltcEthElem.style.color = ratioLTCtoETH > lastRatioLTCtoETH ? "#9b59b6" : "orange";
    }
    lastRatioLTCtoETH = ratioLTCtoETH;

  } catch (error) {
    console.error("Error fetching prices:", error);
  }
}

fetchPrices();
setInterval(fetchPrices, 1000);
