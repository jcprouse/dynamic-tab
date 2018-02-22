var CssService = {
  setTileScale: function(scale){
    document.documentElement.style.setProperty('--size', (scale - 2)+'px');
    document.documentElement.style.setProperty('--size_large', (scale * 2)+'px');
    $("#txtSize").val(scale);
  },
  setTileImage: function(tile, imageUrl){
    $(tile).css('background-image','url('+this._getUrl(imageUrl)+')');
    var scale = $("#tileImageSize").val();
    this.setTileImageScale(tile, scale);
  },
  //Scale is a percentage
  setTileImageScale: function(tile, scale){
    scale = parseInt(scale);
    if ($(tile).hasClass("grid-item--horizontal"))
      $(tile).css('background-size',(scale / 2) + '% ' + scale + '%');
    else if ($(tile).hasClass("grid-item--vertical"))
      $(tile).css('background-size', scale + '% '+ (scale / 2) + '%');
    else
      $(tile).css('background-size', scale + '% ' + scale + '%');
    return $(tile).css('background-size');
  },
  _getUrl: function(url){
    return window.URL.createObjectURL(url);
  }
}
