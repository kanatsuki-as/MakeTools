//=============================================================================
// AdultStatus.js
//=============================================================================

/*:
 * @plugindesc メニュー画面にステータスコマンドを追加します。追加されたコマンドをクリックすると設定した値を一覧を表示します
 * @author kanatsuki (http://isyukan.com/)
 * @param status_title
 * @desc ステータス一覧の上部に表示する名前です。
 * @default 現在のエロステータス
 * 
 * @param param_name_1
 * @desc 設定値1 空文字の場合は画面上に表示されず、その部分が空白になります（上詰めはされません）
 * @default なし
 * 
 * @param param_name_2
 * @desc 設定値2 空文字の場合は画面上に表示されず、その部分が空白になります（上詰めはされません）
 * @default 
 * 
 * @param param_name_3
 * @desc 設定値3 空文字の場合は画面上に表示されず、その部分が空白になります（上詰めはされません）
 * @default 
 * 
 * @param param_name_4
 * @desc 設定値4 空文字の場合は画面上に表示されず、その部分が空白になります（上詰めはされません）
 * @default 
 * 
 * @param param_name_5
 * @desc 設定値5 空文字の場合は画面上に表示されず、その部分が空白になります（上詰めはされません）
 * @default 
 * 
 * @param param_name_6
 * @desc 設定値6 空文字の場合は画面上に表示されず、その部分が空白になります（上詰めはされません）
 * @default 
 * 
 * @param param_name_7
 * @desc 設定値7 空文字の場合は画面上に表示されず、その部分が空白になります（上詰めはされません）
 * @default 
 * 
 * @param param_name_8
 * @desc 設定値8 空文字の場合は画面上に表示されず、その部分が空白になります（上詰めはされません）
 * @default 
 * 
 * @param param_name_9
 * @desc 設定値9 空文字の場合は画面上に表示されず、その部分が空白になります（上詰めはされません）
 * @default 
 * 
 * @param param_name_10
 * @desc 設定値10 空文字の場合は画面上に表示されず、その部分が空白になります（上詰めはされません）
 * @default 
 * 
 * @param command_name
 * @desc メニューに表示するコマンド名を設定します。
 * @default エロステータス
 * 
 * 
 * @param status_position
 * @desc メニューに表示する位置を設定します
   0: 左に立ち絵、右に値、それ以外: 左に値、右に立ち絵
 * @default 0
 * 

 ・メニュー画面に、下記の項目を追加します。
 ・メニューコマンド
 ・エッチステータス画面

 作者: kanatsuki (
 作成日: 2019/7/20
*/




// 自作オブジェクトのコンストラクタ
// 即時関数の外に出しておかないとデータをロードした時に
// prototypeがundefinedになるので注意
function AdultStatusSaveObj(){
    this.initialize.apply(this, arguments);
}




