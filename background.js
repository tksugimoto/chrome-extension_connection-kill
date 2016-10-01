
chrome.browserAction.onClicked.addListener(updateBlockList);

updateBlockList();


const callback = details => {
	const url = details.url;
	const fqdn = url.match("://([^/]+)")[1];
	return {
		cancel: fqdn in blockFQDNList || blockFullURLList.some(rule => url.startsWith(rule))
	};
};
const filter = {
	urls: [
		"*://*/*"
	]
};
const opt_extraInfoSpec = [
	"blocking"
];
chrome.webRequest.onBeforeRequest.addListener(callback, filter, opt_extraInfoSpec);

let blockFQDNList = {};
const blockFullURLList = [];
const REGEXP_FULL_URL = /^https?:[/][/]/;
const REGEXP_SPACE_ONLY = /^[\s　]*$/;
function updateBlockList() {
	fetch("file/block-list.txt").then(response => {
		return response.text();
	}).then(responseText => {
		blockFQDNList = {};
		blockFullURLList.length = 0;
		responseText.split(/\r*\n/).forEach(line => {
			if (line.lastIndexOf("#", 0) === 0) return;
			if (REGEXP_SPACE_ONLY.test(line)) return;
			if (REGEXP_FULL_URL.test(line)) {
				blockFullURLList.push(line);
			} else {
				blockFQDNList[line] = true;
			}
		});
	});
}
