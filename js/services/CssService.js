var CssService = {
  setTileScale: function(scale){
    document.documentElement.style.setProperty('--size', (scale - 2)+'px');
    document.documentElement.style.setProperty('--size_large', (scale * 2)+'px');
    $("#txtSize").val(scale);
  },
  setTileImage: function(tile, imageUrl, isBlob, scale){
    if (!isBlob) imageUrl = this._getUrl(imageUrl);
    $(tile).css('background-image','url('+imageUrl+')');
    if (!scale) scale = $("#tileImageSize").val();
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
    $(tile).attr("data-item-img-scale",scale);
  },
  _getUrl: function(url){
    return window.URL.createObjectURL(url);
  }
}
