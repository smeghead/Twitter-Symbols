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
//2010-10-03 1.0.16 fixed a bug that create too many smile buttons.
//2010-10-03 1.0.17 fixed a bug that create too many smile buttons in hootsuite.
//2011-02-18 1.0.18 fixed a bug that smile button does'nt appear.
//2011-04-28 1.0.19 added coffee cup symbol.
//2011-07-28 1.0.20 supported with DOM structure changed in official twitter site.
//2011-08-07 1.0.21 supported new twipple.jp. source code has restructured.

//割り込み処理
console.log('Twitter Symbols: initialize start.');

//オプション設定項目の取得
chrome.extension.sendRequest("get_ts_options", function(response) {
  init(response.options);
});

function twitter_site() {
  return { 
    init: function(options) {
      document.body.addEventListener('DOMNodeInserted', function(event){
        if (!event.target.innerHTML) return;
        var divs = event.target.getElementsByTagName('div');
        for (var i = 0; i < divs.length; i++) {
          var d = divs[i];
          if (d.className.indexOf('tweet-button-sub-container') > -1) {
            var cont = d;
            setTimeout(function(){
              var textareaNodeList = cont.parentElement.parentElement.getElementsByTagName('textarea');
              if (textareaNodeList.length == 0) return;
              var status_box = textareaNodeList.item(0);
              create_symbol_tables(options, status_box, cont);
            }, 500);
          }
        }
      });
    },
    search_status_box: function(status_box) {
      return document.getElementById('status');
    },
    generate_smile_link: function() {
      var smile_link = document.createElement('a');
      //smile_link.setAttribute('class', 'smily-button tweet-button button');
      smile_link.setAttribute('class', 'a-btn a-btn-m smily-button tweet-button button');
      var button_caption = document.createTextNode();
      button_caption.nodeValue = '☺';
      smile_link.appendChild(button_caption);
      return smile_link;
    },
    setup_smile_link: function(smile_link, symbol_table, callee, buttons) {
      var buttons = buttons || document.getElementById('tweeting_controls');
      if (!buttons) {
        console.log('Twitter Symbols: no buttons. setup stop.');
        return;
      }

      var tweet = buttons.querySelector('a.tweet-button');
      buttons.insertBefore(smile_link, tweet);
      document.body.appendChild(symbol_table);
      symbol_table.style.display = 'none';
    },
    open_symbol_table: function(symbol_table, link) {
      console.log('id:' + symbol_table.id);
      console.log(symbol_table.style.display);
      var pos = getElementPosition(link);
      symbol_table.style.top = pos.top + 28 + 'px';
      symbol_table.style.left = pos.left + 'px';
      symbol_table.style.display = 'block';
      console.log(symbol_table.style.display);
    }
  };
}

function twipple_site() {
  return {
    init: function(options) {
      var cont = document.getElementById('ExecutionButtonControl');
      create_symbol_tables(options, document.getElementById('input'), cont.querySelector('div'));
      var cont2 = document.getElementById('DefaultControl');
      create_symbol_tables(options, document.getElementById('input2'), cont2.querySelector('span'));
    },
    search_status_box: function() {
      return document.getElementById('input');
    },
    generate_smile_link: function() {
      var smile_link = document.createElement('a');
      smile_link.setAttribute('class', 'twipple-smile-link');
      smile_link.setAttribute('href', 'javascript:void(0);');
      var span = document.createElement('span');
      var button_caption = document.createTextNode();
      button_caption.nodeValue = '☺';
      span.appendChild(button_caption);
      span.setAttribute('style', 'font-size:15pt;');
      smile_link.appendChild(span);
      return smile_link;
    },
    setup_smile_link: function(smile_link, symbol_table, callee, container) {
      var li = document.createElement('li');
      if (container.tagName == 'DIV') {
        li.setAttribute('class', 'tweetAreaButtonSwitch');
      } else {
        li.setAttribute('class', 'tweetAreaButtonSwitch fl');
      }
      var ul = container.querySelector('ul');
      li.insertBefore(smile_link, li.firstChild);
      ul.insertBefore(li, ul.firstChild);
      document.body.appendChild(symbol_table);
    },
    open_symbol_table: function(symbol_table, link) {
      var pos = getElementPosition(link);
      symbol_table.style.top = pos.top + 20 + 'px';
      symbol_table.style.left = pos.left + 'px';
      symbol_table.style.display = 'block';
      console.log('show');
    }
  };
}

