


(function (){
    const contentScriptLinks = ['./node_modules/jquery/dist/jquery.min.js'];

    contentScriptLinks.forEach(src => {
    let el = document.createElement('script');
    el.src = chrome.runtime.getURL(src);
    document.body.appendChild(el);
    });

    
})();