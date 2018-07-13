var ImportExportService = {
  import: function(contentAsString){
    log(contentAsString,"Import started")
    content = JSON.parse(contentAsString);
    StorageDAO.set("ID", content.id);
    TileService.setAllTiles({tiles: content.tiles});
    TileService.setAllTilesLayout(content.layout);
    TileService.setAllTilesScale(content.scale);
    TileService.setTileImageAutoColour(content.tac);
    location.reload();
  },
  export: function(){
    var newID = (StorageDAO.get(TileService.id_key) || 1);
    var content = {tiles: TileService.getAllTiles().tiles , layout: JSON.parse(TileService.getAllTilesLayout()), id: newID, scale: TileService.getAllTilesScale(), tac: TileService.getTileImageAutoColour()};
    var contentAsString = JSON.stringify(content);

    let csvContent = "data:text/json;charset=utf-8,"+contentAsString;

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "export.json");

    link.click();
  }
}
