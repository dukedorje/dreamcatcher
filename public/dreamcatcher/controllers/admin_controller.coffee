$.Controller 'Dreamcatcher.Controllers.Admin',
  
  init: -> 
    @page = 1   
    @totalUsers = parseInt $('#totalUsers').data 'id'
    @pageSize = $('#pageSize').data 'id'
    @totalPages = Math.ceil(@totalUsers / @pageSize)    
    @addPageLinks()
    @updateNav()
        
  updateUsersPage: (json) ->  
    $('#userList').html(json.html)
    # @updateNav()
    $('#allUsersIcon').show()
    $('#pageLoading').hide()

  getParams: ->
    page: @page
  
  # Show or hide next/prev buttons
  updateNav: ->
    if @page > 1 
     $('#prevPage').show()
     $('#prevPageEnd').hide()
    else 
     $('#prevPage').hide()
     $('#prevPageEnd').show()

    if @page < @totalPages    
      $('#nextPage').show()
      $('#nextPageEnd').hide()
    else
      $('#nextPage').hide()
      $('#nextPageEnd').show()
  
  # Add numbered page links  
  addPageLinks: ->
    num = 0
    while num < @totalPages
      num += 1
      $('#pages').append @view 'page_number', {page: num}    

        
  # Dom listeners
  '#userPage click': (el,ev) ->
    @page = parseInt el.text()
    $('#allUsersIcon').hide()
    $('#pageLoading').show()
    Dreamcatcher.Models.Admin.load @getParams(), @updateUsersPage
    @updateNav()

  '#nextPage, #prevPage click': (el,ev) ->
    @page = 1 if !@page? 
    @page = if ev.currentTarget.id is 'nextPage' then @page += 1 else @page -= 1 
    $('#allUsersIcon').hide()
    $('#pageLoading').show()
    Dreamcatcher.Models.Admin.load @getParams(), @updateUsersPage  
    @updateNav()     