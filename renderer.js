// Variables to store the previous prices and ratios
let lastLTCPrice = null;
let lastBTCPrice = null;
let lastRatioBTCtoLTC = null;
let lastRatioLTCtoBTC = null;

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

// Fetch the latest prices from the Coinbase API
async function fetchPrices() {
  const ltcApiURL = "https://api.coinbase.com/v2/prices/LTC-USD/spot";
  const btcApiURL = "https://api.coinbase.com/v2/prices/BTC-USD/spot";

  try {
    const [ltcResponse, btcResponse] = await Promise.all([
      fetch(ltcApiURL),
      fetch(btcApiURL),
    ]);

    if (!ltcResponse.ok || !btcResponse.ok) {
      throw new Error("API response not OK");
    }

    const ltcData = await ltcResponse.json();
    const btcData = await btcResponse.json();

    const ltcPrice = parseFloat(ltcData.data.amount);
    const btcPrice = parseFloat(btcData.data.amount);

    const formattedLtcPrice = formatLTCPrice(ltcPrice);
    const formattedBtcPrice = formatBTCPrice(btcPrice);

    const ltcPriceElement = document.getElementById("ltc-price");
    const btcPriceElement = document.getElementById("btc-price");
    const btcToLtcRatioElement = document.getElementById("btc-ltc-ratio");
    const ltcToBtcRatioElement = document.getElementById("ltc-btc-ratio");

    if (!ltcPriceElement || !btcPriceElement || !btcToLtcRatioElement || !ltcToBtcRatioElement) {
      throw new Error("Missing DOM elements");
    }

    // Update prices
    ltcPriceElement.textContent = `${addCommas(formattedLtcPrice)} LTC`;
    btcPriceElement.textContent = `${addCommas(formattedBtcPrice)} BTC`;

    // Calculate ratios
    const btcToLtcRatio = (btcPrice / ltcPrice).toFixed(0);
    const ltcToBtcRatio = (ltcPrice / btcPrice).toFixed(6);

    btcToLtcRatioElement.textContent = `${btcToLtcRatio} BTC/LTC`;
    ltcToBtcRatioElement.textContent = `${ltcToBtcRatio} LTC/BTC`;

    // Update colors based on changes
    if (lastLTCPrice !== null) {
      ltcPriceElement.style.color = ltcPrice > lastLTCPrice ? "yellow" : "#00A0FF";
    }
    lastLTCPrice = ltcPrice;

    if (lastBTCPrice !== null) {
      btcPriceElement.style.color = btcPrice > lastBTCPrice ? "yellow" : "orange";
    }
    lastBTCPrice = btcPrice;

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

    // Update DOM with error messages and colors
    const elements = ["ltc-price", "btc-price", "btc-ltc-ratio", "ltc-btc-ratio"];
    elements.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = "Error";
        el.style.color = "red";
      }
    });
  }
}

// Fetch prices every second
setInterval(fetchPrices, 1000);

// Initial fetch
fetchPrices();
