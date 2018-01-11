var $grid;

var debug = false;
var resetToStock = false;

$( document ).ready(function() {

  if (resetToStock) reset();

  var tile_collection = TileService.get().tiles;
  log(tile_collection,"Tile collection on load");

  for (var counter = 0; counter < tile_collection.length; counter++)
  {
    var tile = tile_collection[counter];
    $("#grid").append('<div class="'+tile.class+'" data-item-id="'+tile.dataitemid+'" style="background-color:#'+tile.colour+'"></div>')
  }


  var size = parseInt((StorageDAO.get('size') || "100"));
  $("#txtSize").val(size);

  document.documentElement.style.setProperty(`--size`, (size-2)+'px');
  document.documentElement.style.setProperty(`--size_large`, (size * 2)+'px');

  // init Packery
  $grid = $('.grid').packery({
    itemSelector: '.grid-item',
    columnWidth: '.grid-sizer',
    gutter: 4,
    //columnWidth:100,
    percentPosition: true,
    initLayout: false // disable initial layout
  });

  var initPositions = TileService.getLayout();

  // init layout with saved positions
  $grid.packery( 'initShiftLayout', initPositions, 'data-item-id' );

  $grid.find('.grid-item').each(initGridItem);

  // save drag positions on event
  $grid.on( 'dragItemPositioned', function() {
    TileService.saveLayout();
  });

  $grid.on( 'staticClick', '.grid-item', function( item ) {
    var dataItemId = $(item.target.outerHTML).attr("data-item-id");
    log("ID: "+dataItemId,"Item clicked");
    //window.location = "https://www.bbc.co.uk"
  });

});


function update(hex) {
  $('#colourSelector div').css('backgroundColor', "#"+hex);
  NavService.previewColour(hex);
}


var initGridItem = function( i, itemElem ) {
  // Make draggable
  var draggie = new Draggabilly( itemElem );
  $grid.packery( 'bindDraggabillyEvents', draggie );

  // Right click event
  $(itemElem).contextmenu(function(){
    NavService.show(this);
    return false;

  })
}

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

var log = function(content,header){
  if (debug) {
    if (header){
      console.log("--- "+header+" ---")
    }
    console.log(content);
  }
}
