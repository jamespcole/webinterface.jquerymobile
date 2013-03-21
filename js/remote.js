/*****************************************************************
* Remote
*
*****************************************************************/

	$(document).on('click', ".play-toggle", function() {
		xbmc.control({'type' : 'play', onSuccess : togglePlayPauseButton})
	});

	$(document).on('click', ".prev-button", function() {
		if(currentPlayType == "audio")
			xbmc.playerGoTo({to : 'previous'});
		else
			xbmc.seek({"value" : "smallbackward"});
	});
	$(document).on('click', ".next-button", function() {
		if(currentPlayType == "audio")
			xbmc.playerGoTo({to : 'next'});
		else
			xbmc.seek({"value" : "smallforward"});
	});
			
	

	function togglePlayPauseButton()
	{
		if(!xbmc.isUsingWebSocket)
		{
			$(".play-toggle").each(function(index, value) { 
			   if($(this).hasClass("play-button"))
				{
					console.log("toggling to pause button");
					$(this).removeClass("play-button");
					$(this).addClass("pause-button");
					currentStatus = "playing";
				}
				else
				{
					console.log("toggling to play button");
					$(this).removeClass("pause-button");
					$(this).addClass("play-button");
					currentStatus = "paused";
				}
			});
		}
	}