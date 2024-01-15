# Image Overlay Editor


Made using `React` and `Fabric.js`. 

<br>

## Usage 

<br>

**Show Label Details** :
- Click on existing label to show its detail

**Edit Label Details** :
- To edit the label transformation, simply resize, translate, etc by using the controls provided. Click on white space to exit the edit mode
- To edit the label type, click on the `type` field in the side panel, change it, and click anywhere on the sidepanel to update the value. Clicking anywhere on the canvas should reflect the changes

**Create New Label** :
- `Ctrl + Left Click` on white space to create a label 

**Delete Label**
- `Shift + Left Click` on a label to delete it.  

**Save and Exit** :

- Click on *Save and Exit* button to save the edited labels as a JSON

<br>

## Note
___

<br>

- The image is resized to fit into a (1000, 600)px canvas. So, for floating point pixels, I have used `Math.round()` to approximate. Hence, there will be a slight (usually unnoticeable) offset while rendering the labels
- There is **no undo feature**
