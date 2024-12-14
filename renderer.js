// Variables to store the previous prices and ratios
let lastLTCPrice = null;
let lastBTCPrice = null;
let lastRatioBTCtoLTC = null;
let lastRatioLTCtoBTC = null;

// Function to format numbers with commas
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
    console.log("Fetching LTC and BTC prices...");

    // Fetch data from both APIs concurrently
    const [ltcResponse, btcResponse] = await Promise.all([
      fetch(ltcApiURL),
      fetch(btcApiURL),
    ]);

    if (!ltcResponse.ok || !btcResponse.ok) {
      throw new Error("Failed to fetch data from the API.");
    }

    const ltcData = await ltcResponse.json();
    const btcData = await btcResponse.json();

    // Extract prices
    const ltcPrice = parseFloat(ltcData.data.amount);
    const btcPrice = parseFloat(btcData.data.amount);

    console.log("LTC Price:", ltcPrice);
    console.log("BTC Price:", btcPrice);

    // Get DOM elements
    const ltcPriceElement = document.getElementById("ltc-price");
    const btcPriceElement = document.getElementById("btc-price");
    const btcToLtcRatioElement = document.getElementById("btc-ltc-ratio");
    const ltcToBtcRatioElement = document.getElementById("ltc-btc-ratio");

    // Update prices and ratios
    ltcPriceElement.textContent = `${addCommas(formatLTCPrice(ltcPrice))} LTC`;
    btcPriceElement.textContent = `${addCommas(formatBTCPrice(btcPrice))} BTC`;

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

    // Display error in UI
    ["ltc-price", "btc-price", "btc-ltc-ratio", "ltc-btc-ratio"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = "Error";
        el.style.color = "red";
      }
    });
  }
}

// Ensure the script runs after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Fetch prices every 10 seconds
  setInterval(fetchPrices, 10000);
  fetchPrices();
});
