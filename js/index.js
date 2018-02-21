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
    if (tile.img)
    {
      backgroundUrl = "; background-image:url(data:image/png;base64,"+tile.img+")";
    }
    $("#grid").append('<div class="'+tile.class+'" data-item-id="'+tile.dataitemid+'" data-item-url="'+(tile.url || "")+'" style="background-color:'+(tile.colour || '#FFFFFF')+backgroundUrl+'"></div>')
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
    {dataitemid:1,class:"grid-item grid-item--horizontal"},
    {dataitemid:2,class:"grid-item grid-item--horizontal"},
    {dataitemid:3,class:"grid-item grid-item--vertical"},
    {dataitemid:4,class:"grid-item"},
    {dataitemid:5,class:"grid-item"},
    {dataitemid:6,class:"grid-item grid-item--large"},
    {dataitemid:7,class:"grid-item grid-item--horizontal"},
    {dataitemid:8,class:"grid-item grid-item--horizontal"},
    {dataitemid:9,class:"grid-item grid-item--vertical"},
    {dataitemid:10,class:"grid-item"},
    {dataitemid:11,class:"grid-item grid-item--horizontal"},
    {dataitemid:12,class:"grid-item grid-item--vertical"},
    {dataitemid:13,class:"grid-item"},
    {dataitemid:14,class:"grid-item"},
    {dataitemid:15,class:"grid-item grid-item--large"},
    {dataitemid:16,class:"grid-item"},
    {dataitemid:17,class:"grid-item grid-item--horizontal"},
    {dataitemid:18,class:"grid-item grid-item--vertical"},
    {dataitemid:19,class:"grid-item"},
  ]}

  StorageDAO.set("ID","20");
  StorageDAO.set("tiles",JSON.stringify(tilecollection));
  StorageDAO.set('dragPositions', "")
}
