var log = function(content,header){
  if (debug) {
    if (header){
      console.log("--- "+header+" ---")
    }
    console.log(content);
  }
}
