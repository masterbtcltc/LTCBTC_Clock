// Price state
let lastLTCPrice = null;
let lastBTCPrice = null;
let lastRatioBTCtoLTC = null;
let lastRatioLTCtoBTC = null;
let lastBTCD = null;
let lastLTCD = null;

function addCommas(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatBTCPrice(price) {
  return Math.round(price).toString();
}

function formatLTCPrice(price) {
  return price.toFixed(2);
}

// Fetch price data from Coinbase
async function fetchPrices() {
  try {
    const [ltcRes, btcRes] = await Promise.all([
      fetch("https://api.coinbase.com/v2/prices/LTC-USD/spot"),
      fetch("https://api.coinbase.com/v2/prices/BTC-USD/spot")
    ]);

    const ltcPrice = parseFloat((await ltcRes.json()).data.amount);
    const btcPrice = parseFloat((await btcRes.json()).data.amount);

    const ltcDisplay = formatLTCPrice(ltcPrice);
    const btcDisplay = formatBTCPrice(btcPrice);

    const ltcElem = document.getElementById("ltc-price");
    const btcElem = document.getElementById("btc-price");
    const btcLtcElem = document.getElementById("btc-ltc-ratio");
    const ltcBtcElem = document.getElementById("ltc-btc-ratio");

    ltcElem.textContent = `${addCommas(ltcDisplay)} LTC`;
    btcElem.textContent = `${addCommas(btcDisplay)} BTC`;

    const ratioBTCtoLTC = (btcPrice / ltcPrice).toFixed(0);
    const ratioLTCtoBTC = (ltcPrice / btcPrice).toFixed(6);

    btcLtcElem.textContent = `${ratioBTCtoLTC} BTC/LTC`;
    ltcBtcElem.textContent = `${ratioLTCtoBTC} LTC/BTC`;

    // Color transitions
    if (lastLTCPrice !== null) {
      ltcElem.style.color = parseFloat(ltcDisplay) > parseFloat(lastLTCPrice) ? "yellow" : "#00A0FF";
    }
    lastLTCPrice = ltcDisplay;

    if (lastBTCPrice !== null) {
      btcElem.style.color = parseInt(btcDisplay) > parseInt(lastBTCPrice) ? "yellow" : "orange";
    }
    lastBTCPrice = btcDisplay;

    if (lastRatioBTCtoLTC !== null) {
      btcLtcElem.style.color = ratioBTCtoLTC > lastRatioBTCtoLTC ? "orange" : "#00A0FF";
    }
    lastRatioBTCtoLTC = ratioBTCtoLTC;

    if (lastRatioLTCtoBTC !== null) {
      ltcBtcElem.style.color = ratioLTCtoBTC > lastRatioLTCtoBTC ? "#00A0FF" : "orange";
    }
    lastRatioLTCtoBTC = ratioLTCtoBTC;

  } catch (error) {
    console.error("Error fetching prices:", error);
    document.getElementById("ltc-price").textContent = "Error LTC";
    document.getElementById("btc-price").textContent = "Error BTC";
    document.getElementById("btc-ltc-ratio").textContent = "N/A BTC:LTC";
    document.getElementById("ltc-btc-ratio").textContent = "N/A LTC:BTC";

    document.getElementById("ltc-price").style.color = "red";
    document.getElementById("btc-price").style.color = "red";
    document.getElementById("btc-ltc-ratio").style.color = "red";
    document.getElementById("ltc-btc-ratio").style.color = "red";
  }
}

// Fetch BTC/LTC dominance from CoinGecko
async function fetchDominance() {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/global");
    const data = await response.json();

    const btcD = data.data.market_cap_percentage.btc;
    const ltcD = data.data.market_cap_percentage.ltc;

    const btcElem = document.getElementById("btc-dominance");
    const ltcElem = document.getElementById("ltc-dominance");

    btcElem.textContent = `${btcD.toFixed(2)}% BTC Dominance`;
    ltcElem.textContent = `${ltcD.toFixed(2)}% LTC Dominance`;

    if (lastBTCD !== null) {
      btcElem.style.color = btcD > lastBTCD ? "yellow" : "#f7931a";
    }
    lastBTCD = btcD;

    if (lastLTCD !== null) {
      ltcElem.style.color = ltcD > lastLTCD ? "yellow" : "#bebebe";
    }
    lastLTCD = ltcD;

  } catch (error) {
    console.error("Error fetching dominance:", error);
    document.getElementById("btc-dominance").textContent = "Error BTC.D";
    document.getElementById("ltc-dominance").textContent = "Error LTC.D";
    document.getElementById("btc-dominance").style.color = "red";
    document.getElementById("ltc-dominance").style.color = "red";
  }
}

// Run fetches
fetchPrices();
fetchDominance();

setInterval(fetchPrices, 1000);     // every second
setInterval(fetchDominance, 60000); // every 60s
