function login() {
  const id = document.getElementById('username').value.trim();
  const pw = document.getElementById('password').value;

  if (!id || !pw) {
    document.getElementById('login-error').textContent = 'IDとパスワードを入力してください。';
    return;
  }

  // パスワード保存（※簡易方式、実運用NG）
  const savedPassword = localStorage.getItem(`user_${id}_pw`);
  if (savedPassword && savedPassword !== pw) {
    document.getElementById('login-error').textContent = 'パスワードが間違っています。';
    return;
  }

  // 初回ログイン時はパスワード保存
  if (!savedPassword) {
    localStorage.setItem(`user_${id}_pw`, pw);
  }

  // ログイン成功
  sessionStorage.setItem("currentUser", id);
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('game-screen').style.display = 'block';
  document.getElementById('user-label').textContent = id;

  initGame(); // ゲームを初期化
}

function logout() {
  sessionStorage.removeItem("currentUser");
  location.reload(); // 再読み込みでログアウト
}
