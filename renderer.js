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
    const [ltcRes, btcRes, ethRes, xrpRes] = await Promise.all([
      fetch("https://api.coinbase.com/v2/prices/LTC-USD/spot"),
      fetch("https://api.coinbase.com/v2/prices/BTC-USD/spot"),
      fetch("https://api.coinbase.com/v2/prices/ETH-USD/spot"),
      fetch("https://api.coinbase.com/v2/prices/XRP-USD/spot"),
    ]);

    const ltcPrice = parseFloat((await ltcRes.json()).data.amount);
    const btcPrice = parseFloat((await btcRes.json()).data.amount);
    const ethPrice = parseFloat((await ethRes.json()).data.amount);
    const xrpPrice = parseFloat((await xrpRes.json()).data.amount);

    // Format prices for display
    const ltcDisplay = formatLTCPrice(ltcPrice);
    const btcDisplay = formatBTCPrice(btcPrice);
    const ethDisplay = formatETHPrice(ethPrice);
    const xrpDisplay = formatXRPPrice(xrpPrice);

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

    // Color updates for price changes (using only BTC and LTC colors)
    if (lastLTCPrice !== null) {
      ltcElem.style.color = parseFloat(ltcDisplay) > parseFloat(lastLTCPrice) ? "yellow" : "#00A0FF";
    }
    lastLTCPrice = ltcDisplay;

    if (lastBTCPrice !== null) {
      btcElem.style.color = parseInt(btcDisplay) > parseInt(lastBTCPrice) ? "yellow" : "orange";
    }
    lastBTCPrice = btcDisplay;

    // ETH and XRP use same colors as LTC for rises/falls
    if (lastETHPrice !== null) {
      ethElem.style.color = parseFloat(ethDisplay) > parseFloat(lastETHPrice) ? "yellow" : "#00A0FF";
    }
    lastETHPrice = ethDisplay;

    if (lastXRPPrice !== null) {
      xrpElem.style.color = parseFloat(xrpDisplay) > parseFloat(lastXRPPrice) ? "yellow" : "#00A0FF";
    }
    lastXRPPrice = xrpDisplay;

    // Color updates for ratio changes (BTC colors for BTC ratios, LTC colors for LTC ratios)
    if (lastRatioBTCtoLTC !== null) {
      btcLtcElem.style.color = ratioBTCtoLTC > lastRatioBTCtoLTC ? "orange" : "#00A0FF";
    }
    lastRatioBTCtoLTC = ratioBTCtoLTC;

    if (lastRatioLTCtoBTC !== null) {
      ltcBtcElem.style.color = ratioLTCtoBTC > lastRatioLTCtoBTC ? "#00A0FF" : "orange";
    }
    lastRatioLTCtoBTC = ratioLTCtoBTC;

    if (lastRatioETHtoLTC !== null) {
      ethLtcElem.style.color = ratioETHtoLTC > lastRatioETHtoLTC ? "#00A0FF" : "orange";
    }
    lastRatioETHtoLTC = ratioETHtoLTC;

    if (lastRatioLTCtoETH !== null) {
      ltcEthElem.style.color = ratioLTCtoETH > lastRatioLTCtoETH ? "orange" : "#00A0FF";
    }
    lastRatioLTCtoETH = ratioLTCtoETH;

    if (lastRatioXRPtoLTC !== null) {
      xrpLtcElem.style.color = ratioXRPtoLTC > lastRatioXRPtoLTC ? "#00A0FF" : "orange";
    }
    lastRatioXRPtoLTC = ratioXRPtoLTC;

    if (lastRatioLTCtoXRP !== null) {
      ltcXrpElem.style.color = ratioLTCtoXRP > lastRatioLTCtoXRP ? "orange" : "#00A0FF";
    }
    lastRatioLTCtoXRP = ratioLTCtoXRP;

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
