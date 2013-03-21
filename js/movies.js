	/*****************************************************************
	* Movies
	*
	*****************************************************************/

	function showMovies(urlObj, options)
	{
		pageSelector = urlObj.hash.replace( /\?.*$/, "" );
		
		var qs = $.parseQuerystring(urlObj.hash);			
		
		xbmc.getMovies({onError : showError, onSuccess: function(result) {
				renderMovies(result, urlObj, options);
			}
		});
	}

	function renderMovies(result, urlObj, options)
	{
		debugLog(result, "Loading Movies");
		pageSelector = urlObj.hash.replace( /\?.*$/, "" );
		var qs = $.parseQuerystring(urlObj.hash);			

		var $page = $( pageSelector );
		$content = $page.children( ":jqmData(role=content)" );
		
		var markup = '';			
		if(result.limits.total == 0 || result.movies.length == 0)
		{
			markup = xbmc_jqm.lang.get('no_movies', 'Text');
		}
		else
		{
			markup = "<ul data-role='listview' data-inset='true'>";
			markup += '<li data-role="list-divider">Movies</li>';
			for(var i = 0; i < result.movies.length; i++)
			{			
				markup += '<li><a href="/#movie?movieid=' + result.movies[i].movieid + '">' + result.movies[i].label + '</a></li>';
			}
			markup += "</ul>";
		}
		$content.html(markup);
		$page.page();
		$content.find( ":jqmData(role=listview)" ).listview();
		options.dataUrl = urlObj.href;

		
		$.mobile.changePage( $page, options );
	}

	function showMovie(urlObj, options)
	{
		var qs = $.parseQuerystring(urlObj.hash);			
		
		xbmc.getMovieInfo({onError : showError, movieid : qs['movieid'], onSuccess: function(result) {
				renderMovie(result, urlObj, options);
			}
		});
	}

	function renderMovie(result, urlObj, options)
	{			
		pageSelector = urlObj.hash.replace( /\?.*$/, "" );
		var qs = $.parseQuerystring(urlObj.hash);
		debugLog(result, "Loading Movie " + qs['movieid']);	
		movieid = qs["movieid"];

		var $page = $( pageSelector );
		$content = $page.children( ":jqmData(role=content)" );
		
		var markup = '<div class="movie-info-div">';
		markup += '<div class="movie-info-div-inner">';
		if(result.thumbnail != '')
			markup += '<div class="movie-thumb-holder"><img class="movie_thumb" src="' + xbmc.getThumbUrl(result.thumbnail) + '" /></div>';
		markup += '<div class="movie-info">';
		markup += "<h1>" + result.label + "</h1>";
		markup += "<h2> Year: " + result.year + ", Director: " + result.director + "</h2>";
		markup += "<p>" + result.plot + "</p>";

		markup += '<a href="javascript:void(0)" onclick="xbmc.playerOpen({item : \'movieid\', itemId : ' + movieid + ', onError : showError})" data-role="button" data-inline="true">Play Movie</a>';
		markup += '<a href="javascript:void(0)" onclick="addToPlayList({item : \'movieid\', itemId : ' + movieid + ', playlistid: 1})" data-role="button" data-inline="true">Queue Movie</a>';
		markup += "</div>";
		markup += "</div>";
		markup += "</div>";

		$content.html(markup);
		$page.page();
		$content.find( ":jqmData(role=listview)" ).listview();
		$content.find( ":jqmData(role=button)" ).button();
		options.dataUrl = urlObj.href;
		if(result.fanart != '')
		{
			$page.css("background", "url(" + xbmc.getThumbUrl(result.fanart) + ") no-repeat center center fixed");
			$page.css("background-size", "cover");				
		}
		else
		{				
			$page.css("background-image", "none");
		}
		
		$.mobile.changePage( $page, options );
	}