function hootsuite_site() {
  return {
    init: function(options) {
      create_symbol_tables(options);
    },
    search_status_box: function() {
      return document.getElementById('messageBoxMessage');
    },
    generate_smile_link: function() {
      var smile_link = document.createElement('a');
      smile_link.setAttribute('class', 'hootsuite-smile-link');
      var span = document.createElement('span');
      var button_caption = document.createTextNode();
      button_caption.nodeValue = '☺';
      span.appendChild(button_caption);
      smile_link.appendChild(span);
      return smile_link;
    },
    setup_smile_link: function(smile_link, symbol_table, callee) {
      var buttons = document.getElementById('messageTools');
      if (!buttons) {
        console.log('Twitter Symbols: no buttons. setup stop.');
        return;
      }
      buttons.insertBefore(symbol_table, buttons.firstChild);
      buttons.insertBefore(smile_link, buttons.firstChild);
      symbol_table.setAttribute('top', smile_link.top + smile_link.height + 'px');
      symbol_table.setAttribute('left', smile_link.left + 'px');
      // check symbol table. if deleted symbol table, recreate.
      if (document.twitter_symbols___timer == undefined) {
        document.twitter_symbols___timer = setInterval(function(){
          var links = document.getElementsByTagName('a');
          var exists = false;
          for (var i = 0; i < links.length; i++) {
            if (links[i].className.indexOf('hootsuite-smile-link') > -1) {
              exists = true;
            }
          }
          if (!exists) {
            callee();
          }
        }, 5000);
      }
    },
    open_symbol_table: function(symbol_table, link) {
      symbol_table.style.display = 'block';
    }
  };
}

var current_site = function(hostname){
  if (hostname.match(/twitter/)) {
    //Twitter
    return twitter_site();
  } else if (hostname.match(/twipple/)) {
    //Twipple
    console.log('Twitter Symbols: tiwpple');
    return twipple_site();
  } else if (hostname.match(/hootsuite/)) {
    //hootsuite
    return hootsuite_site();
  } else {
    throw new Exception('unknown url.');
  }
}(location.hostname);


function create_symbol_tables(options, status, container) {
  var callee = arguments.callee;
  var symbols = '♥✈☺♬☑♠☎☻♫☒♤☤☹♪♀✩✉☠✔♂★✇♺✖♨❦☁✌♛❁☪☂✏♝❀☭☃☛♞✿☮☼☚♘✾☯☾☝♖✽✝☄☟♟✺☥✂✍♕✵☉☇☈☡✠☊☋☌☍♁✇☢☣✣✡☞☜✜✛❥♈♉♊♋♌♍♎♏♐♑♒♓☬☫☨☧☦✁✃✄✎✐❂❉❆♅♇♆♙♟♔♕♖♗♘♚♛♜♝♞©®™…∞¥€£ƒ$≤≥∑«»ç∫µ◊ı∆Ω≈*§•¶¬†&¡¿øå∂œÆæπß÷‰√≠%˚ˆ˜˘¯∑ºª‽?☕';
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
          var status_box = status || current_site.search_status_box();
          if (!status_box) {
            console.log('Twitter Symbols: no status box. setup stop.');
            return;
          }
          var pos = status_box.selectionStart;
          status_box.value = status_box.value.substring(0, pos) + this.innerText + status_box.value.substring(pos);
          status_box.selectionStart = pos + this.innerText.length;
          symbol_table.style.display = symbol_table.style.display != "block" ? "block" : "none";
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
          var status_box = status || current_site.search_status_box(status_box);
          if (!status_box) {
            console.log('Twitter Symbols: no status box. setup stop.');
            return;
          }
          var pos = status_box.selectionStart;
          var facemark = this.innerText;
          if (facemark.match(/^".*"$/)) {
            facemark = facemark.substring(1, facemark.length -1);
          }
          status_box.value = status_box.value.substring(0, pos) + facemark + status_box.value.substring(pos);
          status_box.selectionStart = pos + facemark.length;
          symbol_table.style.display = symbol_table.style.display != "block" ? "block" : "none";
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

    var smile_link = current_site.generate_smile_link();
    smile_link.addEventListener('click', function() {
      setTimeout(function(){
        current_site.open_symbol_table(symbol_table, smile_link);
      }, 1);
    }, false);

    current_site.setup_smile_link(smile_link, symbol_table, callee, container);
    document.body.addEventListener('click', function(){
      if (symbol_table && symbol_table.style.display == "block") {
        symbol_table.style.display = "none";
      }
    }, false);
  } catch (e) {
    console.log('Twitter Symbols: create_symbol_tables ' + e);
  }
}

function init(options) {
  console.log('Twitter Symbols: global script start.');
  current_site.init(options);
  console.log('Twitter Symbols: global script end.');
}
function getElementPosition(element) {
  var valueT = 0, valueL = 0;
  do {
    valueT += element.offsetTop  || 0;
    valueL += element.offsetLeft || 0;
    if (element.offsetParent == document.body)
      if (element.position == 'absolute') break;

    element = element.offsetParent;
  } while (element);

  return {left: valueL, top: valueT};
}
/* vim: set ts=2 sw=2 sts=2 expandtab fenc=utf-8: */
