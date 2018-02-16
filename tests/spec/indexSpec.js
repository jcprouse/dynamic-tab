describe("Index", function() {

  const existingTileCollection = JSON.parse('{"tiles":[{"dataitemid":62,"class":"a-class","colour":"#123456","img":"blob:http://localhost/2db7"},{"dataitemid":73,"class":"second-class", "url":"www.test.com"}]}');
  var grid = $("<div id='grid'></div>");
  beforeEach(function() {
    spyOn(TileService, 'getAllTiles').and.returnValue(existingTileCollection);
    spyOn(TileService, 'getAllTilesScale').and.returnValue(142);
    $(document.body).append(grid);
  });
  afterEach(function(){
    $(grid).remove();
  });

  it("initialisation should load saved tiles", function() {
    init();
    expect(grid.html()).toEqual('<div class="a-class" data-item-id="62" data-item-url="" style="background-color:#123456; background-image:url(blob:http://localhost/2db7)"></div>'+
    '<div class="second-class" data-item-id="73" data-item-url="www.test.com" style="background-color:#FFFFFF"></div>')
  });

  it("initialisation should load tile scale", function() {
    spyOn(CssService, 'setTileScale');
    init();
    expect(CssService.setTileScale).toHaveBeenCalledWith(142);
  });

  it("initialisation should set grid layout", function() {
    spyOn(TileService, 'getAllTilesLayout').and.returnValue('fakePositions');
    spyOn(PackaryGrid, 'setShiftPositions');
    init();
    expect(PackaryGrid.setShiftPositions).toHaveBeenCalledWith('fakePositions');
  });

  it("initialisation should load event handlers", function() {
    spyOn(window, 'init_eventHandlers');
    init();
    expect(window.init_eventHandlers).toHaveBeenCalled();
  });
});
