# DesignStudio

We are using fabric.js to manuplate different kind of objects on canvas. Find link here : http://fabricjs.com/

# Folder Structure

`- DesignStudio
  -node_modules
  -public
     -js //our js files
     -index.html
  -server.js
  -package.json
  -README.md`
  
# How to run project

1) clone or download the source code from github
2) go to DesignStudio folder
3) install node module
   `npm install`
4) run the project
   `npm start`
5) open the http://localhost:3000/
 
# Design studio methods

**createCanvas(canvasId)** : Initialize canvas by providing id of canvas.
**setBackground(image)** : Set canvas background in our cas it will be product image. 
**addText(text)** : Add text on canvas.
**addImage(image)** : Add image on canvas.
**deleteActiveObject()** : Deletes the current active object.
**clearDesigns()** : Clears all the design from canvas.
**exportDesign()** : Export the existing design as base64 string
