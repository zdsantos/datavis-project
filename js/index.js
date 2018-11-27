const realFileButton = document.getElementById("real-file");
const inputButton = document.getElementById("input-button");
const filename = document.getElementById("file-name");
const submitButton = document.getElementById("submit-button");

inputButton.addEventListener("click", () => {
    realFileButton.click();
});

realFileButton.addEventListener("change", (event) => {
    if (realFileButton.value) {
        filename.innerHTML = realFileButton.value.match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1];

        // sendFiles(event.target.files);
    } else {
        filename.innerHTML = "Nenhum arquivo escolhido.";
    }
});

// submitButton.addEventListener("click", (event) => {
//     // var fileInput = $('#real-file');
//     // console.log(fileInput.get(0).files);
//     $.ajax({
//         url: "http://192.168.25.4:8000/cgi-bin/python.py",
//         type: "post",
//         datatype: "html",
//         data: { var1: "foo", var2: "foo" },
//         success: function(response){
//                 $("#div").html(response);
//                 console.log("OK"); 
//         }
//     })
// })

// function sendFiles(filesList) {
//     let content = ''
    
//     Array.from(filesList).forEach(file => {
//         console.log(file)
//         if (file.type.match(/^image\//)) {
//             content += `<img src='${URL.createObjectURL(file)}'>`
//         } else {
//             // você pode tratar outros tipos de arquivos, como vídeos ou áudios
//             // para este exemplo, vamos  jogar o arquivo em um iframe
//             content += `<iframe src='${URL.createObjectURL(file)}'></iframe>`
//         }
//     });

//     console.log(content);
    
//     let div = document.createElement('div')
//     div.innerHTML = content
//     document.body.appendChild(div)
// }