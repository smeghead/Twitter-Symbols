function get_ts_options() {
  try{
    console.log('get_ts_options');
    var smiles = [];
    if (localStorage.ts_smiles) {
      smiles = JSON.parse(localStorage.ts_smiles);
    }
    var options = {
      'smiles': smiles
    };
    console.log(options);
    if (smiles.length == 0) {
      options.smiles = ['(^_^)', '(>_<)', '(^_^;)', '(ToT)', 'm(_ _)m', '\\(^^)/'];
    }
  
    //save
    save_ts_options(options);
    return options;
  } catch (e) {
    console.log(e);
  }
}
function save_ts_options(options) {
  console.log('save_ts_options');
  console.log(options);
  console.log('stringify:[' + JSON.stringify(options.smiles) + ']');
  localStorage['ts_smiles'] = JSON.stringify(options.smiles);
}
function clear_ts_options() {
  console.log('clear_ts_options');
  localStorage['ts_smiles'] = '';
  console.log('clear_ts_options end');
}
