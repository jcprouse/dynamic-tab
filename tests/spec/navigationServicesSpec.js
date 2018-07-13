describe("TileNavigationService", function() {

    var selectedTile;
    var jscolorMock;
  
    beforeEach(function(){
      spyOn(TileService, 'update');
      $(document.body).append($("<div id='testTile' class='grid-item constraint selected' data-item-id='1' data-item-url='www.test.com' style='background-color:#f0f0f0'></div>"));
      selectedTile = document.getElementById('testTile');
  
      $(document.body).append($("<input type='checkbox' id='chkTileImageConstraint' />"));
      $(document.body).append($('<input class="jscolor {} form-control mr-sm-2" value="ffffff" id="colourSelector" type="text">'));
      jscolorMock = jasmine.createSpyObj('jscolor',['fromString']);
      document.getElementById('colourSelector').jscolor = jscolorMock;
  
      $(document.body).append($('<div id="nav_tiles" class="navbar"></div>'));
      $(document.body).append($('<input type="checkbox" id="chkTileImageAutoColour" />'));
      $(document.body).append($('<input type="range" min="10" max="100" value="100" id="tileImageSize" />'));
      $(document.body).append($('<input type="text" id="txtUrl"></input>'));
    });
    afterEach(function(){
      TileNavigationService.selectedItem = null;
      $("#testTile").remove();
      $("#colourSelector").remove();
      $("#nav_tiles").remove();
      $("#txtUrl").remove();
      $("#tileImageSize").remove();
      $("#chkTileImageConstraint").remove();
      $("#chkTileImageAutoColour").remove();
    });
  
    it("selecting a tile stores the tile reference and gives a highlight", function() {
      TileNavigationService.selectTile(selectedTile);
      expect(TileNavigationService.selectedItem).toEqual(selectedTile);
      expect($(TileNavigationService.selectedItem).hasClass('selected')).toEqual(true);
    });
  
    it("selecting a tile removes reference and highlight from previous tile", function() {
      var existingtile = "<div id='testTile2' class='grid-item selected' data-item-id='1'></div>";
      $(document.body).append($(existingtile));
      TileNavigationService.selectedItem = document.getElementById("testTile2");
      TileNavigationService.selectTile(selectedTile);
      expect(TileNavigationService.selectedItem).toEqual(selectedTile);
      expect($("#testTile2").hasClass('selected')).toEqual(false);
      $("#testTile2").remove();
    });
  
  
    it("selecting a tile extracts editable properties and shows nav bar", function() {
      spyOn(TileNavigationService, 'hideNavBar');
      $("#nav_tiles").hide();
      TileNavigationService.selectTile(selectedTile);
      expect(jscolorMock.fromString).toHaveBeenCalledWith($(selectedTile).css("background-color"));
      expect($("#txtUrl").val()).toEqual("www.test.com");
      expect($("#chkTileImageConstraint").is(':checked')).toEqual(true);
      expect($("#tileImageSize").val()).toEqual("100");
      expect($("#nav_tiles").is(':visible')).toEqual(true);
      expect(TileNavigationService.hideNavBar).not.toHaveBeenCalled();
    });
  
    it("selecting a tile sets image scale bar if available", function() {
      $(selectedTile).attr("data-item-img-scale","60")
      TileNavigationService.selectTile(selectedTile);
      expect($("#tileImageSize").val()).toEqual("60");
    });
  
    it("right clicking a tile twice closes the nav bar", function() {
      spyOn(TileNavigationService, 'hideNavBar');
      TileNavigationService.selectedItem = selectedTile;
      TileNavigationService.selectTile(selectedTile);
      expect(TileNavigationService.hideNavBar).toHaveBeenCalled();
    });
  
    it("hide nav bar removes the nav display, tile reference and tile highlight", function() {
      $("#testTile").addClass('selected');
      TileNavigationService.selectedItem = selectedTile;
      TileNavigationService.hideNavBar();
      expect($(selectedTile).hasClass('selected')).toEqual(false);
      expect($("#nav_tiles").is(':visible')).toEqual(false);
      expect(TileNavigationService.selectedItem).toEqual(null);
    });
  
    it("hide nav bar handles selectedItem being null", function() {
      TileNavigationService.hideNavBar();
      expect($("#nav_tiles").is(':visible')).toEqual(false);
    });
  
    it("delete request removes tile and reformats grid", function() {
      spyOn(TileService, 'delete');
      spyOn(TileService, 'setAllTilesLayout');
  
      var spy_packaryGridGet_packery = jasmine.createSpyObj('get',['packery']);
      spyOn(PackaryGrid, 'get').and.returnValue(spy_packaryGridGet_packery);
  
      TileNavigationService.selectedItem="<div data-item-id='123abc'></div>"
  
      TileNavigationService.deleteTile();
      expect(TileService.delete).toHaveBeenCalledWith('123abc');
      expect(spy_packaryGridGet_packery.packery).toHaveBeenCalledWith('remove',"<div data-item-id='123abc'></div>");
      expect(TileService.setAllTilesLayout).toHaveBeenCalled();
    });
  
    it("set tile colour request saves colour against tile", function() {
      TileNavigationService.selectedItem = selectedTile;
      TileNavigationService.setTileColour('F0F0F0');
      expect($(selectedTile).css('backgroundColor')).toEqual('rgb(240, 240, 240)');
      expect(TileService.update).toHaveBeenCalledWith("1",JSON.parse('{"colour":"#F0F0F0"}'));
      expect($(selectedTile).css('backgroundColor')).toEqual('rgb(240, 240, 240)');
    });
  
    it("set tile size request saves size against tile and reformats grid", function() {
      var spy_packaryGridGet_packery = jasmine.createSpyObj('get',['packery']);
      spyOn(PackaryGrid, 'get').and.returnValue(spy_packaryGridGet_packery);
      TileNavigationService.selectedItem = selectedTile;
      TileNavigationService.setTileSize('large');
      expect($(selectedTile).hasClass('grid-item--large')).toEqual(true);
      expect(spy_packaryGridGet_packery.packery).toHaveBeenCalledWith('layout');
      expect(TileService.update).toHaveBeenCalledWith("1",JSON.parse('{"class":"grid-item grid-item--large"}'));
    });
  
    it("set tile scale request saves the scale", function() {
      var spy_packaryGridGet_packery = jasmine.createSpyObj('get',['packery']);
      spyOn(PackaryGrid, 'get').and.returnValue(spy_packaryGridGet_packery);
      spyOn(TileService, 'setAllTilesScale');
      TileNavigationService.setTileScale("150");
      expect(TileService.setAllTilesScale).toHaveBeenCalledWith("150");
    });
  
    it("set tile scale request saves the scale, updates styling and reformats grid", function() {
      var spy_packaryGridGet_packery = jasmine.createSpyObj('get',['packery']);
      spyOn(PackaryGrid, 'get').and.returnValue(spy_packaryGridGet_packery);
      spyOn(CssService, 'setTileScale');
      spyOn(TileService, 'setAllTilesScale');
      TileNavigationService.setTileScale("150");
      expect(CssService.setTileScale).toHaveBeenCalledWith('150');
      expect(spy_packaryGridGet_packery.packery).toHaveBeenCalled();
    });
  
    it("set tile url request saves tile redirection address and updates DOM", function() {
      TileNavigationService.selectedItem = selectedTile;
      TileNavigationService.setTileUrl('www.test.com');
      expect($(selectedTile).attr('data-item-url')).toEqual('www.test.com');
      expect(TileService.update).toHaveBeenCalledWith("1",JSON.parse('{"url":"www.test.com"}'));
    });
  
    it("set tile image scale updates css and saves the scale", function() {
      TileNavigationService.selectedItem = selectedTile;
      spyOn(CssService, 'setTileImageScale');
      TileNavigationService.setTileImageScale('123');
      expect(CssService.setTileImageScale).toHaveBeenCalledWith(selectedTile,'123');
      expect(TileService.update).toHaveBeenCalledWith('1',JSON.parse('{"img":{"scale":"123"}}'));
    });
  
    it("toggle image constraint either adds or removes constraint class", function() {

      $(selectedTile).attr("data-item-img-scale","72");
      spyOn(CssService, 'setTileImageScale');
      TileNavigationService.selectedItem = selectedTile;

      $("#chkTileImageConstraint").attr("checked",true);
      TileNavigationService.toggleTileImageConstraint();
      expect($("#testTile").hasClass("constraint")).toEqual(true);
      expect(TileService.update).toHaveBeenCalledWith("1",JSON.parse('{"class":"grid-item constraint"}'));
      expect(CssService.setTileImageScale).toHaveBeenCalledWith(selectedTile,'72');

      $("#chkTileImageConstraint").removeAttr("checked");
      TileNavigationService.toggleTileImageConstraint();
      expect($("#testTile").hasClass("constraint")).toEqual(false);
      expect(TileService.update).toHaveBeenCalledWith("1",JSON.parse('{"class":"grid-item"}'));
      expect(CssService.setTileImageScale).toHaveBeenCalledWith(selectedTile,'72');
    });

    it("toggle image auto colour will update Tile Service", function() {
      spyOn(TileService, 'setTileImageAutoColour');
      TileNavigationService.toggleTileImageAutoColour();
      expect(TileService.setTileImageAutoColour).toHaveBeenCalledWith(0);
      
      $("#chkTileImageAutoColour").attr("checked",true);
      TileNavigationService.toggleTileImageAutoColour();
      expect(TileService.setTileImageAutoColour).toHaveBeenCalledWith(1);
    });


  });



describe("SettingsNavigationService", function() {
  
    beforeEach(function(){
      $(document.body).append($('<div id="nav_settings" class="navbar"></div>'));
    });

    afterEach(function(){
      TileNavigationService.selectedItem = null;
      $("#nav_settings").remove();
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
    
        SettingsNavigationService.createTile();
    
        expect(spy_packaryGridGet_append.append).toHaveBeenCalledWith(newItem);
        expect(GridService.initialiseItem).toHaveBeenCalledWith(newItem.get(0));
        expect(TileService.setAllTilesLayout).toHaveBeenCalled();
    });

    it("show nav bar displays it in view", function() {
        $("#nav_settings").hide();
        SettingsNavigationService.showNavBar();
        expect($("#nav_settings").is(':visible')).toEqual(true);
    });

    it("hide nav bar removes it from view", function() {
        SettingsNavigationService.hideNavBar();
        expect($("#nav_settings").is(':visible')).toEqual(false);
    });

    it("toggle nav bar either shows or hides", function() {
        SettingsNavigationService.toggleNavBar();
        expect($("#nav_settings").is(':visible')).toEqual(false);
        SettingsNavigationService.toggleNavBar();
        expect($("#nav_settings").is(':visible')).toEqual(true);
    });

});