// Interactions with Chrome storage
var StorageDAO = {
  set: function(key,value){
    localStorage.setItem(key, value );
  },
  get: function(key){
    return localStorage.getItem(key);
  }
}
