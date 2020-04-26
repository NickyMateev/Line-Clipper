function constructClipBtn(displayTag) {
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

function fileTraverser(file) {
    return function() {
      traverseFile(file, retrieveFilePath(file))
    }
}

function attachDOMElementListener(element, func, observerOptions) {
  const listenerAttachedAttribute = "listener-attached"
  listenerAttached = element.getAttribute(listenerAttachedAttribute)
  if (listenerAttached == null) {
    new MutationObserver(func).observe(element, observerOptions)
    element.setAttribute(listenerAttachedAttribute , "true")
  }
}

async function traverseFile(file, filePath) {
  lines = file.querySelectorAll('[data-line-number]')

  for (line of lines) {
    lineNumber = line.getAttribute("data-line-number")
    if (lineNumber == "...") {
      continue
    }

    path = filePath + ":" + lineNumber

    textTag = document.createElement("text")
    textTag.innerHTML = lineNumber
    textTag.style = "color: rgba(27, 31, 35, 0.3)"


    lineClipBtn = constructClipBtn(textTag)
    lineClipBtn.setAttribute("value", path)

    line.appendChild(lineClipBtn)

    line.removeAttribute("data-line-number")
  }

  expandableLines = file.getElementsByClassName("js-expandable-line")
  if (expandableLines.length > 0) {
    attachDOMElementListener(expandableLines[0].parentNode, fileTraverser(file), {childList: true})
  }
}

function retrieveFilePath(file) {
  return file.getElementsByTagName("a")[0].title
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
  traverseFile(document, filePath)
}

function traverseMultiFilePage() {
  files = document.getElementsByClassName("file")

  for (var i = 0; i < files.length; i++) {
    attachDOMElementListener(files[i], fileTraverser(files[i]), {attributes: true})
    traverseFile(files[i], retrieveFilePath(files[i]))
  }

  if (files.length > 0) { // Sometimes there are files hidden behind "Load more" buttons or collapsed code snippets in the PR conversation tab - we need to listen for changes on container DOM parent too detect when new files are "revealed"
    attachDOMElementListener(files[0].parentNode.parentNode, traverseMultiFilePage, {childList: true, subtree: true})
  }
}

function processFile() {
  var path = document.querySelectorAll('[name=analytics-location]')[0].getAttribute("content")
  var hasMultipleFiles = path.includes("pull_requests") || path.includes("commit")

  var traverseFileFunc = traverseSingleFilePage
  if (hasMultipleFiles) {
    traverseFileFunc = traverseMultiFilePage
  }
  traverseFileFunc()
}


pageTitle = document.getElementsByTagName("title")[0]
attachDOMElementListener(pageTitle, processFile, {childList: true})
processFile()
