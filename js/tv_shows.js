/*****************************************************************
* TV Shows
*
*****************************************************************/

	function showTVShows( urlObj, options )
	{			
		pageSelector = urlObj.hash.replace( /\?.*$/, "" );
		var qs = $.parseQuerystring(urlObj.hash);
		
		xbmc.getTvShows({onSuccess: function(result) {
				renderTVShowList(result, urlObj, options);
			}
		});	
	}

	function renderTVShowList(result, urlObj, options)
	{			
		debugLog(result, "Loading TV Shows");
		pageSelector = urlObj.hash.replace( /\?.*$/, "" );
		var qs = $.parseQuerystring(urlObj.hash);						
		var category = qs['category'];

		var $page = $( pageSelector );
		$content = $page.children( ":jqmData(role=content)" );
		
		var markup = '';			
		if(result.limits.total == 0 || result.tvshows.length == 0)
		{
			markup = xbmc_jqm.lang.get('no_shows', 'Text');
		}
		else
		{
			markup = "<ul data-role='listview' data-inset='true'>";
			markup += '<li data-role="list-divider">' + xbmc_jqm.lang.get('tv_shows', 'Text') + '</li>';
			for(var i = 0; i < result.tvshows.length; i++)
			{
				//forward slashes mess up the query string so replace them 
				//and change back later(even though they are valid jqmobile doesn't like them)
				//file = result.tvshows[i].file.replace(/\//g, "\\");
				markup += '<li><a href="/#tvseasons?tvshowid=' + result.tvshows[i].tvshowid + '">' + result.tvshows[i].label + '</a></li>';
			}
			markup += "</ul>";
		}
		$content.html(markup);
		$page.page();
		$content.find( ":jqmData(role=listview)" ).listview();
		options.dataUrl = urlObj.href;

		$.mobile.changePage( $page, options );			
	}

	function showTVSeasons( urlObj, options )
	{
		pageSelector = urlObj.hash.replace( /\?.*$/, "" );
		
		var qs = $.parseQuerystring(urlObj.hash);
		var tvshowid = qs['tvshowid'];
		
		xbmc.getSeasons({tvshowid : tvshowid, onError: showError, onSuccess: function(result) {
				renderTVSeasonsList(result, urlObj, options);
			}
		});	
	}

	function renderTVSeasonsList(result, urlObj, options)
	{
		debugLog(result, "Loading TV Seasons");
		pageSelector = urlObj.hash.replace( /\?.*$/, "" );
		var qs = $.parseQuerystring(urlObj.hash);						
		var tvshowid = qs['tvshowid'];

		var $page = $( pageSelector );
		$content = $page.children( ":jqmData(role=content)" );
		
		var markup = '';			
		if(result.limits.total == 0 || result.seasons.length == 0)
		{
			markup = xbmc_jqm.lang.get('no_seasons', 'Text');
		}
		else
		{
			markup += '<div id="tv_show_info"><div id="tv_show_inner"></div></div>';
			markup += "<ul data-role='listview' data-inset='true' id='show_season_list'>";
			markup += '<li data-role="list-divider">' + xbmc_jqm.lang.get('tv_seasons', 'Text') + '</li>';
			for(var i = 0; i < result.seasons.length; i++)
			{
				markup += '<li><a href="/#tvseason?season=' + result.seasons[i].season + '&tvshowid=' + tvshowid + '">' + result.seasons[i].label + '</a></li>';
			}
			markup += "</ul>";
		}
		$content.html(markup);			
		
		$page.page();
		$content.find( ":jqmData(role=listview)" ).listview();
		options.dataUrl = urlObj.href;

		$.mobile.changePage( $page, options );

		xbmc.getTvShowInfo({tvshowid : tvshowid, onError : showError, onSuccess: function(show_info) {
			debugLog(show_info, "Loaded Show Info");
			if(show_info.fanart != '')
			{
				$page.css("background", "url(" + xbmc.getThumbUrl(show_info.fanart) + ") no-repeat center center fixed");
				$page.css("background-size", "cover");				
				$content.find("ul").addClass("list-with-background");
			}
			else
			{				
				$page.css("background-image", "none");
				$content.find("ul").removeClass("list-with-background");
			}
			var markup = '';
			if(show_info.art != undefined && show_info.art.banner != undefined)
			{
				markup += '<img src="' + xbmc.getThumbUrl(show_info.art.banner) + '" />';
				$('#tv_show_info').addClass('has-artwork');
			}
			else if(show_info.thumbnail != '')
			{
				markup += '<img src="' + xbmc.getThumbUrl(show_info.thumbnail) + '" />';
				$('#tv_show_info').addClass('has-artwork');		
			}
			markup += '<h2>' + show_info.label + '</h2>';
			markup += '<p>' + show_info.plot + '</p>';
			$('#tv_show_inner').html(markup);
		}});			
	}

	function showTVSeason( urlObj, options )
	{			
		pageSelector = urlObj.hash.replace( /\?.*$/, "" );
		
		var qs = $.parseQuerystring(urlObj.hash);
		var tvshowid = qs['tvshowid'];
		var season = qs['season'];
		
		xbmc.getEpisodes({item : 'tvshowid', itemId : tvshowid, season : season, onError: showError, onSuccess: function(result) {
				renderTVSeasonList(result, urlObj, options)
			}
		});	
	}

	function renderTVSeasonList(result, urlObj, options)
	{
		debugLog(result, "Loading TV Season Episodes");
		pageSelector = urlObj.hash.replace( /\?.*$/, "" );
		var qs = $.parseQuerystring(urlObj.hash);						
		var tvshowid = qs['tvshowid'];
		var season = qs['season'];

		var $page = $( pageSelector );
		$content = $page.children( ":jqmData(role=content)" );
		
		var markup = '';			
		if(result.limits.total == 0 || result.episodes.length == 0)
		{
			markup = xbmc_jqm.lang.get('no_episodes', 'Text');
		}
		else
		{				
			markup += '<div id="season_info_holder"><h2 id="season_label"></h2><img id="season_poster" /></div>';
			markup += "<ul data-role='listview' data-inset='true'>";
			markup += '<li data-role="list-divider">' + xbmc_jqm.lang.get('tv_episodes', 'Text') + '</li>';
			for(var i = 0; i < result.episodes.length; i++)
			{						
				markup += '<li><a href="/#episode_info?episodeid=' + result.episodes[i].episodeid + '">' + result.episodes[i].label + '</a></li>';
			}
			markup += "</ul>";
		}
		$content.html(markup);
		$page.page();
		$content.find( ":jqmData(role=listview)" ).listview();
		options.dataUrl = urlObj.href;

		
		$.mobile.changePage( $page, options );
		xbmc.getSeasons({tvshowid : tvshowid, onSuccess: function(seasons) {
			debugLog(seasons, "Getting Season Poster");
			//anoying but there is no function to just get the sepcific seson info
			var s_index = -1;
			for(var i = 0; i < seasons.seasons.length; i++)
				if(seasons.seasons[i].season == season)
					s_index = i;
			if(s_index != -1 && seasons.seasons[s_index].art != undefined && seasons.seasons[s_index].art.poster != undefined)
			{
				$('#season_poster').attr("src", xbmc.getThumbUrl(seasons.seasons[s_index].art.poster));
				$('#season_info_holder').addClass("season-art");
				$content.find("ul").addClass("has-season-art");
			}
			else	
			{
				$('#season_poster').hide();
				$content.find("ul").removeClass("has-season-art");
			}

			if(s_index != -1 && seasons.seasons[s_index].art != undefined && seasons.seasons[s_index].art['tvshow.fanart'] != undefined)				
			{
				$page.css("background", "url(" + xbmc.getThumbUrl(seasons.seasons[s_index].art['tvshow.fanart']) + ") no-repeat center center fixed");
				$page.css("background-size", "cover");	
				$content.find("ul").addClass("list-with-background");
			}
			else
			{				
				$page.css("background-image", "none");
				$content.find("ul").removeClass("list-with-background");
			}
			if(seasons.seasons[s_index] != undefined)				
				$('#season_label').html(seasons.seasons[s_index].label);
		}});				
	}

	function showEpisodeInfo( urlObj, options )
	{	
		pageSelector = urlObj.hash.replace( /\?.*$/, "" );
		
		var qs = $.parseQuerystring(urlObj.hash);
		var episodeid = qs['episodeid'];			
		
		xbmc.getEpisodeDetails({episodeid : episodeid, onSuccess: function(result) {
				renderEpisodeInfo(result, urlObj, options);
			}
		});
	}

	function renderEpisodeInfo(result, urlObj, options)
	{
		debugLog(result, "Loading Episode");
		var $page = $( pageSelector );
		$content = $page.children( ":jqmData(role=content)" );
		var qs = $.parseQuerystring(urlObj.hash);
		var episodeid = qs['episodeid'];
		
		var markup = '';
		if(result.thumbnail != '')
		{
			markup += '<div class="episode_thumb"><div class="episode_thumb_inner">';
			markup += '<img src="' + xbmc.getThumbUrl(result.thumbnail) + '" />';
			markup += '</div></div>';
		}
		markup += '<div class="episode_info">';
		markup += '<div class="episode_info_inner">';
		markup += "<h1>" + result.label + "</h1>";
		markup += "<h2>" + xbmc_jqm.lang.get('tv_season', 'Text') + " " + result.season + " " + xbmc_jqm.lang.get('tv_episode', 'Text') + " " + result.episode + "</h2>";
		markup += "<p>" + result.plot + "</p>";

		markup += '<a href="javascript:void(0)" onclick="xbmc.playerOpen({item : \'episodeid\', itemId : ' + episodeid + ', onError : showError})" data-role="button" data-inline="true">' + xbmc_jqm.lang.get('play_episode', 'Text') + '</a>';
		markup += '<a href="javascript:void(0)" onclick="addToPlayList({item : \'episodeid\', itemId : ' + episodeid + ', playlistid: 1})" data-role="button" data-inline="true">' + xbmc_jqm.lang.get('queue_episode', 'Text') + '</a>';

		markup += '</div>';
		markup += '</div>';

		$content.html(markup);
		$page.page();
		$content.find( ":jqmData(role=listview)" ).listview();
		$content.find( ":jqmData(role=button)" ).button();
		options.dataUrl = urlObj.href;
		
		$.mobile.changePage( $page, options );

		if(result.fanart != '')
		{
			$page.css("background", "url(" + xbmc.getThumbUrl(result.fanart) + ") no-repeat center center fixed");
			$page.css("background-size", "cover");				
		}
		else
		{				
			$page.css("background-image", "none");
		}
	}