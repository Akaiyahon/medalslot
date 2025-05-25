function login() {
  const id = document.getElementById('username').value.trim();
  const pw = document.getElementById('password').value;

  if (!id || !pw) {
    document.getElementById('login-error').textContent = 'IDとパスワードを入力してください。';
    return;
  }

  const savedPassword = localStorage.getItem(`user_${id}_pw`);
  if (savedPassword && savedPassword !== pw) {
    document.getElementById('login-error').textContent = 'パスワードが間違っています。';
    return;
  }

  if (!savedPassword) {
    localStorage.setItem(`user_${id}_pw`, pw);
  }

  sessionStorage.setItem("currentUser", id);
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('game-screen').style.display = 'block';
  document.getElementById('user-label').textContent = id;

  // ログインボーナスチェック
  const today = new Date().toDateString();
  const lastLoginKey = `user_${id}_lastLogin`;
  const lastLogin = localStorage.getItem(lastLoginKey);

  if (lastLogin !== today) {
    const coinKey = `user_${id}_coins`;
    const currentCoins = parseInt(localStorage.getItem(coinKey) || "0", 10);
    const newCoins = currentCoins + 5;
    localStorage.setItem(coinKey, newCoins);
    localStorage.setItem(lastLoginKey, today);
    document.getElementById('login-bonus').textContent = "🎁 本日のログインボーナス +5枚！";
  } else {
    document.getElementById('login-bonus').textContent = "";
  }

  initGame();
}

function logout() {
  sessionStorage.removeItem("currentUser");
  location.reload();
}
