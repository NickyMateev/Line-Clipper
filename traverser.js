pageTitle = document.getElementsByTagName("title")[0]
processPageDOM()
attachElementObserver(pageTitle, processPageDOM, {childList: true}) // Use case: Ensures consistent behavior when switching between PR tabs

function processPageDOM() {
  var path = document.querySelectorAll('[name=analytics-location]')[0].getAttribute("content")
  var hasMultipleFiles = path.includes("pull_requests") || path.includes("commit")

  var traverseFileFunc = traverseSingleFilePage
  if (hasMultipleFiles) {
    traverseFileFunc = traverseMultiFilePage
  }
  traverseFileFunc()
}

function traverseSingleFilePage() {
  finalPathTag = document.getElementsByClassName("final-path")
  if (finalPathTag.length == 0) {
    return
  }

  fileName = finalPathTag[0].textContent

  var filePath = ""
  pathTokens = document.getElementsByClassName("js-path-segment")
  for (var i = 1; i < pathTokens.length; i++) {
    filePath += pathTokens[i].textContent + "/"
  }

  filePath += fileName
  processFileDOM(document, filePath)
}

function traverseMultiFilePage() {
  files = document.getElementsByClassName("file")

  for (var i = 0; i < files.length; i++) {
    filePath = files[i].getElementsByTagName("a")[0].title

    fileDOMProcessor = function(fileDOM, path) {
      return function() {
        processFileDOM(fileDOM, path)
      }
    }(files[i], filePath)

    fileDOMProcessor()
    attachElementObserver(files[i], fileDOMProcessor, {attributes: true}) // Use case: PR Conversation tab has code snippets collapsed/not loaded until opened up
  }

  filesContainer = document.getElementById("files")
  if (filesContainer != null) {
    attachElementObserver(filesContainer, traverseMultiFilePage, {childList: true, subtree: true}) // Use case: PR Files Changed tab doesn't load all files initially to the DOM
  }
}

async function processFileDOM(fileDOM, filePath) {
  lines = fileDOM.querySelectorAll('[data-line-number]')

  for (line of lines) {
    lineNumber = line.getAttribute("data-line-number")
    if (lineNumber == "...") {
      continue
    }

    path = filePath + ":" + lineNumber

    textTag = document.createElement("text")
    textTag.innerHTML = lineNumber

    colorValue = window.getComputedStyle(line).getPropertyValue("color")
    textTag.style = "color: " + colorValue

    lineClipBtn = buildClipboardBtn(textTag)
    lineClipBtn.setAttribute("value", path)

    line.appendChild(lineClipBtn)

    line.removeAttribute("data-line-number")
  }
}

function buildClipboardBtn(displayTag) {
  var clipBtn = document.createElement("clipboard-copy")
  clipBtn .classList = "js-clipboard-copy zeroclipboard-link text-gray link-hover-blue"
  clipBtn .setAttribute("aria-label", "Copy")
  clipBtn .setAttribute("data-copy-feedback", "Copied!")
  clipBtn .setAttribute("tabindex", "0")
  clipBtn .setAttribute("role", "button")
  
  var checkSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  checkSvg.classList = "octicon octicon-check js-clipboard-check-icon mx-1 d-inline-block text-green d-none"
  checkSvg.setAttributeNS("http://www.w3.org/2000/svg", "viewBox", "0 0 12 16")
  checkSvg.setAttribute("width", "12px")
  checkSvg.setAttribute("height", "16px")
  checkSvg.setAttribute("version", "1.1")
  checkSvg.setAttribute("aria-hidden", "true")

  var svgPath = document.createElementNS("http://www.w3.org/2000/svg", "path")
  svgPath.setAttribute("fill-rule", "evenodd")
  svgPath.setAttribute("d", "M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z")

  var displayPath = document.createElement("path")
  displayPath.setAttribute("fill-rule", "evenodd")
  displayPath.setAttribute("d", "M2 13h4v1H2v-1zm5-6H2v1h5V7zm2 3V8l-3 3 3 3v-2h5v-2H9zM4.5 9H2v1h2.5V9zM2 12h2.5v-1H2v1zm9 1h1v2c-.02.28-.11.52-.3.7-.19.18-.42.28-.7.3H1c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h3c0-1.11.89-2 2-2 1.11 0 2 .89 2 2h3c.55 0 1 .45 1 1v5h-1V6H1v9h10v-2zM2 5h8c0-.55-.45-1-1-1H8c-.55 0-1-.45-1-1s-.45-1-1-1-1 .45-1 1-.45 1-1 1H3c-.55 0-1 .45-1 1z")

  displayTag.classList = "d-inline-block mx-1 js-clipboard-clippy-icon"
  displayTag.appendChild(displayPath)
  checkSvg.appendChild(svgPath)

  clipBtn.appendChild(displayTag)
  clipBtn.appendChild(checkSvg)

  return clipBtn
}

function attachElementObserver(element, func, observerOptions) {
  const listenerAttachedAttribute = "listener-attached"
  listenerAttached = element.getAttribute(listenerAttachedAttribute)

  if (listenerAttached == null) {
    new MutationObserver(func).observe(element, observerOptions)
    element.setAttribute(listenerAttachedAttribute , "true")
  }
}
