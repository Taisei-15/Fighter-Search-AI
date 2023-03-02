const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("file-input");
const submitButton = document.getElementById("submit-button");
const preview = document.getElementById("preview");

dropzone.addEventListener("dragover", function(event) {
  event.preventDefault();
});

dropzone.addEventListener("drop", function(event) {
  event.preventDefault();
  const files = event.dataTransfer.files;
  handleFiles(files);
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
