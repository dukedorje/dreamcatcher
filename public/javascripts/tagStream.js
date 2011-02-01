// Setup Vars
var autoCompleteExpanded = false;
var textTyped = false;
var locationExpanded = false;
var sharingExpanded = false;

$(document).ready(function() {
  setupTagStream();
  setupMood();
})

function setupMood(){
  $('.moodIcon').unbind();
  $('.moodIcon').click(function(){
    if($('.moodIcon-picker').css('display') == 'none'){
      $('.moodIcon-picker').fadeIn();
      
      // Create clickable div to close when not clicking on element
      var newElement = '<div id="bodyClick" style="z-index: 1100; cursor: pointer; width: 100%; height: 100%; position: fixed; top: 0; left: 0;" class=""></div>';
    
      $('body').prepend(newElement);
    
      // Scroll to top of page
      $('html, body').animate({scrollTop:0}, 'slow');
    
      $('#bodyClick').click(function(event){
        // Hide Settings
        $('.moodIcon-picker').fadeOut();
        $('#bodyClick').fadeOut().remove();
      })
      
      // Setup close button
      $('.currentIcon').unbind();
      $('.currentIcon').click(function(){
        $('.moodIcon-picker').fadeOut();
        $('#bodyClick').fadeOut().remove();
      })
    } else {
      $('.moodIcon-picker').fadeOut();
      $('#bodyClick').fadeOut().remove();
    }
  })
}

function setupTagStream(){
  // Hide nodes
  $('#autoComplete .results').hide();
  
  // expand tag entry field
  $('#entryBar .quote').click(function(){
    if($('#quoteEntry').css('display') == 'none'){
      closeEntryPanels();
      $('#quoteEntry').slideDown();
    } else {
      $('#quoteEntry').slideUp();
    }
  })
  
  // expand tag entry field
  $('#entryBar .tag').click(function(){
    if($('#tagEntry').css('display') == 'none'){
      closeEntryPanels();
      $('#tagEntry').slideDown();
    } else {
      $('#tagEntry').slideUp();
    }
  })
  
  // Setup auto-complete
  $('#tagInput').keypress(function(event){
    // Change me, just makes the results show after
    // more than 3 chars have been typed
    var numberOfChars = $('#tagInput').val().split('').length;
    if(numberOfChars > 2){
      // Hide searching
      $('#searching-temp').hide();
      
      if(!autoCompleteExpanded){
        // Expand auto-complete dropdown
        autoCompleteExpanded = true;
      
        // Setup click event on .results
        $('#autoComplete .results').click(function(){
          // add tag to display
          selectTag($(this));
        });
      
        $('#autoComplete').slideDown('fast');
      
      
      }
      
      // Display results
      $('#autoComplete .results').fadeIn('fast');
    }
  });
  
  // Tag input clear on focus
  $('#tagInput').focus(function(){
    if($(this).val() == $(this).attr('title')){
      clearMePrevious = $(this).val();
      $(this).val('');
    }
  });
  
  // Tag input put text back on blur if empty
  $('#tagInput').blur(function(){
    if($(this).val() == ""){
      $(this).val($(this).attr('title'));
    }
  });
  
  // Sharing & Location Expander
  $('#sharingExpand').toggle(function(){
    $('#share').slideDown();
  }, function(){
    $('#share').slideUp();
  })
}

function closeEntryPanels(){
  // closes all entry panels so the next can open
  // only one visible at a time
  $('.entryObj').slideUp();
}

function selectTag($this){
  // Hide autoComplete tag selector
  $('#autoComplete').fadeOut('fast');
  
  // switch to info input view
  setInputType('info');
}

function setInputType(type){
  switch(type){
    case "tag":
      // hide all data & clear
      $('.tagNode').hide();
      $('#tagInput').val('WHO / WHAT / WHERE are you dreaming?');
      $('#tagInput').css('width', '480px');
      $('#tagInput').css('margin', '4px 0 4px 35px');
      
      break;
    
    case "info":
      $('#tagInput').val('What were they doing?');
      $('#tagInput').css('width', '300px');
      $('#tagInput').css('margin', '4px 0 4px 190px');
      
      $('#tagInput').focus(function(){
        if($(this).val() == 'What were they doing?'){
          $(this).val('');
        }
      })
      
      $('.add').click(function(){
        if($('#tagInput').val() != 'What were they doing?'){
          createNewTag();
        }
      })
      
      // Show tag node
      $('.tagNode').fadeIn();
      
      //$('.entryInput .add').
      break;
  }
}

var tagsObj = [
  {"type": "tag", "value": "magic"},
  {"type": "user", "value": "Sporeganic"},
  {"type": "user", "value": "phong"},
  {"type": "tag", "value": "magic"},
  {"type": "location", "value": "Portland, OR"},
  {"type": "user", "value": "Eph"},
];

function createNewTag(){
  var newElement = {"type": "tag", "value": $('#tagInput').val()};
  
  tagsObj.pop()
  tagsObj.push(newElement);
  
  buildTags();
}

function buildTags(){
  // clear tag field
  $('#tagsLive').empty();
  
  for(var u = 0; u < tagsObj.length; u++){
    var newElement = '';
    switch(tagsObj[u].type){
      case "tag":
        newElement = '<div style="color: rgb(107, 185, 255);" class="stream_tag tagWhat"><span>' + tagsObj[u].value +'</span></div>';
        break;
      case "user":
        newElement = '<div style="color: rgb(107, 185, 255);" class="stream_tag tagWho"><div class="avatar"></div><span>' + tagsObj[u].value + '</span></div>'
        break;
      case "location":
        newElement = '<div style="color: rgb(107, 185, 255);" class="stream_tag tagWhat"><span>' + tagsObj[u].value +'</span></div>';
        break;
    }
    
    setInputType('tag');
    
    $('#tagsLive').append(newElement);
  }
}