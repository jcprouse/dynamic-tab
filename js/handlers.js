$("#txtSize").on("change",function(){
  document.documentElement.style.setProperty(`--size`, this.value+'px');
  document.documentElement.style.setProperty(`--size_large`, (this.value * 2)+'px');
  StorageDAO.set('size', this.value)
  PackaryGrid.get().packery();
  TileService.saveLayout();
})

$("#btnAdd").on("click",function(){
  var newID = IdService.create();
  TileService.create(newID);

  var $item = $('<div class="grid-item" data-item-id="'+newID+'"></div>');
  PackaryGrid.get().append( $item ).packery( 'appended', $item );
  $item.each(initGridItem);

  TileService.saveLayout();
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

$("#btnExport").on("click",function(){
  ImportExportService.export();
})

$("#btnCloseNav").on("click",function(){
    NavigationService.hideNavBar();
})

$("#nav-delete").on("click",function(){
  NavigationService.delete();
})

$(".dropdown-size").on("click",function(){
  NavigationService.setTileSize($(this).attr('data-item-id'));
})
