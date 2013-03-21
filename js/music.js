/*****************************************************************
* Music
*
*****************************************************************/
//declare this global so we don't have to make a second call to get the album info
var albums_loaded = false;
function showAlbums(urlObj, options )
{
	pageSelector = urlObj.hash.replace( /\?.*$/, "" );
	
	var qs = $.parseQuerystring(urlObj.hash);
	var artistid = qs['artistid'];			
	var genreid = qs['genreid'];
				
	if(artistid == undefined && genreid == undefined)
	{
		if(!albums_loaded || !useCaching)	
			xbmc.getAlbums({onError : showError, onSuccess: function(result) {
					renderAlbumList(result, urlObj, options)
				}
			});
		else
		{
			$.mobile.loading( 'show' );
			debugLog(null, "loading cached version of albums");
			var $page = $( pageSelector );
			$page.page();
			$.mobile.changePage( $page, options );
		}
	}
	else if(artistid != undefined)
		xbmc.getAlbums({onError : showError, item : "artistid", itemId : artistid, onSuccess: function(result) {
				renderAlbumList(result, urlObj, options)
			}
		});
}

function renderAlbumList(result, urlObj, options)
{
	debugLog(result, "Loading Albums");
	pageSelector = urlObj.hash.replace( /\?.*$/, "" );
	var qs = $.parseQuerystring(urlObj.hash);						
	var artistid = qs['artistid'];			
	var genreid = qs['genreid'];

	if(artistid == undefined && genreid == undefined)
		albums_loaded = true;

	var $page = $( pageSelector );
	$content = $page.find( ":jqmData(role=content)" );
	
	var markup = '';			
	if(result == null || result.limits.total == 0 || result.albums.length == 0)
	{
		markup = xbmc_jqm.lang.get('no_albums', 'Text');			
	}
	else
	{	
		if(artistid != undefined)
			markup += '<div id="artist_info"><div id="artist_info_inner"></div></div>';
		markup += "<ul data-role='listview' data-inset='true'>";
		markup += '<li data-role="list-divider">' + xbmc_jqm.lang.get('albums', 'Text') + '</li>';
		for(var i = 0; i < result.albums.length; i++)
		{
			var label = result.albums[i].label;
			if(pageSelector == "#music_albums")
				label += " - " + result.albums[i].artist;
			markup += '<li><a href="#music_album?albumid=' + result.albums[i].albumid + '">' + label + '</a></li>';
		}
		markup += "</ul>";
	}
	$content.html(markup);
	$page.page();
	$content.find( ":jqmData(role=listview)" ).listview();

	options.dataUrl = urlObj.href;
	
	$.mobile.changePage( $page, options );
	if(artistid != undefined)
		loadArtistInfo(artistid, $content, $page, false);
}

function loadArtistInfo(artistid, content, page, background_only)
{			
	xbmc.getArtistDetails({onSuccess: function(result) {
		debugLog(result, "Loaded artist info");
		if(result.fanart != '')
		{
			page.css("background", "url(" + xbmc.getThumbUrl(result.fanart) + ") no-repeat center center fixed");
			page.css("background-size", "cover");	
			content.find("ul").addClass("list-with-background");
		}
		else
		{				
			page.css("background-image", "none");
			content.find("ul").removeClass("list-with-background");
		}
		if(!background_only)
		{
			var info_div = page.find('#artist_info_inner');
			var markup = '<h1 onclick="$(\'#artist_bio\').slideToggle()">' + result.label + "</h1>";
			markup += '<p id="artist_bio">' + result.description + "</p>";
			info_div.html(markup);	
		}			
	}, artistid : artistid});
}

function showAlbum(urlObj, options)
{
	pageSelector = urlObj.hash.replace( /\?.*$/, "" );
	
	var qs = $.parseQuerystring(urlObj.hash);
	var albumid = qs['albumid'];
	
	xbmc.getSongs({item : "albumid", itemId : albumid, onSuccess: function(result) {
			renderAlbum(result, urlObj, options);
		}
	});	
}

function renderAlbum(result, urlObj, options)
{
	debugLog(result, "Loading Album Songs");
	pageSelector = urlObj.hash.replace( /\?.*$/, "" );
	var qs = $.parseQuerystring(urlObj.hash);						
	var albumid = qs['albumid'];
	var album_index = qs['album_index'];

	var $page = $( pageSelector );
	$content = $page.children( ":jqmData(role=content)" );
	
	var markup = '<div id="album_info" class="album_info"></div>';			
	if(result.limits.total == 0 || result.songs.length == 0)
	{
		markup = xbmc_jqm.lang.get('no_songs', 'Text');	
	}
	else
	{
		markup += "<ul data-role='listview' data-inset='true' class='album_songs'>";
		markup += '<li data-role="list-divider">' + xbmc_jqm.lang.get('tracks', 'Text') + '</li>';
		for(var i = 0; i < result.songs.length; i++)
		{					
			markup += '<li><a href="#song_options?song_id=' + result.songs[i].songid + '">' + ((result.songs[i].track < 6000) ? result.songs[i].track + ". " : '') + result.songs[i].label + '</a></li>';
		}
		markup += "</ul>";
	}
	$content.html(markup);
	$page.page();
	$content.find( ":jqmData(role=listview)" ).listview();
	
	options.dataUrl = urlObj.href;
	
	$.mobile.changePage( $page, options );
	loadAlbumInfo(albumid, $content, $page);			
}

