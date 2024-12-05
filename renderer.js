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

// Function to format Bitcoin price
function formatBTCPrice(price) {
  // Show no decimal if the price is less than 1000, else show one decimal
  if (price >= 1000) {
    return price.toFixed(1); // One decimal if >= 1000
  } else {
    return Math.floor(price).toString(); // No decimal for lower prices
  }
}

// Function to format Litecoin price with two decimals
function formatLTCPrice(price) {
  return price.toFixed(2); // Always show 2 decimal places for Litecoin
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
    const formattedLtcPrice = formatLTCPrice(ltcPrice); // Always 2 decimals for Litecoin
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

    // Color changes for LTC price (brighter blue when price increases)
    const brightBlue = "#00A0FF"; // Brighter blue color
    if (lastLTCPrice !== null) {
      ltcPriceElement.style.color = parseFloat(formattedLtcPrice) > parseFloat(lastLTCPrice) ? brightBlue : "blue"; 
    }
    lastLTCPrice = formattedLtcPrice;

    // Color changes for BTC price
    if (lastBTCPrice !== null) {
      btcPriceElement.style.color = parseFloat(formattedBtcPrice) > parseFloat(lastBTCPrice) ? "yellow" : "orange";
    }
    lastBTCPrice = formattedBtcPrice;

    // Update the scrolling text for Bitcoin at 100k swap message
    const scrollTextElement = document.getElementById("scrolling-text");
    if (btcPrice >= 100000) {
      scrollTextElement.textContent = "Litecoin heading into high 5-digits";
    } else {
      scrollTextElement.textContent = ""; // Clear when Bitcoin is below 100k
    }

  } catch (error) {
    console.error("Error fetching prices:", error);

    // Display error messages
    const ltcPriceElement = document.getElementById("ltc-price");
    const btcPriceElement = document.getElementById("btc-price");
    const ratioElement = document.getElementById("ltc-btc-ratio");
    const scrollTextElement = document.getElementById("scrolling-text");

    ltcPriceElement.textContent = "Error";
    btcPriceElement.textContent = "Error";
    ratioElement.textContent = "N/A";
    scrollTextElement.textContent = "Error fetching data.";

    ltcPriceElement.style.color = "red";
    btcPriceElement.style.color = "red";
    ratioElement.style.color = "red";
    scrollTextElement.style.color = "red";
  }
}

// Refresh prices every 1 second
setInterval(fetchPrices, 1000);

// Fetch prices immediately when the page loads
fetchPrices();
