<header>
  <link href="./styles/style.css" rel="stylesheet" />
  <nav>共通メニュー</nav>

  <?php
    if (session_status() == PHP_SESSION_NONE) {
      // セッションは有効で、開始していないとき
      session_start();
    }
    if (isset($_SESSION['name'])){
      $name = $_SESSION['name'];
    };
  ?>
  <label>利用者：<?php echo $name; ?></label>&nbsp;
  <button id="./signManager/logOutButton" onclick="location.href='./signManager/signOut.php'">ログアウト</button>
</header>
