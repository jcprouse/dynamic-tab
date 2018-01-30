var init_eventHandlers = function(){

  $("#txtSize").on("change",function(){
    NavigationService.setTileScale(this.value);
  })

  $("#btnCreateTile").on("click",function(){
    NavigationService.createTile();
  })

  $("#btnExport").on("click",function(){
    ImportExportService.export();
  })

  $("#btnCloseNav").on("click",function(){
      NavigationService.hideNavBar();
  })

  $("#nav-delete").on("click",function(){
    NavigationService.deleteTile();
  })

  $(".dropdown-size").on("click",function(){
    NavigationService.setTileSize($(this).attr('data-item-id'));
  })

  $("#txtUrl").on("change",function(){
    NavigationService.setTileUrl(this.value);
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

  PackaryGrid.get().on( 'dragItemPositioned', function() {
    TileService.setAllTilesLayout();
  });

  //$grid.on( 'staticClick', '.grid-item', function( item ) {
  PackaryGrid.get().on( 'staticClick', '.grid-item', function( item ) {
    var dataItemId = $(item.target.outerHTML).attr("data-item-id");
    log("ID: "+dataItemId,"Item clicked");
    //window.location = "https://www.bbc.co.uk"
  });

}
