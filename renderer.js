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

// Function to format Bitcoin price with conditions
function formatBTCPrice(price) {
  // Bitcoin: If the price is 1000 or more, show 1 decimal place, otherwise, show as an integer (no decimal)
  if (price >= 1000) {
    return price.toFixed(1);  // One decimal if >= 1000
  }
  return Math.round(price).toString();  // No decimal for lower prices
}

// Function to format Litecoin price
function formatLTCPrice(price) {
  // Litecoin: Always show 2 decimal places
  return price.toFixed(2);
}

// Fetch prices and update the display
async function fetchPrices() {
  const ltcApiURL = "https://api.coinbase.com/v2/prices/LTC-USD/spot";
  const btcApiURL = "https://api.coinbase.com/v2/prices/BTC-USD/spot";

  try {
    // Fetch Litecoin price
    const ltcResponse = await fetch(ltcApiURL);
    const ltcData = await ltcResponse.json();
    const ltcPrice = parseFloat(ltcData.data.amount); // Litecoin price

    // Fetch Bitcoin price
    const btcResponse = await fetch(btcApiURL);
    const btcData = await btcResponse.json();
    const btcPrice = parseFloat(btcData.data.amount); // Bitcoin price

    console.log(`BTC Price: ${btcPrice}`);  // Debugging line
    console.log(`LTC Price: ${ltcPrice}`);  // Debugging line

    // Format prices
    const formattedLtcPrice = formatLTCPrice(ltcPrice);  // Always 2 decimals for Litecoin
    const formattedBtcPrice = formatBTCPrice(btcPrice); // 1 decimal for Bitcoin if >= 1000, else no decimals

    // Update LTC price (with 2 decimals and commas)
    const ltcPriceElement = document.getElementById("ltc-price");
    ltcPriceElement.textContent = addCommas(formattedLtcPrice);

    // Update BTC price (formatted with commas)
    const btcPriceElement = document.getElementById("btc-price");
    btcPriceElement.textContent = addCommas(formattedBtcPrice);

    // Update ratio (rounded down to nearest whole number)
    const ratioElement = document.getElementById("ltc-btc-ratio");
    const ratio = Math.floor(btcPrice / ltcPrice); // Calculate ratio and round down
    ratioElement.textContent = `1:${ratio}`;

    // Color changes for LTC price
    if (lastLTCPrice !== null) {
      ltcPriceElement.style.color = parseFloat(formattedLtcPrice) > parseFloat(lastLTCPrice) ? "yellow" : "blue";
    }
    lastLTCPrice = formattedLtcPrice;

    // Color changes for BTC price
    if (lastBTCPrice !== null) {
      btcPriceElement.style.color = parseFloat(formattedBtcPrice) > parseFloat(lastBTCPrice) ? "yellow" : "orange";
    }
    lastBTCPrice = formattedBtcPrice;
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
