async function fetchEthereumPrice() {
  const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum');
  const data = await response.json();
  return {
    price: data[0].current_price,
    priceChangePercentage: data[0].price_change_percentage_24h,
  };
}

function getBadgeColor(priceChangePercentage) {
  if (priceChangePercentage <= -5) {
    return '#F44336'; // Red
} else {
    return '#4CAF50'; // Green
  }
}

async function displayEthereumPrice() {
  try {
    const { price, priceChangePercentage } = await fetchEthereumPrice();
    const badgeText = `${Math.round(price)}`;
    const badgeColor = getBadgeColor(priceChangePercentage);
    chrome.action.setBadgeText({ text: badgeText });
    chrome.action.setBadgeBackgroundColor({ color: badgeColor });
  } catch (error) {
    chrome.action.setBadgeText({ text: 'Err' });
    chrome.action.setBadgeBackgroundColor({ color: '#F44336' });
    console.error(error);
  }
}

chrome.action.onClicked.addListener((tab) => {
  displayEthereumPrice();
});

chrome.alarms.create('updateEthereumPrice', { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'updateEthereumPrice') {
    displayEthereumPrice();
  }
});

displayEthereumPrice(); // Display the initial price
