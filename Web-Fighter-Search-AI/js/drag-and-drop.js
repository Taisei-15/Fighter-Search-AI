const dropzone = document.getElementById("dropzone");

const submitButton = document.getElementById("submit-button");
const preview = document.getElementById("preview");

dropzone.addEventListener("dragover", function(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy'
});

dropzone.addEventListener("drop", function(event) {
  let itemId = ''
    const droppedItems = []
    event.preventDefault()

    if (event.dataTransfer.items) {
      for (const item of event.dataTransfer.items) {
        const { kind, type } = item
        if (kind === 'file') {
          const file = item.getAsFile()
          droppedItems.push(file.name)
        } else if (kind === 'string') {
          if (type === 'text/plain') {
            itemId = event.dataTransfer.getData(type)
          }
        }
      }
    }

    if (itemId !== '') {
      droppedItems.push($(itemId).innerHTML)
    }

    if(droppedItems.length > 0){
      dropzone.innerHTML = droppedItems.join(', ')
    }
});



submitButton.addEventListener("click", function() {
  
    // Submit the image here
  alert("解析中‼");
  
});

