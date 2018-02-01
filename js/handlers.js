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

  /*$("#tileImageUpload").on("change",function(e){
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = (function(theFile) {
          return function(e) {
            NavigationService.setTileImage(e.target.result);
          };
        })(file);

    reader.readAsDataURL(file);
  })*/

//  document.getElementById('tileImageUpload').onchange = function(evt) {
$("#tileImageUpload").on("change",function(e){
    ImageTools.resize(this.files[0], {
        width: 200, // maximum width
        height: 200 // maximum height
    }, function(blob, didItResize) {
        // didItResize will be true if it managed to resize it, otherwise false (and will return the original file as 'blob')
        document.getElementById('preview').src = window.URL.createObjectURL(blob);
        NavigationService.setTileImage(window.URL.createObjectURL(blob));
        // you can also now upload this blob using an XHR.
    });
  });

/*  $("#tileImageUpload").on("change",function(e){
    resizeImage({
      file: this.files[0], maxSize: 200
    }).then(function (resizedImage) {
        console.log("upload resized image")
        document.getElementById('preview').src = window.URL.createObjectURL(resizedImage);
    }).catch(function (err) {
        console.error(err);
    });
  })*/



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
