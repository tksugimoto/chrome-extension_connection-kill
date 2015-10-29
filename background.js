
chrome.browserAction.onClicked.addListener(function (){
    updateBlockList();
});

updateBlockList();


var callback = function (details) {
    var fqdn = details.url.match("://([^/]+)")[1];
    return {
        cancel: fqdn in blockFQDNList
    };
};
var filter = {
	urls: [
		"*://*/*"
	]
};
var opt_extraInfoSpec = [
    "blocking"
];
chrome.webRequest.onBeforeRequest.addListener(callback, filter, opt_extraInfoSpec);

var blockFQDNList = {};
var REGEXP_SPACE_ONLY = /^[\s　]*$/;
function updateBlockList() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "file/block-list.txt");
    xhr.onload = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                blockFQDNList = {};
                xhr.responseText.split(/\r*\n/).forEach(function (line){
                    if (line.lastIndexOf("#", 0) === 0) return;
                    if (REGEXP_SPACE_ONLY.test(line)) return;
                    blockFQDNList[line] = true;
                });
            }
        }
    };
    xhr.send(null);
}
