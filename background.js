function getInternalIDFromURL(url) {
  // Get only the main part of the URL, not the scheme nor fragment
  const parsedURL = new URL(url);
  return `${parsedURL.host}/${parsedURL.pathname}${parsedURL.search}`;
}

function getActiveTab() {
  // Get the current active tab
  return browser.tabs.query({ active: true, currentWindow: true })
    .then(tabs => ({
      internalId: getInternalIDFromURL(tabs[0].url),
      data: tabs[0],
    }))
}

function getTagForTab(id) {
  return browser.storage.local.get(id)
    .then(tag => {
      const values = Object.values(tag);
      return values.length === 1 ? values[0] : {};
    })
}

function getTagForActiveTab() {
  let activeTab;
  return getActiveTab()
    .then(tab => {
      activeTab = tab;
      return getTagForTab(tab.internalId)
    })
    .then(tag => ({ tag, tab: activeTab }));
}

function updatePopUp(color, text) {
  return browser.runtime.sendMessage({
    command: "updatePopUp",
    color,
    text,
  });
}

function updateIcon(tabId, color = "default") {
  browser.browserAction.setIcon({
    tabId,
    path: {
      16: `icons/${color}_16.png`,
      32: `icons/${color}_32.png`,
      48: `icons/${color}_48.png`,
      96: `icons/${color}_96.png`,
    },
  })
}

function update() {
  getTagForActiveTab()
    .then(({ tag, tab }) => {
      return Promise.all([
        updatePopUp(tag.color, tag.text),
        updateIcon(tab.id, tag.color),
      ])
    })
}

browser.tabs.onActivated.addListener(update);
browser.tabs.onUpdated.addListener(update);

browser.runtime.onMessage.addListener(message => {
  if (message.command === "update") {
    update();
  } else if (message.command === "getActiveTabInternalId") {
    return getActiveTab().then(tab => tab.internalId);
  }
})
