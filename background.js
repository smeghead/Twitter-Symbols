function get_ts_options() {
  try {
    var smiles = [];
    if (localStorage.ts_smiles) {
      smiles = JSON.parse(localStorage.ts_smiles);
    }
    var options = {
      'smiles': smiles
    };
    if (smiles.length == 0) {
      options.smiles = ['(^_^)', '(>_<)', '(^_^;)', '(ToT)', 'm(_ _)m', '\\(^^)/', '#twitter_symbols', 'goo.gl/GNgEe'];
    }
  
    //save
    save_ts_options(options);
    return options;
  } catch (e) {
    console.log(e);
  }
}
function save_ts_options(options) {
  localStorage['ts_smiles'] = JSON.stringify(options.smiles);
}
function clear_ts_options() {
  localStorage['ts_smiles'] = '';
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request == "get_ts_options") {
      sendResponse({options: get_ts_options()});
    }
  }
);

