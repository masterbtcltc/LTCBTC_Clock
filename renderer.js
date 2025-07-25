const BTC_UP_COLOR = "yellow";
const BTC_DOWN_COLOR = "orange";
const LTC_UP_COLOR = "yellow";
const LTC_DOWN_COLOR = "#00A0FF";
const ETH_UP_COLOR = "yellow";
const ETH_DOWN_COLOR = "#00A0FF";
const DOGE_UP_COLOR = "yellow";
const DOGE_DOWN_COLOR = "#00A0FF";

let lastLTCPrice = null, lastBTCPrice = null, lastETHPrice = null, lastDOGEPrice = null;
let lastRatioBTCtoLTC = null, lastRatioLTCtoBTC = null;
let lastRatioETHtoLTC = null, lastRatioLTCtoETH = null;
let lastRatioDOGEtoLTC = null, lastRatioLTCtoDOGE = null;

function addCommas(num) {
  const str = num.toString();
  return str.includes(".")
    ? str.split(".")[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + str.split(".")[1]
    : str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatBTCPrice(p) { return Math.round(p).toString(); }
function formatLTCPrice(p) { return p.toFixed(2); }
function formatETHPrice(p) { return Math.round(p).toString(); }
function formatDOGEPrice(p) { return p.toFixed(4); }

function flashPrice(el, color) {
  if (!el) return;
  const originalColor = el.style.color;
  const originalFontSize = window.getComputedStyle(el).fontSize;
  el.style.color = color;
  el.style.fontSize = '110px';
  el.style.transition = 'color 0.5s ease, font-size 0.5s ease';
  setTimeout(() => {
    el.style.color = originalColor;
    el.style.fontSize = originalFontSize;
  }, 500);
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

    ltcElem.textContent = `${addCommas(ltcDisplay)} LTC`;
    btcElem.textContent = `${addCommas(btcDisplay)} BTC`;
    ethElem.textContent = `${addCommas(ethDisplay)} ETH`;
    dogeElem.textContent = `${dogeDisplay} DOGE`;

    const ratioBTCtoLTC = (btcPrice / ltcPrice).toFixed(0);
    const ratioLTCtoBTC = (ltcPrice / btcPrice).toFixed(6);
    const ratioETHtoLTC = (ethPrice / ltcPrice).toFixed(2);
    const ratioLTCtoETH = (ltcPrice / ethPrice).toFixed(6);
    const ratioDOGEtoLTC = (dogePrice / ltcPrice).toFixed(8);
    const ratioLTCtoDOGE = (ltcPrice / dogePrice).toFixed(2);

    btcLtcElem.textContent = `${ratioBTCtoLTC} BTC/LTC`;
    ltcBtcElem.textContent = `${ratioLTCtoBTC} LTC/BTC`;
    ethLtcElem.textContent = `${ratioETHtoLTC} ETH/LTC`;
    ltcEthElem.textContent = `${ratioLTCtoETH} LTC/ETH`;
    dogeLtcElem.textContent = `${ratioDOGEtoLTC} DOGE/LTC`;
    ltcDogeElem.textContent = `${ratioLTCtoDOGE} LTC/DOGE`;

    function updateColor(elem, last, current, upColor, downColor) {
      if (last !== null) {
        const up = parseFloat(current) > parseFloat(last);
        elem.style.color = up ? upColor : downColor;
        if (Math.abs(current - last) / last > 0.005) {
          flashPrice(elem, up ? upColor : downColor);
        }
      }
    }

    updateColor(ltcElem, lastLTCPrice, ltcDisplay, LTC_UP_COLOR, LTC_DOWN_COLOR);
    updateColor(btcElem, lastBTCPrice, btcDisplay, BTC_UP_COLOR, BTC_DOWN_COLOR);
    updateColor(ethElem, lastETHPrice, ethDisplay, ETH_UP_COLOR, ETH_DOWN_COLOR);
    updateColor(dogeElem, lastDOGEPrice, dogeDisplay, DOGE_UP_COLOR, DOGE_DOWN_COLOR);

    lastLTCPrice = ltcDisplay;
    lastBTCPrice = btcDisplay;
    lastETHPrice = ethDisplay;
    lastDOGEPrice = dogeDisplay;

    btcLtcElem.style.color = ratioBTCtoLTC > lastRatioBTCtoLTC ? BTC_UP_COLOR : BTC_DOWN_COLOR;
    ltcBtcElem.style.color = ratioLTCtoBTC > lastRatioLTCtoBTC ? LTC_UP_COLOR : LTC_DOWN_COLOR;
    ethLtcElem.style.color = ratioETHtoLTC > lastRatioETHtoLTC ? ETH_UP_COLOR : ETH_DOWN_COLOR;
    ltcEthElem.style.color = ratioLTCtoETH > lastRatioLTCtoETH ? LTC_UP_COLOR : LTC_DOWN_COLOR;
    dogeLtcElem.style.color = ratioDOGEtoLTC > lastRatioDOGEtoLTC ? DOGE_UP_COLOR : DOGE_DOWN_COLOR;
    ltcDogeElem.style.color = ratioLTCtoDOGE > lastRatioLTCtoDOGE ? LTC_UP_COLOR : LTC_DOWN_COLOR;

    lastRatioBTCtoLTC = ratioBTCtoLTC;
    lastRatioLTCtoBTC = ratioLTCtoBTC;
    lastRatioETHtoLTC = ratioETHtoLTC;
    lastRatioLTCtoETH = ratioLTCtoETH;
    lastRatioDOGEtoLTC = ratioDOGEtoLTC;
    lastRatioLTCtoDOGE = ratioLTCtoDOGE;

  } catch (error) {
    console.error("Error fetching prices:", error);
    [
      "ltc-price", "btc-price", "eth-price", "doge-price",
      "btc-ltc-ratio", "ltc-btc-ratio", "eth-ltc-ratio",
      "ltc-eth-ratio", "doge-ltc-ratio", "ltc-doge-ratio"
    ].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = `Error`;
        el.style.color = "red";
      }
    });
  }
}

function adjustFontSize() {
  const width = window.innerWidth;
  document.querySelectorAll('.price-line').forEach(el => {
    if (width < 500) {
      el.style.fontSize = '40px';
    } else {
      el.style.fontSize = ''; // let CSS clamp handle it
    }
  });
}

window.addEventListener('resize', adjustFontSize);
adjustFontSize();

// Hover effects
document.querySelectorAll('.price-line').forEach(el => {
  el.addEventListener('mouseenter', () => {
    el.classList.add('hovered');
  });
  el.addEventListener('mouseleave', () => {
    el.classList.remove('hovered');
  });
});

fetchPrices();
setInterval(fetchPrices, 1000);
