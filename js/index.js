const realFileButton = document.getElementById("real-file");
const inputButton = document.getElementById("input-button");
const filename = document.getElementById("file-name");

inputButton.addEventListener("click", () => {
    realFileButton.click();
});

realFileButton.addEventListener("change", () => {
    if (realFileButton.value) {
        filename.innerHTML = realFileButton.value.match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1];
    } else {
        filename.innerHTML = "Nenhum arquivo escolhido.";
    }
});