const colors = ["red", "orange", "yellow", "green", "blue", "purple", "grey"];

function updateTag(color, text) {
  const current = document.getElementById('current');
  current.className = color || "unset";
  current.firstChild.data = text || "No Tag Set";
}

function getColorFromTarget(target) {
  for (let i = 0; i < colors.length; i++) {
    if (target.classList.contains(colors[i])) {
      return colors[i];
    }
  }
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("preset")) {
    const text = e.target.textContent;
    const color = getColorFromTarget(e.target);
    browser.runtime.sendMessage({ command: "getActiveTabInternalId"})
      .then(id => browser.storage.local.set({
          [id]: { color, text }
        }))
      .then(() => browser.runtime.sendMessage({ command: "update" }));
  } else if (e.target.id === "clear") {
    browser.storage.local.clear()
      .catch(e => {
        document.getElementById('error-content').classList.remove('hidden');
        document.getElementById('error-message').firstChild.data = 'Cannot clear storage.';
      })
      .then(() => browser.runtime.sendMessage({ command: "update" }))
  }
})

browser.runtime.onMessage.addListener(message => {
  if (message.command === "updatePopUp") {
    updateTag(message.color, message.text);
  }
})

window.onload = () => {
  browser.runtime.sendMessage({ command: "update"})
}
