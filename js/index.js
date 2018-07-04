var debug = true;
var resetToStock = false;

$( document ).ready(function() {
    init();
});

var init = function(){
  if (resetToStock) reset();

  var tile_collection = TileService.getAllTiles().tiles;
  log(tile_collection,"Tile collection on load");

  for (var counter = 0; counter < tile_collection.length; counter++)
  {
    var tile = tile_collection[counter];
    var backgroundUrl = "";
    var element = $('<div class="'+tile.class+'" data-item-id="'+tile.dataitemid+'" data-item-url="'+(tile.url || "")+'" style="background-color:'+(tile.colour || '#FFFFFF')+backgroundUrl+'"></div>');
    $("#grid").append(element);

    if (tile.img.url)
    {
      CssService.setTileImage(element, tile.img.url, tile.img.scale);
    }
  }

  CssService.setTileScale( TileService.getAllTilesScale() );

  // Initialise grid
  PackaryGrid.set(
    $('.grid').packery({
    itemSelector: '.grid-item',
    columnWidth: '.grid-sizer',
    gutter: 4,
    //columnWidth:100,
    percentPosition: true,
    initLayout: false // disable initial layout
    })
  );

  // Load layout
  PackaryGrid.setShiftPositions( TileService.getAllTilesLayout() );

  // Initialise grid items
  PackaryGrid.get().find('.grid-item').each(function(i, item){
    GridService.initialiseItem(item);
  });

  init_eventHandlers();
};

var reset = function(){

  var tilecollection = {tiles:[
    {dataitemid:1,class:"grid-item grid-item--horizontal", img:{}},
    {dataitemid:2,class:"grid-item grid-item--horizontal", img:{}},
    {dataitemid:3,class:"grid-item grid-item--vertical", img:{}},
    {dataitemid:4,class:"grid-item", img:{}},
    {dataitemid:5,class:"grid-item", img:{}},
    {dataitemid:6,class:"grid-item grid-item--large", img:{}},
    {dataitemid:7,class:"grid-item grid-item--horizontal", img:{}},
    {dataitemid:8,class:"grid-item grid-item--horizontal", img:{}},
    {dataitemid:9,class:"grid-item grid-item--vertical", img:{}},
    {dataitemid:10,class:"grid-item", img:{}},
    {dataitemid:11,class:"grid-item grid-item--horizontal", img:{}},
    {dataitemid:12,class:"grid-item grid-item--vertical", img:{}},
    {dataitemid:13,class:"grid-item", img:{}},
    {dataitemid:14,class:"grid-item", img:{}},
    {dataitemid:15,class:"grid-item grid-item--large", img:{}},
    {dataitemid:16,class:"grid-item", img:{}},
    {dataitemid:17,class:"grid-item grid-item--horizontal", img:{}},
    {dataitemid:18,class:"grid-item grid-item--vertical", img:{}},
    {dataitemid:19,class:"grid-item", img:{}},
  ]}

  StorageDAO.set("ID","20");
  StorageDAO.set("tiles",JSON.stringify(tilecollection));
  StorageDAO.set('dragPositions', "")
}
