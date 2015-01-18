document.body.onload = initialize;
function initialize() {
  var files = document.getElementById("files");
  files.onchange = function() {
    var length = this.files.length;
    var fileReaders  = [];
    for(var fileIndex = 0; fileIndex < length; fileIndex++) {
      fileReaders.push(new FileReader());
      fileReaders[fileIndex].onloadend = function() {
        var imageContainer = document.createElement("div");
        var image = document.createElement("img");
        image.src = this.result;
        imageContainer.appendChild(image);
        document.getElementById("previewImages").appendChild(imageContainer);
      }
      if(this.files[fileIndex]) {
        fileReaders[fileIndex].readAsDataURL(this.files[fileIndex]);
      }
    }
  }
  var add = document.getElementById("add");
  add.onclick = function() {
    preview = document.getElementById("previewImages");
    var children = preview.children;
    var times = children.length;
    for(var i = 0; i < times; i++) {
      document.body.appendChild(preview.removeChild(children[0]).children[0]);
    }
    files.value = "";
  }
  var newButton = document.getElementById("newButton");
  newButton.onclick = function() {
    var active = this.getAttribute("data-active") === "true";
    this.setAttribute("data-active", active ? "false" : "true");
    document.getElementById("fileDialog").style.display = active ? "none" : "block";
    this.style.backgroundColor = active ? "" : "red";
  }
}