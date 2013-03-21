	//PVR

	function showChannelGroups( urlObj, options )
	{
		pageSelector = urlObj.hash.replace( /\?.*$/, "" );
		var qs = $.parseQuerystring(urlObj.hash);			
		
		xbmc.pvrGetChannelGroups({onError : showError, onSuccess: function(result) {
				renderChannelGroups(result, urlObj, options);
			}
		});
	}

	function renderChannelGroups(result, urlObj, options)
	{
		debugLog(result, "Channel Groups");
		pageSelector = urlObj.hash.replace( /\?.*$/, "" );
		var qs = $.parseQuerystring(urlObj.hash);

		var $page = $( pageSelector );
		$content = $page.find( ":jqmData(role=content)" );
		
		var markup = '';			
		if(result == null || result.limits.total == 0 || result.channelgroups.length == 0)
		{
			markup = xbmc_jqm.lang.get('no_channels', 'Text');
		}
		else
		{
			markup = "<ul data-role='listview' data-inset='true'>";
			markup += '<li data-role="list-divider">Stations</li>';
			for(var i = 0; i < result.channelgroups.length; i++)
			{
				markup += '<li><a href="#channels?channelgroupid=' + result.channelgroups[i].channelgroupid + '">' + result.channelgroups[i].label + '</a></li>';
			}
			markup += "</ul>";
		}
		$content.html(markup);
		$page.page();
		$content.find( ":jqmData(role=listview)" ).listview();
	
		options.dataUrl = urlObj.href;
		
		$.mobile.changePage( $page, options );
	}		

	function showChannels( urlObj, options )
	{
		pageSelector = urlObj.hash.replace( /\?.*$/, "" );
		
		var qs = $.parseQuerystring(urlObj.hash);			
		var channelgroupid = qs['channelgroupid'];
		
		xbmc.pvrGetChannels({channelgroupid : channelgroupid, onSuccess: function(result) {
				renderChannels(result, urlObj, options);
			}
		});
	}


	function renderChannels(result, urlObj, options)
	{
		debugLog(result, "Loading Channels");
		pageSelector = urlObj.hash.replace( /\?.*$/, "" );
		var qs = $.parseQuerystring(urlObj.hash);

		var $page = $( pageSelector );
		$content = $page.find( ":jqmData(role=content)" );
		
		var markup = '';			
		if(result == null || result.limits.total == 0 || result.channels.length == 0)
		{
			markup = xbmc_jqm.lang.get('no_channels', 'Text');
		}
		else
		{
			markup = "<ul data-role='listview' data-inset='true'>";
			markup += '<li data-role="list-divider">Stations</li>';
			for(var i = 0; i < result.channels.length; i++)
			{
				markup += '<li><a href="javascript:void()" onclick="xbmc.playerOpen({item : \'channelid\', itemId : ' + result.channels[i].channelid + '})">' + result.channels[i].label + '</a></li>';					
			}
			markup += "</ul>";
		}
		$content.html(markup);
		$page.page();
		$content.find( ":jqmData(role=listview)" ).listview();
	
		options.dataUrl = urlObj.href;
		
		$.mobile.changePage( $page, options );			

	}