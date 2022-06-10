'use strict';

const button = document.getElementById('button'); // ボタン
const message = document.getElementById('message'); // メッセージ
const stageNumber = document.getElementById('stage-number'); // ステージ番号
const filter = document.getElementById('filter'); // フィルター
const stage = document.querySelectorAll('.stage'); // ステージ

let currentStatus = 'start'; // 現在のステータス
let currentStage = 0; // 現在のステージ
let clickCount = 1; // クリックカウント
const maxStage = 9; // 最大ステージ数

let numberBox; // number-boxクラスを持つ要素（後で取得）
let boxVolume; // number-boxクラスを持つ要素の数（後で取得）

let numbers = []; // 使用する数字を格納する
let numbersLength; // 使用する数字の数（後で取得）
let ramdomNmber;


// カードボックスにランダムに数字を当てる関数の定義
function setNumber() {

  // 1～ボックス数の数字を配列に格納
  for(let i = 1; i <= boxVolume; i++) {
    numbers.push(i);
  }
  numbersLength = numbers.length;
    
  // 各number-box要素に対して以下の処理
  numberBox.forEach((value) => {
    ramdomNmber = Math.floor(Math.random() * numbersLength); // ランダムな整数を生成
    value.textContent = numbers[ramdomNmber]; // numbers配列のramdomNmber番目の値をボックスに代入
    numbers.splice(ramdomNmber, 1); // numbers配列からramdomNmber番目の値を取り除く
    numbersLength--; // numbers配列の配列数を1減らす
  });
}


// 一瞬カードの数字を見せる関数
function instantShow() {

  // 各number-box要素に対して以下の処理
  numberBox.forEach(function(value) {
    value.classList.add('show'); // 'show'クラスを付与
    filter.classList.add('on'); // 一時的に操作不能にする

    // 0.3秒後に以下の処理
    setTimeout(() => {
      value.classList.remove('show'); // 'show'クラスを除去
      filter.classList.remove('on'); // 操作不能解除
    }, 300);
  });
}


// number-box要素がクリックされたときの判定をする関数を定義
function judge(e) {

  // クリックされたnumber-boxの数字と現在のクリック数が一致するとき以下の処理
  if(Number(e.target.textContent) === clickCount) {

    // クリックされたnumber-boxの数字を表示
    e.target.classList.add('show');

    // クリックカウントをプラス1
    clickCount++;

    // 1度クリックされたボタンは無効化する
    e.target.removeEventListener('click', judge);

    // クリックカウントがnumber-boxの合計数まで到達した場合以下の処理
    if(clickCount > boxVolume) {

      // 最終ステージの場合
      if(currentStage === maxStage) {
        message.classList.add('display-block'); // メッセージ表示
        message.textContent = '☆★☆ALL CLEAR☆★☆'; // メッセージのテキストは「☆★☆ALL CLEAR☆★☆」
        button.classList.add('display-block'); // スタートボタン表示
        button.textContent = 'もう一度！'; // スタートボタンのテキストは「もう一度！」
        currentStatus = 'gameover'; // ステータスをgameoverにする

      // 最終ステージ以外の場合
      } else {
        message.classList.add('display-block'); // メッセージ表示
        message.textContent = 'CLEAR!!'; // メッセージのテキストは「CLEAR!!」
        button.classList.add('display-block'); // スタートボタン表示
        button.textContent = '次のステージへ'; // スタートボタンのテキストは「次のステージへ」
        currentStatus = 'clear'; // ステータスをclearにする
      }
    }
  
  // クリックされたnumber-boxの数字と現在のクリック数が一致しないとき以下の処理
  } else {

    // ナンバーボックスの数字を全部表示する
    numberBox.forEach((value) => {
      value.classList.add('show');
    });
    message.classList.add('display-block'); // メッセージ表示
    message.textContent = 'GAME OVER!!'; // メッセージのテキストは「GAME OVER!!」
    button.classList.add('display-block'); // スタートボタン表示
    button.textContent = '再チャレンジ'; // スタートボタンのテキストは「再チャレンジ」
    currentStatus = 'gameover'; // ステータスをgameoverにする
    filter.classList.add('on'); // 一時的に操作不能にする
  }
}


// ステージ変更の関数を定義
function stageChange() {

  // 現在のステージを非表示にする
  stage[currentStage].classList.add('display-none');

  // クリックカウントを1に戻す
  clickCount = 1;

  // ステータスがclearの場合次のステージへ、ステータスがgameover場合、ステージを初期化
  if (currentStatus === 'clear') {
    currentStage++;
  } else if(currentStatus === 'gameover') {
    currentStage = 0;
  }
  
  // 次のステージ表示
  stage[currentStage].classList.remove('display-none');
}


// ☆スタートボタンがクリックされたとき、ここから処理開始
button.addEventListener('click', () => {

  // ボタン・メッセージ・ステージ番号を非表示にする
  button.classList.remove('display-block');
  message.classList.remove('display-block');
  stageNumber.classList.remove('display-block');

  // ステータスが'clear'か'gameover'であればstageChange関数を実行（'start'の時は飛ばす）
  if (currentStatus === 'clear' || currentStatus === 'gameover') {
    stageChange();
  }

  // 現在のステージのnumber-boxクラスを持つ要素を新たに取得
  numberBox = stage[currentStage].querySelectorAll('.number-box');

  // number-boxクラスを持つ要素の数を取得
  boxVolume = numberBox.length;

  // 各number-box要素に対してjudge関数のイベント追加
  numberBox.forEach(function(value) {
    value.addEventListener('click', judge);
  });

  // number-boxを全て非表示にする
  numberBox.forEach((value) => {
    value.classList.remove('display-block');
  });

  // 0.5秒後に以下の処理
  setTimeout(() => {

    // ステージ番号、number-boxの表示
    numberBox.forEach((value) => {
      stageNumber.textContent = `ステージ${currentStage+1}`;
      stageNumber.classList.add('display-block');
      value.classList.add('display-block');
    });
    
    // カードに数字をセットする関数を実行
    setNumber();

    // カードの数字を一瞬見せる関数を実行
    instantShow();
  }, 500);

});