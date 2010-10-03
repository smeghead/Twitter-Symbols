//history
//2010-06-20 1.0.0 リリース
//2010-06-20 1.0.1 記号を大きく表示するように修正した。
//2010-06-20 1.0.3 id=status の入力エリアが存在しない場合は、表示しないように修正した。
//2010-06-20 1.0.4 ボタンから、機能を呼び出すように修正した。
//2010-06-20 1.0.5 ボタンのキャプションの文字サイズを大きくした。
//2010-06-21 1.0.6 シンボルテーブルが、半透明にならないようにした。
//2010-06-22 1.0.7 主要処理を実行するタイミングを変更して、確実に実行できるように修正した。ログを出力するように修正した。
//2010-08-03 1.0.8 added Japanese Face Marks. and able to edit face marks. Enjoy!
//2010-08-05 1.0.9 be able to use http://twipple.jp/ too.
//2010-08-17 1.0.10 modified css.
//2010-08-17 1.0.11 add options information.
//2010-08-27 1.0.12 be able to use http://hootsuite.com/
//2010-08-27 1.0.13 fixed a bug after posted, smile button disapeared. in hootsuite page.
//2010-08-28 1.0.14 supported facemarks quoted.
//2010-10-03 1.0.15 supported new twitter ui.

//割り込み処理
console.log('Twitter Symbols: initialize start.');

var options = {};
//オプション設定項目の取得
console.log('request send');
chrome.extension.sendRequest("get_ts_options", function(response) {
  options = response.options;
  register_scripts();
});
console.log('request sent');

var search_status_box, generate_smile_link, setup_smile_link;
if (location.hostname.match(/twitter/)) {
  //Twitter
  search_status_box = function search_status_box(statusBox) {
    return document.getElementById('status');
  };
  generate_smile_link = function generate_smile_link() {
    var smile_link = document.createElement('a');
    //smile_link.setAttribute('class', 'smily-button tweet-button button');
    smile_link.setAttribute('class', 'a-btn a-btn-m smily-button tweet-button button');
    var button_caption = document.createTextNode();
    button_caption.nodeValue = '☺';
    smile_link.appendChild(button_caption);
    return smile_link;
  };
  setup_smile_link = function setup_smile_link(smile_link, symbol_table, callee, buttons) {
    var buttons = buttons || document.getElementById('tweeting_controls');
    if (!buttons) {
      console.log('Twitter Symbols: no buttons. setup stop.');
      return;
    }
    var as = buttons.getElementsByTagName('a');
    console.log('as:' + as.length);
    var tweet = as[as.length - 1];
    console.log('tweet:' + tweet.outerHTML);
    buttons.insertBefore(smile_link, tweet);
    buttons.insertBefore(symbol_table, tweet);
    symbol_table.setAttribute('top', smile_link.top + smile_link.height);
    symbol_table.setAttribute('left', smile_link.left);
    symbol_table.style.display = 'none';
    console.log('had setup');
  };
} else if (location.hostname.match(/twipple/)) {
  //Twipple
  search_status_box = function search_status_box() {
    return document.getElementById('input');
  };
  generate_smile_link = function generate_smile_link() {
    var smile_link = document.createElement('a');
    smile_link.setAttribute('class', 'twipple-smile-link');
    var span = document.createElement('span');
    var button_caption = document.createTextNode();
    button_caption.nodeValue = '☺';
    span.appendChild(button_caption);
    span.setAttribute('style', 'font-size:15pt;');
    smile_link.appendChild(span);
    return smile_link;
  };
  setup_smile_link = function setup_smile_link(smile_link, symbol_table) {
    var buttons = document.getElementById('postarea_inRight');
    if (!buttons) {
      console.log('Twitter Symbols: no buttons. setup stop.');
      return;
    }
    buttons.insertBefore(smile_link, buttons.firstChild);
    buttons.insertBefore(symbol_table, buttons.firstChild);
    symbol_table.setAttribute('top', smile_link.top + smile_link.height);
    symbol_table.setAttribute('left', smile_link.left);
    symbol_table.style.display = 'none';
  };
} else if (location.hostname.match(/hootsuite/)) {
  //hootsuite
  search_status_box = function search_status_box() {
    return document.getElementById('messageBoxMessage');
  };
  generate_smile_link = function generate_smile_link() {
    var smile_link = document.createElement('a');
    smile_link.setAttribute('class', 'hootsuite-smile-link');
    var span = document.createElement('span');
    var button_caption = document.createTextNode();
    button_caption.nodeValue = '☺';
    span.appendChild(button_caption);
    smile_link.appendChild(span);
    return smile_link;
  };
  setup_smile_link = function setup_smile_link(smile_link, symbol_table, callee) {
    console.log('setup_smile_link.');
    var buttons = document.getElementById('messageTools');
    if (!buttons) {
      console.log('Twitter Symbols: no buttons. setup stop.');
      return;
    }
    buttons.insertBefore(symbol_table, buttons.firstChild);
    buttons.insertBefore(smile_link, buttons.firstChild);
    symbol_table.setAttribute('top', smile_link.top + smile_link.height);
    symbol_table.setAttribute('left', smile_link.left);
    symbol_table.style.display = 'none';
    // check symbol table. if deleted symbol table, recreate.
    if (document.twitter_symbols___timer == undefined) {
      console.log('check register.');
      document.twitter_symbols___timer = setInterval(function(){
        if (!document.getElementById('symbols')) {
          callee();
        }
      }, 5000);
      console.log('check registered.');
    }
  };
} else {
  throw new Exception('unknown url.');
}

