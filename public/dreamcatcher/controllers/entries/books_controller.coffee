$.Controller 'Dreamcatcher.Controllers.Entries.Books',

  model: Dreamcatcher.Models.Book
  
  init: ->
    @model.get {}, (html) =>
      $('#entryField .matrix').prepend html
      $('.book').each (i, el) =>
        @closeBook $(el)
      
  newBook: ->
    @model.new {}, (html) =>
      $('#entryField .matrix').prepend html
      @openBook $('#entryField .matrix .book:first')
    
  showPage: (el, page) ->
    bookEl = el.closest '.book'
    $('.open', bookEl).children().hide()
    $(".#{page}-panel", bookEl).show()
    @createUploader bookEl if page is 'cover'
    
  closeBook: (el) ->
    bookEl = el.closest '.book'
    $('.open', bookEl).hide()
    $('.closed', bookEl).show()
    
  openBook: (el) ->
    bookEl = el.closest '.book'
    #close all books
    $('.book .open').hide()
    $('.book .closed').show()
    #just open the current
    $('.open', bookEl).show()
    $('.closed', bookEl).hide()
    #$('#bodyClick').show()
    
  changeBookColor: (el) ->
    color = el.attr 'class'
    bookEl = el.closest '.book'
    bookEl.attr 'class', 'book'
    bookEl.addClass color
    bookEl.data 'color', color
    
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
    bookEl = el.closest '.book'
    bookMeta = @getBookMeta bookEl
    bookId = bookEl.data 'id'
    if bookId is 'new'
      @model.create bookMeta, @callback('bookCreated', bookEl)
    else
      bookId = parseInt bookId
      @model.update bookId, bookMeta, @callback('bookUpdated', bookEl)
  
  bookCreated: (el)->
    notice 'New book has been created'
    @closeBook el
  
  bookUpdated: (el, result) -> 
    notice result.message
    @closeBook el
    
  '.book .closed .edit click': (el) ->
    @openBook el
    
  '.book .more click': (el) ->
    @showMore el
    
  getBookMeta: (el) ->
    return {
      book: {
        title: $('.titleInput', el).val()
        user_id: $('.userInfo').data 'id'
        color: el.attr('class').replace('book','').trim()
        cover_image_id: el.data('image') if el.data('image')
        #viewing_level: $('.viewing-menu',bookEl).val()
        #commenting_level: $('.commenting-menu',bookEl).val()
      }
    }
    
  createUploader: (el) ->
    @uploader = Dreamcatcher.Classes.UploadHelper.createUploader {
      element: $('.cover-panel', el)
      url: '/images.json'
      button: 'add'
      drop: 'dropbox'
      list: 'dropbox-field-shine'
    }, @callback('uploadSubmit'), @callback('uploadComplete', el), @callback('uploadCancel'), @callback('uploadProgress')
    
  uploadSubmit: ->
    @uploader.setParams {
      image: {
        section: 'book covers'
        category: 'all'
        genre: ''
      }
    }
  uploadComplete: (el, id, fileName, result) ->
    if result.image?
      image = result.image
      el.data 'image', image.id
      $('.cover', el).css 'background-image', "url(/images/uploads/#{image.id}-252x252.#{image.format})"
      $('.dropbox-field-shine', el).css 'background', "transparent url(/images/uploads/#{image.id}-252x252.#{image.format}) no-repeat center center"

  uploadCancel: ->
    log 'cancelled'
  
  uploadProgress: ->
    log 'progress'
    
  #todo: add mask to flat (styles)
  
  
    
    

    