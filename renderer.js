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
    const ratioElement = document.getElementById("ltc-btc-ratio");
    const reverseRatioElement = document.getElementById("ltc-btc-ratio-reverse");

    ltcPriceElement.textContent = `${addCommas(formattedLtcPrice)} LTC`;
    btcPriceElement.textContent = `${addCommas(formattedBtcPrice)} BTC`;
    
    const ratio = (btcPrice / ltcPrice).toFixed(8); // Display ratio directly
    ratioElement.textContent = `${ratio}LTC:BTC`;
    reverseRatioElement.textContent = `${(ratio).toFixed(8)} BTC:LTC`;

    // Check for price changes and set colors
    if (lastLTCPrice !== null) {
      ltcPriceElement.style.color = parseFloat(formattedLtcPrice) > parseFloat(lastLTCPrice) ? "yellow" : "#00A0FF"; // Yellow for increase, bright blue for decrease
    }
    lastLTCPrice = formattedLtcPrice;

    if (lastBTCPrice !== null) {
      btcPriceElement.style.color = parseInt(formattedBtcPrice) > parseInt(lastBTCPrice) ? "yellow" : "orange"; // Yellow for increase, orange for decrease
    }
    lastBTCPrice = formattedBtcPrice;

    if (lastRatio !== null) {
      ratioElement.style.color = ratio > lastRatio ? "yellow" : "white"; // Yellow for increase, white for decrease or no change
    }
    lastRatio = ratio;
  } catch (error) {
    console.error("Error fetching prices:", error);
    
    document.getElementById("ltc-price").textContent = "Error LTC";
    document.getElementById("btc-price").textContent = "Error BTC";
    document.getElementById("ltc-btc-ratio").textContent = "N/A LTC:BTC";
    document.getElementById("ltc-btc-ratio-reverse").textContent = "N/A BTC:LTC";

    document.getElementById("ltc-price").style.color = "red";
    document.getElementById("btc-price").style.color = "red";
    document.getElementById("ltc-btc-ratio").style.color = "red";
    document.getElementById("ltc-btc-ratio-reverse").style.color = "red";
  }
}

setInterval(fetchPrices, 1000);
fetchPrices();
