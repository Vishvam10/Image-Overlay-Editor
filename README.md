# Image Overlay Editor

Made using `React` and `Fabric.js`

<br>

## Usage 

- Click on existing label to show its detail
- Edit the label (resize, translate, etc) and click on white space to exit the edit mode
- Click on *Save and Exit* button to save the edited labels as a JSON
- Click on white space to create a label 

Buggy :
- Upon creating a new label, it not selectable for some reason

Todo :
- Edit label from the `Fabric.TextBox()`. Being grouped with the `Fabric.rect()` has been causing some issues.

**Note :** The image is resized to fit into a (1000, 600)px canvas. So, for floating point pixels, I have used `Math.round()` to approximate. Hence, there will be a slight (usually unnoticeable) offset while rendering the labels.
