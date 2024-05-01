<header>
  <link href="./styles/style.css" rel="stylesheet" />
  <nav><?php echo $title; ?></nav>

  <?php

    //includeを使っている呼び出し元のファイル情報を取得
    $txt_name = debug_backtrace();
    //includeを使っている呼び出し元のファイル名を出力
    $txt_name = $txt_name[0]["file"];
    $txt_name = basename($txt_name, ".php");

    if (session_status() == PHP_SESSION_NONE) {
      // セッションは有効で、開始していないとき
      session_start();
    }
    if (isset($_SESSION['name'])){
      $name = $_SESSION['name'];
    };
  ?>

  <div style="text-align:right;">
    <label>利用者：<?php echo $name; ?></label>&nbsp;
    <button id="logOutButton" onclick="location.href='./signManager/signOut.php'">サインアウト</button>&nbsp;
  </div>

  <?php
      if ($txt_name != 'menu') {
        print '&nbsp;<a href="./menu.php">メニュー画面</a>';
      }
  ?>
</header>
