var gui = require('nw.gui');
var win = gui.Window.get();

const VANGUARD_CODE = "V1BNLmxvYWRBcHAoeyJuYW1lIjoidmFuZ3VhcmRhcHAiLCJjb250ZXh0IjoicGFnZSIsImpzIjpbXSwiY3NzIjpbeyJuYW1lIjoiYXBwIiwic3JjIjoiYUdWaFpHVnlJSHNnWkdsemNHeGhlVG9nYm05dVpUc2dmUTBLSTJOdmJuUmhhVzVsY2lCN0lHSnZkSFJ2YlRvZ01IQjRJV2x0Y0c5eWRHRnVkRHNnY0c5emFYUnBiMjQ2SUdGaWMyOXNkWFJsSVdsdGNHOXlkR0Z1ZERzZ2NtbG5hSFE2SURCd2VDRnBiWEJ2Y25SaGJuUTdJR3hsWm5RNklEQndlRHNnYjNabGNtWnNiM2N0ZURvZ2FHbGtaR1Z1TzMwTkNpTmpiMjUwWVdsdVpYSXVabWw0WldRdGFHVmhaR1Z5SUhzZ2JXRnlaMmx1TFhSdmNEb2dNSEI0SVdsdGNHOXlkR0Z1ZERzZ2ZRMEtMbk5wWkdWaVlYSXRabWw0WldRZ2V5QjBiM0E2SURCd2VDRnBiWEJ2Y25SaGJuUTdJSDA9In1dLCJmaWxlcyI6W10sImlubGluZUltYWdlcyI6W119KTs=";

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
    }
    
    if (window.ShellBrowserConfig.hideAppRefresh) 
    {
        $("#refreshbrowser_button").hide();
    }
    
    $("title").text(window.ShellBrowserConfig.title);
	
	// Wire up events
	function setupFrameEvents()
	{
        $("#refreshbrowser_button").click(function(){
            window.top.location.reload();
        });
        
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
			if (!window.ShellBrowserConfig.jailTools)
            {
                win.showDevTools();
            }
            else
            {
                var frame = $("iframe.active");
                win.showDevTools($(frame).attr('id'));
            }
		});
	}
    
    function setFauxHeaderPosition()
    {
        var left = $("#fakes_button").position().left;
        $(".fauxheader-rest").css('left', left);
    }
    
    // Set the URL bar from the currently visible frame, if it isn't focused.
    var lastUrl = "";
    
    // this part got kinda bad kinda quick
    function setUrlBar()
    {
        var frame = $("iframe.active")[0];
        var url = (frame.contentWindow.location+"");
        
        var title = frame.contentWindow.document.querySelector("title");
        if (title != null) { title = title.innerText; } else { title = 'Home' }
        
        if ((lastUrl != url || frame.contentWindow["WPM"] == null) && window.ShellBrowserConfig.injectWpm)
        {
          lastUrl = url;
          
          var interval = setInterval(function () {
                var frame = $("iframe.active")[0];
                var cw = frame.contentWindow;
                if (cw.document.readyState == "complete")
                {
                    clearInterval(interval);
                    
                    if (cw["WPM"] == null && cw != null)
                    {
                        console.log('injecting wpm by eval');
                        cw["WPM"] = {};
                        
                        var code = 'var el = document.createElement("script"); el.id = "wpm_bootloader"; el.src = location.protocol + "//" + "market.webpushers.com/build/boot.js";document.head.appendChild(el);';
                        
                        frame.contentWindow.eval(code);
                        
                        console.log("injected wpm to "+url);
                    }
                }
          }, 400);
            
            
        }
        
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