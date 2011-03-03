getYoutubeData = (video_url, linked_element) ->
  splitTextArray = video_url.split('v=');
  filePath = 'http://gdata.youtube.com/feeds/api/videos?q=' + splitTextArray[splitTextArray.length - 1] + '&alt=json&max-results=30&format=5';
  
  # Get the data from YOUTUBE
  $.ajax({
    url: filePath
    dataType: 'jsonp'
    success: (data) ->
      log data
      videoPath = data.feed.entry[0].media$group.media$content[0].url
      embedPlayer = '<object width="425" height="350"><param name="movie" value="' + videoPath + '"></param><param name="wmode" value="transparent"></param><embed src="' + videoPath + '" type="application/x-shockwave-flash" wmode="transparent" width="425" height="350"></embed></object>'
      
      thumbnail_url = data.feed.entry[0].media$group.media$thumbnail[1].url
      
      #var newElement = '<div class="linkContainer youtube"><div class="title"><input class="linkTitleValue" style="width: 220px;" value="' + data.feed.entry[0].title.$t + '" name="entry[links_attributes][][title]" /></div><div class="url"><input value="' + newText + '" class="linkUrlValue" name="entry[links_attributes][][url]" style="width: 320px;"><div class="icon"><img src="http://www.google.com/s2/favicons?domain_url=' + newText + '" /></div></div><div class="removeicon"></div><div class="thumb" style="background: url(' + data.feed.entry[0].media$group.media$thumbnail[1].url + ') no-repeat center center transparent"></div><div class="description">' + data.feed.entry[0].content.$t + '</div></div>'
      $.publish 'youtube:data', [linked_element, thumbnail_url]
  })
  
  
$(document).ready ->
  tagsController = new TagsController('.showTags', 'show')
  $('.gallery .lightbox a').lightBox();
  
  # Setup tag re-ordering
  if $('#entryField').data('owner')
    $("#sorting").val(1)
    $("#tag-list").sortable -> distance: 30
  
  	$( "#tag-list" ).bind "sortstart", (event, ui) ->
  	  $("#sorting").val(0)
	  
  	$( "#tag-list" ).bind "sortstop", (event, ui) ->
  	  $("#sorting").val(1)
	  
  	  tagOrder = []
  	  $('#tag-list > .tag').each (i, el) ->
  	    tagOrder.push($(this).data('id'))
	    
  	  entry = $('#showEntry').data('id')
  	  order = tagOrder.join()
	  
  	  $.ajax {
        type: 'PUT'
        url: '/tags/order_custom'
        data:
          entry_id: entry
          position_list: order
        #success: (data, status, xhr) => log "success"
      }
    
  #tags/order_custom = url, with the params: entry_id and position_list (your ordered list of ids) to it?

  $('#comment_body').keyup ->
    fitToContent(this, 0)
  $('#comment_body').css('overflow','hidden')
  
	# Setup comment expander
	# $('textarea#comment_body').autoResize
	#  animationDuration: 500
	#  animate: true
	#  extraSpace: 40

	  
  # setup remove comment handler
  $('.deleteComment').live 'click', (event)->
    tempCount = $('.commentsHeader .counter').html();
    tempCount--
    $('.commentsHeader .counter').html(tempCount)
    $(event.currentTarget).parent().parent().slideUp()
  
    
  # Hide the elements in the browsers they cant be seen in
  if window.BrowserDetect.browser is "Safari" or window.BrowserDetect.browser is "Chrome"
    # for show entry
    $('.tagInput').css('width', '250px') 
  
  
  
  # Setup youtube attachments to load in on the page & links favico
  $('.link a').each ->
    if this.hostname && this.hostname != location.hostname
      $(this).before '<img class="attachedLink" src="http://' + this.hostname + '/favicon.ico" />'
      
      # Check for favico error
      $(".attachedLink").bind "error", ->
        $(this).attr('src', '/images/icons/link-16.gif')
 
  $('.gallery .youtube').each (i, el) =>
    # Pass the url and the element it came from
    getYoutubeData($(el).find('a').attr('href'), $(el))
  
  $.subscribe 'youtube:data', ($element, thumbnail)=> 
    $element.css('background-image', 'url(' + thumbnail + ')')
    
    
    
    
    
    
  
    
# There is a point where using objects is just more obfuscation.

# If abstraction doesn't simplify, it's not worth it.
commentsPanel = $('#showEntry .commentsPanel')

$('form#new_comment').bind 'ajax:success', (event, xhr, status)->
  $('textarea', this).val('')
  
  # Update comment count
  newVal = parseInt($('.commentsHeader .counter').text()) + 1
  $('.commentsHeader .counter').text(newVal)
  
  commentsPanel.find('.target').children().last().prev().before(xhr).prev().hide().slideDown()


# TODO
#   # insert the failure message inside the "#account_settings" element
