var init_eventHandlers = function(){

  $("#txtSize").on("change",function(){
    TileNavigationService.setTileScale(this.value);
  })

  $("#btnCreateTile").on("click",function(){
    SettingsNavigationService.createTile();
  })

  $("#btnExport").on("click",function(){
    ImportExportService.export();
  })

  $("#btnCloseNav").on("click",function(){
      TileNavigationService.hideNavBar();
  })

  $("#nav-delete").on("click",function(){
    TileNavigationService.deleteTile();
  })

  $(".dropdown-size").on("click",function(){
    TileNavigationService.setTileSize($(this).attr('data-item-id'));
  })

  $("#txtUrl").on("change",function(){
    TileNavigationService.setTileUrl(this.value);
  })

  $("#fileImport").on("change",function(e){
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = (function(theFile) {
          return function(e) {
            ImportExportService.import(e.target.result);
          };
        })(file);

    reader.readAsText(file);
  })

  $("#tileImageUpload").on("change",function(e){
      TileNavigationService.setTileImage(this.files[0]);
  });

  PackaryGrid.get().on( 'dragItemPositioned', function() {
    TileService.setAllTilesLayout();
  });

  PackaryGrid.get().on( 'staticClick', '.grid-item', function( item ) {
    var dataItemId = $(item.target.outerHTML).attr("data-item-id");
    log("ID: "+dataItemId,"Item clicked");
  });

  $("#tileImageSize").on("input",function(){
    TileNavigationService.setTileImageScale($(this).val(),false);
  });

  $("#tileImageSize").on("change",function(){
    TileNavigationService.setTileImageScale($(this).val(),true);
  });

  $("#btn_settings").on("click",function(){
    SettingsNavigationService.toggleNavBar();
  })

  $("#chkTileImageConstraint").on("change",function(){
    TileNavigationService.toggleTileImageConstraint();
  })
}
