$("#txtSize").on("change",function(){
  document.documentElement.style.setProperty(`--size`, this.value+'px');
  document.documentElement.style.setProperty(`--size_large`, (this.value * 2)+'px');
  StorageDAO.set('size', this.value)
  $grid.packery();
  TileService.saveLayout();
})

$("#btnAdd").on("click",function(){
  var newID = IdService.create();
  TileService.create(newID);

  var $item = $('<div class="grid-item" data-item-id="'+newID+'"></div>');
  $grid.append( $item ).packery( 'appended', $item );
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
    NavService.hide();
})

$("#nav-delete").on("click",function(){
  NavService.delete();
})

$(".dropdown-size").on("click",function(){
  NavService.saveSize($(this).attr('data-item-id'));
})
