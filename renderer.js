let lastLTCPrice = null;
let lastBTCPrice = null;
let lastRatio = null;

function addCommas(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatBTCPrice(price) {
  return Math.round(price).toString(); // Ensure no decimals by rounding and converting to string
}

function formatLTCPrice(price) {
  return price.toFixed(2); // Always 2 decimals for Litecoin
}

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
    
    const ltcToBtcRatio = (ltcPrice / btcPrice).toFixed(6); // Calculate LTC to BTC ratio with 6 decimals
    const btcToLtcRatio = (btcPrice / ltcPrice).toFixed(6); // Calculate BTC to LTC ratio with 6 decimals

    btcToLtcRatioElement.textContent = `${btcToLtcRatio} BTC/LTC`; // Show BTC to LTC ratio without "1:"
    ltcToBtcRatioElement.textContent = `${ltcToBtcRatio} LTC/BTC`; // Show LTC to BTC ratio as a decimal

    // Check for price changes and set colors
    if (lastLTCPrice !== null) {
      ltcPrice
