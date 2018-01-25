describe("TileService", function() {

  const existingTileCollection = '{"tiles":[{"dataitemid":62,"class":"a-class"},{"dataitemid":73,"class":"second-class"}]}';
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
    var newTileCollection = existingTileCollection.substring(0,existingTileCollection.length - 2) + ',{"dataitemid":41,"class":"grid-item"}]}';
    TileService.create();
    expect(StorageDAO.get).toHaveBeenCalledWith('ID');
    expect(StorageDAO.set).toHaveBeenCalledWith('tiles',newTileCollection);
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

  it("update request can update colour and size", function() {
    TileService.update(62, JSON.parse('{"colour":"red", "class":"abc"}'));
    var expectedValue = existingTileCollection.replace('"dataitemid":62,"class":"a-class"','"dataitemid":62,"class":"abc","colour":"red"');
    expect(StorageDAO.set).toHaveBeenCalledWith('tiles',expectedValue);
  });

  it("update request shouldnt update any items if the ID doesn't match", function() {
    TileService.update(2, JSON.parse('{"colour":"red"}'));
    expect(StorageDAO.set).toHaveBeenCalledWith('tiles',existingTileCollection);
  });

  it("delete request should remove tile", function() {
    TileService.delete(62);
    var expectedValue = existingTileCollection.replace('{"dataitemid":62,"class":"a-class"},','');
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
});

describe("NavigationService", function() {

  var selectedTile;
  var jscolorMock;

  beforeEach(function(){
    $(document.body).append($("<div id='testTile' class='grid-item' data-item-id='1' style='background-color:#f0f0f0'></div>"));
    selectedTile = document.getElementById('testTile');

    $(document.body).append($('<input class="jscolor {} form-control mr-sm-2" value="ffffff" id="colourSelector" type="text">'));
    jscolorMock = jasmine.createSpyObj('jscolor',['fromString']);
    document.getElementById('colourSelector').jscolor = jscolorMock;

    $(document.body).append($('<div class="navbar"></div>'));
  });
  afterEach(function(){
    NavigationService.selectedItem = null;
    $("#testTile").remove();
    $("#colourSelector").remove();
    $(".navbar").remove();
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
    $(".navbar").hide();
    NavigationService.selectTile(selectedTile);
    expect(jscolorMock.fromString).toHaveBeenCalledWith($(selectedTile).css("background-color"));
    expect($(".navbar").is(':visible')).toEqual(true);
  });

  it("hide nav bar removes the nav display and tile highlight", function() {
    $("#testTile").addClass('selected');
    NavigationService.selectedItem = selectedTile;
    NavigationService.hideNavBar();
    expect($(selectedTile).hasClass('selected')).toEqual(false);
    expect($(".navbar").is(':visible')).toEqual(false);
  });

  it("hide nav bar handles selectedItem being null", function() {
    NavigationService.hideNavBar();
    expect($(".navbar").is(':visible')).toEqual(false);
  });

  it("delete request removes tile and reformats grid", function() {
    spyOn(TileService, 'delete');
    spyOn(TileService, 'setAllTilesLayout');

    var spy_packaryGridGet_packery = jasmine.createSpyObj('get',['packery']);
    spyOn(PackaryGrid, 'get').and.returnValue(spy_packaryGridGet_packery);

    NavigationService.selectedItem="<div data-item-id='123abc'></div>"

    NavigationService.delete();
    expect(TileService.delete).toHaveBeenCalledWith('123abc');
    expect(spy_packaryGridGet_packery.packery).toHaveBeenCalledWith('remove',NavigationService.selectedItem);
    expect(TileService.setAllTilesLayout).toHaveBeenCalled();
  });

  it("set tile colour request saves colour against tile", function() {
    spyOn(TileService, 'update');
    NavigationService.selectedItem = selectedTile;
    NavigationService.setTileColour('F0F0F0');
    expect($(selectedTile).css('backgroundColor')).toEqual('rgb(240, 240, 240)');
    expect(TileService.update).toHaveBeenCalledWith("1",JSON.parse('{"colour":"#F0F0F0"}'));
  });

  it("set tile size request saves size against tile and reformats grid", function() {
    var spy_packaryGridGet_packery = jasmine.createSpyObj('get',['packery']);
    spyOn(PackaryGrid, 'get').and.returnValue(spy_packaryGridGet_packery);
    spyOn(TileService, 'update');

    NavigationService.selectedItem = selectedTile;
    NavigationService.setTileSize('large');
    expect($(selectedTile).hasClass('grid-item--large')).toEqual(true);
    expect(spy_packaryGridGet_packery.packery).toHaveBeenCalledWith('layout');
    expect(TileService.update).toHaveBeenCalledWith("1",JSON.parse('{"class":"grid-item grid-item--large"}'));
  });
});
