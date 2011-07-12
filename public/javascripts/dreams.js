/*
checkForLinksShowEntry -> linkify (body & comments), embedYoutubeLinks



*/

$(document).ready(function() {
  checkForLinksShowEntry();
  
  setupEvents();
  setupImagebank();
  setupUploader();
  setupLinkButtons();
  //setup2dThumbIPadClick();
});

function checkForLinksShowEntry(){
  // Check entry for links and convert to hyperlinks
  var oldCode = $('.content .body').html();
  var newCode = linkify(oldCode);
  $('.content .body').html(newCode);
  
  var oldComments = $('.commentsPanel').html()
  var newComments = linkify(oldComments);
  $('.commentsPanel').html(newComments);
  
  
  embedYoutubeLinks();
}

// Turns all links in the body of an entry
// into embedded youtube links
function embedYoutubeLinks(){
  
  // THIS HAS TWO MAIN FUNCTIONS, ONE GETS EVERYTHING IN THE COMMENTS PANEL
  // ONE GETS ALL OF THE BODY LINKS. WE MAY BE ABLE TO CLEAN THIS UP TO BE ONE
  // NEED TO THINK ABOUT IT FOR A BIT
  
  
  // One for Comments
  // moved to commentLinks.js (for use in new JMVC controllers)
  
  
  
  
  
  
  // One for content body
  $('.content .body').find('a').each(function(i, ele){
    
    var current_url = $(ele).attr('href');
    var $current_element = $(ele);
    var tempAnchor = $("<a />");
    tempAnchor.attr('href', current_url)
    var hostname = tempAnchor.attr('hostname');
    
    // Check to be sure that youtube or soundcloud (or any future embeds) do not
    // appear in the hostname, so it can skip all of this
    if((current_url.indexOf("v=") == -1) && (hostname.indexOf("youtube.com") != -1)){
      hostname = "dreamcatcher.net";
    }
    if(hostname == "soundcloud.com" || hostname == "www.soundcloud.com"){
      // If soundcloud, embed element
      var dataId = String("soundcloud-" + i);
        $(ele).data('id', i);
        $(ele).addClass('soundcloud');
      
        var filePath = 'http://api.embed.ly/1/oembed?url=' + current_url + '&format=json'
        $.ajax({
          url: filePath,
          dataType: 'jsonp',
          success: function(data) {
            var newElement = '<div class="audio hidden" id="' + dataId + '"> ' + data.html + '</div>';
            $current_element.after(newElement)
            $current_element.next().find('object').attr('width', '100%')
            $current_element.next().find('object').find('embed').attr('width', '100%')
          }
        });
        
        
    } else if(hostname == "vimeo.com" || hostname == "www.vimeo.com"){
      //http://api.embed.ly/1/oembed?url=http%3A%2F%2Fvimeo.com%2F6775209&maxwidth=600&format=xml
      var dataId = String("vimeo-" + i);
      $(ele).data('id', i);
      $(ele).addClass('vimeo');
      
      var filePath = 'http://api.embed.ly/1/oembed?url=' + current_url + '&format=json'
      $.ajax({
        url: filePath,
        dataType: 'jsonp',
        success: function(data) {
          log(data)
          var embedPlayer = data.html;
          var newElement = '<div class="video hidden" id="' + dataId + '"><div class="close minimize hidden"></div><div class="player">' + embedPlayer + '</div><div class="info"><div style="background: url(/images/icons/vimeo-24.png) no-repeat center" class="logo"></div><span class="videoTitle">' + data.title + '</span></div></div>';
          $current_element.after(newElement)
          $current_element.next().find('iframe').attr('width', '546')
          $current_element.next().find('iframe').attr('height', '390')
        }
      });
         
    
    } else if(hostname == "youtube.com" || hostname == "www.youtube.com"){
      // Create new Youtube Element & make it work
      var dataId = String("youtube-" + i);
      $(ele).data('id', i);
      
      $(ele).addClass('youtube');
      
      // Get & set youtube data
      var splitTextArray = String($(ele).attr('href')).split('v=');
      var filePath = 'http://gdata.youtube.com/feeds/api/videos?q=' + splitTextArray[splitTextArray.length - 1] + '&alt=json&max-results=30&format=5';

      // Get the data from YOUTUBE
      $.ajax({
        url: filePath,
        dataType: 'jsonp',
        success: function(data) {
          if(typeof data.feed.entry != 'undefined' && data.feed.entry != null){
            var ua = navigator.userAgent
            if(ua.match(/iPad/i)){
              // IPAD Server HTML5 player
              var videoArray = data.feed.entry[0].id.$t.split('/')
              var video_id = videoArray[videoArray.length - 1]
              var embedPlayer = '<iframe class="youtube-player" type="text/html" width="546" height="390" src="http://www.youtube.com/embed/' + video_id + '" frameborder="0"></iframe>'
            } else {
              // Normal flash w/ autoplay
              var videoPath = data.feed.entry[0].media$group.media$content[0].url;
              var embedPlayer = '<object width="546" height="390"><param name="movie" value="' + videoPath + '&autoplay=1&hd=1"></param><param name="wmode" value="transparent"></param><embed src="' + videoPath + '&autoplay=1&hd=1" type="application/x-shockwave-flash" wmode="transparent" width="546" height="390"></embed></object>';
            }
    
            var newElement = '<div class="video hidden" id="' + dataId + '"><div class="close minimize hidden"></div><div class="player">' + embedPlayer + '</div><div class="info"><div style="background: url(/images/icons/youtube-24.png) no-repeat center" class="logo"></div><span class="videoTitle">' + data.feed.entry[0].title.$t + '</span></div></div>';
            $current_element.after(newElement)
          } else {
            // Non embedable video
            // Make link work
            $current_element.click(function(){
              window.open(current_url)
            })
          }
        }
      });
    }
    
  })



  
  // Add youtube icon after each youtube, soundcloud & vimeo link
  $('.content .body, .commentsPanel').find('a.youtube, a.soundcloud, a.vimeo').filter(function(){
    return this.hostname && this.hostname !== location.hostname;
  }).prepend('<div class="img"></div>')
  
  // WILL NEED TO FIGURE OUT A WAY TO COMBINE ALL OF THESE
  // AND MAKE THEM WORK EASILY W ALL NEW EMBED TYPES!
  
  // Set click event for youtube links
  $('.content .body, .commentsPanel').find('a.youtube').click(function(event){
    event.preventDefault()
    var embedVideo = String("#youtube-" + $(event.currentTarget).data('id'));
    $(embedVideo).show()
  })

  // Set click event for soundcloud links
  $('.content .body, .commentsPanel').find('a.soundcloud').click(function(event){
    event.preventDefault()
    var embedVideo = String("#soundcloud-" + $(event.currentTarget).data('id'));
    $(embedVideo).show()
  })
  
  // Set click event for vimeo links
  $('.content .body, .commentsPanel').find('a.vimeo').click(function(event){
    event.preventDefault()
    var embedVideo = String("#vimeo-" + $(event.currentTarget).data('id'));
    $(embedVideo).show()
  })
    
}



