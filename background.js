
chrome.browserAction.onClicked.addListener(updateBlockList);

updateBlockList();


const callback = details => {
	const fqdn = details.url.match("://([^/]+)")[1];
	return {
		cancel: fqdn in blockFQDNList
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
const REGEXP_SPACE_ONLY = /^[\s　]*$/;
function updateBlockList() {
	fetch("file/block-list.txt").then(response => {
		return response.text();
	}).then(responseText => {
		blockFQDNList = {};
		responseText.split(/\r*\n/).forEach(line => {
			if (line.lastIndexOf("#", 0) === 0) return;
			if (REGEXP_SPACE_ONLY.test(line)) return;
			blockFQDNList[line] = true;
		});
	});
}
