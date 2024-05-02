<?php

/**
 * Configクラス
 * @description getメソッド実行により、getメソッドの引数に設定されたキーに一致する値をConfigファイル(common.php)から取得する。
 */
class Config {

    private const ConfigDirectory = __DIR__;    //configファイルが配置されているディレクトリ
    private const ConfigFile = 'common.php';    //configファイル名

    /**
     * getメソッド
     * @param string $s 取得する値のキー
     * @return string キーに該当する値
     */
    public static function get($s) {
        $values = preg_split('/\./', $s, -1, PREG_SPLIT_NO_EMPTY);
        $key = array_pop($values);

        //設定ファイルを複数に分けて管理する場合、以下の行を既存の物と置き換え、呼出し元のパラメータを設定例の通りに設定する事。（設定例：$key2_1Value = Config::get('common2.key');）
        // $file = array_pop($values) . '.php';

        $file = self::ConfigFile;

        $config = include(self::ConfigDirectory . DIRECTORY_SEPARATOR . $file);
        return $config[$key];
    }
}