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

// Function to format the prices
function formatPrice(price, isLTC) {
  if (isLTC) {
    // Litecoin: Always show 2 decimals
    return parseFloat(price).toFixed(2);
  } else {
    // Bitcoin: Only add decimal if price is 1000 or more
    return price >= 1000 ? parseFloat(price).toFixed(1) : Math.round(price).toString();
  }
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

    // Format prices
    const formattedLtcPrice = formatPrice(ltcPrice, true);  // Always 2 decimals for Litecoin
    const formattedBtcPrice = formatPrice(btcPrice, false); // Only decimal if BTC >= 1000

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
