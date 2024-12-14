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
  return Math.round(price).toString(); // Ensure no decimals by rounding and converting to string
}

// Function to format Litecoin price (2 decimals)
function formatLTCPrice(price) {
  return price.toFixed(2); // Always 2 decimals for Litecoin
}

// Fetch the latest prices from the Coinbase API
async function fetchPrices() {
  const ltcApiURL = "https://api.coinbase.com/v2/prices/LTC-USD/spot";
  const btcApiURL = "https://api.coinbase.com/v2/prices/BTC-USD/spot";

  try {
    // Fetch Litecoin and Bitcoin prices concurrently
    const [ltcResponse, btcResponse] = await Promise.all([
      fetch(ltcApiURL),
      fetch(btcApiURL),
    ]);

    if (!ltcResponse.ok || !btcResponse.ok) throw new Error("API response not OK");

    const [ltcData, btcData] = await Promise.all([
      ltcResponse.json(),
      btcResponse.json(),
    ]);

    const ltcPrice = parseFloat(ltcData.data.amount);
    const btcPrice = parseFloat(btcData.data.amount);

    // Format prices
    const formattedLtcPrice = formatLTCPrice(ltcPrice);
    const formattedBtcPrice = formatBTCPrice(btcPrice);

    // Get DOM elements
    const ltcPriceElement = document.getElementById("ltc-price");
    const btcPriceElement = document.getElementById("btc-price");
    const btcToLtcRatioElement = document.getElementById("btc-ltc-ratio");
    const ltcToBtcRatioElement = document.getElementById("ltc-btc-ratio");

    if (!ltcPriceElement || !btcPriceElement || !btcToLtcRatioElement || !ltcToBtcRatioElement) {
      throw new Error("Missing DOM elements");
    }

    // Update DOM elements with prices
    ltcPriceElement.textContent = `${addCommas(formattedLtcPrice)} LTC`;
    btcPriceElement.textContent = `${addCommas(formattedBtcPrice)} BTC`;

    // Calculate and update ratios
    const btcToLtcRatio = (btcPrice / ltcPrice).toFixed(0);
    const ltcToBtcRatio = (ltcPrice / btcPrice).toFixed(6);

    btcToLtcRatioElement.textContent = `${btcToLtcRatio} BTC/LTC`;
    ltcToBtcRatioElement.textContent = `${ltcToBtcRatio} LTC/BTC`;

    // Check for price changes and update colors
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
    console.error("Error fetching prices:", error.message);

    // Handle errors by updating DOM with error messages and red color
    const elements = ["ltc-price", "btc-price", "btc-ltc-ratio", "ltc-btc-ratio"];
    elements.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = "Error";
        el.style.color = "red";
      }
    });
  }
}

// Set interval to fetch prices every 10 seconds
setInterval(fetchPrices, 10000);

// Initial fetch
fetchPrices();
