// Variables to store the previous prices and ratios
let lastLTCPrice = null;
let lastBTCPrice = null;
let lastRatioBTCtoLTC = null;
let lastRatioLTCtoBTC = null;
let lastBTCD = null;
let lastLTCD = null;

// Function to add commas to numbers
function addCommas(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Function to format Bitcoin price (no decimals)
function formatBTCPrice(price) {
  return Math.round(price).toString();
}

// Function to format Litecoin price (2 decimals)
function formatLTCPrice(price) {
  return price.toFixed(2);
}

// Fetch price data from Coinbase
async function fetchPrices() {
  const ltcApiURL = "https://api.coinbase.com/v2/prices/LTC-USD/spot";
  const btcApiURL = "https://api.coinbase.com/v2/prices/BTC-USD/spot";

  try {
    const ltcResponse = await fetch(ltcApiURL);
    const ltcData = await ltcResponse.json();
    const ltcPrice = parseFloat(ltcData.data.amount);

    const btcResponse = await fetch(btcApiURL);
    const btcData = await btcResponse.json();
    const btcPrice = parseFloat(btcData.data.amount);

    const formattedLtcPrice = formatLTCPrice(ltcPrice);
    const formattedBtcPrice = formatBTCPrice(btcPrice);

    const ltcPriceElement = document.getElementById("ltc-price");
    const btcPriceElement = document.getElementById("btc-price");
    const btcToLtcRatioElement = document.getElementById("btc-ltc-ratio");
    const ltcToBtcRatioElement = document.getElementById("ltc-btc-ratio");

    ltcPriceElement.textContent = `${addCommas(formattedLtcPrice)} LTC`;
    btcPriceElement.textContent = `${addCommas(formattedBtcPrice)} BTC`;

    const btcToLtcRatio = (btcPrice / ltcPrice).toFixed(0);
    const ltcToBtcRatio = (ltcPrice / btcPrice).toFixed(6);

    btcToLtcRatioElement.textContent = `${btcToLtcRatio} BTC/LTC`;
    ltcToBtcRatioElement.textContent = `${ltcToBtcRatio} LTC/BTC`;

    // Color changes
    if (lastLTCPrice !== null) {
      ltcPriceElement.style.color = parseFloat(formattedLtcPrice) > parseFloat(lastLTCPrice) ? "yellow" : "#00A0FF";
    }
    lastLTCPrice = formattedLtcPrice;

    if (lastBTCPrice !== null) {
      btcPriceElement.style.color = parseInt(formattedBtcPrice) > parseInt(lastBTCPrice) ? "yellow" : "orange";
    }
    lastBTCPrice = formattedBtcPrice;

    if (lastRatioBTCtoLTC !== null) {
      btcToLtcRatioElement.style.color = btcToLtcRatio > lastRatioBTCtoLTC ? "orange" : "#00A0FF";
    }
    lastRatioBTCtoLTC = btcToLtcRatio;

    if (lastRatioLTCtoBTC !== null) {
      ltcToBtcRatioElement.style.color = ltcToBtcRatio > lastRatioLTCtoBTC ? "#00A0FF" : "orange";
    }
    lastRatioLTCtoBTC = ltcToBtcRatio;
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

// Fetch dominance data from CoinGecko
async function fetchDominance() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/global');
    const data = await response.json();

    const btcD = data.data.market_cap_percentage.btc;
    const ltcD = data.data.market_cap_percentage.ltc;

    const btcDElement = document.getElementById("btc-dominance");
    const ltcDElement = document.getElementById("ltc-dominance");

    btcDElement.textContent = `${btcD.toFixed(2)}% BTC Dominance`;
    ltcDElement.textContent = `${ltcD.toFixed(2)}% LTC Dominance`;

    if (lastBTCD !== null) {
      btcDElement.style.color = btcD > lastBTCD ? "yellow" : "#f7931a";
    }
    lastBTCD = btcD;

    if (lastLTCD !== null) {
      ltcDElement.style.color = ltcD > lastLTCD ? "yellow" : "#bebebe";
    }
    lastLTCD = ltcD;
  } catch (error) {
    console.error("Error fetching dominance data:", error);
    document.getElementById("btc-dominance").textContent = "Error BTC.D";
    document.getElementById("ltc-dominance").textContent = "Error LTC.D";
    document.getElementById("btc-dominance").style.color = "red";
    document.getElementById("ltc-dominance").style.color = "red";
  }
}

// Run price fetch every second
setInterval(fetchPrices, 1000);
fetchPrices();

// Run dominance fetch every 60 seconds
setInterval(fetchDominance, 60000);
fetchDominance();
