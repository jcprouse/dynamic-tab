describe("TileService", function() {

  const existingTileCollection = '{"tiles":[{"dataitemid":62,"class":"a-class","img":{}},{"dataitemid":73,"class":"second-class","img":{}}]}';
  const existingTilePositions = "{'id':'123'}";

  var spy_StorageDAO_get;

  beforeEach(function() {
    spyOn(StorageDAO, 'set');
    spy_StorageDAO_get = spyOn(StorageDAO, 'get').and.returnValue(existingTileCollection);
    spyOn(PackaryGrid, 'getShiftPositions').and.returnValue(existingTilePositions);
    spyOn(window, 'log');
  });

  it("get request should return a default tile collection if nothing found in local storage", function() {
    spy_StorageDAO_get.and.returnValue('');
    expect(TileService.getAllTiles()).toEqual(JSON.parse('{"tiles":[]}'));
    expect(StorageDAO.get).toHaveBeenCalledWith('tiles');
  });

  it("get request should return existing saved tile collection", function() {
    expect(TileService.getAllTiles()).toEqual(JSON.parse(existingTileCollection));
  });

  it("set request should save supplied tile collection", function() {
    var input = '{"abc":"123"}';
    TileService.setAllTiles(JSON.parse(input));
    expect(StorageDAO.set).toHaveBeenCalledWith('tiles',input);
  });

  it("create request should append a new tile item into the collection", function() {
    spy_StorageDAO_get.and.returnValues('41',existingTileCollection);
    // Append to the end
    var newTileCollection = existingTileCollection.substring(0,existingTileCollection.length - 2) + ',{"dataitemid":41,"class":"grid-item","img":{}}]}';
    expect(TileService.create()).toEqual(41);
    expect(StorageDAO.get).toHaveBeenCalledWith('ID');
    expect(StorageDAO.set.calls.allArgs()).toEqual([['ID',42],['tiles',newTileCollection]]);
  });

  it("create request should store the next new ID", function() {
    spy_StorageDAO_get.and.returnValues('41',existingTileCollection);
    TileService.create();
    expect(StorageDAO.set).toHaveBeenCalledWith('ID',42);
  });

  it("update request updates only a single tile item into the collection", function() {
    TileService.update(62, JSON.parse('{"class":"123"}'));
    var expectedValue = existingTileCollection.replace('"dataitemid":62,"class":"a-class"','"dataitemid":62,"class":"123"');
    expect(StorageDAO.set).toHaveBeenCalledWith('tiles',expectedValue);
  });

  it("update request can update colour, size, url, image and image scale", function() {
    TileService.update(62, JSON.parse('{"colour":"red", "class":"abc", "url":"www.test.com", "img":{"url":"123","scale":"60"}}'));
    var expectedValue = existingTileCollection.replace('"dataitemid":62,"class":"a-class","img":{}','"dataitemid":62,"class":"abc","img":{"url":"123","scale":"60"},"colour":"red","url":"www.test.com"');
    expect(StorageDAO.set).toHaveBeenCalledWith('tiles',expectedValue);
  });

  it("update request shouldnt update any items if the ID doesn't match", function() {
    TileService.update(2, JSON.parse('{"colour":"red"}'));
    expect(StorageDAO.set).toHaveBeenCalledWith('tiles',existingTileCollection);
  });

  it("delete request should remove tile", function() {
    TileService.delete(62);
    var expectedValue = existingTileCollection.replace('{"dataitemid":62,"class":"a-class","img":{}},','');
    expect(StorageDAO.set).toHaveBeenCalledWith('tiles',expectedValue);
  });

  it("delete request shouldnt delete any items if the ID doesn't match", function() {
    TileService.delete(2);
    expect(StorageDAO.set).toHaveBeenCalledWith('tiles',existingTileCollection);
  });

  it("save layout request calculates and saves positions", function() {
    TileService.setAllTilesLayout();
    expect(StorageDAO.set).toHaveBeenCalledWith('dragPositions',JSON.stringify(existingTilePositions));
  });

  it("save layout request can accept and save supplied positions", function() {
    var input = "{'id':'456'}";
    TileService.setAllTilesLayout(input);
    expect(StorageDAO.set).toHaveBeenCalledWith('dragPositions',JSON.stringify(input));
  });

  it("get layout request returns tile positions", function() {
    spy_StorageDAO_get.and.returnValue("{'id':'456'}");
    expect(TileService.getAllTilesLayout()).toEqual("{'id':'456'}");
    expect(StorageDAO.get).toHaveBeenCalledWith('dragPositions');
  });

  it("save tile scale request saves the scale and current positions", function() {
    spyOn(TileService,'setAllTilesLayout');
    TileService.setAllTilesScale('150');
    expect(StorageDAO.set).toHaveBeenCalledWith('scale','150');
    expect(TileService.setAllTilesLayout).toHaveBeenCalled();
  });

  it("get tile scale request returns scale from storage", function() {
    spy_StorageDAO_get.and.returnValues('142');
    expect(TileService.getAllTilesScale()).toEqual(142);
  });
  it("get tile scale request will default to 100", function() {
    spy_StorageDAO_get.and.returnValues('');
    expect(TileService.getAllTilesScale()).toEqual(100);
  });
});

