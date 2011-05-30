$.Controller 'Dreamcatcher.Controllers.Entries.Books',

  init: ->
    @initSelectMenu()
    $('.book').each (i, el) =>
      @closeBook $(el)
  
  initSelectMenu:  ->
    $('#new-post').selectmenu {
      style: 'dropdown'
      menuWidth: '174px'
      positionOptions: {
        offset: '-136px -35px'
      }
    }
    
  showPage: (el, page) ->
    bookEl = el.closest '.book'
    $('.open', bookEl).children().hide()
    $(".#{page}-panel", bookEl).show()
    
  closeBook: (el) ->
    bookEl = el.closest '.book'
    $('.open', bookEl).hide()
    $('.closed', bookEl).show()
    
  openBook: (el) ->
    bookEl = el.closest '.book'
    $('.open', bookEl).show()
    $('.closed', bookEl).hide()
    
  changeBookColor: (el) ->
    color = el.attr 'class'
    bookEl = el.closest '.book'
    bookEl.attr 'class', 'book'
    bookEl.addClass color
    
  showMore: (el) ->
    bookEl = el.closest '.book'
    $('.more-settings', bookEl).toggle()
    
    
  '.book .control-panel .color click': (el) ->
    @showPage el, 'color'
    
  '.book .control-panel .coverImage click': (el) ->
    @showPage el, 'cover'
    
  '.book .control-panel .access click': (el) ->
    @showPage el, 'access'
    
  '.book .open .back click': (el) ->
    @showPage el, 'control'
    
  '.book .color-panel .swatches li click': (el) ->
    @changeBookColor el
    
    
  '.book .control-panel .confirm click': (el) ->
    @closeBook el
    
  '.book .closed .edit click': (el) ->
    @openBook el
    
  '.book .more click': (el) ->
    @showMore el
    

    