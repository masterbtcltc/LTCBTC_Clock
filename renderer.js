// Colors for each coin
const BTC_UP_COLOR = "yellow";
const BTC_DOWN_COLOR = "orange";

const LTC_UP_COLOR = "yellow";
const LTC_DOWN_COLOR = "#00A0FF";

const ETH_UP_COLOR = "yellow";
const ETH_DOWN_COLOR = "#00A0FF";

// Variables to keep last values for coloring
let lastLTCPrice = null;
let lastBTCPrice = null;
let lastETHPrice = null;

let lastRatioBTCtoLTC = null;
let lastRatioLTCtoBTC = null;
let lastRatioETHtoLTC = null;
let lastRatioLTCtoETH = null;

// Helper to add commas to numbers
function addCommas(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Formatters
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
      fetch("https://api.coinbase.com/v2/prices/ETH-USD/spot"),
    ]);

    const ltcPrice = parseFloat((await ltcRes.json()).data.amount);
    const btcPrice = parseFloat((await btcRes.json()).data.amount);
    const ethPrice = parseFloat((await ethRes.json()).data.amount);

    const ltcDisplay = formatLTCPrice(ltcPrice);
    const btcDisplay = formatBTCPrice(btcPrice);
    const ethDisplay = formatETHPrice(ethPrice);

    const ltcElem = document.getElementById("ltc-price");
    const btcElem = document.getElementById("btc-price");
    const ethElem = document.getElementById("eth-price");

    const btcLtcElem = document.getElementById("btc-ltc-ratio");
    const ltcBtcElem = document.getElementById("ltc-btc-ratio");
    const ethLtcElem = document.getElementById("eth-ltc-ratio");
    const ltcEthElem = document.getElementById("ltc-eth-ratio");

    ltcElem.textContent = `${addCommas(ltcDisplay)} LTC`;
    btcElem.textContent = `${addCommas(btcDisplay)} BTC`;
    ethElem.textContent = `${addCommas(ethDisplay)} ETH`;

    const ratioBTCtoLTC = (btcPrice / ltcPrice).toFixed(0);
    const ratioLTCtoBTC = (ltcPrice / btcPrice).toFixed(6);
    const ratioETHtoLTC = (ethPrice / ltcPrice).toFixed(2);
    const ratioLTCtoETH = (ltcPrice / ethPrice).toFixed(6);

    btcLtcElem.textContent = `${ratioBTCtoLTC} BTC/LTC`;
    ltcBtcElem.textContent = `${ratioLTCtoBTC} LTC/BTC`;
    ethLtcElem.textContent = `${ratioETHtoLTC} ETH/LTC`;
    ltcEthElem.textContent = `${ratioLTCtoETH} LTC/ETH`;

    // Price color updates
    if (lastLTCPrice !== null) {
      ltcElem.style.color = parseFloat(ltcDisplay) > parseFloat(lastLTCPrice) ? LTC_UP_COLOR : LTC_DOWN_COLOR;
    }
    lastLTCPrice = ltcDisplay;

    if (lastBTCPrice !== null) {
      btcElem.style.color = parseInt(btcDisplay) > parseInt(lastBTCPrice) ? BTC_UP_COLOR : BTC_DOWN_COLOR;
    }
    lastBTCPrice = btcDisplay;

    if (lastETHPrice !== null) {
      ethElem.style.color = parseFloat(ethDisplay) > parseFloat(lastETHPrice) ? ETH_UP_COLOR : ETH_DOWN_COLOR;
    }
    lastETHPrice = ethDisplay;

    // Ratio color updates — use the first coin in pair to decide colors
    if (lastRatioBTCtoLTC !== null) {
      btcLtcElem.style.color = ratioBTCtoLTC > lastRatioBTCtoLTC ? BTC_UP_COLOR : BTC_DOWN_COLOR;
    }
    lastRatioBTCtoLTC = ratioBTCtoLTC;

    if (lastRatioLTCtoBTC !== null) {
      ltcBtcElem.style.color = ratioLTCtoBTC > lastRatioLTCtoBTC ? LTC_UP_COLOR : LTC_DOWN_COLOR;
    }
    lastRatioLTCtoBTC = ratioLTCtoBTC;

    if (lastRatioETHtoLTC !== null) {
      ethLtcElem.style.color = ratioETHtoLTC > lastRatioETHtoLTC ? ETH_UP_COLOR : ETH_DOWN_COLOR;
    }
    lastRatioETHtoLTC = ratioETHtoLTC;

    if (lastRatioLTCtoETH !== null) {
      ltcEthElem.style.color = ratioLTCtoETH > lastRatioLTCtoETH ? LTC_UP_COLOR : LTC_DOWN_COLOR;
    }
    lastRatioLTCtoETH = ratioLTCtoETH;

  } catch (error) {
    console.error("Error fetching prices:", error);

    [
      "ltc-price",
      "btc-price",
      "eth-price",
      "btc-ltc-ratio",
      "ltc-btc-ratio",
      "eth-ltc-ratio",
      "ltc-eth-ratio",
    ].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = `Error`;
        el.style.color = "red";
      }
    });
  }
}

fetchPrices();
setInterval(fetchPrices, 1000);
