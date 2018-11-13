var readUploadedFile = function(file, callback) {
    var reader = new FileReader();
    reader.onload = function(event) {
        var imgObj = new Image();
        imgObj.src = event.target.result;
        imgObj.onload = function() {
            callback(imgObj)
        }
    }
    reader.readAsDataURL(file);
}

const cloudName = 'dsoxr0nis';
const unsignedUploadPreset = 'hxay11ox';

// *********** Upload file to Cloudinary ******************** //
function uploadFile(file) {
    var url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    // Reset the upload progress bar
    document.getElementById('progress').style.width = 0;

    // Update progress (can be used to show progress indicator)
    xhr.upload.addEventListener("progress", function(e) {
        var progress = Math.round((e.loaded * 100.0) / e.total);
        document.getElementById('progress').style.width = progress + "%";
    });

    xhr.onreadystatechange = function(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // File uploaded successfully
            var response = JSON.parse(xhr.responseText);
            // https://res.cloudinary.com/cloudName/image/upload/v1483481128/public_id.jpg
            console.log('Uploaded image url : ', response.secure_url);
            var url = response.secure_url;
            // Create a thumbnail of the uploaded image, with 150px width
            var tokens = url.split('/');
            tokens.splice(-2, 0, 'w_150,c_scale');
            var img = new Image(); // HTML5 Constructor
            img.src = tokens.join('/');
            img.alt = response.public_id;
            document.getElementById('gallery').appendChild(img);
        }
    };

    fd.append('upload_preset', unsignedUploadPreset);
    fd.append('tags', 'browser_upload'); // Optional - add tag for image admin in Cloudinary
    fd.append('file', file);
    xhr.send(fd);
}

function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

//Usage example:
var file = dataURLtoFile('data:text/plain;base64,aGVsbG8gd29ybGQ=', 'hello.txt');


$(document).ready(function() {
    //your product url
    var url = "https://cdn.shopify.com/s/files/1/0140/5992/9658/products/cup_1_300x300.jpg";

    //intialize design studio by creating canvas
    DesignStudio.createCanvas('canvas');
    //set backgound
    DesignStudio.setBackgroundFromURL(url);

    //add text handler
    $('#addText').on('click', function() {
        DesignStudio.addText($('#textInput').val());
    });

    //add image handler
    $('#addImage').on('change', function(e) {
        readUploadedFile(e.target.files[0], function(img) {
            DesignStudio.addImage(img);
        });
    })

    //set canvas background (product image)
    $('#addBackground').on('change', function(e) {
        readUploadedFile(e.target.files[0], function(img) {
            DesignStudio.setBackground(img);
        });
    });

    //delete the active/selected object
    $('#deleteObj').on('click', function(e) {
        DesignStudio.deleteActiveObject();
    });

    //clear designs handler
    $('#clearDesigns').on('click', function(e) {
        DesignStudio.clearDesigns();
    });

    //export final design
    $('#export').on('click', function(e) {
    	var file = dataURLtoFile(DesignStudio.exportDesign(), 'temp.png');
        uploadFile(file)
    })

})