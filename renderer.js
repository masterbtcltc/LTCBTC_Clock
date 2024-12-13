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
    const btcToLtcRatioElement = document.getElementById("btc-ltc-ratio");
    const ltcToBtcRatioElement = document.getElementById("ltc-btc-ratio");

    ltcPriceElement.textContent = `${addCommas(formattedLtcPrice)} LTC`;
    btcPriceElement.textContent = `${addCommas(formattedBtcPrice)} BTC`;
    
    const ltcToBtcRatio = (ltcPrice / btcPrice).toFixed(6); // Calculate LTC to BTC ratio with 6 decimals
    const btcToLtcRatio = (btcPrice / ltcPrice); // Calculate BTC to LTC ratio with 6 decimals

    // Calculate without decimals
    const roundedBtcToLtcRatio = Math.round(btcPrice / ltcPrice);

    btcToLtcRatioElement.textContent = `${roundedBtcToLtcRatio} BTC:LTC`;
    ltcToBtcRatioElement.textContent = `${ltcToBtcRatio} LTC:BTC`;





    // Check for price changes and set colors
    if (lastLTCPrice !== null) {
      ltcPriceElement.style.color = parseFloat(formattedLtcPrice) > parseFloat(lastLTCPrice) ? "yellow" : "#00A0FF";
    }
    lastLTCPrice = formattedLtcPrice;

    if (lastBTCPrice !== null) {
      btcPriceElement.style.color = parseInt(formattedBtcPrice) > parseInt(lastBTCPrice) ? "yellow" : "orange";
    }
    lastBTCPrice = formattedBtcPrice;

    if (lastRatio !== null) {
      btcToLtcRatioElement.style.color = btcToLtcRatio > lastRatio ? "yellow" : "white";
    }
    lastRatio = btcToLtcRatio;
  } catch (error) {
    console.error("Error fetching prices:", error);
    
    document.getElementById("ltc-price").textContent = "Error LTC";
    document.getElementById("btc-price").textContent = "Error BTC";
    document.getElementById("btc-ltc-ratio").textContent = "N/A BTC:LTC";
    document.getElementById("ltc-btc-ratio").textContent = "N/A LTC:BTC";

    document.getElementById("ltc-price").style.color = "red";
    document.getElementById("btc-price").style.color = "red";
    document.getElementById("btc-ltc-ratio").style.color = "red";
    document.getElementById("ltc-btc-ratio").style.color = "red";
  }
}

setInterval(fetchPrices, 1000);
fetchPrices();
