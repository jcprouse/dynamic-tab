// Interations with the tiles data
var TileService = {
  tiles_key: 'tiles',
  layout_key: 'dragPositions',
  id_key: 'ID',
  scale_key: 'scale',
  default: '{"tiles":[]}',
  create: function(){
    var newID = parseInt((StorageDAO.get(this.id_key) || 1));
    StorageDAO.set(this.id_key, (newID + 1));
    var tile_collection = this.getAllTiles();
    tile_collection.tiles.push({dataitemid:newID,class:"grid-item"});
    StorageDAO.set(this.tiles_key, JSON.stringify(tile_collection));
    return newID;
  },
  update: function(ID, tile_config){
    var tile_collection = this.getAllTiles();
    for (var counter = 0; counter < tile_collection.tiles.length; counter++)
    {
      if (tile_collection.tiles[counter].dataitemid == ID)
      {
        if (tile_config.colour)
          tile_collection.tiles[counter].colour = tile_config.colour;
        if (tile_config.class)
          tile_collection.tiles[counter].class = tile_config.class;
        break;
      }
    }
    StorageDAO.set(this.tiles_key, JSON.stringify(tile_collection));
    log(JSON.stringify(tile_collection), "Tile collection updated");
  },
  delete: function(ID){
    var tile_collection = this.getAllTiles();
    for (var counter = 0; counter < tile_collection.tiles.length; counter++)
    {
      if (tile_collection.tiles[counter].dataitemid == ID)
      {
        tile_collection.tiles.splice(counter,1)
        break;
      }
    }
    log(tile_collection, "Tile record removed");
    StorageDAO.set(this.tiles_key, JSON.stringify(tile_collection));
  },
  getAllTiles: function(){
    return JSON.parse(StorageDAO.get(this.tiles_key) || this.default);
  },
  getAllTilesLayout: function(){
    return StorageDAO.get(this.layout_key);
  },
  getAllTilesScale: function(){
    return parseInt(StorageDAO.get(this.scale_key) || 100);
  },
  setAllTiles: function(tile_collection){
    StorageDAO.set(this.tiles_key, JSON.stringify(tile_collection));
  },
  // positions optional. Used for forceful import
  setAllTilesLayout: function(positions){
    if (!positions) positions = PackaryGrid.getShiftPositions();
    StorageDAO.set(this.layout_key, JSON.stringify(positions))
    log(positions,"Layout saved")
  },
  setAllTilesScale: function(scale){
    StorageDAO.set(this.scale_key,scale);
    this.setAllTilesLayout();
  }
}

var GridService = {
  initialiseItem: function(item) {
    // Make draggable
    var draggie = new Draggabilly(item);
    PackaryGrid.get().packery('bindDraggabillyEvents', draggie);
    // Right click event
    $(item).contextmenu(function(){
      NavigationService.selectTile(this);
      return false;
    });
  }
}

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
    // Change highlighted tile
    $(this.selectedItem).removeClass('selected');
    this.selectedItem = item;
    $(this.selectedItem).addClass('selected');
    //Set jsColor ready for editing
    var currentTileColour = $(this.selectedItem).css("background-color");
    document.getElementById('colourSelector').jscolor.fromString(currentTileColour);
    $(".navbar").show();
  },
  hideNavBar: function(){
    $(this.selectedItem).removeClass('selected');
    $(".navbar").hide();
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
    $(this.selectedItem).attr('class','grid-item grid-item--'+size);
    PackaryGrid.get().packery('layout');
    TileService.update($(this.selectedItem).attr("data-item-id"),{class:$(this.selectedItem).attr('class')})
  },
  setTileScale: function(scale){
    CssService.setTileScale(scale);
    PackaryGrid.get().packery();
    TileService.setAllTilesScale(scale);
  }
}

var CssService = {
  setTileScale: function(scale){
    document.documentElement.style.setProperty(`--size`, scale+'px');
    document.documentElement.style.setProperty(`--size_large`, (scale * 2)+'px');
    $("#txtSize").val(scale);
  }
}

var ImportExportService = {
  import: function(contentAsString){
    log(contentAsString,"Import started")
    content = JSON.parse(contentAsString);
    StorageDAO.set("ID", content.id)
    TileService.setAllTiles({tiles: content.tiles});
    TileService.setAllTilesLayout(content.layout);
    location.reload();
  },
  export: function(){
    var newID = (StorageDAO.get(TileService.id_key) || 1);
    var content = {tiles: TileService.get().tiles , layout: JSON.parse(TileService.getAllTilesLayout()), id: newID};
    var contentAsString = JSON.stringify(content);

    let csvContent = "data:text/json;charset=utf-8,"+contentAsString;

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "export.json");

    link.click();
  }
}
