var readUploadedFile = function (file, callback) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var imgObj = new Image();
        imgObj.src = event.target.result;
        imgObj.onload = function () {
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
    $('#progress').css({
        width: 0
    });

    // Update progress (can be used to show progress indicator)
    xhr.upload.addEventListener("progress", function (e) {
        // var progress = Math.round((e.loaded * 100.0) / e.total);
        // $('#progress').css({
        //     width: progress + "%"
        // })
    });

    xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4) {
            if (xhr.status = 200) {
                // File uploaded successfully
                var response = JSON.parse(xhr.responseText);
                console.log('Uploaded image url : ', response.secure_url);
                var url = response.secure_url;
                // Create a thumbnail of the uploaded image, with 150px width
                var tokens = url.split('/');
                tokens.splice(-2, 0, 'w_150,c_scale');
                var img = new Image();
                img.src = tokens.join('/');
                img.alt = response.public_id;
                //Append thumbnail to gallery
                $('#gallery').append(img);
                showExportSuccessMsg();
                $('#preview-modal').modal('hide');

            } else {
                showExportFailureMsg();
                disablePreviewButtons(false);
            }
        }
    };

    fd.append('upload_preset', unsignedUploadPreset);
    fd.append('tags', 'browser_upload'); // Optional - add tag for image admin in Cloudinary
    fd.append('file', file);
    xhr.send(fd);
}

function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {
        type: mime
    });
}

//Usage example:
var file = dataURLtoFile('data:text/plain;base64,aGVsbG8gd29ybGQ=', 'hello.txt');

//change preview modal content on preview 
function showPreviewDetail(src) {
    $('#preview-img').attr("src", src).show();
    $('#preview-modal .modal-title').html('Design Preview');
    //$('#progress-bar').hide();
    $('#loader').hide();
    disablePreviewButtons(false);
    $('#preview-modal').modal({
        show: true,
        backdrop: 'static',
        keyboard: false
    });
}

//change preview modal content on export click
function showExportDetail() {
    $('#preview-modal .modal-title').html('Exporting Design');
    disablePreviewButtons(true);
    //$('#progress-bar').show();
    $('#loader').show();
}

//disable/enable buttons while preview/export 
function disablePreviewButtons(enabled) {
    $('#export').prop("disabled", enabled);
    $('#icon-close').prop("disabled", enabled);
    $('#btn-close').prop("disabled", enabled);
}

//show success message when exported design is saved on cloud
function showExportSuccessMsg() {
    $('#export-success').show();
    //auto hide success message after 5 sec
    setTimeout(function () {
        $('#export-success').hide()
    }, 5000);
}

//show error message when exported design is saved on cloud
function showExportFailureMsg() {
    $('#export-error').show();
    //auto hide error message after 5 sec
    setTimeout(function () {
        $('#export-error').hide()
    }, 5000);
}

//Load fonts before adding to canvas
/* We needs to load fonts before adding to canvas
   otherwise fonts will not load(visible) on canvas until text is added
   on canvas and we dont resize it */
function loadFonts(fontFamily, successCallback, errorCallback, count) {
    count = Number(count ? count : 0);

    if (count++ > 5)
        return errorCallback && errorCallback();

    WebFont.load({
        custom: {
            families: [fontFamily + ":n4,i4,n7,i7"]
        },
        active: function () {
            successCallback && successCallback();
        },
        inactive: loadFonts.bind(null, fontFamily, successCallback, errorCallback, count)
    });
}


$(document).ready(function () {
    //your product url
    var url = "https://cdn.shopify.com/s/files/1/0140/5992/9658/products/cup_1_300x300.jpg";

    //intialize design studio by creating canvas
    DesignStudio.createCanvas('canvas');
    //set backgound
    DesignStudio.setBackgroundFromURL(url);

    //add text handler
    $('#addText').on('click', function () {
        var options = {
            fill: $('#font-color').val(),
            fontSize: $('#font-size').val(),
            fontFamily: $('#font-family').val(),
        }
        loadFonts(options.fontFamily, function () {
            DesignStudio.addText($('#textInput').val(), options);
            $('#textInput').val('');
        }, function () {
            alert('Unable to load font - ' + options.fontFamily);
        });
    });

    //add image handler
    $('#addImage').on('change', function (e) {
        readUploadedFile(e.target.files[0], function (img) {
            DesignStudio.addImage(img);
        });
    })

    //set canvas background (product image)
    $('#addBackground').on('change', function (e) {
        readUploadedFile(e.target.files[0], function (img) {
            DesignStudio.setBackground(img);
        });
    });

    //delete the active/selected object
    $('#deleteObj').on('click', function (e) {
        DesignStudio.deleteActiveObject();
    });

    //clear designs handler
    $('#clearDesigns').on('click', function (e) {
        DesignStudio.clearDesigns();
    });

    //export final design
    $('#export').on('click', function (e) {
        showExportDetail();
        var file = dataURLtoFile(DesignStudio.exportDesign(), 'temp.png');
        uploadFile(file);
    });

    //Preview final design
    $('#preview').on('click', function (e) {
        var src = DesignStudio.exportDesign();
        showPreviewDetail(src);
    });

    //Initialize color picker
    $('#font-color').colorpicker();

    // Example using an event, to change the color of the .selected-color background:
    $('#font-color').on('changeColor', function (event) {
        $('.selected-color').css('background-color', event.color.toString());
    });

})