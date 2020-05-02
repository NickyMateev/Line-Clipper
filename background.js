function openPage() {
  chrome.tabs.create({
    url: "https://github.com/NickyMateev/Line-Clipper"
  });
}

chrome.browserAction.onClicked.addListener(openPage);