function linkify(text) {
  if( !text ) return text;
  
  text = text.replace(/(https?\:\/\/|ftp\:\/\/|www\.)[\w\.\-_]+(:[0-9]+)?\/?([\w#!:.?+=&(&amp;)%@!\-\/])*/gi, function(url){
    nice = url;
    if( url.match('^https?:\/\/') )
    {
      nice = nice.replace(/^https?:\/\//i,'')
    }
    else
      url = 'http://'+url;
    
    var urlTitle = nice.replace(/^www./i,'');
    return '<a target="_blank" rel="nofollow" href="'+ url +'">'+ url +'</a>';
  });
  
  return text;
}

// ????
function checkAttachButtons(){
  var buttonVisible = false;
  $('#entryAttach .attach').each(function(i, el){
    // Go thru each button and see if they are all hidden
    if($(this).css('display') != 'none'){
      buttonVisible = true
    }
  })
  
  if(!buttonVisible){
    $('#entryAttach').fadeOut();
  } else {
    $('#entryAttach').fadeIn()
  }
}

function setupEvents(){

  // Set newly displayed header click
  $('.imagesHeader').unbind()
  $('.imagesHeader').click(function(){
    // if no images added, remove panel 
    // and show button
    if($('#currentImages').children().length == 1){
      $('.entryImages').slideUp();
      $('#attach-images').show();
    } else {
      // if content added, minimize panel
      if($('#currentImages').css('display') != 'none'){
        $('#currentImages').slideUp();
      } else {
        $('#currentImages').slideDown();
      }
    }
    checkAttachButtons();
  })
  
  // Set newly displayed header click
  $('.entryTags .headers').unbind();
  $('.entryTags .headers').click(function(){
    if($('#tag-list').children().length == 2){
      // No tags added hide it all
      $('.entryTags').slideUp();
      $('#attach-tags').show();
    } else {
      // tags added only minimize
      if($('#tag-list').css('display') != 'none'){
        var elementHeight = $('#tag-list').height(); 
        $('#tag-list').css('height', elementHeight + 'px');
        $('#tag-list').slideUp('fast');
        
        /*var combinedHeight = elementHeight;
        $('#newDream-tag').height(combinedHeight);
        $('#newDream-tag').animate({height: 42}, "fast");*/
      } else {
        var elementHeight = $('#tag-list').height(); 
        $('#tag-list').css('height', elementHeight + 'px');
        $('#tag-list').slideDown('fast');
        
        /*var combinedHeight = 50 + elementHeight;
        $('#newDream-tag').height(42);
        $('#newDream-tag').animate({height: combinedHeight}, "fast");*/
      }
    }
    checkAttachButtons();
  })
  
  // Setup mood picker
  $('.emotionPanel input').change(function(event){
    $(this).parent().parent().find('label').removeClass('selected')
    $(this).parent().addClass('selected')
  })
  
  
  $('.entryEmotions .headers').unbind()
  $('.entryEmotions .headers').click(function(){
    var radioSelected = false;
    $('.entryEmotions input[type="radio"]:checked').each(function(i, el){
      // only mark as selected if its a value other than 1
      if($(el).val() != '0'){
        radioSelected = true
      }
    })
    
    if(radioSelected){
      if($('.emotionPanel').css('display') == 'none'){
        $('.emotionPanel').slideDown()
      } else {
        $('.emotionPanel').slideUp()
      }
    } else {
      $('.entryEmotions').slideUp();
      $('#attach-emotions').show();
    }
    
    checkAttachButtons();
  })
  
  // Set newly displayed header click
  $('.entryLinks .headers').unbind();
  $('.entryLinks .headers').click(function(){
    if($('#linkHolder').children().length < 1){
      // No tags added hide it all
      $('.entryLinks').slideUp();
      $('#attach-links').show();
    } else {
      // tags added only minimize
      if($('#linkHolder').css('display') != 'none'){
        $('#linkHolder').slideUp();
      } else {
        $('#linkHolder').slideDown();
      }
    }
    checkAttachButtons();
  })
  
  // $('#entry-date').unbind();
  $('#entry-date, .dateTimeHeader').click(function(){
    if($('.entryDateTime').css('display') == 'none'){
      $('.entryDateTime').slideDown();
    } else {
      $('.entryDateTime').slideUp();
    }
  })
  
  // Listen for paste in LINK field
  $('.linkAdd').click(function() {
    setTimeout('checkForPastedLink($("#linkValue").val())', 400);
  });
  
  $('#linkValue').keypress(function(e) {
    if(e.keyCode == 13) {
      e.preventDefault()
      e.stopPropagation()
      setTimeout('checkForPastedLink($("#linkValue").val())', 400);
      return false;
    }
  });
  
  // Remove link listener
  $('.removeicon').live("click", function(){
    $(this).parent().fadeOut('fast', function(){
      $(this).remove();
    });
  })

  
  setupImageButtons();
}

function checkForPastedLink(newText){
  $('#linkValue').val('');
  //var regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
  var regexp = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  if(regexp.test(newText)){
    // Check for http at start (add if not there)
    var tempURL = newText.substring(0,4);
    if(tempURL != 'http'){
      newText = "http://" + newText;
    }
    
    // Post link
    addLink(newText)
  }
}

function addLink(newText){
  if($('.entryLinks').css('display') == 'none'){
    $('.entryLinks').slideDown();
    $('#attach-links').hide();
    
    // Set newly displayed header click
    $('.entryLinks .headers').unbind();
    $('.entryLinks .headers').click(function(){
      if($('#linkHolder').children().length < 1){
        // No tags added hide it all
        $('.entryLinks').slideUp();
        $('#attach-links').show();
      } else {
        // tags added only minimize
        if($('#linkHolder').css('display') != 'none'){
          $('#linkHolder').slideUp();
        } else {
          $('#linkHolder').slideDown();
        }
      }
    })
  }
  // Check what DOMAIN they are pasting
  var tempAnchor = $("<a />");
  tempAnchor.attr('href', newText)
  var hostname = tempAnchor.attr('hostname'); // http://example.com
  
  // Check if it a non video youtube link (no v=)
  if((newText.indexOf("v=") == -1) && (hostname.indexOf("youtube.com") != -1)){
    hostname = "dreamcatcher.net"
  }
  
  switch(hostname){
    case "youtube.com":
        showYoutubeData(newText);
      break;
    
    case "www.youtube.com":
        showYoutubeData(newText);
      break;
      
    default:
        var randomNumber = Math.round( Math.random() * 100001) ; // Generate ID
        var newID = 'link-' + randomNumber;
        var newEle = '#' + newID;
        var newDOM = $(newEle);
        var newElement = '<div id="' + newID + '" class="linkContainer"><div class="title"><input value="link title" style="width: 220px;" name="links[][title]" class="linkTitleValue"></div><div class="url"><input value="' + newText + '" class="linkTitleValue" name="links[][url]" style="width: 320px;"><div class="icon"><img src="http://www.google.com/s2/favicons?domain_url=' + newText + '" /></div></div><div class="close"></div></div>';
        $('#linkHolder').append(newElement);
        var dataSent = {url: newText};
        // Get the title from server
        var filePath = '/parse/title'
        $.ajax({
          url: filePath,
          context: $(newEle),
          data: dataSent,
          success: function(data) {
            $(this).find('.title .linkTitleValue').val(data.title)
            $('.linkContainer').fadeIn();
          }
        });
      break;
      
  }
}

function showYoutubeData(newText){
  // Find the Video ID number
  var splitTextArray = newText.split('v=');
  var filePath = 'http://gdata.youtube.com/feeds/api/videos?q=' + splitTextArray[splitTextArray.length - 1] + '&alt=json&max-results=30&format=5';
  
  // Get the data from YOUTUBE
  $.ajax({
    url: filePath,
    dataType: 'jsonp',
    success: function(data) {
      if(typeof data.feed.entry != 'undefined' && data.feed.entry != null){
        var ua = navigator.userAgent
        if(ua.match(/iPad/i)){
          // IPAD Server HTML5 player
          var videoArray = data.feed.entry[0].id.$t.split('/')
          var video_id = videoArray[videoArray.length - 1]
          var embedPlayer = '<iframe class="youtube-player" type="text/html" width="614" height="390" src="http://www.youtube.com/embed/' + video_id + '" frameborder="0"></iframe>'
        } else {
          // Normal flash w/ autoplay
          var videoPath = data.feed.entry[0].media$group.media$content[0].url;
          var embedPlayer = '<object width="614" height="390"><param name="movie" value="' + videoPath + '&autoplay=1&hd=1"></param><param name="wmode" value="transparent"></param><embed src="' + videoPath + '&autoplay=1&hd=1" type="application/x-shockwave-flash" wmode="transparent" width="614" height="390"></embed></object>';
        }
        //var videoPath = data.feed.entry[0].media$group.media$content[0].url;
        //var embedPlayer = '<object width="425" height="350"><param name="movie" value="' + videoPath + '"></param><param name="wmode" value="transparent"></param><embed src="' + videoPath + '" type="application/x-shockwave-flash" wmode="transparent" width="425" height="350"></embed></object>';
        var newElement = '<div class="linkContainer youtube"><div class="title"><input class="linkTitleValue" style="width: 220px;" value="' + data.feed.entry[0].title.$t + '" name="links[][title]" /></div><div class="url"><input value="' + newText + '" class="linkUrlValue" name="links[][url]" style="width: 320px;"><div class="icon"><img src="http://www.google.com/s2/favicons?domain_url=' + newText + '" /></div></div><div class="close"></div><div class="thumb" style="background: url(' + data.feed.entry[0].media$group.media$thumbnail[1].url + ') no-repeat scroll center center transparent"></div><div class="description">' + data.feed.entry[0].content.$t + '</div></div>';
        $('#linkHolder').append(newElement);
        $('#linkHolder').slideDown()
        $('.linkContainer').fadeIn();
      } else {
        var randomNumber = Math.round( Math.random() * 100001) ; // Generate ID
        var newID = 'link-' + randomNumber;
        var newEle = '#' + newID;
        var newDOM = $(newEle);
        
        var newElement = '<div id="' + newID + '" class="linkContainer"><div class="title"><input value="Youtube Video" style="width: 220px;" name="links[][title]" class="linkTitleValue"></div><div class="url"><input value="' + newText + '" class="linkTitleValue" name="links[][url]" style="width: 320px;"><div class="icon"><img src="http://www.google.com/s2/favicons?domain_url=' + newText + '" /></div></div><div class="close"></div></div>';
        $('#linkHolder').append(newElement);
        
        var dataSent = {url: newText};
        // Get the title from server
        var filePath = '/parse/title'
        $.ajax({
          url: filePath,
          context: $(newEle),
          data: dataSent,
          success: function(data) {
            $(this).find('.title .linkTitleValue').val(data.title)
            $('.linkContainer').fadeIn();
          }
        });
      }
    }
  });
}

function setupImageButtons(){
  // Click to remove Image
  $('#currentImages .close').live('click', function(event){
    // Remove from list of used images
    var currentImageId = $(this).parent().parent().data('id');
    
    $('.image_upload').each(function(i, element){
      if($(this).val() == currentImageId){
        $(this).remove()
      }
    })
    
    $(this).parent().parent().fadeOut('fast', function(){
      $(this).remove();
    });
    
  })
}

function setupLinkButtons(){
  // Click to remove link
  $('#linkHolder .close').live('click', function(event){
    // Remove from list of used link  
    $(event.currentTarget).parent().slideUp(250, function(){
      $(this).remove()
    })
  })
}



