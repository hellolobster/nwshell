var gui = require('nw.gui');
var win = gui.Window.get();

// a user entered this, search or append HTTP
function fix_url(url)
{
    if (url.toLowerCase().indexOf("http") == -1 && url.indexOf(".") != -1)
    {
        return "http://" + url;
    }
    else
    {
        return "https://duckduckgo.com/?q="+escape(url);
    }
}

$(function(){
    $("iframe.active")[0].src = window.ShellBrowserConfig.homepage;
    
    if (window.ShellBrowserConfig.shrinkBar)
    {
        $(".fauxheader.lower").remove();
        $("header").css('height', '55px');
        $("#main").css('top', '55px');
    }
    
    if (window.ShellBrowserConfig.hideTools) 
    {
        $("#devtools_button").hide();
        $("#refreshbrowser_button").hide();
    }
    
    $("title").text(window.ShellBrowserConfig.title);
	
	// Wire up events
	function setupFrameEvents()
	{
        $("#back_button").click(function(){
            var frame = $("iframe.active")[0];
            frame.contentWindow.history.back();
        });
        
        $("#forward_button").click(function(){
            var frame = $("iframe.active")[0];
            frame.contentWindow.history.forward();
        });
        
        $("#refresh_button").click(function(){
            var frame = $("iframe.active")[0];
            frame.contentWindow.location.reload();
        });
        
        $("#window_close").click(function(){
            win.close();
            this.close(true);
        });
        
        var maximizeToggle = false;
        $("#window_maximize").click(function(){
            if (!maximizeToggle)
            {
                maximizeToggle = true;
                win.maximize();
            }
            else
            {
                maximizeToggle = false;
                win.unmaximize();
            }
        });
        
        $("#window_minimize").click(function(){
            win.minimize();
        });
		
		$("#devtools_button").click(function(){
			win.showDevTools();
		});
	}
    
    function setFauxHeaderPosition()
    {
        var left = $("#fakes_button").position().left;
        $(".fauxheader-rest").css('left', left);
    }
    
    // Set the URL bar from the currently visible frame, if it isn't focused.
    function setUrlBar()
    {
        var frame = $("iframe.active")[0];
        var title = frame.contentWindow.document.querySelector("title");
        if (title != null) { title = title.innerText; } else { title = 'Home' }
        
        $("title").text(window.ShellBrowserConfig.title + " - " + title);
        $(".pagetitle").text(window.ShellBrowserConfig.title + " - " + title);
        
        if ($("#urlbar").is(":focus"))
            return;
        
        $("#urlbar").val((frame.contentWindow.location+""));
    }
    
    $("#urlbar").keydown(function(e){
        if (e.which == 13)
        {
            var frame = $("iframe.active")[0];
           // frame.src = $("#urlbar").val();
            var url = $("#urlbar").val();
            frame.contentWindow.location = fix_url(url);
            setUrlBar();
        }
    });
    
    var int1 = setInterval(setFauxHeaderPosition, 450);
    var int2 = setInterval(setUrlBar, 400);
    
    $(window).resize(function(){
        setFauxHeaderPosition();
    });
	
	// Initialize
	setupFrameEvents();
    setUrlBar();
});