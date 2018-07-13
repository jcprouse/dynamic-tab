// Interations with the tiles data
var TileService = {
  tiles_key: 'tiles',
  layout_key: 'dragPositions',
  id_key: 'ID',
  scale_key: 'scale',
  tileautocolour_key: 'tac',
  default: '{"tiles":[]}',
  create: function(){
    var newID = parseInt((StorageDAO.get(this.id_key) || 1));
    StorageDAO.set(this.id_key, (newID + 1));
    var tile_collection = this.getAllTiles();
    tile_collection.tiles.push({dataitemid:newID,class:"grid-item",img:{}});
    StorageDAO.set(this.tiles_key, JSON.stringify(tile_collection));
    return newID;
  },
  update: function(ID, tile_config){
    log(tile_config, "Attempting to update tile record "+ ID);
    var tile_collection = this.getAllTiles();
    for (var counter = 0; counter < tile_collection.tiles.length; counter++)
    {
      if (tile_collection.tiles[counter].dataitemid == ID)
      {
        if (tile_config.colour)
          tile_collection.tiles[counter].colour = tile_config.colour;
        if (tile_config.class)
          tile_collection.tiles[counter].class = tile_config.class;
        if (tile_config.url)
          tile_collection.tiles[counter].url = tile_config.url;
        if (tile_config.img){
          if (tile_config.img.url)
            tile_collection.tiles[counter].img.url = tile_config.img.url;
          if (tile_config.img.scale)
            tile_collection.tiles[counter].img.scale = tile_config.img.scale;
        }
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
  },
  getTileImageAutoColour: function(value){
    return parseInt(StorageDAO.get(this.tileautocolour_key) || 0);
  },
  setTileImageAutoColour: function(value){
    log("TileService.setTileImageAutoColour",value)
    StorageDAO.set(this.tileautocolour_key,value);
  }
}
