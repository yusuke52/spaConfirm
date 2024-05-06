<?php
// configファイル読み込み
require_once('../config/config.php');

/**
 * LogWriteクラス
 * @description ログファイル作成及びログメッセージのファイル出力を行う。
 */
class LogWrite
{
    // logファイルパス
    private const LogDirectory = __DIR__;    //logファイルが配置されているディレクトリ

    // logファイル名フォーマット
    private const InfoLogFileNameFormat = 'logInfo_%s.log';         //情報
    private const ErrorLogFileNameFormat = 'logError_%s.log';       //エラー

    // logファイル名
    private $InfoLogFileName;         //情報
    private $ErrorLogFileName;        //エラー

    /**
     * コンストラクタ
     * @description 当日分の情報ログファイルが作成されているかをチェックし、未作成であれば作成する。
     */
    public function __construct() {

        //情報ログファイル名取得
        $this->InfoLogFileName = self::LogDirectory . '/' . sprintf(self::InfoLogFileNameFormat, date('Ymd'));

        // 情報ログファイルが作成済みであるかチェック
        if(!file_exists($this->InfoLogFileName)) {
            // ファイルが存在しなければ、作成
            touch($this->InfoLogFileName);
        }
    }

    /**
     * LogWritingメソッド
     * @param string $msg 取得する値のキー
     * @param boolean $canErrMsg エラーメッセージであるかの判定（初期値:False）
     * @description 引数のメッセージをログファイルに出力する。$canErrMsgがTrueの場合、当日分のエラーログメッセージファイルの存在チェックを行い、存在しない場合は新規作成する。
     */
    public function LogWriting($msg, $canErrMsg = false)
    {

        $logfileName = '';
        if ($canErrMsg == false) {
            //メンバ変数から情報ログファイル名取得
            $logfileName = $this->InfoLogFileName;
        } else {
            //エラーログファイル名取得
            $this->ErrorLogFileName = self::LogDirectory . '/' . sprintf(self::ErrorLogFileNameFormat, date('Ymd'));
            $logfileName = $this->ErrorLogFileName;

            // エラーログファイルが作成済みであるかチェック
            if(!file_exists($logfileName)) {
                // ファイルが存在しなければ作成する
                touch($logfileName);
            }
        }

        // 書き込み用メッセージ作成
        $writingMsg = '';
        if ($canErrMsg == false) {
            $writingMsg = date('Y/m/d G:i:s') . ' : 情報 : '.$msg;
        }else{
            $writingMsg = date('Y/m/d G:i:s') . ' : エラー : '.$msg;
        }

        // ファイルへメッセージ書き込み
        $fp = fopen($logfileName, "a");
        fwrite($fp, $writingMsg . PHP_EOL);
        fclose($fp);
    }
}
