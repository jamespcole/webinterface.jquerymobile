	var debug = true;

	function debugLog(obj, message)
	{
		if(debug)
		{
			if(message != '')
				console.log(message);
			if(obj != 'undefined')
				console.log(obj);
		}
	}

	String.prototype.hashCode = function(){
	    var hash = 0;
	    if (this.length == 0) return hash;
	    for (i = 0; i < this.length; i++) {
		char = this.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	    }
	    return hash;
	}

	function getTimeString(time)
	{
		var minutes = Math.floor(time / 60);		

		var seconds = time - minutes * 60;		

		var hours = Math.floor(time / 3600);

		return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2);
	}

	function pad (str, max) {
	  return (str+"").length < max ? pad("0" + str, max) : str;
	}

	//this is for parsing query strings out of the url because JQM doesn't do it automatically
	jQuery.extend({
		parseQuerystring: function(qs){
		var nvpair = {};
		
		if(qs.indexOf('?') > -1)
		{
			var bits = qs.split("?");
			if(bits.length > 1)
				qs = bits[1];
			else
				qs = bits[0];
			
		}
		var pairs = qs.split('&');
		if(qs.indexOf('&') > -1)
		{
			$.each(pairs, function(i, v){
				var pair = v.split('=');
				nvpair[pair[0]] = pair[1];
			});
		}
		else
		{
			var pair = qs.split('=');
			if(pair.length > 1)
				nvpair[pair[0]] = pair[1];
		}
		return nvpair;
		}
	});