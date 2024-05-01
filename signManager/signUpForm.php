<h1>新規ユーザ登録</h1>
<form action="./signUp.php" method="post">
<div>
    <label>
        名前：<br>
        &nbsp;&nbsp;<input type="text" name="name" required>
    </label>
</div>
<div>
    <label>
        メールアドレス(サインイン時のIDになります。開発中のため、入力したアドレス先に実際にメールが送信されることはありません。)：<br>
        &nbsp;&nbsp;<input type="text" name="mail" required>
    </label>
</div>
<div>
    <label>
        パスワード：<br>
        &nbsp;&nbsp;<input type="password" name="pass" required>
    </label>
</div>
<input type="submit" value="新規登録">
</form>
<p>すでに登録済みの方は<a href="./signInForm.php">こちら</a></p>
