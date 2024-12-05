let lastLTCPrice = null; // Store the last LTC price to track changes
let lastBTCPrice = null; // Store the last BTC price to track changes

// Fetch prices and update the display
async function fetchPrices() {
  const ltcApiURL = "https://api.coinbase.com/v2/prices/LTC-USD/spot";
  const btcApiURL = "https://api.coinbase.com/v2/prices/BTC-USD/spot";

  try {
    // Fetch Litecoin price
    const ltcResponse = await fetch(ltcApiURL);
    const ltcData = await ltcResponse.json();
    const ltcPrice = parseFloat(ltcData.data.amount); // Litecoin price with decimals

    // Fetch Bitcoin price
    const btcResponse = await fetch(btcApiURL);
    const btcData = await btcResponse.json();
    const btcPrice = Math.round(parseFloat(btcData.data.amount)); // Round BTC price to nearest whole number

    // Update LTC price (with 2 decimals)
    const ltcPriceElement = document.getElementById("ltc-price");
    ltcPriceElement.textContent = ltcPrice.toFixed(2); // Always show Litecoin with 2 decimals

    // Update BTC price (no decimals)
    const btcPriceElement = document.getElementById("btc-price");
    btcPriceElement.textContent = btcPrice.toString(); // Display BTC price as an integer string

    // Update ratio (rounded down to nearest whole number)
    const ratioElement = document.getElementById("ltc-btc-ratio");
    const ratio = Math.floor(btcPrice / ltcPrice); // Calculate ratio and round down to the nearest whole number
    ratioElement.textContent = `1:${ratio}`;

    // Color changes for LTC price
    if (lastLTCPrice !== null) {
      ltcPriceElement.style.color = ltcPrice > lastLTCPrice ? "yellow" : "blue";
    }
    lastLTCPrice = ltcPrice;

    // Color changes for BTC price
    if (lastBTCPrice !== null) {
      btcPriceElement.style.color = btcPrice > lastBTCPrice ? "yellow" : "orange";
    }
    lastBTCPrice = btcPrice;
  } catch (error) {
    console.error("Error fetching prices:", error);

    // Display error messages
    const ltcPriceElement = document.getElementById("ltc-price");
    const btcPriceElement = document.getElementById("btc-price");
    const ratioElement = document.getElementById("ltc-btc-ratio");

    ltcPriceElement.textContent = "Error";
    btcPriceElement.textContent = "Error";
    ratioElement.textContent = "N/A";

    ltcPriceElement.style.color = "red";
    btcPriceElement.style.color = "red";
    ratioElement.style.color = "red";
  }
}

// Refresh prices every 1 second
setInterval(fetchPrices, 1000);

// Fetch prices immediately when the page loads
fetchPrices();
