var log = function(content,header){
  if (debug) {
    if (header){
      console.log("--- "+header+" ---")
    }
    console.log(content);
  }
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}