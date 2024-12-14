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
    // Fetch Litecoin price
    const ltcResponse = await fetch(ltcApiURL);
    if (!ltcResponse.ok) throw new Error("LTC API response not OK");
    const ltcData = await ltcResponse.json();
    if (!ltcData.data || !ltcData.data.amount) throw new Error("Invalid LTC API response");
    const ltcPrice = parseFloat(ltcData.data.amount);

    // Fetch Bitcoin price
    const btcResponse = await fetch(btcApiURL);
    if (!btcResponse.ok) throw new Error("BTC API response not OK");
    const btcData = await btcResponse.json();
    if (!btcData.data || !btcData.data.amount) throw new Error("Invalid BTC API response");
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
      ltcPriceElement.style.color = parseFloat(formattedLtcPrice) > parseFloat(lastLTCPrice) ? "yellow" : "#00A0FF"; // Yellow for increase, bright blue for decrease
    }
    lastLTCPrice = formattedLtcPrice;

    if (lastBTCPrice !== null) {
      btcPriceElement.style.color = parseInt(formattedBtcPrice) > parseInt(lastBTCPrice) ? "yellow" : "orange"; // Yellow for increase, orange for decrease
    }
    lastBTCPrice = formattedBtcPrice;

    if (lastRatioBTCtoLTC !== null) {
      btcToLtcRatioElement.style.color = btcToLtcRatio > lastRatioBTCtoLTC ? "orange" : "#00A0FF"; // Orange for increase, Blue for decrease or no change
    }
    lastRatioBTCtoLTC = btcToLtcRatio;

    if (lastRatioLTCtoBTC !== null) {
      ltcToBtcRatioElement.style.color = ltcToBtcRatio > lastRatioLTCtoBTC ? "#00A0FF" : "orange"; // Blue for increase, orange for decrease or no change
    }
    lastRatioLTCtoBTC = ltcToBtcRatio;

  } catch (error) {
    console.error("Error fetching prices:", error.message);

    // Handle errors by updating DOM with error messages and red color
    document.getElementById("ltc-price")?.textContent = "Error LTC";
    document.getElementById("btc-price")?.textContent = "Error BTC";
    document.getElementById("btc-ltc-ratio")?.textContent = "N/A BTC:LTC";
    document.getElementById("ltc-btc-ratio")?.textContent = "N/A LTC:BTC";

    const elements = ["ltc-price", "btc-price", "btc-ltc-ratio", "ltc-btc-ratio"];
    elements.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.color = "red";
    });
  }
}

// Set interval to fetch prices every second
setInterval(fetchPrices, 1000);

// Initial fetch
fetchPrices();
