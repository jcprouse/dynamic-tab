describe("Services", function() {

//  var tileService;

/*  beforeEach(function() {
    tileService = new T();
    song = new Song();
  });*/

  it("should return a default tile collection if nothing found in local storage", function() {
    TileService.get();
    expect(player.currentlyPlayingSong).toEqual(song);

    //demonstrates use of custom matcher
    expect(player).toBePlaying(song);
  });

}
