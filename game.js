const reelSymbols = ["🍒", "🍋", "🍊", "🍇", "🔔", "⭐"];
const reels = [
  document.getElementById("reel1"),
  document.getElementById("reel2"),
  document.getElementById("reel3"),
];
const coinDisplay = document.getElementById("coins");
const messageDisplay = document.getElementById("message");
const spinButton = document.getElementById("spin-button");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const userLabel = document.getElementById("user-label");
const loginError = document.getElementById("login-error");
const loginBonusDisplay = document.getElementById("login-bonus");

const exchangeBtn = document.getElementById("exchange-10-coins");
const exchangeMsg = document.getElementById("exchange-message");

const rankingList = document.getElementById("ranking-list");

const startBattleBtn = document.getElementById("start-battle");
const battleMessage = document.getElementById("battle-message");

const secretCodeInput = document.getElementById("secret-code-input");
const secretCodeBtn = document.getElementById("secret-code-btn");
const secretCodeMessage = document.getElementById("secret-code-message");

let coins = 0;
let currentUser = null;

// ログイン関数
function login() {
  const id = document.getElementById("username").value.trim();
  const pw = document.getElementById("password").value;

  if (!id || !pw) {
    loginError.textContent = "IDとパスワードを入力してください。";
    return;
  }

  const savedPassword = localStorage.getItem(`user_${id}_pw`);
  if (savedPassword && savedPassword !== pw) {
    loginError.textContent = "パスワードが間違っています。";
    return;
  }

  if (!savedPassword) {
    localStorage.setItem(`user_${id}_pw`, pw);
  }

  sessionStorage.setItem("currentUser", id);
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";
  userLabel.textContent = id;

  // ログインボーナス
  const today = new Date().toDateString();
  const lastLoginKey = `user_${id}_lastLogin`;
  const lastLogin = localStorage.getItem(lastLoginKey);

  if (lastLogin !== today) {
    const coinKey = `user_${id}_coins`;
    const currentCoins = parseInt(localStorage.getItem(coinKey) || "0", 10);
    const newCoins = currentCoins + 5;
    localStorage.setItem(coinKey, newCoins);
    localStorage.setItem(lastLoginKey, today);
    loginBonusDisplay.textContent = "🎁 本日のログインボーナス +5枚！";
  } else {
    loginBonusDisplay.textContent = "";
  }

  initGame();
}

// ログアウト
function logout() {
  sessionStorage.removeItem("currentUser");
  location.reload();
}

// ゲーム初期化
function initGame() {
  currentUser = sessionStorage.getItem("currentUser");
  if (!currentUser) {
    return;
  }
  const saved = localStorage.getItem(`user_${currentUser}_coins`);
  coins = saved ? parseInt(saved, 10) : 10;
  updateCoins();
  updateRanking();
}

// コイン表示更新
function updateCoins() {
  coinDisplay.textContent = coins;
  localStorage.setItem(`user_${currentUser}_coins`, coins);
}

// スピン処理
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
  const spinDuration = 60; // 約1秒

  const spinInterval = setInterval(() => {
    reels.forEach((reel) => {
      const randIndex = Math.floor(Math.random() * reelSymbols.length);
      reel.textContent = reelSymbols[randIndex];
    });
    spinCount++;
    if (spinCount >= spinDuration) {
      clearInterval(spinInterval);
      checkResult();
      spinButton.disabled = false;
    }
  }, 16);
});

// 結果判定
function checkResult() {
  const symbols = reels.map((r) => r.textContent);
  if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
    // 3つ揃いボーナス
    const reward = 10;
    coins += reward;
    updateCoins();
    messageDisplay.textContent = `🎉 おめでとう！${symbols[0]} が3つ揃いました！ +${reward}枚`;
  } else if (
    symbols[0] === symbols[1] ||
    symbols[1] === symbols[2] ||
    symbols[0] === symbols[2]
  ) {
    // 2つ揃いボーナス
    const reward = 3;
    coins += reward;
    updateCoins();
    messageDisplay.textContent = `😊 2つ揃い！ +${reward}枚`;
  } else {
    messageDisplay.textContent = "残念！また挑戦してね。";
  }
}

// 交換所処理
exchangeBtn.addEventListener("click", () => {
  if (coins >= 10) {
    coins -= 10;
    updateCoins();
    exchangeMsg.textContent = "アイテム1個と交換しました！";
  } else {
    exchangeMsg.textContent = "メダルが足りません。";
  }
});

// ランキング更新
function updateRanking() {
  rankingList.innerHTML = "";
  // localStorageから全ユーザーのメダル情報を取得
  const users = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.endsWith("_coins")) {
      const userId = key.split("_")[1];
      const userCoins = parseInt(localStorage.getItem(key), 10);
      users.push({ userId, coins: userCoins });
    }
  }
  // コインの多い順にソート
  users.sort((a, b) => b.coins - a.coins);

  // トップ10まで表示
  users.slice(0, 10).forEach(({ userId, coins }, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}位: ${userId} - ${coins}枚`;
    rankingList.appendChild(li);
  });
}

// 対戦開始
startBattleBtn.addEventListener("click", () => {
  // 対戦相手を決める（自分以外のユーザーをランダムに選択）
  const opponents = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.endsWith("_coins")) {
      const userId = key.split("_")[1];
      if (userId !== currentUser) {
        opponents.push(userId);
      }
    }
  }
  if (opponents.length === 0) {
    battleMessage.textContent = "対戦できる相手がいません。";
    return;
  }

  const opponentId =
    opponents[Math.floor(Math.random() * opponents.length)];
  const userCoins = coins;
  const opponentCoins = parseInt(
    localStorage.getItem(`user_${opponentId}_coins`) || "0",
    10
  );

  let resultText = `対戦相手: ${opponentId}\nあなた: ${userCoins}枚 vs 相手: ${opponentCoins}枚\n`;

  if (userCoins > opponentCoins) {
    resultText += "あなたの勝ち！🎉 +5枚ボーナス";
    coins += 5;
    updateCoins();
  } else if (userCoins < opponentCoins) {
    resultText += "あなたの負け…😢 -3枚ペナルティ";
    coins = Math.max(0, coins - 3);
    updateCoins();
  } else {
    resultText += "引き分けです。";
  }

  battleMessage.textContent = resultText.replace(/\n/g, "<br>");
});

// 暗証番号ボーナス
secretCodeBtn.addEventListener("click", () => {
  const code = secretCodeInput.value.trim();
  if (code === "114514") {
    const amount = 20; // 好きな枚数を追加
    coins += amount;
    updateCoins();
    secretCodeMessage.textContent = `正解！メダル${amount}枚を獲得！🎉`;
  } else {
    secretCodeMessage.textContent = "暗証番号が違います。";
  }
  secretCodeInput.value = "";
});

// ページロード時にログイン判定
window.onload = () => {
  const savedUser = sessionStorage.getItem("currentUser");
  if (savedUser) {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "block";
    userLabel.textContent = savedUser;
    initGame();
  }
};

loginBtn.addEventListener("click", login);
logoutBtn.addEventListener("click", logout);
