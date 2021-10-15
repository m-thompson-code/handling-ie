/**
 * no-es6.js
 */

// // Used to detect if current browser doesn't support es6
// // To allow for types, please look at `src/window.d.ts`
// window.nomodule = true;

// Check for IE
if (/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
    // Redirect IE 11 to microsoft support page and opens Edge to go to application 
    // https://support.microsoft.com/en-us/topic/we-recommend-viewing-this-website-in-microsoft-edge-160fa918-d581-4932-9e4e-1075c4713595?ui=en-us&rs=en-us&ad=us
    window.location = 'microsoft-edge:' + window.location;

    // To support using microsoft-edge handler, we need to allow the browser to attempt to navigate first.
    // Then after browser has successfully launched 'microsoft-edge:<location>', 
    // let's navigate the current browser (IE 11) to a microsoft support page
    setTimeout(function() {
        window.location = "https://support.microsoft.com/en-us/topic/we-recommend-viewing-this-website-in-microsoft-edge-160fa918-d581-4932-9e4e-1075c4713595?ui=en-us&rs=en-us&ad=us";
    }, 0);
} else {
    // source: https://developer.mozilla.org/en-US/docs/Web/API/Location/replace
    // The current page will not be saved in session History, meaning the user won't be able to use the back button to navigate to it.
    window.location.replace('./browser-lacks-support');
}
