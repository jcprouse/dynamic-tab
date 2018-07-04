var CssService = {
  setTileScale: function(scale){
    document.documentElement.style.setProperty('--size', (scale - 2)+'px');
    document.documentElement.style.setProperty('--size_large', (scale * 2)+'px');
    $("#txtSize").val(scale);
  },
  setTileImage: function(tile, imageUrl, scale){
    $(tile).css('background-image','url(data:image/png;base64,'+imageUrl+')');
    this.setTileImageScale(tile, scale);
  },
  //Scale is a percentage
  setTileImageScale: function(tile, scale){

    if ($(tile).hasClass("grid-item--horizontal"))
      $(tile).css('background-size', scale + '%');
    else if ($(tile).hasClass("grid-item--vertical"))
      $(tile).css('background-size', 'auto ' + scale + '%');
    else
     $(tile).css('background-size', scale + '% ' + scale + '%');

    $(tile).attr("data-item-img-scale",scale);
  }
}
