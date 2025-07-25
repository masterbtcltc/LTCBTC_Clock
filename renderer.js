// Variables to keep last values for coloring
let lastLTCPrice = null;
let lastBTCPrice = null;
let lastETHPrice = null;
let lastXRPPrice = null;

let lastRatioBTCtoLTC = null;
let lastRatioLTCtoBTC = null;
let lastRatioETHtoLTC = null;
let lastRatioLTCtoETH = null;
let lastRatioXRPtoLTC = null;
let lastRatioLTCtoXRP = null;

let lastBTCDominance = null;
let lastLTCDominance = null;

// Colors for consistency
const BTC_UP_COLOR = "yellow";
const BTC_DOWN_COLOR = "orange";
const LTC_UP_COLOR = "yellow";
const LTC_DOWN_COLOR = "#00A0FF";

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
function formatXRPPrice(price) {
  return price.toFixed(4);
}

async function fetchPrices() {
  try {
    // Fetch all prices in parallel
    const [ltcRes, btcRes, ethRes, xrpRes, dominanceRes] = await Promise.all([
      fetch("https://api.coinbase.com/v2/prices/LTC-USD/spot"),
      fetch("https://api.coinbase.com/v2/prices/BTC-USD/spot"),
      fetch("https://api.coinbase.com/v2/prices/ETH-USD/spot"),
      fetch("https://api.coinbase.com/v2/prices/XRP-USD/spot"),
      fetch("https://api.coinpaprika.com/v1/global"), // For dominance data
    ]);

    const ltcPrice = parseFloat((await ltcRes.json()).data.amount);
    const btcPrice = parseFloat((await btcRes.json()).data.amount);
    const ethPrice = parseFloat((await ethRes.json()).data.amount);
    const xrpPrice = parseFloat((await xrpRes.json()).data.amount);

    // Get dominance data from Coinpaprika API response
    const dominanceData = await dominanceRes.json();
    const btcDominance = dominanceData.btc_dominance_percent;
    const ltcDominance = dominanceData.ltc_dominance_percent;

    // Format prices for display
    const ltcDisplay = formatLTCPrice(ltcPrice);
    const btcDisplay = formatBTCPrice(btcPrice);
    const ethDisplay = formatETHPrice(ethPrice);
    const xrpDisplay = formatXRPPrice(xrpPrice);

    const btcDomDisplay = btcDominance.toFixed(2) + "%";
    const ltcDomDisplay = ltcDominance.toFixed(2) + "%";

    // Get elements
    const ltcElem = document.getElementById("ltc-price");
    const btcElem = document.getElementById("btc-price");
    const ethElem = document.getElementById("eth-price");
    const xrpElem = document.getElementById("xrp-price");

    const btcLtcElem = document.getElementById("btc-ltc-ratio");
    const ltcBtcElem = document.getElementById("ltc-btc-ratio");
    const ethLtcElem = document.getElementById("eth-ltc-ratio");
    const ltcEthElem = document.getElementById("ltc-eth-ratio");
    const xrpLtcElem = document.getElementById("xrp-ltc-ratio");
    const ltcXrpElem = document.getElementById("ltc-xrp-ratio");

    const btcDomElem = document.getElementById("btc-dominance");
    const ltcDomElem = document.getElementById("ltc-dominance");

    // Update price text
    ltcElem.textContent = `${addCommas(ltcDisplay)} LTC`;
    btcElem.textContent = `${addCommas(btcDisplay)} BTC`;
    ethElem.textContent = `${addCommas(ethDisplay)} ETH`;
    xrpElem.textContent = `${addCommas(xrpDisplay)} XRP`;

    // Calculate ratios
    const ratioBTCtoLTC = (btcPrice / ltcPrice).toFixed(0);
    const ratioLTCtoBTC = (ltcPrice / btcPrice).toFixed(6);
    const ratioETHtoLTC = (ethPrice / ltcPrice).toFixed(2);
    const ratioLTCtoETH = (ltcPrice / ethPrice).toFixed(6);
    const ratioXRPtoLTC = (xrpPrice / ltcPrice).toFixed(4);
    const ratioLTCtoXRP = (ltcPrice / xrpPrice).toFixed(4);

    // Update ratio text
    btcLtcElem.textContent = `${ratioBTCtoLTC} BTC/LTC`;
    ltcBtcElem.textContent = `${ratioLTCtoBTC} LTC/BTC`;
    ethLtcElem.textContent = `${ratioETHtoLTC} ETH/LTC`;
    ltcEthElem.textContent = `${ratioLTCtoETH} LTC/ETH`;
    xrpLtcElem.textContent = `${ratioXRPtoLTC} XRP/LTC`;
    ltcXrpElem.textContent = `${ratioLTCtoXRP} LTC/XRP`;

    // Update dominance text
    btcDomElem.textContent = `BTC Dominance: ${btcDomDisplay}`;
    ltcDomElem.textContent = `LTC Dominance: ${ltcDomDisplay}`;

    // Price color updates (BTC and LTC colors ONLY)
    if (lastLTCPrice !== null) {
      ltcElem.style.color = parseFloat(ltcDisplay) > parseFloat(lastLTCPrice) ? LTC_UP_COLOR : LTC_DOWN_COLOR;
    }
    lastLTCPrice = ltcDisplay;

    if (lastBTCPrice !== null) {
      btcElem.style.color = parseInt(btcDisplay) > parseInt(lastBTCPrice) ? BTC_UP_COLOR : BTC_DOWN_COLOR;
    }
    lastBTCPrice = btcDisplay;

    // ETH and XRP prices use LTC colors
    if (lastETHPrice !== null) {
      ethElem.style.color = parseFloat(ethDisplay) > parseFloat(lastETHPrice) ? LTC_UP_COLOR : LTC_DOWN_COLOR;
    }
    lastETHPrice = ethDisplay;

    if (lastXRPPrice !== null) {
      xrpElem.style.color = parseFloat(xrpDisplay) > parseFloat(lastXRPPrice) ? LTC_UP_COLOR : LTC_DOWN_COLOR;
    }
    lastXRPPrice = xrpDisplay;

    // Ratio color updates — BTC color for BTC ratios, LTC color for LTC ratios
    if (lastRatioBTCtoLTC !== null) {
      btcLtcElem.style.color = ratioBTCtoLTC > lastRatioBTCtoLTC ? BTC_DOWN_COLOR : LTC_DOWN_COLOR;
    }
    lastRatioBTCtoLTC = ratioBTCtoLTC;

    if (lastRatioLTCtoBTC !== null) {
      ltcBtcElem.style.color = ratioLTCtoBTC > lastRatioLTCtoBTC ? LTC_DOWN_COLOR : BTC_DOWN_COLOR;
    }
    lastRatioLTCtoBTC = ratioLTCtoBTC;

    if (lastRatioETHtoLTC !== null) {
      ethLtcElem.style.color = ratioETHtoLTC > lastRatioETHtoLTC ? LTC_DOWN_COLOR : BTC_DOWN_COLOR;
    }
    lastRatioETHtoLTC = ratioETHtoLTC;

    if (lastRatioLTCtoETH !== null) {
      ltcEthElem.style.color = ratioLTCtoETH > lastRatioLTCtoETH ? BTC_DOWN_COLOR : LTC_DOWN_COLOR;
    }
    lastRatioLTCtoETH = ratioLTCtoETH;

    if (lastRatioXRPtoLTC !== null) {
      xrpLtcElem.style.color = ratioXRPtoLTC > lastRatioXRPtoLTC ? LTC_DOWN_COLOR : BTC_DOWN_COLOR;
    }
    lastRatioXRPtoLTC = ratioXRPtoLTC;

    if (lastRatioLTCtoXRP !== null) {
      ltcXrpElem.style.color = ratioLTCtoXRP > lastRatioLTCtoXRP ? BTC_DOWN_COLOR : LTC_DOWN_COLOR;
    }
    lastRatioLTCtoXRP = ratioLTCtoXRP;

    // Dominance color updates (same as prices)
    if (lastBTCDominance !== null) {
      btcDomElem.style.color = btcDominance > lastBTCDominance ? BTC_UP_COLOR : BTC_DOWN_COLOR;
    }
    lastBTCDominance = btcDominance;

    if (lastLTCDominance !== null) {
      ltcDomElem.style.color = ltcDominance > lastLTCDominance ? LTC_UP_COLOR : LTC_DOWN_COLOR;
    }
    lastLTCDominance = ltcDominance;

  } catch (error) {
    console.error("Error fetching prices:", error);

    [
      "ltc-price",
      "btc-price",
      "eth-price",
      "xrp-price",
      "btc-ltc-ratio",
      "ltc-btc-ratio",
      "eth-ltc-ratio",
      "ltc-eth-ratio",
      "xrp-ltc-ratio",
      "ltc-xrp-ratio",
      "btc-dominance",
      "ltc-dominance",
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