function loadAlbumInfo(albumid, content, page)
{
	xbmc.getAlbumDetails({onSuccess: function(result){
		debugLog(result, "Loading Album Info");
		var markup = '<div class="album_info_inner">';
		if(result.thumbnail != '')
			markup += '<img src="' + xbmc.getThumbUrl(result.thumbnail) + '" />';
		markup += '<h2>' + result.artist + '</h2>';
		markup += '<h3>' + result.label + '</h3>';
		markup += '<a href="javascript:void(0)" onclick="xbmc.playerOpen({item : \'albumid\', itemId : ' + albumid + '})" data-role="button" data-inline="true">' + xbmc_jqm.lang.get('play_album', 'Text') + '</a>';
		markup += '<a href="javascript:void(0)" onclick="addToPlayList({item : \'albumid\', itemId : ' + albumid + '})" data-role="button" data-inline="true">' + xbmc_jqm.lang.get('queue_album', 'Text') + '</a>';
		markup += '</div>'; //end album_info_inner
		$('#album_info').html(markup);
		content.find( ":jqmData(role=button)" ).button();
		page.find( ":jqmData(role=header) h1" ).html(result.label);
		if(result.artistid.length > 0)
			loadArtistInfo(result.artistid[0], content, page, true);
	}, onError: showError, albumid : albumid});
}		


//cache the artists
var artists = null;
function showArtists(urlObj, options)
{						
	pageSelector = urlObj.hash.replace( /\?.*$/, "" );			
	var qs = $.parseQuerystring(urlObj.hash);			
	var genreid = qs['genreid'];			
	
	if(genreid == undefined)
	{
		if(artists == null || useCaching == false)	
		{
			xbmc.getArtists({onSuccess: function(result) { 
					renderArtistList(result, urlObj, options);
				}
			});	
		}
		else
		{					
			$.mobile.loading( 'show' );
			debugLog(artists, "loading cached version of artists");
			var $page = $( pageSelector );
			$page.page();
			$.mobile.changePage( $page, options );
		}
	}
	else if(genreid != undefined)
	{
		xbmc.getArtists({genreid : genreid, onSuccess: function(result) { 
				renderArtistList(result, urlObj, options);
			}
		});	
	}
}

function renderArtistList(result, urlObj, options)
{
	artists = result;
	debugLog(result, "Loading Artists");
	pageSelector = urlObj.hash.replace( /\?.*$/, "" );
	var qs = $.parseQuerystring(urlObj.hash);

	var $page = $( pageSelector );
	$content = $page.find( ":jqmData(role=content)" );
	
	var markup = '';			
	if(result == null || result.limits.total == 0 || result.artists.length == 0)
	{
		markup = xbmc_jqm.lang.get('no_artists', 'Text');
	}
	else
	{
		markup = "<ul data-role='listview' data-inset='true'>";
		markup += '<li data-role="list-divider">' + xbmc_jqm.lang.get('artists', 'Text') + '</li>';
		for(var i = 0; i < result.artists.length; i++)
		{
			markup += '<li><a href="#music_artist_albums?artistid=' + result.artists[i].artistid + '&artist_index=' + i + '">' + result.artists[i].label + '</a></li>';
		}
		markup += "</ul>";
	}
	$content.html(markup);
	$page.page();
	$content.find( ":jqmData(role=listview)" ).listview();

	options.dataUrl = urlObj.href;
	
	$.mobile.changePage( $page, options );
}

function showSongOptions( urlObj, options )
{
	pageSelector = urlObj.hash.replace( /\?.*$/, "" );
	
	var qs = $.parseQuerystring(urlObj.hash);
	var songid = qs['song_id'];
	debugLog(null, "options for song " + songid);

	var $page = $( pageSelector );
	$content = $page.find( ":jqmData(role=content)" );

	var markup = '';
	markup += '<a data-role="button" href="javascript:void(0)" onclick="xbmc.playerOpen({item : \'songid\', itemId : ' + songid + ', onSuccess: function(result) {history.back()}})">' + xbmc_jqm.lang.get('play_song', 'Text') + '</a>';
	markup += '<a data-role="button" href="javascript:void(0)" onclick="addToPlayList({item : \'songid\', itemId : ' + songid + ', onSuccess: function(result) {history.back()}})">' + xbmc_jqm.lang.get('queue_song', 'Text') + '</a>';
	markup += '<a data-rel="back" data-role="button" href="#">' + xbmc_jqm.lang.get('cancel', 'Text'); + '</a>';
	
	$content.html(markup);

	$page.page();			
	$content.find( ":jqmData(role=button)" ).button();
	options.dataUrl = urlObj.href;
	
	$.mobile.changePage( $page, options );
}
