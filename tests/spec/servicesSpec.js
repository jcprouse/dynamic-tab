describe("GridService", function() {

  var selectedTile;

  beforeEach(function(){
    $(document.body).append($("<div id='testTile' class='grid-item' data-item-id='1'></div>"));
    selectedTile = document.getElementById('testTile');
  });

  afterEach(function(){
    $("#testTile").remove();
  });

  it("initialise item makes a single tile draggable", function() {
    var stubDraggabilly = jasmine.createSpy('stubDraggabilly');
    spyOn(window, 'Draggabilly').and.returnValue(stubDraggabilly);

    var spy_packaryGridGet_packery = jasmine.createSpyObj('get',['packery']);
    spyOn(PackaryGrid, 'get').and.returnValue(spy_packaryGridGet_packery);

    GridService.initialiseItem(selectedTile);
    expect(window.Draggabilly).toHaveBeenCalledWith(selectedTile);
    expect(spy_packaryGridGet_packery.packery).toHaveBeenCalledWith('bindDraggabillyEvents',stubDraggabilly);
  });

  it("initialise item gives a right click context menu", function() {
    spyOn(TileNavigationService, 'selectTile');
    GridService.initialiseItem(selectedTile);
    expect($('#testTile').triggerHandler('contextmenu')).toEqual(false);
    expect(TileNavigationService.selectTile).toHaveBeenCalledWith(selectedTile);
  });

});

describe("CssService", function() {

  var scaleTextbox = $("<input type='text' id='txtSize'></input>");
  var selectedTile;

  beforeEach(function() {
    $(document.body).append(scaleTextbox);
    $(document.body).append($("<div id='testTile' class='grid-item' data-item-id='1'></div>"));
    //$(document.body).append($("<input type='range' min='10' max='100' value='72' id='tileImageSize' />"));
    selectedTile = document.getElementById('testTile');
  });
  afterEach(function(){
    $(scaleTextbox).remove();
    $(selectedTile).remove();
    $("#tileImageSize").remove();
  });

  it("set tile scale request updates styling propeties", function() {
    document.documentElement.style.setProperty('--size_grid_item','100px');
    document.documentElement.style.setProperty('--size_large_grid_item', '200px');
    CssService.setTileScale("150");
    expect(document.documentElement.style.getPropertyValue('--size_grid_item')).toEqual('148px');
    expect(document.documentElement.style.getPropertyValue('--size_large_grid_item')).toEqual('300px');
    expect(scaleTextbox.val()).toEqual("150");
  });

  it("set tile image request sets background", function() {
    CssService.setTileImage(selectedTile,"blob",72);
    expect($(selectedTile).css('background-image')).toEqual('url("data:image/png;base64,blob")');
  });

  it("set tile image request resizes background based on tile size and scale", function() {
    CssService.setTileImage(selectedTile,"blob",72);
    expect($(selectedTile).css('background-size')).toEqual('72% 72%');

    $(selectedTile).addClass("grid-item--large");
    CssService.setTileImage(selectedTile,"blob",72);
    expect($(selectedTile).css('background-size')).toEqual('72% 72%');

    $(selectedTile).removeClass("grid-item--large").addClass("grid-item--normal");
    CssService.setTileImage(selectedTile,"blob",72);
    expect($(selectedTile).css('background-size')).toEqual('72% 72%');

    $(selectedTile).removeClass("grid-item--normal").addClass("grid-item--horizontal");
    CssService.setTileImage(selectedTile,"blob",72);
    expect($(selectedTile).css('background-size')).toEqual('72% 72%');

    $(selectedTile).removeClass("grid-item--horizontal").addClass("grid-item--vertical");
    CssService.setTileImage(selectedTile,"blob",72);
    expect($(selectedTile).css('background-size')).toEqual('72% 72%');
  });

  it("set tile image request keeps constaints if selected", function() {
    $(selectedTile).addClass("constraint")
    CssService.setTileImage(selectedTile,"blob",72);
    expect($(selectedTile).css('background-size')).toEqual('auto 72%');

    $(selectedTile).addClass("grid-item--large");
    CssService.setTileImage(selectedTile,"blob",72);
    expect($(selectedTile).css('background-size')).toEqual('auto 72%');

    $(selectedTile).removeClass("grid-item--large").addClass("grid-item--normal");
    CssService.setTileImage(selectedTile,"blob",72);
    expect($(selectedTile).css('background-size')).toEqual('auto 72%');

    $(selectedTile).removeClass("grid-item--normal").addClass("grid-item--horizontal");
    CssService.setTileImage(selectedTile,"blob",72);
    expect($(selectedTile).css('background-size')).toEqual('72%');

    $(selectedTile).removeClass("grid-item--horizontal").addClass("grid-item--vertical");
    CssService.setTileImage(selectedTile,"blob",72);
    expect($(selectedTile).css('background-size')).toEqual('auto 72%');
  });
});
