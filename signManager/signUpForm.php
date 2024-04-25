<h1>新規会員登録</h1>
<form action="./signUp.php" method="post">
<div>
    <label>
        名前：
        <input type="text" name="name" required>
    </label>
</div>
<div>
    <label>
        メールアドレス(ログイン時のIDになります。)開発中：入力したアドレス先に実際にメールが送信されることはありません。：<br>
        <input type="text" name="mail" required>
    </label>
</div>
<div>
    <label>
        パスワード：
        <input type="password" name="pass" required>
    </label>
</div>
<input type="submit" value="新規登録">
</form>
<p>すでに登録済みの方は<a href="./signInForm.php">こちら</a></p>
