let lastLTCPrice = null; 
let lastBTCPrice = null;

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

    document.getElementById("ltc-price").textContent = addCommas(formattedLtcPrice);
    document.getElementById("btc-price").textContent = addCommas(formattedBtcPrice);

    const ratio = Math.floor(btcPrice / ltcPrice);
    document.getElementById("ltc-btc-ratio").textContent = `1:${ratio}`;

    if (lastLTCPrice !== null) {
      const ltcPriceElement = document.getElementById("ltc-price");
      ltcPriceElement.style.color = parseFloat(formattedLtcPrice) > parseFloat(lastLTCPrice) ? "#00A0FF" : "blue";
    }
    lastLTCPrice = formattedLtcPrice;

    if (lastBTCPrice !== null) {
      const btcPriceElement = document.getElementById("btc-price");
      btcPriceElement.style.color = parseInt(formattedBtcPrice) > parseInt(lastBTCPrice) ? "yellow" : "orange";
    }
    lastBTCPrice = formattedBtcPrice;
  } catch (error) {
    console.error("Error fetching prices:", error);
    
    document.getElementById("ltc-price").textContent = "Error";
    document.getElementById("btc-price").textContent = "Error";
    document.getElementById("ltc-btc-ratio").textContent = "N/A";

    document.getElementById("ltc-price").style.color = "red";
    document.getElementById("btc-price").style.color = "red";
    document.getElementById("ltc-btc-ratio").style.color = "red";
  }
}

setInterval(fetchPrices, 1000);
fetchPrices();
