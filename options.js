function store_options() {
//  console.log('save smiles:' + document.getElementById('smiles').value);
  console.log('save smiles:' + document.getElementById('smiles').value.split("\n"));
  var smiles = document.getElementById('smiles').value.split("\n");
  save_ts_options({
//    css: document.getElementById('css').value,
    smiles: smiles
  });

  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 2000);
}

function restore_options() {
  var options = get_ts_options();
//  document.getElementById('css').value = options.css;
  console.log(options.smiles);
  document.getElementById('smiles').value = options.smiles.join("\n");
}
function clear_options() {
  clear_ts_options();
  restore_options();
}

window.addEventListener('load', function(){
  restore_options();
  document.getElementById('save').addEventListener('click', store_options, false);
  document.getElementById('clear').addEventListener('click', clear_options, false);
  document.getElementById('close').addEventListener('click', function(){window.close();}, false);
}, false);
