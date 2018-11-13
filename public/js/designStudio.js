//Overright deafult control colors
fabric.Object.prototype.set({
    transparentCorners: false,
    borderColor: '#ff00ff',
    cornerColor: '#007bff'
});

//Design studio module
var DesignStudio = (function() {
    return {
        canvas: null,

        defaultHeight: 600,

        defaultWidth: 600,

        //creates the canvas with specified height and width
        createCanvas: function(canvasId) {
            if (!canvasId || !document.getElementById(canvasId))
                throw new Error('Canvas element not found');
            this.canvas = new fabric.Canvas(canvasId, {
                height: this.defaultHeight,
                width: this.defaultWidth
            });
            return this.canvas;
        },
 
        //remove backround
        removeBackground: function() {
            var objects = this.canvas.getObjects();

            //if already background is set than remove it
            var backgroundObj = objects.find(function(obj) {
                return obj.isCanvasBackground
            });
            if (backgroundObj)
                this.canvas.remove(backgroundObj);
        },

        //common function to set background image
        _setBackground: function(_image) {
            var ih = _image.naturalHeight,
                iw = _image.naturalWidth;

            var image = new fabric.Image(_image);
            image.isCanvasBackground = true;
            //background object shouldn't allowed to select or modify
            image.selectable = false;
            //scale background image to fit the canvas while maintaining aspect ration
            (ih >= iw) ? image.scaleToHeight(this.canvas.getHeight()): image.scaleToWidth(this.canvas.getWidth());
            this.canvas.centerObject(image);
            //always insert at background means on 0 index
            this.canvas.insertAt(image, 0);
            this.canvas.renderAll();
        },

        //to set background (product image)
        setBackground: function(image) {
            if (!image)
                throw new Error('image is undefined');

            var objects = this.canvas.getObjects();

            this.removeBackground();
            this._setBackground(image);
        },

        //to set background (product image as url)
        setBackgroundFromURL: function(url) {
            if (!url)
                throw new Error('url is undefined');

            var self = this;
            var objects = this.canvas.getObjects();

            this.removeBackground();
             
            //load image
            var image = new Image();
            //image successfully loaded
            image.onload = function() {
                self._setBackground(image);
            };
            //unable to load image due to invalid url or network issue
            image.onerror = function() {
                throw new Error('Unable to load image');
            };
            image.crossOrigin = "Anonymous";
            image.src = url;
        },

        //add text 
        addText: function(text) {
            if (!Boolean(text) || !text.trim().length)
                throw new Error('text is undefined');
            var text = new fabric.Text(text, {
                fill: 'black'
            });
            this.canvas.centerObject(text);
            this.canvas.add(text);
            this.canvas.renderAll();
        },

        //add image
        addImage: function(_image) {
            if (!_image)
                throw new Error('image is undefined');
            var image = new fabric.Image(_image);
            this.canvas.centerObject(image);
            this.canvas.add(image);
            this.canvas.renderAll();
        },

        //delete the active/selected object
        deleteActiveObject: function() {
            if (!this.canvas)
                throw new Error('No canvas found');
            var activeObj = this.canvas.getActiveObject();
            if (activeObj && !activeObj.isCanvasBackground)
                this.canvas.remove(activeObj);
        },

        //clear all the designs from canvas
        clearDesigns: function() {
            if (!this.canvas)
                throw new Error('No canvas found');
            var objects = this.canvas.getObjects();
            objects.forEach(function(obj) {
                //don't remove background image
                !obj.isCanvasBackground && this.canvas.remove(obj);
            }.bind(this))
        },

        //export canvas design as base64 image
        exportDesign: function() {
            if (!this.canvas)
                throw new Error('No canvas found');
            return this.canvas.toDataURL();
        }
    }
})();