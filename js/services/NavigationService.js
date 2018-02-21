// Events triggered from the nav bar and DOM interactions
var NavigationService = {
  selectedItem: null,
  selectedColour: null,
  createTile: function(){
    var newID = TileService.create();
    var item = $('<div class="grid-item" data-item-id="'+newID+'"></div>');
    PackaryGrid.get().append(item).packery('appended',item);
    TileService.setAllTilesLayout();
    GridService.initialiseItem(item.get(0));
  },
  selectTile: function(item){
    // Re-selecting the same tile closes the nav
    if (this.selectedItem == item) this.hideNavBar();
    // Change highlighted tile
    else {
      $(this.selectedItem).removeClass('selected');
      this.selectedItem = item;
      $(this.selectedItem).addClass('selected');
      //Set background colour
      document.getElementById('colourSelector').jscolor.fromString( $(this.selectedItem).css("background-color") );
      //Set url
      $("#txtUrl").val( $(this.selectedItem).attr("data-item-url") )
      $("#nav_tiles").show();
    }
  },
  hideNavBar: function(){
    $(this.selectedItem).removeClass('selected');
    this.selectedItem = null;
    $("#nav_tiles").hide();
  },
  deleteTile: function() {
    TileService.delete($(this.selectedItem).attr("data-item-id"));
    PackaryGrid.get().packery('remove',this.selectedItem);
    TileService.setAllTilesLayout();
  },
  setTileColour: function(tileColour){
    $(this.selectedItem).css('backgroundColor', "#"+tileColour);
    TileService.update($(this.selectedItem).attr("data-item-id"),{colour:'#'+tileColour});
  },
  setTileSize: function(size){
    $(this.selectedItem).attr('class','grid-item grid-item--'+size+' selected');
    PackaryGrid.get().packery('layout');
    TileService.update($(this.selectedItem).attr("data-item-id"),{class:$(this.selectedItem).attr('class')})
  },
  setTileScale: function(scale){
    CssService.setTileScale(scale);
    PackaryGrid.get().packery();
    TileService.setAllTilesScale(scale);
  },
  setTileUrl: function(tileUrl){
    $(this.selectedItem).attr('data-item-url',tileUrl);
    TileService.update($(this.selectedItem).attr("data-item-id"),{url:tileUrl});
  },
  setTileImage: function(imageUrl){

    CssService.setTileImage(this.selectedItem, imageUrl);
    $("#tileImageUpload").val("");

    var bg = $(this.selectedItem).css('background-image').replace('url(','').replace(')','').replace('"','').replace('"','');

    // build an image from the dataURL
    var img=new Image();
    //img.crossOrigin='anonymous';
    // This will fire when the image source is set
    img.onload=function(){
      var canvas=document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 200;
      // draw the image onto the canvas
      canvas.getContext("2d").drawImage(this,0,0);
      var dataURL = canvas.toDataURL("image/png").replace(/^data:image\/(png|jpg);base64,/, "");
      TileService.update($(NavigationService.selectedItem).attr("data-item-id"), {img:dataURL});
    }
    img.src=bg;
  }
}
