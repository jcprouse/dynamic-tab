var CssService = {
  setTileScale: function(scale){
    document.documentElement.style.setProperty('--size', (scale - 2)+'px');
    document.documentElement.style.setProperty('--size_large', (scale * 2)+'px');
    $("#txtSize").val(scale);
  },
  setTileImage: function(tile, imageUrl){
    console.log(tile);
    $(tile).css('background-image','url('+window.URL.createObjectURL(imageUrl)+')');
    var scale = parseInt($("#tileImageSize").val());
    if ($(tile).hasClass("grid-item--horizontal"))
      $(tile).css('background-size',(scale / 2) + '% ' + scale + '%');
    else if ($(tile).hasClass("grid-item--vertical"))
      $(tile).css('background-size', scale + '% '+ (scale / 2) + '%');
    else
      $(tile).css('background-size', scale + '% ' + scale + '%');
  }
}
