let lastLTCPrice = null; // Store the last LTC price to track changes
let lastBTCPrice = null; // Store the last BTC price to track changes

// Function to add commas to numbers
function addCommas(num) {
  let numStr = num.toString();
  let parts = numStr.split(".");
  let intPart = parts[0];
  let decPart = parts[1] || '';
  
  intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
  return decPart ? `${intPart}.${decPart}` : intPart;
}

// Fetch prices and update the display
async function fetchPrices() {
  const ltcApiURL = "https://api.coinbase.com/v2/prices/LTC-USD/spot";
  const btcApiURL = "https://api.coinbase.com/v2/prices/BTC-USD/spot";

  try {
    // Fetch Litecoin price
    const ltcResponse = await fetch(ltcApiURL);
    const ltcData = await ltcResponse.json();
    const ltcPrice = parseFloat(ltcData.data.amount).toFixed(2); // Litecoin price with 2 decimals

    // Fetch Bitcoin price
    const btcResponse = await fetch(btcApiURL);
    const btcData = await btcResponse.json();
    const btcPrice = Math.round(parseFloat(btcData.data.amount)).toString(); // Bitcoin price as integer

    // Update LTC price (with 2 decimals and commas)
    const ltcPriceElement = document.getElementById("ltc-price");
    ltcPriceElement.textContent = addCommas(ltcPrice);

    // Update BTC price (no decimals but with commas)
    const btcPriceElement = document.getElementById("btc-price");
    btcPriceElement.textContent = addCommas(btcPrice);

    // Update ratio (rounded down to nearest whole number)
    const ratioElement = document.getElementById("ltc-btc-ratio");
    const ratio = Math.floor(parseFloat(btcPrice) / parseFloat(ltcPrice)); // Calculate ratio and round down
    ratioElement.textContent = `1:${ratio}`;

    // Color changes for LTC price
    if (lastLTCPrice !== null) {
      ltcPriceElement.style.color = parseFloat(ltcPrice) > parseFloat(lastLTCPrice) ? "yellow" : "blue";
    }
    lastLTCPrice = ltcPrice;

    // Color changes for BTC price
    if (lastBTCPrice !== null) {
      btcPriceElement.style.color = parseFloat(btcPrice) > parseFloat(lastBTCPrice) ? "yellow" : "orange";
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
