//this is for handling dynamically generated pages, see http://jquerymobile.com/demos/1.2.0/docs/pages/page-dynamic.html
	$(document).bind( "pagebeforechange", function( e, data ) {

		$.mobile.loading( 'show' );
		if ( typeof data.toPage === "string" ) {
			console.log(data);

			var u = $.mobile.path.parseUrl( data.toPage );
			pageSelector = u.hash.replace( /\?.*$/, "" );
			debugLog(pageSelector, '');
			
			if(pageSelector == "#sourcelist")
			{
				showSourceList( u, data.options );
				e.preventDefault();
			}
			else if(pageSelector == "#filelist")
			{						
				showFileList( u, data.options);						
				e.preventDefault();						
			}
			else if(pageSelector == "#playlist")
			{						
				showPlaylist( u, data.options);						
				e.preventDefault();						
			}
			/*else if(pageSelector == "#file_options")
			{						
				showFileOptions( u, data.options);						
				e.preventDefault();						
			}
			else if(pageSelector == "#folder_options")
			{						
				showFolderOptions( u, data.options);						
				e.preventDefault();						
			}*/
			else if(pageSelector == "#playlist_options")
			{						
				showPlaylistOptions( u, data.options);						
				e.preventDefault();						
			}
			else if(pageSelector == "#tvshows")
			{						
				showTVShows( u, data.options);						
				e.preventDefault();						
			}
			else if(pageSelector == "#tvseasons")
			{			
				showTVSeasons( u, data.options);						
				e.preventDefault();						
			}
			else if(pageSelector == "#tvseason")
			{			
				showTVSeason( u, data.options);						
				e.preventDefault();						
			}
			else if(pageSelector == "#music_albums" || pageSelector == "#music_artist_albums")
			{			
				showAlbums( u, data.options);						
				e.preventDefault();						
			}
			else if(pageSelector == "#music_album")
			{			
				showAlbum( u, data.options);						
				e.preventDefault();						
			}
			else if(pageSelector == "#music_artists")
			{			
				showArtists( u, data.options);						
				e.preventDefault();						
			}
			else if(pageSelector == "#episode_info")
			{
				showEpisodeInfo( u, data.options);						
				e.preventDefault();
			}
			else if(pageSelector == "#song_options")
			{
				showSongOptions( u, data.options);						
				e.preventDefault();
			}
			else if(pageSelector == "#global_options")
			{
				renderGlobalOptions( u, data.options);						
				e.preventDefault();
			}
			else if(pageSelector == "#channels")
			{
				showChannels( u, data.options);						
				e.preventDefault();
			}
			else if(pageSelector == "#channel_groups")
			{
				showChannelGroups( u, data.options);						
				e.preventDefault();
			}
			else if(pageSelector == "#movies")
			{
				showMovies( u, data.options);						
				e.preventDefault();
			}
			else if(pageSelector == "#movie")
			{
				showMovie( u, data.options);						
				e.preventDefault();
			}
		}
	});