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
