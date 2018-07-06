// Events triggered from the nav bar and DOM interactions
var TileNavigationService = {
  selectedItem: null,
  selectedColour: null,
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
      $("#txtUrl").val( $(this.selectedItem).attr("data-item-url") );
 
      if ($(this.selectedItem).hasClass("constraint")) $("#chkTileImageConstraint").prop("checked",true);
      else $("#chkTileImageConstraint").prop("checked",false);

      $("#tileImageSize").val( $(this.selectedItem).attr("data-item-img-scale") || "100" )
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
  saveTileClass: function(){
    var clone = $(this.selectedItem).clone(); 
    TileService.update($(clone).attr("data-item-id"),{class:$(clone).removeClass("selected").attr("class")});
  },
  setTileColour: function(tileColour){
    $(this.selectedItem).css('backgroundColor', "#"+tileColour);
    TileService.update($(this.selectedItem).attr("data-item-id"),{colour:'#'+tileColour});
  },
  setTileSize: function(size){
    $(this.selectedItem).attr('class','grid-item grid-item--'+size+' selected');
    PackaryGrid.get().packery('layout');
    //TileService.update($(this.selectedItem).attr("data-item-id"),{class:'grid-item grid-item--'+size})
    this.saveTileClass();
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
    
    $("#tileImageUpload").val("");

    var bg = window.URL.createObjectURL(imageUrl).replace('url(','').replace(')','').replace('"','').replace('"','');
    var img=new Image();

    img.onload=function(){
      var canvas=document.createElement("canvas");

      var width = img.width;
      var height = img.height;

      if (width > height && width > 200) {
          // width is the largest dimension, and it's too big.
          height *= 200 / width;
          width = 200;
      } else if (height > 200) {
          // either width wasn't over-size or height is the largest dimension
          // and the height is over-size
          width *= 200 / height;
          height = 200;
      }

      canvas.width = width;
      canvas.height = height;

      // draw the image onto the canvas
      canvas.getContext("2d").drawImage(this,0,0,img.width,img.height,0,0,width,height);

      var dataURL = canvas.toDataURL("image/png").replace(/^data:image\/(png|jpg);base64,/, "");
      var bg_scale = $("#tileImageSize").val();
      TileService.update($(TileNavigationService.selectedItem).attr("data-item-id"), {img:{url:dataURL,scale:bg_scale}});
      CssService.setTileImage(TileNavigationService.selectedItem, dataURL, bg_scale);
    }
    img.src=bg;
  },
  setTileImageScale: function(bg_scale){
    CssService.setTileImageScale(this.selectedItem,bg_scale);
    TileService.update($(this.selectedItem).attr("data-item-id"),{img:{scale:bg_scale}})
  },
  toggleTileImageConstraint: function(){
    if ($("#chkTileImageConstraint").is(':checked'))
      $(this.selectedItem).addClass("constraint")
    else
      $(this.selectedItem).removeClass("constraint")
    
    this.saveTileClass();

    CssService.setTileImageScale(this.selectedItem,$(this.selectedItem).attr("data-item-img-scale"));
  }
}

var SettingsNavigationService = {
  createTile: function(){
    var newID = TileService.create();
    var item = $('<div class="grid-item" data-item-id="'+newID+'"></div>');
    PackaryGrid.get().append(item).packery('appended',item);
    TileService.setAllTilesLayout();
    GridService.initialiseItem(item.get(0));
  },
  toggleNavBar: function(){
    if($("#nav_settings").is(':visible')) this.hideNavBar();
    else this.showNavBar();
  },
  showNavBar: function(){
    $("#btn_settings").addClass("on");
    $("#nav_settings").show();
  },
  hideNavBar: function(){
    $("#btn_settings").removeClass("on");
    $("#nav_settings").hide();
  }
}