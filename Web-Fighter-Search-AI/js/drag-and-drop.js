const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("file-input");
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

fileInput.addEventListener("change", function() {
  const files = this.files;
  handleFiles(files);
});

dropzone.addEventListener("click", function() {
  fileInput.click();
});

submitButton.addEventListener("click", function() {
  const image = preview.querySelector("img");
  if (image) {
    // Submit the image here
    alert("解析中‼");
  }
});

function handleFiles(files) {
  const file = files[0];
  const reader = new FileReader();
  reader.addEventListener("load", function() {
    const image = new Image();
    image.src = this.result;
    preview.appendChild(image);
    submitButton.removeAttribute("disabled");
  });
  reader.readAsDataURL(file);
}
