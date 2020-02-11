//=============================================================================
// ReminiscenceCreate.js
//=============================================================================

/*:
 * @plugindesc 画面に簡易的な回想機能を作成します。
 * @author kanatsuki (http://isyukan.com/)
 * 
 * @param sceneName
 * @desc 回想に並べるイベント名（Commonでつけた名前）を指定します。数字以外の文字列を指定してください
 * 
 * @param startX
 * @desc 開始位置のX座標です。数字で指定してください
 * @default 0
 * 
 * @param startY
 * @desc 開始位置のY座標です。数字で指定してください
 * @default 0
 * 
 * @param row_gap
 * @desc 行（横）の間隔です。数字で指定してください
 * @default 0
 * 
 * @param column_gap
 * @desc 行（縦）の間隔です。数字で指定してください
 * @default 0
 * 
 * @param rowsCount
 * @desc 行（横）にいくつシーンを並べるか。数字で指定してください
 * @default 5
 * 

 ・画面に簡易的な回想機能を作成します。
 ・

 作者: kanatsuki (
 作成日: 2020/2/09
*/

// 以下から即時関数
(function() {
  "use strict";

  //=============================================================================
  // StorageManager
  //  json形式で保存する処理を追加定義します。
  //=============================================================================
  StorageManager.saveToLocalDataFile = function(fileName, json) {
    let data = JSON.stringify(json);
    let fs = require("fs");
    let dirPath = this.localDataFileDirectoryPath();
    let filePath = dirPath + fileName;
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
    fs.writeFileSync(filePath, data);
  };

  StorageManager.localDataFileDirectoryPath = function() {
    let path = require("path");
    let base = path.dirname(process.mainModule.filename);
    return path.join(base, "data/");
  };

  //-----------------------------------------------------------------------------
  // 初期化処理
  //=============================================================================

  const fs = require("fs");
  const dirPath = StorageManager.localDataFileDirectoryPath();

  const pluginName = "ReminiscenceCreate";
  const command_bind_name = "reminiscence_create";

  alert("回想作成機能がonになっています。回想機能を作成後、機能をoffもしくは削除してください");


  //=============================================================================
  // パラメーター処理
  //=============================================================================

  const parameters = PluginManager.parameters(pluginName)
  const sceneName = String(parameters['sceneName'] || '');
  const startX = Number(parameters['startX'] || 0);
  const startY = Number(parameters['startY'] || 0);
  const row_gap = Number(parameters['row_gap'] || 0) + 1;
  const column_gap = Number(parameters['column_gap'] || 0) + 1;
  const rowsCount = Number(parameters['rowsCount'] || 1);

  SceneManager.onKeyDown = function(event) {
    switch (event.keyCode) {
      case 116:   // F5
          if(!window.confirm("注意。回想を作成するMAPのイベントは空である必要があります。\nまたこの機能はイベント内容を直接書き換えるため、使用時にはimgやaudioと同じ場所にあるdataフォルダをコピーしてバックアップを作る事を推奨します。回想を作成しますか？")) {
            return;
          }
          // Mapデータ読み込み
          var filename = "Map%1.json".format($gameMap.mapId().padZero(3));
          let mapData = JSON.parse(fs.readFileSync(dirPath + filename));

          if(!sceneName) {
            alert("シーン名がありません");
            return;
          }

          for(const map of mapData.events) {
            if(map != null) {
              alert("マップにイベントが存在します。イベントを削除してください");
              return;
            }
          }
         
          const events = createReminiscence();
      
          if(events.length < 1) {
            alert("sceneNameが見つかりませんでした。Commonでつけた名前と同じか再度確認してください");
            return;
          }

          console.log(events);
          mapData.events = events;
          StorageManager.saveToLocalDataFile(filename, mapData);
          alert("作成しました");
          break;
        }
  };

  // 回想シーンを作成します。
  const createReminiscence = function() {
    //
    const commonEvents = JSON.parse(
      fs.readFileSync(dirPath + "CommonEvents.json")
    );

    const sceneEvents = commonEvents.filter(event => {
      if(!event) return false;
      const regexp = new RegExp(sceneName + '[0-9 ０-９]{1,3}');
      return event.name.match(regexp) ? true : false;
      }
    );

    let retEventList = [];
    retEventList.push(null);
    let currentRowCount = 0;
    let currentcolumnCount = 0;

    sceneEvents.forEach((sceneEvent, index) => {
      const id = index + 1;
      const scene = {
        id: id,
        name: "scene" + "%1".format((index + 1).padZero(3)),
        note: "",
        pages: [
          {
            conditions: {
              actorId: 1,
              actorValid: false,
              itemId: 1,
              itemValid: false,
              selfSwitchCh: "A",
              selfSwitchValid: false,
              switch1Id: 1,
              switch1Valid: false,
              switch2Id: 1,
              switch2Valid: false,
              variableId: 1,
              variableValid: false,
              variableValue: 0
            },
            directionFix: false,
            image: {
              characterIndex: 0,
              characterName: "",
              direction: 2,
              pattern: 0,
              tileId: 0
            },
            list: [
              { code: 101, indent: 0, parameters: ["", 0, 0, 2] },
              {
                code: 401,
                indent: 0,
                parameters: ["〇〇のシーンです。再生しますか？"]
              },
              {
                code: 102,
                indent: 0,
                parameters: [["はい", "いいえ"], 1, 0, 1, 0]
              },
              { code: 402, indent: 0, parameters: [0, "はい"] },
              { code: 117, indent: 1, parameters: [sceneEvent.id] },
              { code: 0, indent: 1, parameters: [] },
              { code: 402, indent: 0, parameters: [1, "いいえ"] },
              { code: 0, indent: 1, parameters: [] },
              { code: 404, indent: 0, parameters: [] },
              { code: 0, indent: 0, parameters: [] }
            ],
            moveFrequency: 3,
            moveRoute: {
              list: [{ code: 0, parameters: [] }],
              repeat: true,
              skippable: false,
              wait: false
            },
            moveSpeed: 3,
            moveType: 0,
            priorityType: 0,
            stepAnime: false,
            through: false,
            trigger: 0,
            walkAnime: true
          }
        ],
        x: startX + (currentRowCount * row_gap),
        y: startY + (currentcolumnCount * column_gap),
      };
      retEventList.push(scene);

      // 次の位置へ
      currentRowCount++;
      if(currentRowCount >= rowsCount) {
        currentRowCount = 0;
        currentcolumnCount++;
      }
    });

    return retEventList;
  };
})();
