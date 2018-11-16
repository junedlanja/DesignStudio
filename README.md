# DesignStudio

**External Libraries**

**Fabric.js**

We are using fabric.js to manuplate different kind of objects on canvas. Find link here : http://fabricjs.com/

**webfontloader**

To load fonts we are using webfontloader. Find link here : https://github.com/typekit/webfontloader

# How to run project

1. clone or download the source code from github
2. go to DesignStudio folder
3. install node module
   `npm install`
4. run the project
   `npm start`
5. open the http://localhost:3000/

# Design studio methods

**createCanvas(canvasId)** : Initialize canvas by providing id of canvas.

**setBackground(image)** : Set canvas background in our case it will be product image.

**setBackgroundFromURL(url)** : Set canvas background from provided url in our case it will be product image.

**removeBackground()** : To remove existing background.

**addText(text, options)** : Add text on canvas. Takes two parameters one for Text and other font options like size, fill, font family

**addImage(image)** : Add image on canvas.

**deleteActiveObject()** : Deletes the current active object.

**clearDesigns()** : Clears all the design from canvas.

**exportDesign()** : Export the existing design as base64 string