describe("NavigationService", function() {

  var selectedTile;
  var jscolorMock;

  beforeEach(function(){
    spyOn(TileService, 'update');
    $(document.body).append($("<div id='testTile' class='grid-item' data-item-id='1' data-item-url='www.test.com' style='background-color:#f0f0f0'></div>"));
    selectedTile = document.getElementById('testTile');

    $(document.body).append($('<input class="jscolor {} form-control mr-sm-2" value="ffffff" id="colourSelector" type="text">'));
    jscolorMock = jasmine.createSpyObj('jscolor',['fromString']);
    document.getElementById('colourSelector').jscolor = jscolorMock;

    $(document.body).append($('<div id="nav_tiles" class="navbar"></div>'));
    $(document.body).append($('<input type="text" id="txtUrl"></input>'));
  });
  afterEach(function(){
    NavigationService.selectedItem = null;
    $("#testTile").remove();
    $("#colourSelector").remove();
    $("#nav_tiles").remove();
    $("#txtUrl").remove();
  });

  it("selecting a tile stores the tile reference and gives a highlight", function() {
    NavigationService.selectTile(selectedTile);
    expect(NavigationService.selectedItem).toEqual(selectedTile);
    expect($(NavigationService.selectedItem).hasClass('selected')).toEqual(true);
  });

  it("selecting a tile removes reference and highlight from previous tile", function() {
    var existingtile = "<div id='testTile2' class='grid-item selected' data-item-id='1'></div>";
    $(document.body).append($(existingtile));
    NavigationService.selectedItem = document.getElementById("testTile2");
    NavigationService.selectTile(selectedTile);
    expect(NavigationService.selectedItem).toEqual(selectedTile);
    expect($("#testTile2").hasClass('selected')).toEqual(false);
    $("#testTile2").remove();
  });


  it("selecting a tile extracts editable properties and shows nav bar", function() {
    spyOn(NavigationService, 'hideNavBar');
    $("#nav_tiles").hide();
    NavigationService.selectTile(selectedTile);
    expect(jscolorMock.fromString).toHaveBeenCalledWith($(selectedTile).css("background-color"));
    expect($("#txtUrl").val()).toEqual("www.test.com");
    expect($("#nav_tiles").is(':visible')).toEqual(true);
    expect(NavigationService.hideNavBar).not.toHaveBeenCalled();
  });

  it("right clicking a tile twice closes the nav bar", function() {
    spyOn(NavigationService, 'hideNavBar');
    NavigationService.selectedItem = selectedTile;
    NavigationService.selectTile(selectedTile);
    expect(NavigationService.hideNavBar).toHaveBeenCalled();
  });

  it("hide nav bar removes the nav display, tile reference and tile highlight", function() {
    $("#testTile").addClass('selected');
    NavigationService.selectedItem = selectedTile;
    NavigationService.hideNavBar();
    expect($(selectedTile).hasClass('selected')).toEqual(false);
    expect($("#nav_tiles").is(':visible')).toEqual(false);
    expect(NavigationService.selectedItem).toEqual(null);
  });

  it("hide nav bar handles selectedItem being null", function() {
    NavigationService.hideNavBar();
    expect($("#nav_tiles").is(':visible')).toEqual(false);
  });

  it("delete request removes tile and reformats grid", function() {
    spyOn(TileService, 'delete');
    spyOn(TileService, 'setAllTilesLayout');

    var spy_packaryGridGet_packery = jasmine.createSpyObj('get',['packery']);
    spyOn(PackaryGrid, 'get').and.returnValue(spy_packaryGridGet_packery);

    NavigationService.selectedItem="<div data-item-id='123abc'></div>"

    NavigationService.deleteTile();
    expect(TileService.delete).toHaveBeenCalledWith('123abc');
    expect(spy_packaryGridGet_packery.packery).toHaveBeenCalledWith('remove',NavigationService.selectedItem);
    expect(TileService.setAllTilesLayout).toHaveBeenCalled();
  });

  it("set tile colour request saves colour against tile", function() {
    NavigationService.selectedItem = selectedTile;
    NavigationService.setTileColour('F0F0F0');
    expect($(selectedTile).css('backgroundColor')).toEqual('rgb(240, 240, 240)');
    expect(TileService.update).toHaveBeenCalledWith("1",JSON.parse('{"colour":"#F0F0F0"}'));
    expect($(selectedTile).css('backgroundColor')).toEqual('rgb(240, 240, 240)');
  });

  it("set tile size request saves size against tile and reformats grid", function() {
    var spy_packaryGridGet_packery = jasmine.createSpyObj('get',['packery']);
    spyOn(PackaryGrid, 'get').and.returnValue(spy_packaryGridGet_packery);
    NavigationService.selectedItem = selectedTile;
    NavigationService.setTileSize('large');
    expect($(selectedTile).hasClass('grid-item--large')).toEqual(true);
    expect(spy_packaryGridGet_packery.packery).toHaveBeenCalledWith('layout');
    expect(TileService.update).toHaveBeenCalledWith("1",JSON.parse('{"class":"grid-item grid-item--large selected"}'));
  });

  it("set tile scale request saves the scale", function() {
    var spy_packaryGridGet_packery = jasmine.createSpyObj('get',['packery']);
    spyOn(PackaryGrid, 'get').and.returnValue(spy_packaryGridGet_packery);
    spyOn(TileService, 'setAllTilesScale');
    NavigationService.setTileScale("150");
    expect(TileService.setAllTilesScale).toHaveBeenCalledWith("150");
  });

  it("set tile scale request saves the scale, updates styling and reformats grid", function() {
    var spy_packaryGridGet_packery = jasmine.createSpyObj('get',['packery']);
    spyOn(PackaryGrid, 'get').and.returnValue(spy_packaryGridGet_packery);
    spyOn(CssService, 'setTileScale');
    spyOn(TileService, 'setAllTilesScale');
    NavigationService.setTileScale("150");
    expect(CssService.setTileScale).toHaveBeenCalledWith('150');
    expect(spy_packaryGridGet_packery.packery).toHaveBeenCalled();
  });

  it("create new tile request creates a new visual element and saves it", function() {
    spyOn(TileService, 'create').and.returnValue(41);


    var spy_packaryGridGet_append = jasmine.createSpyObj('get',['append']);
    var spy_packaryGridGetAppend_packery = jasmine.createSpyObj('append',['packery']);
    spy_packaryGridGet_append.append.and.returnValue(spy_packaryGridGetAppend_packery);
    spyOn(PackaryGrid, 'get').and.returnValue(spy_packaryGridGet_append);


    spyOn(TileService, 'setAllTilesLayout');
    spyOn(GridService, 'initialiseItem');
    var newItem = $('<div class="grid-item" data-item-id="41"></div>');

    NavigationService.createTile();

    expect(spy_packaryGridGet_append.append).toHaveBeenCalledWith(newItem);
    expect(GridService.initialiseItem).toHaveBeenCalledWith(newItem.get(0));
    expect(TileService.setAllTilesLayout).toHaveBeenCalled();
  });

  it("set tile url request saves tile redirection address and updates DOM", function() {
    NavigationService.selectedItem = selectedTile;
    NavigationService.setTileUrl('www.test.com');
    expect($(selectedTile).attr('data-item-url')).toEqual('www.test.com');
    expect(TileService.update).toHaveBeenCalledWith("1",JSON.parse('{"url":"www.test.com"}'));
  });

/*  nounittest.txt
 it("set tile image request saves image url", function() {;
    spyOn(CssService, 'setTileImage');
    NavigationService.selectedItem = selectedTile;
    NavigationService.setTileImage('blob');
    expect(TileService.update).toHaveBeenCalledWith("1",JSON.parse('{"img":"blob"}'));
  })*/

  it("set tile image request updates css and resets uploader", function() {
    $(document.body).append($("<input id='tileImageUpload' type='text' value='abc'></input>"));
    var tileImageUpload = document.getElementById('tileImageUpload');
    NavigationService.selectedItem = selectedTile;
    spyOn(CssService, 'setTileImage');
    NavigationService.setTileImage('blob');
    expect(CssService.setTileImage).toHaveBeenCalledWith(selectedTile,'blob');
    expect($(tileImageUpload).val()).toEqual('');
    $(tileImageUpload).remove();
  });

  it("set tile image scale updates css", function() {
    NavigationService.selectedItem = selectedTile;
    spyOn(CssService, 'setTileImageScale');
    NavigationService.setTileImageScale('123');
    expect(CssService.setTileImageScale).toHaveBeenCalledWith(selectedTile,'123');
    expect(TileService.update).not.toHaveBeenCalled();
  });

  it("set tile image scale saves the scale if requested", function() {
    NavigationService.selectedItem = selectedTile;
    spyOn(CssService, 'setTileImageScale').and.returnValue("456");;
    NavigationService.setTileImageScale('123',false);
    expect(TileService.update).not.toHaveBeenCalled();
    NavigationService.setTileImageScale('123',true);
    expect(CssService.setTileImageScale).toHaveBeenCalledWith(selectedTile,'123');
    expect(TileService.update).toHaveBeenCalledWith('1',JSON.parse('{"img":{"scale":"456"}}'));
  });
});

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
    spyOn(NavigationService, 'selectTile');
    GridService.initialiseItem(selectedTile);
    expect($('#testTile').triggerHandler('contextmenu')).toEqual(false);
    expect(NavigationService.selectTile).toHaveBeenCalledWith(selectedTile);
  });

});

