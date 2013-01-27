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
//2011-08-10 1.0.22 fixed a bag not display smile link in hootsuit.
//2011-08-31 1.0.23 supported new hootsuite.
//2011-09-11 1.0.24 fixed position display symbol table when scrolled in twitter.
//2011-10-14 1.0.25 fixed to added multiple smily butons like goast.
//2011-11-11 1.0.26 when reply and DM, symbol table not appear front of screen. fixed this.
//2011-12-11 1.0.27 when selected at reply and DM window, window disapeared. fixed this. > thank you, @PP_Thoneo 
//2012-01-06 1.0.28 added http://goo.gl/GNgEe to smilemarks.
//2012-02-14 1.0.29 supported new twitter site design.
//2012-09-15 2.0.0 supported new twitter site design.
//2012-09-15 2.0.1 fixed symbol talbe position.
//2012-09-23 2.0.2 added symbols
//2012-11-09 2.1.0 added smile button at profile bio.
//2013-01-14 2.1.1 fixed a bug fail to insert symbols to empty statusbox.
//2013-01-27 2.2.0 supported new twitter site design. terminated twipple and hootsuite support.
//2013-01-27 2.2.1 fixed some bugs.
//2013-01-27 2.2.2 fixed a bugs cannot insert facemarks.

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
          var cont = divs[i];
          if (cont.className.indexOf('tweet-button') > -1) {
            //setTimeout(function(){
              var status_box = cont.parentElement.parentElement.parentElement.querySelector('.tweet-box');
              if (!status_box) return;

              create_symbol_tables(options, status_box, cont, true);
            //}, 500);
          }
        }
      });
      {
        var divs = document.body.querySelectorAll('div.tweet-button');
        for (var i = 0; i < divs.length; i++) {
          var cont = divs[i];
          var status_box = cont.parentElement.parentElement.parentElement.querySelector('.tweet-box');
          create_symbol_tables(options, status_box, cont);
        }
        var bio = document.body.querySelector('#user_description');
        if (bio) {
          var bio_label = bio.parentElement.querySelector('.bio-label');
          create_symbol_tables(options, bio, bio_label, true);
        }
      }
    },
    search_status_box: function(status_box) {
      return document.getElementById('status');
    },
    generate_smile_link: function() {
      var smile_link = document.createElement('a');
      //smile_link.setAttribute('class', 'smily-button tweet-button button');
      smile_link.setAttribute('class', 'a-btn a-btn-m smily-button tweet-button btn');
      var button_caption = document.createTextNode();
      button_caption.nodeValue = '☺';
      smile_link.appendChild(button_caption);
      return smile_link;
    },
    setup_smile_link: function(smile_link, symbol_table, args, buttons) {
      var buttons = buttons || document.getElementById('tweeting_controls');
      if (!buttons) {
        console.log('Twitter Symbols: no buttons. setup stop.');
        return;
      }
      if (buttons.querySelector('a.smily-button')) {
        console.log('Twitter Symbols: already exists. remove and continue.');
        var old = buttons.querySelector('a.smily-button');
        old.parentElement.removeChild(old);
      }

      smile_link.style.float = 'none';
      var tweet = buttons.querySelector('button.tweet-action');
      if (tweet) {
        buttons.insertBefore(smile_link, tweet);
      } else {
        buttons.appendChild(smile_link);
      }
      document.body.appendChild(symbol_table);
      symbol_table.style.display = 'none';
    },
    open_symbol_table: function(symbol_table, link, status_box) {
      var tweet_button = link.parentElement.querySelector('.tweet-action');
      if (tweet_button.className.match('disabled')) {
        status_box.focus();
        status_box.firstChild.appendChild(document.createTextNode(''));
      }
      var pos = getElementPosition(link, symbol_table.getAttribute('data-scroll_ignore'));
      symbol_table.style.top = pos.top + 28 + 'px';
      symbol_table.style.left = pos.left + 'px';
      symbol_table.style.display = 'block';
    }
  };
}

var current_site = function(hostname){
  if (hostname.match(/twitter/)) {
    //Twitter
    return twitter_site();
  } else {
    throw new Exception('unknown url.');
  }
}(location.hostname);

