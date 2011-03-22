$(document).ready(function() {
  checkForLinksShowEntry();
  
  setupEvents();
  setupImagebank();
  setupUploader();
  setupSharingImages();
  setupLinkButtons();
  setup2dThumbIPadClick();
  
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

  $('.content .body, .commentsPanel').find('a').each(function(i, ele){
    var current_url = $(ele).attr('href');
    var tempAnchor = $("<a />");
    tempAnchor.attr('href', current_url)
    var hostname = tempAnchor.attr('hostname');
    if((current_url.indexOf("v=") == -1) && (hostname.indexOf("youtube.com") != -1)){
      hostname = "dreamcatcher.net";
    }
    
    if(hostname == "youtube.com" || hostname == "www.youtube.com"){
      // Create new Element & make it work
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
          var videoPath = data.feed.entry[0].media$group.media$content[0].url;
          var embedPlayer = '<object width="614" height="390"><param name="movie" value="' + videoPath + '"></param><param name="wmode" value="transparent"></param><embed src="' + videoPath + '" type="application/x-shockwave-flash" wmode="transparent" width="614" height="390"></embed></object>';
      
          var newElement = '<div class="video hidden" id="' + dataId + '"><div class="close-24 minimize"></div><div class="player">' + embedPlayer + '</div><div class="info"><div style="background: url(/) no-repeat center" class="logo"></div><span class="videoTitle">' + data.feed.entry[0].title.$t + '</span></div></div>';
          $('.content .body').after(newElement)
          
          //var newElement = '<div class="linkContainer youtube"><div class="title"><input class="linkTitleValue" style="width: 220px;" value="' + data.feed.entry[0].title.$t + '" name="entry[links_attributes][][title]" /></div><div class="url"><input value="' + newText + '" class="linkUrlValue" name="entry[links_attributes][][url]" style="width: 320px;"><div class="icon"><img src="http://www.google.com/s2/favicons?domain_url=' + newText + '" /></div></div><div class="close-24"></div><div class="thumb" style="background: url(' + data.feed.entry[0].media$group.media$thumbnail[1].url + ') no-repeat center center transparent"></div><div class="description">' + data.feed.entry[0].content.$t + '</div></div>';
          //$('#linkHolder').append(newElement);
          //$('#linkHolder').slideDown()
          //$('.linkContainer').fadeIn();
        }
      });
    }
    
  })
  // Set click event to close youtube links
  $('.content .video').find('.close-24').live("click", function(event){
    $(event.currentTarget).parent().hide()
  })
  
  // Add youtube icon after each youtube link
  $('.content .body, .commentsPanel').find('a.youtube').filter(function(){
    return this.hostname && this.hostname !== location.hostname;
  }).after('<img class="youtube" src="/images/icons/youtube-16.png" />')
  
  // Set click event for youtube links
  $('.content .body, .commentsPanel').find('a.youtube').click(function(event){
    event.preventDefault()
    // Hide others
    $('.video').hide()
    
    var embedVideo = String("#youtube-" + $(event.currentTarget).data('id'));
    $(embedVideo).show()
    
    //var newY = getOffset($(embedVideo).get(0)).top
    
    // Scroll to video
    //$('html, body').animate({scrollTop:newY}, 'slow');
  })
    
}

function getOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}


