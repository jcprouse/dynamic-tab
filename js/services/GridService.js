var GridService = {
  initialiseItem: function(item) {
    // Make draggable
    var draggie = new Draggabilly(item);
    PackaryGrid.get().packery('bindDraggabillyEvents', draggie);

    $(item).on("staticClick",function(){
      if (!TileNavigationService.selectedItem){
        var url = $(item).attr('data-item-url');
        if (url) window.location.href = url;
      }
    });

    // Right click event
    $(item).contextmenu(function(){
      TileNavigationService.selectTile(this);
      return false;
    });
  }
}
