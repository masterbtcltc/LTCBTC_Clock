const BTC_UP_COLOR = "yellow";
const BTC_DOWN_COLOR = "orange";
const LTC_UP_COLOR = "yellow";
const LTC_DOWN_COLOR = "#00A0FF";
const ETH_UP_COLOR = "yellow";
const ETH_DOWN_COLOR = "#00A0FF";
const DOGE_UP_COLOR = "#FFB84D";
const DOGE_DOWN_COLOR = "#FF6F00";

let lastLTCPrice = null;
let lastBTCPrice = null;
let lastETHPrice = null;
let lastDOGEPrice = null;
let lastRatioBTCtoLTC = null;
let lastRatioLTCtoBTC = null;
let lastRatioETHtoLTC = null;
let lastRatioLTCtoETH = null;
let lastRatioDOGEtoLTC = null;
let lastRatioLTCtoDOGE = null;

function addCommas(num) {
  const str = num.toString();
  if (str.includes(".")) {
    const [int, dec] = str.split(".");
    return int.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + dec;
  }
  return str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatBTCPrice(p) { return Math.round(p).toString(); }
function formatLTCPrice(p) { return p.toFixed(2); }
function formatETHPrice(p) { return Math.round(p).toString(); }
function formatDOGEPrice(p) { return p.toFixed(4); }

function flashElement(el, isUp) {
  el.classList.remove("flash-up", "flash-down");
  void el.offsetWidth; // reflow trick
  el.classList.add(isUp ? "flash-up" : "flash-down");
}

async function fetchPrices() {
  try {
    const [ltcRes, btcRes, ethRes, dogeRes] = await Promise.all([
      fetch("https://api.coinbase.com/v2/prices/LTC-USD/spot"),
      fetch("https://api.coinbase.com/v2/prices/BTC-USD/spot"),
      fetch("https://api.coinbase.com/v2/prices/ETH-USD/spot"),
      fetch("https://api.coinbase.com/v2/prices/DOGE-USD/spot"),
    ]);

    const ltcPrice = parseFloat((await ltcRes.json()).data.amount);
    const btcPrice = parseFloat((await btcRes.json()).data.amount);
    const ethPrice = parseFloat((await ethRes.json()).data.amount);
    const dogePrice = parseFloat((await dogeRes.json()).data.amount);

    const ltcDisplay = formatLTCPrice(ltcPrice);
    const btcDisplay = formatBTCPrice(btcPrice);
    const ethDisplay = formatETHPrice(ethPrice);
    const dogeDisplay = formatDOGEPrice(dogePrice);

    const ltcElem = document.getElementById("ltc-price");
    const btcElem = document.getElementById("btc-price");
    const ethElem = document.getElementById("eth-price");
    const dogeElem = document.getElementById("doge-price");
    const btcLtcElem = document.getElementById("btc-ltc-ratio");
    const ltcBtcElem = document.getElementById("ltc-btc-ratio");
    const ethLtcElem = document.getElementById("eth-ltc-ratio");
    const ltcEthElem = document.getElementById("ltc-eth-ratio");
    const dogeLtcElem = document.getElementById("doge-ltc-ratio");
    const ltcDogeElem = document.getElementById("ltc-doge-ratio");

    // Update text
    ltcElem.textContent = `${addCommas(ltcDisplay)} LTC`;
    btcElem.textContent = `${addCommas(btcDisplay)} BTC`;
    ethElem.textContent = `${addCommas(ethDisplay)} ETH`;
    dogeElem.textContent = `${dogeDisplay} DOGE`;

    const ratioBTCtoLTC = (btcPrice / ltcPrice).toFixed(0);
    const ratioLTCtoBTC = (ltcPrice / btcPrice).toFixed(6);
    const ratioETHtoLTC = (ethPrice / ltcPrice).toFixed(2);
    const ratioLTCtoETH = (ltcPrice / ethPrice).toFixed(6);
    const ratioDOGEtoLTC = (dogePrice / ltcPrice).toFixed(8);
    const ratioLTCtoDOGE = (ltcPrice / dogePrice).toFixed(0);

    btcLtcElem.textContent = `${ratioBTCtoLTC} BTC/LTC`;
    ltcBtcElem.textContent = `${ratioLTCtoBTC} LTC/BTC`;
    ethLtcElem.textContent = `${ratioETHLTC} ETH/LTC`;
    ltcEthElem.textContent = `${ratioLTCtoETH} LTC/ETH`;
    dogeLtcElem.textContent = `${ratioDOGEtoLTC} DOGE/LTC`;
    ltcDogeElem.textContent = `${ratioLTCtoDOGE} LTC/DOGE`;

    // Flash animations
    if (lastLTCPrice !== null) flashElement(ltcElem, parseFloat(ltcDisplay) > parseFloat(lastLTCPrice));
    if (lastBTCPrice !== null) flashElement(btcElem, parseFloat(btcDisplay) > parseFloat(lastBTCPrice));
    if (lastETHPrice !== null) flashElement(ethElem, parseFloat(ethDisplay) > parseFloat(lastETHPrice));
    if (lastDOGEPrice !== null) flashElement(dogeElem, parseFloat(dogeDisplay) > parseFloat(lastDOGEPrice));

    if (lastRatioBTCtoLTC !== null) flashElement(btcLtcElem, parseFloat(ratioBTCtoLTC) > parseFloat(lastRatioBTCtoLTC));
    if (lastRatioLTCtoBTC !== null) flashElement(ltcBtcElem, parseFloat(ratioLTCtoBTC) > parseFloat(lastRatioLTCtoBTC));
    if (lastRatioETHtoLTC !== null) flashElement(ethLtcElem, parseFloat(ratioETHLTC) > parseFloat(lastRatioETHtoLTC));
    if (lastRatioLTCtoETH !== null) flashElement(ltcEthElem, parseFloat(ratioLTCtoETH) > parseFloat(lastRatioLTCtoETH));
    if (lastRatioDOGEtoLTC !== null) flashElement(dogeLtcElem, parseFloat(ratioDOGEtoLTC) > parseFloat(lastRatioDOGEtoLTC));
    if (lastRatioLTCtoDOGE !== null) flashElement(ltcDogeElem, parseFloat(ratioLTCtoDOGE) > parseFloat(lastRatioLTCtoDOGE));

    // Save for next tick
    lastLTCPrice = ltcDisplay;
    lastBTCPrice = btcDisplay;
    lastETHPrice = ethDisplay;
    lastDOGEPrice = dogeDisplay;
    lastRatioBTCtoLTC = ratioBTCtoLTC;
    lastRatioLTCtoBTC = ratioLTCtoBTC;
    lastRatioETHtoLTC = ratioETHLTC;
    lastRatioLTCtoETH = ratioLTCtoETH;
    lastRatioDOGEtoLTC = ratioDOGEtoLTC;
    lastRatioLTCtoDOGE = ratioLTCtoDOGE;

  } catch (error) {
    console.error("Error:", error);
    document.querySelectorAll(".price-line").forEach(el => {
      el.textContent = "Error";
      el.style.color = "red";
    });
  }
}

fetchPrices();
setInterval(fetchPrices, 1000); // ← kept exactly as you wanted (1-second madness)
