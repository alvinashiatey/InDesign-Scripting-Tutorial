# Google Sheets × InDesign

In this demo, you’ll be able to flow content from a Google Sheet into an InDesign file. We’ll compare two versions: Alvin’s script “CSV Loader” vs. InDesign’s existing Data Merge.

## Pros and cons of “CSV Loader” vs. Data Merge

- CSV Loader
  Pro: Each row of your .csv will seamlessly flow onto each page
  Con: You need to style individual sections in advance, and apply the style accordingly on each page.
- Data Merge
  Pro: You can style a template in advance.
  Con: It’s clunky with .csv.

## Data Merge

- In InDesign: “Windows” → “Utilities” → “Data Merge” → click the hamburger and select “Select Data Source” → click your .csv file
- Data Merge will automatically grab your row titles. Create a text box for a specified row title and apply a character or paragraph style to them. You can do this for each row title to create a template page.
- Once your InDesign template has been created, in the Data Merge panel, click “preview” on the bottom-left to flow in the content from your .csv.
- It will populate each row on a different page, styled with the style you created for each row title.

## How to run a script in inDesign

To run a script, we would first open InDesign and from the menu bar we would select the **Window** dropdown menu. We then would head to the **Utilities** section and click on **Scripts**.

    └── Window
        └──Utilities
            └── Scripts

_Keyboard shortcut:_ `opt+cmd+f11`

From the pop-up dialogue box that appears there would be three parent directories.

    ├──Application
    ├──Community
    ├──User

All the first two directories above have within them scripts provided by Adobe themselves. We would be working with the User directory. Right click on the User directory and you would be prompted with Reveal in Finder. Click that and the directory would be revealed. From this opened directory is where we would be saving our scripts to use within inDesign.

## CSV Loader

- In your g-sheet, go to “file” → “download as .csv”
- In InDesign, create a document at your preferred page size.
- To install Alvin’s script
  - In InDesign: “Windows” → “Utilities” → “Script → right+click “User” folder to ”Reveal in Finder” → click on script “CSV Loader” > select your .csv
- Each row of your spreadsheet will become a different page.

## Short Intro to InDesign Scripting

In this short intro, we would be making an alert and printing "Hello World!" in inDesign.
in your text editor of choice we would make a javascript file with the following code and save this to the inDesign User script folder.

```javascript
alert(“Hello World”)
```

When we run this script from inDesign we should have inDesign exclaim into the aether "Hello World!".

## A somewhat advanced version of our Hello World script

We would be implementing this a little bit fancy Hello World script with a function. I wont be able to go in depth but I would want you to analyse these lines of code and try to figure out if you understand what is happening.

```javascript
function helloWorld() {
  if (app.activeDocument) {
    var document = app.activeDocument;
    var page = document.pages.add();
    var layer;
    if (document.layers.item("helloWorld") == null) {
      layer = document.layers.add({ name: "helloWorld" });
    } else {
      layer = document.layers.item("helloWorld");
    }
    var textFrame = page.textFrames.add(layer);
    textFrame.contents = "Hello World";
    textFrame.visibleBounds = [0, 0, 100, 100];
  }
}

helloWorld();
```

---

### References and Resources

- [Adobe InDesign CS6 Scripting Guide: Javascript](https://usermanual.wiki/adobe/InDesigncs6ScriptingJSEN.3768967468/view)
- [InDesign Automatisieren 2. Auflage 2015](https://github.com/grefel/indesignjs)
- [InDesign JavaScript Reference Guide](http://www.jongware.com/idjshelp.html)
- [Adobe Extensibility API Docs](https://docsforadobe.dev/)
- [InDesign ExtendScript API](https://www.indesignjs.de/extendscriptAPI/indesign-latest/#about.html)
- [JavaScript for InDesign, by Peter Kahrel](https://creativepro.com/now-available-javascript-for-indesign-2nd-edition/)
- [inDesignjs-resources](https://grefel.github.io/indesignjs-resources/)

---

_Readme prepared by Mindy Seu and Alvin Ashiatey for Mindy's class, ["On Gathering: Digital Collections and Virtual Events"](https://courses.yale.edu/?keyword=on-gathering&srcdb=202201). You can find the class website [here](https://on-gathering.com/yale-spring22/index.html)._
