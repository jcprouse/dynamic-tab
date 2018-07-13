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
  
    it("save tile scale request saves the scale", function() {
      spyOn(TileService,'setAllTilesLayout');
      TileService.setAllTilesScale('150');
      expect(StorageDAO.set).toHaveBeenCalledWith('scale','150');
    });
  
    it("get tile scale request returns scale from storage", function() {
      spy_StorageDAO_get.and.returnValues('142');
      expect(TileService.getAllTilesScale()).toEqual(142);
    });
    it("get tile scale request will default to 100", function() {
      spy_StorageDAO_get.and.returnValues('');
      expect(TileService.getAllTilesScale()).toEqual(100);
    });

    it("save tile image auto colour saves the value", function() {
      TileService.setTileImageAutoColour(1);
      expect(StorageDAO.set).toHaveBeenCalledWith(TileService.tileautocolour_key,1);
    });
    it("get tile image auto colour gets the value", function() {
      spy_StorageDAO_get.and.returnValue(1);
      expect(TileService.getTileImageAutoColour()).toEqual(1);
    });
  });
  