function create_symbol_tables(status, container) {
  var callee = arguments.callee;
  var symbols = '♥✈☺♬☑♠☎☻♫☒♤☤☹♪♀✩✉☠✔♂★✇♺✖♨❦☁✌♛❁☪☂✏♝❀☭☃☛♞✿☮☼☚♘✾☯☾☝♖✽✝☄☟♟✺☥✂✍♕✵☉☇☈☡✠☊☋☌☍♁✇☢☣✣✡☞☜✜✛❥♈♉♊♋♌♍♎♏♐♑♒♓☬☫☨☧☦✁✃✄✎✐❂❉❆♅♇♆♙♟♔♕♖♗♘♚♛♜♝♞©®™…∞¥€£ƒ$≤≥∑«»ç∫µ◊ı∆Ω≈*§•¶¬†&¡¿øå∂œÆæπß÷‰√≠%˚ˆ˜˘¯∑ºª‽?';
  var cols_num = 15;
  var cols_num_smile = 3;
  var symbols_id = 'symbol_table' + new Date().getTime();
  try {
    var symbol_table = document.createElement('table');
    symbol_table.setAttribute('id', symbols_id);
    symbol_table.setAttribute('class', 'symbols');
    var tr = document.createElement('tr');
    for (var i = 0; i < symbols.length; i++) {
      var td = document.createElement('td');
      if (i % cols_num == 0) 
        tr = document.createElement('tr');
      var text = document.createTextNode();
      text.nodeValue = symbols[i];
      td.appendChild(text);
      td.addEventListener('click', function(){
          var statusBox = status || search_status_box();
          if (!statusBox) {
            console.log('Twitter Symbols: no status box. setup stop.');
            return;
          }
          var pos = statusBox.selectionStart;
          statusBox.value = statusBox.value.substring(0, pos) + this.innerText + statusBox.value.substring(pos);
          statusBox.selectionStart = pos + this.innerText.length;
          var s = document.getElementById(symbols_id);
          s.style.display = s.style.display != "inline" ? "inline" : "none";
      }, false);
      tr.appendChild(td);
      if (i % cols_num == cols_num - 1 || i == symbols.length - 1) 
        symbol_table.appendChild(tr);
    }
    //smile marks
    for (var i = 0; i < options.smiles.length; i++) {
      var td = document.createElement('td');
      td.setAttribute('colspan', '5');
      td.setAttribute('class', 'facemark');
      if (i % cols_num_smile == 0) 
        tr = document.createElement('tr');
      var text = document.createTextNode();
      text.nodeValue = options.smiles[i];
      td.appendChild(text);
      td.addEventListener('click', function(){
          var statusBox = status || search_status_box(statusBox);
          if (!statusBox) {
            console.log('Twitter Symbols: no status box. setup stop.');
            return;
          }
          var pos = statusBox.selectionStart;
          var facemark = this.innerText;
          if (facemark.match(/^".*"$/)) {
            facemark = facemark.substring(1, facemark.length -1);
          }
          statusBox.value = statusBox.value.substring(0, pos) + facemark + statusBox.value.substring(pos);
          statusBox.selectionStart = pos + facemark.length;
          var s = document.getElementById(symbols_id);
          s.style.display = s.style.display != "inline" ? "inline" : "none";
      }, false);
      tr.appendChild(td);
      if (i % cols_num_smile == cols_num_smile - 1 || i == options.smiles.length - 1) 
        symbol_table.appendChild(tr);
    }
    //options link.
    var text = document.createTextNode();
    text.nodeValue = 'You can add and edit smile marks in options page.';
    var td = document.createElement('td');
    td.setAttribute('colspan', cols_num);
    td.setAttribute('class', 'description');
    td.appendChild(text);
    tr = document.createElement('tr');
    tr.appendChild(td);
    symbol_table.appendChild(tr);

    var smile_link = generate_smile_link();
    smile_link.setAttribute(
        smile_link.tagName.toLowerCase() == 'a' ? 'href' : 'onClick',
        'javascript:var s = document.getElementById("' + symbols_id + '"); s.style.display = s.style.display == "none" ? "inline" : "none";');

    setup_smile_link(smile_link, symbol_table, callee, container);
    var body = document.getElementsByTagName('body')[0];
    body.addEventListener('click', function(){var s = document.getElementById(symbols_id); if (s.style.display == "inline") s.style.display = "none";}, false);
  } catch (e) {
    console.log('Twitter Symbols: ' + e);
  }
}
function register_scripts() {
  var globalScript = "(" + (function(){
    console.log('Twitter Symbols: global script start.');
    create_symbol_tables();
    var body = document.getElementsByTagName('body')[0];
    body.addEventListener('DOMNodeInserted', function(event){
      var divs = event.target.getElementsByTagName('div');
      for (var i = 0; i < divs.length; i++) {
        var d = divs[i];
        if (d.className.indexOf('tweet-button-container') > -1) {
          console.log('=====new edit area inserted.');
          console.log('inserted. ' + d.parentElement.outerHTML);
          var cont = d;
          setTimeout(function(){
            console.log('timeout called. ' + cont.parentElement.outerHTML);
            var textareaNodeList = cont.parentElement.getElementsByTagName('textarea');
            console.log('elements search. ');
            if (textareaNodeList.length == 0) break;
            var statusBox = textareaNodeList.item(0);
            console.log('statusbox : ' + statusBox);
            console.log('start : ' + statusBox.selectionStart);
            create_symbol_tables(statusBox, cont);
          }, 500);
          console.log('set timeout. ');
        }
      }
    });
    console.log('Twitter Symbols: global script end.');
  }).toString() + ")();";

  //スクリプトノード追加
  exportToSite('var options = ' + JSON.stringify(options) + ';', globalScript, search_status_box, generate_smile_link, setup_smile_link, create_symbol_tables);
  console.log('Twitter Symbols: initialize end.');
}

//スクリプトのサイトスペースへのエクスポート
function exportToSite() {
  var scriptContent = '';
  for (var i = 0; i < arguments.length; i++) {
    scriptContent += arguments[i].toString() + '\n';
  }
  addScriptNode(scriptContent);
}

//スクリプトノードの生成
function addScriptNode(content){
  var headNode = document.querySelector('head');
  var scriptNode = document.createElement('script');
  scriptNode.setAttribute('type','text/javascript');
  //ちゃんとテキストノード作って追加しないとWindows版のChromeで動かない
  var textNode = document.createTextNode();
  textNode.nodeValue = '//<![CDATA[\n' + content + '\n//]]>';
  scriptNode.appendChild(textNode);
  headNode.appendChild(scriptNode);
}

/* vim: set ts=2 sw=2 sts=2 expandtab fenc=utf-8: */
