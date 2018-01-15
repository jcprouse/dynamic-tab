// Interations with the tiles
var TileService = {
  key: 'tiles',
  default: '{"tiles":[]}',
  get: function(){
    return JSON.parse(StorageDAO.get(this.key) || this.default);
  },
  set: function(tile_collection){
    StorageDAO.set(this.key, JSON.stringify(tile_collection));
  },
  create: function(newID){
    var tile_collection = TileService.get();
    tile_collection.tiles.push({dataitemid:newID,class:"grid-item"});
    StorageDAO.set(this.key, JSON.stringify(tile_collection));
  },
  update: function(ID, colour){
    var tile_collection = TileService.get();
    for (var counter = 0; counter < tile_collection.tiles.length; counter++)
    {
      if (tile_collection.tiles[counter].dataitemid == ID)
      {
        tile_collection.tiles[counter].colour = colour;
        break;
      }
    }
    StorageDAO.set(this.key, JSON.stringify(tile_collection));
    log(JSON.stringify(tile_collection), "Tile collection updated");
  },
  delete: function(ID){
    var tile_collection = TileService.get();
    for (var counter = 0; counter < tile_collection.tiles.length; counter++)
    {
      if (tile_collection.tiles[counter].dataitemid == ID)
      {
        tile_collection.tiles.splice(counter,1)
        break;
      }
    }
    log(tile_collection, "Tile record removed");
    StorageDAO.set(this.key, JSON.stringify(tile_collection));
  },
  saveLayout: function(positions){
    if (!positions)
      positions = $grid.packery( 'getShiftPositions', 'data-item-id' );
    StorageDAO.set('dragPositions', JSON.stringify( positions ))
    log(positions,"Layout saved")
  },
  getLayout: function(){
    return StorageDAO.get('dragPositions');
  }
}

// Create new dataitemid's
var IdService = {
  create: function(){
    var newID = parseInt((StorageDAO.get("ID") || 1));
    StorageDAO.set("ID", (newID + 1));
    return newID;
  },
  get: function(){
    return (StorageDAO.get("ID") || 1);
  },
  // Forceful overwrite of new ID
  set: function(Id){
    StorageDAO.set("ID", Id);
  }
}

var NavService = {
  selectedItem: null,
  selectedColour: null,
  show: function(item){
    if (this.selectedItem != null)
      $(this.selectedItem).toggleClass('selected');
    this.selectedItem = item;
    $(item).toggleClass('selected');

    var colour = $(item).css("background-color");
  //  $('#colourSelector').jscolor.fromString(colour);

    document.getElementById('colourSelector').jscolor.fromString(colour);

    $(".navbar").show();
  },
  hide: function(){
    if (this.selectedItem != null)
      $(this.selectedItem).toggleClass('selected');
    $(".navbar").hide();
  },
  delete: function() {
    TileService.delete($(this.selectedItem).attr("data-item-id"));

    $grid.packery('remove',this.selectedItem);
    TileService.saveLayout();
  },
  /*previewColour: function(colour){
    $(this.selectedItem).css('backgroundColor', "#"+colour);
    this.selectedColour = colour;
  },*/
  saveColour: function(colour){
    $(this.selectedItem).css('backgroundColor', "#"+colour);
    this.selectedColour = colour;
    //if (this.selectedColour != null) {
    log("#"+this.selectedColour, "Saving colour");
    TileService.update($(this.selectedItem).attr("data-item-id"),"#"+this.selectedColour)
    //}
  },
  saveSize: function(size){
    $(this.selectedItem).attr('class','grid-item grid-item--'+size);
    $grid.packery('layout');
    TileService.update($(this.selectedItem).attr("data-item-id"),this.selectedColour)
  }
}

var ImportExportService = {
  import: function(contentAsString){
    log(contentAsString,"Import started")
    content = JSON.parse(contentAsString);
    IdService.set(content.id);
    TileService.set({tiles: content.tiles});
    TileService.saveLayout(content.layout);
    location.reload();
  },
  export: function(){
    //const rows = [["name1", "city1", "some other info"], ["name2", "city2", "more info"]];
    var content = {tiles: TileService.get().tiles , layout: JSON.parse(TileService.getLayout()), id: IdService.get()};
    var contentAsString = JSON.stringify(content);

    /*if (debug) log(contentAsString,"Export JSON");
    else {*/
      let csvContent = "data:text/json;charset=utf-8,"+contentAsString;

      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "export.json");
      //document.body.appendChild(link); // Required for FF

      link.click(); // This will download the data file named "my_data.csv".
    //}
  }
}