// 以下から即時関数
(function(){
    'use strict';

//-----------------------------------------------------------------------------
// 初期化処理

const pluginName = "AdultStatus";
// メニュー画面コマンドと選択した後の処理をつなぐ際のバインド名
const command_bind_name = 'adult_status';

// 設定値の固有名
const PARAM_LIST = 
{ 
    'param1': 'param_name_1',
    'param2': 'param_name_2',
    'param3': 'param_name_3',
    'param4': 'param_name_4',
    'param5': 'param_name_5',
    'param6': 'param_name_6',
    'param7': 'param_name_7',
    'param8': 'param_name_8',
    'param9': 'param_name_9',
    'param10': 'param_name_10',}

    // 設定パラメーター取得
    let parameters = PluginManager.parameters(pluginName)

    // パラメータからデータを取得
    const command_name = String(parameters['command_name'] || 'エロステータス')
    const status_position = String(parameters['status_position'] || 0)
    const status_title = String(parameters['status_title'] || '現在のエロステータス')

    // ステータス名。ステータス値は保存の必要があるので、_Game_Systemにかく。ここでは処理しない
    let adultParamName ={}
    Object.keys(PARAM_LIST).forEach(function(key) {
        let val = PARAM_LIST[key];
        adultParamName[val] = String(parameters[val] || '')
    });
    

// -------------------------------------------------------------------------------------
// データ設定

   // プラグインコマンドの定義
   var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    
   Game_Interpreter.prototype.pluginCommand = function(command, args)
   {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if(command === pluginName){

            switch(args[0]){
                case 'AddParam':
                $gameSystem.AdultStatusSaveObj().AddParam(args[1],args[2])
                break;
                case 'GetParam': 
                return $gameSystem.AdultStatusSaveObj().GetParam(args[1])
                case 'SetPicture':
                $gameSystem.AdultStatusSaveObj().SetPicture(args[1])
                break;
                case 'GetPicture': 
                return $gameSystem.AdultStatusSaveObj().GetPicture()
            }
        }
    };

    // Game_System
    // プラグインのデータを保存するために
    // Game_Systemにオブジェクトを追加しておく
    // ---------- Game_System ここから ----------
    var _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function(){
        _Game_System_initialize.call(this);
        this._AdultStatusSaveObj = new AdultStatusSaveObj();
    };
 
    Game_System.prototype.AdultStatusSaveObj = function(){
	    return this._AdultStatusSaveObj;
    };
    // ---------- Game_System ここまで ----------
 
    // 自作クラス(オブジェクト)
    AdultStatusSaveObj.prototype            = Object.create(AdultStatusSaveObj.prototype);
    AdultStatusSaveObj.prototype.costructor = AdultStatusSaveObj;
    
    AdultStatusSaveObj.prototype.initialize = function(){
    	this.adultParamValue = {}
        this.fileName = ''
    };
 
    AdultStatusSaveObj.prototype.AddParam = function(key ,value){

        const nowValue = this.GetParam(key) === undefined ? 0 : this.GetParam(key) 
        this.adultParamValue[PARAM_LIST[key]] = nowValue + parseInt(value)
    }

    AdultStatusSaveObj.prototype.GetParam = function(key){
    	return this.adultParamValue[PARAM_LIST[key]]
    }

    AdultStatusSaveObj.prototype.SetPicture = function(fileName){
        this.fileName = fileName
    }

    AdultStatusSaveObj.prototype.GetPicture = function(){
    	return this.fileName
    }
 
 //-----------------------------------------------------------------------------
 // コマンド処理

    // プラグインコマンドの定義
    const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function(){
        _Window_MenuCommand_addOriginalCommands.call(this);
        let enabled = this.areMainCommandsEnabled();
        this.addCommand(command_name, command_bind_name, enabled);
    };

    // コマンド選択時の処理
    const _Scene_Menu_prototype_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_prototype_createCommandWindow.call(this);

        this._commandWindow.setHandler(command_bind_name, () => {
        // メニュー選択されたらテストオプションを呼び出す 
            SceneManager.push(Adult_Status);
        });

    }

 //-----------------------------------------------------------------------------
    // Adult_Status

    function Adult_Status() {
        this.initialize.apply(this, arguments);
    }

    Adult_Status.prototype = Object.create(Scene_MenuBase.prototype);
    Adult_Status.prototype.constructor = Adult_Status;

    Adult_Status.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    // window生成
    Adult_Status.prototype.create = function()  {
        Scene_MenuBase.prototype.create.call(this);
        this._adult_statusWindow = new Window_AdultStatus();
        this._adult_statusWindow.setHandler('cancel', this.popScene.bind(this));

        // 自作ステータス画面にデータを設定
        this._adult_statusWindow.setText();

        this.addWindow(this._adult_statusWindow);
    };
    



 //-----------------------------------------------------------------------------
    // Window_AdultStatus

    function Window_AdultStatus() {
        this.initialize.apply(this, arguments);
    }
    
    Window_AdultStatus.prototype = Object.create(Window_Selectable.prototype);
    Window_AdultStatus.prototype.constructor = Window_AdultStatus;
    
    Window_AdultStatus.prototype.initialize = function() {
        var width = Graphics.boxWidth;
        var height = Graphics.boxHeight;
        Window_Selectable.prototype.initialize.call(this, 0, 0, width, height);
        this._actor = null;
        this.refresh();
        this.activate();
    };

    Window_AdultStatus.prototype.setText = function()  {
            this.refresh();
    };

    Window_AdultStatus.prototype.refresh = function() {
        // 今書かれているものを削除
        this.contents.clear();

        // ラインの高さを取得
        let lineHeight = this.lineHeight()
        // 描画位置計算
        let status_y = lineHeight
        let status_x = status_position != 0 ? this.textPadding() : (Graphics.boxWidth / 4) * 2 + this.textPadding()
        let pic_x = status_position == 0 ? this.textPadding() : (Graphics.boxWidth / 4) * 2 + this.textPadding()

        // 一番長い文字列を取得
        let drawLongLength = 0
        Object.keys(PARAM_LIST).forEach(function(key)
        {
            let length = adultParamName[PARAM_LIST[key]].length;
            drawLongLength =  drawLongLength > length ? drawLongLength : length
        });
        // 数字の描画位置設定
        const x2 = status_x + this.standardFontSize() * drawLongLength;

        // 描画処理
        let pictname = $gameSystem.AdultStatusSaveObj().GetPicture();
        if(!pictname) throw 'ファイルがありません'

        var bitmap = ImageManager.loadPicture(pictname);
        var sprite = new Sprite(bitmap);
        sprite.x = pic_x;
        sprite.y = 0;
        this.addChild(sprite); 

        // タイトル
        this.drawTextEx(status_title, status_x, status_y, 300, 'left');
        // ライン
        this.contents.fillRect(status_x, status_y + this.standardFontSize() + 10, 300, 2, this.normalColor());

        // パラメーター
        Object.keys(PARAM_LIST).forEach(function(key, index) {
            index++;
            let y2 = status_y + lineHeight * index + (index * 10);
            const drawName = adultParamName[PARAM_LIST[key]];

            // 記述があれば描画
            if(drawName)
            {
                this.changeTextColor(this.systemColor());
                this.drawText(drawName + ':', status_x, y2, 200, 'left');
                this.resetTextColor();

                this.drawText($gameSystem.AdultStatusSaveObj().GetParam(key) || 0, x2 + 75, y2, 60, 'right');
            }
        },this);
    };

})();


   