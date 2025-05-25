const reelSymbols = ["🍒", "🍋", "🍊", "🍇", "🔔", "⭐"];
const reels = [document.getElementById("reel1"), document.getElementById("reel2"), document.getElementById("reel3")];
const coinDisplay = document.getElementById("coins");
const messageDisplay = document.getElementById("message");
const spinButton = document.getElementById("spin-button");

let coins = 0;
let currentUser = null;

function initGame() {
  currentUser = sessionStorage.getItem("currentUser");
  const saved = localStorage.getItem(`user_${currentUser}_coins`);
  coins = saved ? parseInt(saved, 10) : 10;
  updateCoins();
}

function updateCoins() {
  coinDisplay.textContent = coins;
  localStorage.setItem(`user_${currentUser}_coins`, coins);
}

spinButton.addEventListener("click", () => {
  if (coins <= 0) {
    messageDisplay.textContent = "メダルが足りません！";
    return;
  }

  spinButton.disabled = true;
  coins--;
  updateCoins();
  messageDisplay.textContent = "";

  let spinCount = 0;
  const spinDuration = 60;
  const interval = setInterval(() => {
    for (let i = 0; i < reels.length; i++) {
      reels[i].textContent = reelSymbols[Math.floor(Math.random() * reelSymbols.length)];
    }

    spinCount++;
    if (spinCount >= spinDuration) {
      clearInterval(interval);
      const result = reels.map(() => reelSymbols[Math.floor(Math.random() * reelSymbols.length)]);
      for (let i = 0; i < reels.length; i++) {
        reels[i].textContent = result[i];
      }

      if (result[0] === result[1] && result[1] === result[2]) {
        coins += 5;
        messageDisplay.textContent = "おめでとう！スリーカードで +5枚！";
      } else if (
        result[0] === result[1] ||
        result[1] === result[2] ||
        result[0] === result[2]
      ) {
        coins += 1;
        messageDisplay.textContent = "ニコイチで +1枚！";
      }

      updateCoins();
      spinButton.disabled = false;
    }
  }, 50);
});