describe("CssService", function() {

  var scaleTextbox = $("<input type='text' id='txtSize'></input>");
  var selectedTile;

  beforeEach(function() {
    $(document.body).append(scaleTextbox);
    $(document.body).append($("<div id='testTile' class='grid-item' data-item-id='1'></div>"));
    $(document.body).append($("<input type='range' min='10' max='100' value='72' id='tileImageSize' />"));
    selectedTile = document.getElementById('testTile');
  });
  afterEach(function(){
    $(scaleTextbox).remove();
    $(selectedTile).remove();
    $("#tileImageSize").remove();
  });

  it("set tile scale request updates styling propeties", function() {
    document.documentElement.style.setProperty('--size','100px');
    document.documentElement.style.setProperty('--size_large', '200px');
    CssService.setTileScale("150");
    expect(document.documentElement.style.getPropertyValue('--size')).toEqual('148px');
    expect(document.documentElement.style.getPropertyValue('--size_large')).toEqual('300px');
    expect(scaleTextbox.val()).toEqual("150");
  });

  it("set tile image request sets background", function() {
    var spy_CssService_getUrl = spyOn(CssService,"_getUrl").and.returnValue("blob.url");
    CssService.setTileImage(selectedTile,"blob");
    expect($(selectedTile).css('background-image')).toEqual('url("'+window.location.href.replace('specrunner.html','blob.url')+'")');
    expect(spy_CssService_getUrl).toHaveBeenCalledWith("blob");
  });

  it("set tile image request resizes background based on tile size and scale", function() {
    var spy_CssService_getUrl = spyOn(CssService,"_getUrl").and.returnValue("blob.url");
    CssService.setTileImage(selectedTile,"blob");
    expect($(selectedTile).css('background-size')).toEqual('72% 72%');

    $(selectedTile).addClass("grid-item--large");
    CssService.setTileImage(selectedTile,"blob");
    expect($(selectedTile).css('background-size')).toEqual('72% 72%');

    $(selectedTile).removeClass("grid-item--large").addClass("grid-item--normal");
    CssService.setTileImage(selectedTile,"blob");
    expect($(selectedTile).css('background-size')).toEqual('72% 72%');

    $(selectedTile).removeClass("grid-item--normal").addClass("grid-item--horizontal");
    CssService.setTileImage(selectedTile,"blob");
    expect($(selectedTile).css('background-size')).toEqual('36% 72%');

    $(selectedTile).removeClass("grid-item--horizontal").addClass("grid-item--vertical");
    CssService.setTileImage(selectedTile,"blob");
    expect($(selectedTile).css('background-size')).toEqual('72% 36%');
  });
});