function linkify(text)
	{
		if( !text ) return text;
		
		text = text.replace(/((https?\:\/\/|ftp\:\/\/)|(www\.))(\S+)(\w{2,4})(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi,function(url){
			nice = url;
			if( url.match('^https?:\/\/') )
			{
				nice = nice.replace(/^https?:\/\//i,'')
			}
			else
				url = 'http://'+url;
			
			
			return '<a target="_blank" rel="nofollow" href="'+ url +'">'+ nice.replace(/^www./i,'') +'</a>';
		});
		
		return text;
	}

function setup2dThumbIPadClick(){
  // make iPad 1 click work on thumbs
  var ua = navigator.userAgent;
  var clickEvent;
  if (ua.match(/iPad/i)){
    clickEvent = "touchstart";
  } else {
    clickEvent = "click";
  } 
  
  $('.thumb-2d a.link').bind( clickEvent, function(event){
    event.preventDefault();
    window.location = $(event.currentTarget).attr('href');
  })
}

function setupSharingImages(){
  $('.detailsBottom .sharing span').each(function(){
    switch($(this).text()){
      case 'private':
          $(this).prev().attr('src', '/images/icons/private-16.png')
        break;
      case 'anonymous':
          $(this).prev().attr('src', '/images/icons/anon-16.png')
        break;
      case 'users':
          $(this).prev().attr('src', '/images/icons/listofUsers-16.png')
        break;
      case 'followers':
          $(this).prev().attr('src', '/images/icons/friend-none-16.png')
        break;
      case 'friends':
          $(this).prev().attr('src', '/images/icons/friend-none-16.png')
        break;
      case 'friends of friends':
          $(this).prev().attr('src', '/images/icons/friend-none-16.png')
        break;
      case 'everyone':
          $(this).prev().attr('src', '/images/icons/sharing-16.png')
        break;
    }
  })
}

var uploader = null;
var imageMetaParams = { image: {"section":"user_uploaded", "category": "new_dream"} };

function setupUploader(){      
  if(document.getElementById('imageDropArea')){
    // Setup radio button events
    
    $('.entryImageContainer input[type=radio]').live('change', function(){
      $('.entryImageContainer .radio').removeClass('selected')
      $(this).parent().addClass('selected')
    })
    
    uploader = new qq.FileUploader({
      element: document.getElementById('imageDropArea'),
      action: '/images.json',
      maxConnections: 1,
      params: imageMetaParams,
      debug: true,
      onSubmit: function(id, fileName){
     
      },
      onComplete: function(id, fileName, responseJSON){
        //setupImageButtons();
      }
    });
  }      
}


function setupImagebank(){
  $('#addFromImageBank').click(function(){
    displayImageBank();
  });
}

function displayImageBank(){
  var filePath = '/images';
  $.ajax({
    url: filePath,
    dataType: 'html',
    success: function(data) {
      //var newElement = '<div class="linkContainer"><div class="title"><input class="linkTitleValue" value="' + data.feed.entry[0].title.$t + '" /></div><div class="url"><a href="' + newText + '">' + newText + '</a></div><div class="removeicon">X</div><div class="icon"><img src="http://www.google.com/s2/favicons?domain_url=' + newText + '" /></div></div>';
      $('body').append(data);
      $('#IB_browser_frame').fadeIn();
      
      // Initialize imagebank w/ sectionFilter (Library, Bedsheets, etc...)
      initImageBank('Library');
    }
  });
}

//************************************//
//            TAG HANDLING            //
//************************************//

//*********** ADDING TAGS ***********//
        
// ADDS DATA TO TAG LIST
function addTagToListDream(tagToAdd,tagType,tagInputBoxIdd){
  var tag_selected =  tagToAdd; // set selected city to be the same as contents of the selected city
  var tag_type =  tagType; // type of tag (tag/thread/emotion/place/person/etc.)

  var randomNumber = Math.round( Math.random() * 100001) ; // Generate ID
  var tagID = 'tagID_' + randomNumber ; // Define ID for New Region
  var tagID_element = '#' + tagID ; // Create variable to handle the ID

  if (tag_selected != ''){ // if it's not empty
    //$('#empty-tag').clone().attr('id', tagID ).appendTo('#tag-list').end; // clone tempty tag box

    var newElement = $('#empty-tag').clone().attr('id', tagID );
    $('#tag-list br').before(newElement);
    $(tagID_element).removeClass('hidden') ; // and unhide the new one
    $(tagID_element).addClass('current-tags');
    $(tagID_element).find('.tagContent').html( tag_selected ); // populate with tag text

    setTimeout(function() { $(tagID_element).animate({ backgroundColor: "#333" }, 'slow'); }, 200);

    /*var elementHeight = $('#tag-list').height();
    //$('#tag-list').css('height', elementHeight + 'px');

    var combinedHeight = elementHeight;
    $('#newDream-tag').animate({height: combinedHeight}, "fast", function(){
      var elementHeight = $('#tag-list').height();
    });*/

  }


  $(tagInputBoxIdd).val(''); // Clear textbox
  $(tagInputBoxIdd).focus(); // Focus text input

  //$(tagInputBoxIdd).autocomplete( 'close' );

  activateRemoveDreamTag('.tag_box');

  // Update on server
  if(tagInputBoxIdd == "#IB_tagText"){
    //updateCurrentImageTags();
  }

  //$(tagID_element).addClass('tag_box_pop', 1000);

  return false;


 };


//*********** REMOVING TAGS ***********//

function activateRemoveDreamTag (context) {

}


// REMOVES DATA FROM TAG LIST
function removeTagFromDreamList (idd){
  /*$(idd).addClass('kill_tag');

  setTimeout(function() { $(idd).addClass('opacity-50', 0 ); }, 250);
  setTimeout(function() { $(idd).fadeOut('fast'); }, 300);
  setTimeout(function() { $(idd).remove(); }, 400);*/
  
  //updateCurrentImageTags();

};

/*** END OF TAGS ***/

var tagHeight;

function checkAttachButtons(){
  var buttonVisible = false;
  $('.entryAttach .attach').each(function(i, el){
    // Go thru each button and see if they are all hidden
    if($(this).css('display') != 'none'){
      buttonVisible = true
    }
  })
  
  if(!buttonVisible){
    $('.entryAttach').fadeOut();
  } else {
    $('.entryAttach').fadeIn()
  }
}

function setupEvents(){
  // Listen for attach toggles
  $('.entryAttach .images').unbind();
  $('.entryAttach .images').click(function(){
    $('.entryImages').slideDown();
    $(this).hide();

    checkAttachButtons();
  })
  
  // Set newly displayed header click
  $('.imagesHeader').unbind()
  $('.imagesHeader').click(function(){
    // if no images added, remove panel 
    // and show button
    if($('#currentImages').children().length == 1){
      $('.entryImages').slideUp();
      $('.entryAttach .images').show();
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
  
  $('.entryAttach .tag').unbind();
  $('.entryAttach .tag').click(function(){
    $('.entryTags').slideDown();
    //$('#newDream-tag').height(0);
    //$('#newDream-tag').css('display', 'block');
    //$('#newDream-tag').animate({height: 42}, "slow");
    
    $(this).hide();
    checkAttachButtons();
  })
  
  // Set newly displayed header click
  $('.entryTags .headers').unbind();
  $('.entryTags .headers').click(function(){
    if($('#tag-list').children().length == 2){
      // No tags added hide it all
      $('.entryTags').slideUp();
      $('.entryAttach .tag').show();
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
  $('.moodPicker input').change(function(event){
    $(this).parent().parent().find('label').removeClass('selected')
    $(this).parent().addClass('selected')
  })
  
  $('.entryAttach .mood').unbind();
  $('.entryAttach .mood').click(function(){
    $('.entryEmotions').slideDown();
    $(this).hide();
    checkAttachButtons();
  })
  
  $('.entryEmotions .headers').unbind()
  $('.entryEmotions .headers').click(function(){
    var radioSelected = false;
    $('.moodPicker input[type="radio"]:checked').each(function(i, el){
      // only mark as selected if its a value other than 1
      if($(el).val() != '1'){
        radioSelected = true
      }
    })
    
    if(radioSelected){
      if($('.moodPicker').css('display') == 'none'){
        $('.moodPicker').slideDown()
      } else {
        $('.moodPicker').slideUp()
      }
    } else {
      $('.entryEmotions').slideUp();
      $('.entryAttach .mood').show();
    }
    
    checkAttachButtons();
  })
  
  $('.entryAttach .links').unbind();
  $('.entryAttach .links').click(function(){
    $('.entryLinks').slideDown();
    $(this).hide();
    checkAttachButtons();
  })
  
  // Set newly displayed header click
  $('.entryLinks .headers').unbind();
  $('.entryLinks .headers').click(function(){
    if($('#linkHolder').children().length < 1){
      // No tags added hide it all
      $('.entryLinks').slideUp();
      $('.entryAttach .links').show();
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
  
  $('#entryOptions .date').unbind();
  $('#entryOptions .date, .dateTimeHeader').click(function(){
    if($('.entryDateTime').css('display') == 'none'){
      $('.entryDateTime').slideDown();
    } else {
      $('.entryDateTime').slideUp();
    }
  })
  
  // Listen for paste in DREAM field
  /*$("#entry_body").bind('paste', function(e) {
    // Get pasted link
    // THIS NEEDS WORK!
    setTimeout(function() {
      var text = $('textarea#entry_body').val()
      var length = text.length;
      var index = text.search(/http:(?!.*http:)/);
      var url = text.slice(index, length);
      checkForPastedLink(url)
    }, 100);
    
  });*/
  
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
    $('.entryAttach .links').hide();
    
    // Set newly displayed header click
    $('.entryLinks .headers').unbind();
    $('.entryLinks .headers').click(function(){
      if($('#linkHolder').children().length < 1){
        // No tags added hide it all
        $('.entryLinks').slideUp();
        $('.entryAttach .links').show();
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
        var newElement = '<div id="' + newID + '" class="linkContainer"><div class="title"><input value="link title" style="width: 220px;" name="entry[links_attributes][][title]" class="linkTitleValue"></div><div class="url"><input value="' + newText + '" class="linkTitleValue" name="entry[links_attributes][][url]" style="width: 320px;"><div class="icon"><img src="http://www.google.com/s2/favicons?domain_url=' + newText + '" /></div></div><div class="close-24"></div></div>';
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
      console.log(data)
      var videoPath = data.feed.entry[0].media$group.media$content[0].url;
      //var embedPlayer = '<object width="425" height="350"><param name="movie" value="' + videoPath + '"></param><param name="wmode" value="transparent"></param><embed src="' + videoPath + '" type="application/x-shockwave-flash" wmode="transparent" width="425" height="350"></embed></object>';
      
      var newElement = '<div class="linkContainer youtube"><div class="title"><input class="linkTitleValue" style="width: 220px;" value="' + data.feed.entry[0].title.$t + '" name="entry[links_attributes][][title]" /></div><div class="url"><input value="' + newText + '" class="linkUrlValue" name="entry[links_attributes][][url]" style="width: 320px;"><div class="icon"><img src="http://www.google.com/s2/favicons?domain_url=' + newText + '" /></div></div><div class="close-24"></div><div class="thumb" style="background: url(' + data.feed.entry[0].media$group.media$thumbnail[1].url + ') no-repeat center center transparent"></div><div class="description">' + data.feed.entry[0].content.$t + '</div></div>';
      $('#linkHolder').append(newElement);
      $('#linkHolder').slideDown()
      $('.linkContainer').fadeIn();
    }
  });
}

function setupImageButtons(){
  // Click to remove Image
  $('#currentImages .close-24').live('click', function(event){
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
  $('#linkHolder .close-24').live('click', function(event){
    // Remove from list of used link  
    $(event.currentTarget).parent().slideUp(250, function(){
      $(this).remove()
    })
  })
}



