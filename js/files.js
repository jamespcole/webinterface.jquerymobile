/*****************************************************************
* Playlists
*
*****************************************************************/

//this function is so that if we queue something and the playlist is empty it will start automatically
function addToPlayList(options)
{
	if(options.playlistid == undefined || options.playlistid == 0)
	{
		xbmc.getAudioPlaylist({onSuccess : function(result) {
			var startPlaylist = false;
			if(!result.items)
			{
				startPlaylist = true;
				options.onSuccess = function(result) {
					xbmc.playlistPlay({item: 0});
				};
			}
			xbmc.playlistAdd(options);
		}});				
	}
	else
	{
		xbmc.getVideoPlaylist({onSuccess : function(result) {
			var startPlaylist = false;
			if(!result.items)
			{
				startPlaylist = true;
				options.onSuccess = function(result) {
					xbmc.playlistPlay({item: 0, playlistid : options.playlistid});
				};
			}
			xbmc.playlistAdd(options);
		}});				
	}
}

//Playlist Events

//this is when a video item in the playlist is selected to be removed 
//from the list, it is called from the playlist item options dialogue
$(document).on('tap', ".video-unqueue", function(e) {	
	var xbmc_index = $(this).attr('xbmc-index');
	console.log("Removing " + xbmc_index);
	xbmc.removeVideoPlaylistItem({item : xbmc_index});
	history.back();
});

//this is when a music item in the playlist is selected to be removed 
//from the list, it is called from the playlist item options dialogue
$(document).on('tap', ".music-unqueue", function(e) {
	var xbmc_index = $(this).attr('xbmc-index');
	console.log("Removing " + xbmc_index);
	xbmc.removeAudioPlaylistItem({item : xbmc_index, onError : showError});
	history.back();
});

$(document).on('tap', ".playlist-item", function(e) {
	e.preventDefault();
	var index = $(e.target).attr('xbmc-index');
	var category = $(e.target).attr('xbmc-category');
	
	$.mobile.changePage('#playlist_options?index=' + index + '&category=' + category, {transition: 'pop', role: 'dialog'}); 
});		

$(document).on('tap', ".play-playlist-item", function(e) {		
	var category = 	$(this).attr('xbmc-category');
	var index = $(this).attr('xbmc-index');
	
	if(category == "music" || category == "audio")	
		xbmc.playlistPlay({item: index});
	else if(category == "video")	
		xbmc.playlistPlay({item: index, playlistid : 1, onError: showError})
	history.back();
});

function showPlaylist(urlObj, options)
{			
	var qs = $.parseQuerystring(urlObj.hash);
	debugLog(null, "Loading playlist for " + currentPlayType);
	if(qs['category'] == undefined)
		qs['category'] = currentPlayType;
	if(qs['category'] == "")
		qs['category'] = "audio";
	if(qs['category'] == "music" || qs['category'] == "audio")
	{
		xbmc.getAudioPlaylist({onSuccess : function(result) {
				renderPlaylist(result, urlObj, options);
			}
		});
	}
	else if(qs['category'] == "video")
	{
		xbmc.getVideoPlaylist({onSuccess : function(result) {
				renderPlaylist(result, urlObj, options);
			}
		});
	}
}

function renderPlaylist(result, urlObj, options)
{
	debugLog(result, "Playlist Data");
	pageSelector = urlObj.hash.replace( /\?.*$/, "" );
	var qs = $.parseQuerystring(urlObj.hash);	
	if(qs['category'] == undefined)
		qs['category'] = currentPlayType;
	if(qs['category'] == "")
		qs['category'] = "music";					
	var category = qs['category'];
	

	var $page = $( pageSelector );
	$content = $page.find( ":jqmData(role=content)" );
	var markup = '';
	if(result.items)
	{
		markup = "<ul data-role='listview' data-inset='true' id='playlist_list'>";
		markup += '<li data-role="list-divider">XBMC</li>';
		for(var i = 0; i < result.items.length; i++)
		{
			markup += '<li><a href="javascript:void(0)" class="playlist-item" xbmc-category="' + category + '" xbmc-index="' + i + '" xbmc-label="' + result.items[i].label + '">' + result.items[i].label + '</a></li>';
		}
		markup += "</ul>";
	}
	else
	{
		markup = "Playlist is empty";
	}
	$content.html(markup);

	if(category == "video")
	{
		$page.find( ":jqmData(role=header) h1" ).html("Video Playlist");
		$page.find( ":jqmData(role=header) a.ui-btn-right").attr("href", "#playlist?category=music");
		$page.find( "#change_playlist_btn_text").html("Music Playlist");
	}
	else if(category == "music")
	{
		$page.find( ":jqmData(role=header) h1" ).html("Audio Playlist");
		$page.find( ":jqmData(role=header) a.ui-btn-right").attr("href", "#playlist?category=video");
		$page.find( "#change_playlist_btn_text").html("Video Playlist");
	}
	else
		$page.find( ":jqmData(role=header) h1" ).html("Playlist");			

	$page.page();
	$content.find( ":jqmData(role=listview)" ).listview();			
	options.dataUrl = urlObj.href;
	
	$.mobile.changePage( $page, options );
	$.mobile.loading("hide");
}

function showPlaylistOptions( urlObj, options )
{
	pageSelector = urlObj.hash.replace( /\?.*$/, "" );
	var qs = $.parseQuerystring(urlObj.hash);
	if(qs['category'] == undefined)
		qs['category'] = currentPlayType;
	if(qs['category'] == "" || qs['category'] == "audio")
		qs['category'] = "music";
	var category = qs['category'];
	
	var index = getFile(qs['index']);			
	
	var $page = $( pageSelector );
	$content = $page.find( ":jqmData(role=content)" );
	markup = '<a data-role="button" class="play-playlist-item" xbmc-category="' + category + '" xbmc-index="' + index + '" href="javascript:void(0)">Play</a>';
	markup += '<a data-role="button" class="' + category + '-unqueue" xbmc-index="' + index + '" href="javascript:void(0)">Remove</a>';			
	markup += '<a data-rel="back" data-role="button" href="#">Cancel</a>';

	$content.html(markup);
	$page.page();
	$content.find( ":jqmData(role=button)" ).button();
	options.role = "dialog";
	options.dataUrl = urlObj.href;
	
	$.mobile.changePage( $page, options );
}

