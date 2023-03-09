const $ = (id) => document.getElementById(id)
const dropzone = document.getElementById("dropzone");
const selectedFiles = []
const submitButton = document.getElementById("submit-button");
const preview = document.getElementById("preview");


window.addEventListener('load', () => {
  submitButton.addEventListener('click', (evt) => {
    evt.preventDefault()

    if (selectedFiles.length === 0) {
      console.log('No file is selected.')
      return
    }

    const fd = new FormData()
    selectedFiles.forEach((f) => fd.append('file1', f, f.name))

    const xhr = new XMLHttpRequest()

    xhr.open('POST', '/test1')

    // Basic Events
    xhr.addEventListener('load', (evt) => {
      console.log('** xhr: load')
      const response = JSON.parse(xhr.responseText)
      console.log(response)
    })

    xhr.addEventListener('progress', (evt) => {
      console.log('** xhr: progress')
    })

    xhr.addEventListener('error', (evt) => {
      console.log('** xhr: error')
    })

    // Upload Events
    xhr.upload.addEventListener('loadstart', (evt) => {
      console.log('++ xhr.upload: loadstart')
      setProgressBar(0)
    })

    xhr.upload.addEventListener('progress', (evt) => {
      const percent = ((evt.loaded / evt.total) * 100).toFixed(1)
      console.log(`++ xhr.upload: progress ${percent}%`)
      setProgressBar(percent)
    })

    xhr.upload.addEventListener('abort', (evt) => {
      console.log('++ xhr.upload: abort (Upload aborted)')
    })

    xhr.upload.addEventListener('error', (evt) => {
      console.log('++ xhr.upload: error (Upload failed)')
    })

    xhr.upload.addEventListener('load', (evt) => {
      console.log('++ xhr.upload: load (Upload Completed Successfully)')
    })

    xhr.upload.addEventListener('timeout', (evt) => {
      console.log('++ xhr.upload: timeout')
    })

    xhr.upload.addEventListener('loadend', (evt) => {
      console.log('++ xhr.upload: loadend (Upload Finished)')
      setTimeout(() => clear(), 1e3)
    })

    xhr.send(fd)
  })
/*
  $('clearButton').addEventListener('click', (evt) => {
    evt.preventDefault()
    clear()
  })
*/
  dropzone.addEventListener('dragover', (event) => {
    event.preventDefault()
  })

  dropzone.addEventListener('drop', (event) => {
    let itemId = ''
    const droppedItems = []
    event.preventDefault()
    if(event.dataTransfer.items) {
      for(const item of event.dataTransfer.items){
        const { kind, type } = item
        if(kind === 'file'){
          const file = item.getAsFile()
          selectedFiles.push(file)
          droppedItems.push(file.name)
        }
      }
      //updateFileList()
    }
    if (itemId !== '') {
      droppedItems.push($(itemId).innerHTML)
    }
    if(droppedItems.length > 0){
      dropzone.innerHTML = droppedItems.join(', ')
    }
  })
})
const setProgressBar = (percent) => {
  if (percent < 0) {
    showProgressBar(false)
  } else {
    showProgressBar(true)
    $('progressBar').style.width = `${percent}%`
  }
}

const showProgressBar = (show) => {
  const c = $('progressBarContainer')
  if (show) {
    removeClass(c, 'invisible')
    addClass(c, 'visible')
  } else {
    removeClass(c, 'visible')
    addClass(c, 'invisible')
    $('progressBar').style.width = '0%'
  }
}

const removeClass = (elm, cls) => {
  if (elm.classList.contains(cls)) {
    elm.classList.remove(cls)
  }
}

const addClass = (elm, cls) => {
  if (!elm.classList.contains(cls)) {
    elm.classList.add(cls)
  }
}

const clear = () => {
  showProgressBar(false)
  selectedFiles.length = 0
  //updateFileList()
}

const updateFileList = () => {
  const fl = $('fileList')
  fl.innerHTML = '' // remove all children
  for (const f of selectedFiles) {
    const li = document.createElement('li')
    li.innerHTML = f.name
    li.className = 'list-group-item'
    fl.appendChild(li)
  }
}