function create_symbol_tables(options, status, container, scroll_ignore) {
  console.log('create_symbol_tables', status);
  var status_box = status;
  var record_range = function(){
    var selection = window.getSelection();
    var position_info = {index: 0};
    if (status.firstChild) {
      var count_fn = function(position_info, nodes){
        for (var i = 0; i < nodes.length; i++) {
          var n = nodes[i];
          console.log('count_fn', n.nodeValue, 'node type', n.nodeType);
          switch (n.nodeType) {
            case 3:
              //text node
              console.log('text node');
              if (n == selection.anchorNode) {
                console.log('this is anchorNode');
                position_info.startPos = position_info.index + selection.anchorOffset;
              }
              if (n == selection.focusNode) {
                console.log('this is focusNode');
                position_info.endPos = position_info.index + selection.focusOffset;
              }
              position_info.index += n.length;
              break;
            case 1:
              //element node
              position_info = count_fn(position_info, n.childNodes);
              break;
          }
        }
        return position_info;
      };
      position_info = count_fn(position_info, status.firstChild.childNodes);
    }
    console.log('computed range', position_info.startPos, position_info.endPos);

    if (position_info.startPos) {
      status.setAttribute('data-selection-start-position', position_info.startPos);
    }
    if (position_info.endPos) {
      status.setAttribute('data-selection-end-position', position_info.endPos);
    }
  };
  status.addEventListener('keyup', record_range, false);
  status.addEventListener('focus', record_range, false);
  status.addEventListener('click', record_range, false);
  
  var args = arguments;
  var symbols = '♥✈☺♬☑♠☎☻♫☒♤☤☹♪♀✩✉☠✔♂★✇♺✖♨❦☁✌♛❁☪☂✏♝❀☭☃☛♞✿☮☼☚♘✾☯☾☝♖✽✝☄☟♟✺☥✂✍♕✵☉☇☈☡✠☊☋☌☍♁✇☢☣✣✡☞☜✜✛❥♈♉♊♋♌♍♎♏♐♑♒♓☬☫☨☧☦✁✃✄✎✐❂❉❆♅♇♆♙♟♔♕♖♗♘♚♛♜♝♞©®™…∞¥€£ƒ$≤≥∑«»ç∫µ◊ı∆Ω≈*§•¶¬†&¡¿øå∂œÆæπß÷‰√≠%˚ˆ˜˘¯∑ºª‽?☕⍢⍤⍥⍨';
  var cols_num = 15;
  var cols_num_smile = 3;
  var symbols_id = 'symbol_table' + new Date().getTime();

  var insert_symbol = function(status_box, text){
        status_box.focus();
        var selection = window.getSelection();
        var range = selection.getRangeAt(0);
        //restore range
        if (status_box.hasAttribute('data-selection-start-position') && status_box.hasAttribute('data-selection-end-position')) {
          
          var position_info = {
            index: 0,
            startPos: status_box.getAttribute('data-selection-start-position'),
            endPos: status_box.getAttribute('data-selection-end-position')
          }; 
          console.log('restore range', position_info.startPos, position_info.endPos);

          var update_range_fn = function(position_info, nodes, range){
            for (var i = 0; i < nodes.length; i++) {
              var n = nodes[i];
              console.log('count_fn', n.nodeValue, 'node type', n.nodeType);
              switch (n.nodeType) {
                case 3:
                  //text node
                  console.log('text node');
                  if (position_info.startPos >= position_info.index && position_info.startPos <= position_info.index + n.length) {
                    range.setStart(n, position_info.startPos - position_info.index);
                  }
                  if (position_info.endPos >= position_info.index && position_info.endPos <= position_info.index + n.length) {
                    range.setEnd(n, position_info.endPos - position_info.index);
                  }
                  position_info.index += n.length;
                  break;
                case 1:
                  //element node
                  position_info = update_range_fn(position_info, n.childNodes, range);
                  break;
              }
            }
            return position_info;
          };
          update_range_fn(position_info, status_box.firstChild.childNodes, range);
        }

        //insert text
        range.deleteContents();
        range.insertNode(document.createTextNode(text));

        //move cursor
        if (selection.rangeCount > 0) {
          selection.collapse(status_box, 1); //末尾にカーソルを設定する
        }
        record_range();
  };
  try {
    var symbol_table = document.createElement('table');
    symbol_table.setAttribute('data-scroll_ignore', scroll_ignore ? 'true' : 'false');
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
      td.addEventListener('click', function(e){
        e.stopPropagation();
        var status_box = status || current_site.search_status_box();
        if (!status_box) {
          console.log('Twitter Symbols: no status box. setup stop.');
          return;
        }

        insert_symbol(status_box, this.innerText);

        symbol_table.style.display = symbol_table.style.display != "block" ? "block" : "none";
        return false;
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

        insert_symbol(status_box, facemark);

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
        var status_box = status || current_site.search_status_box(status_box);
        current_site.open_symbol_table(symbol_table, smile_link, status_box);
      }, 1);
    }, false);

    current_site.setup_smile_link(smile_link, symbol_table, args, container);
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

function getElementPosition(element, scroll_ignore) {
  var valueT = 0, valueL = 0;
  do {
    valueT += element.offsetTop  || 0;
    valueL += element.offsetLeft || 0;
    if (element.offsetParent == document.body)
      if (element.position == 'absolute') break;

    element = element.offsetParent;
  } while (element);


  // if it has scrolled.
  if (scroll_ignore != 'true') {
    valueT += document.documentElement.scrollTop || document.body.scrollTop || 0;
    valueL += document.documentElement.scrollLeft || document.body.scrollLeft || 0;
  }

  return {left: valueL, top: valueT};
}
/* vim: set ts=2 sw=2 sts=2 expandtab fenc=utf-8: */
