# Universal Video Controls - Chrome Extension

## Overview

This Chrome extension gives you YouTube-style keyboard shortcuts for any HTML5 video player you find on the web. Now you can use the same, familiar keys to control videos on news sites, blogs, and other platforms.

This extension is "smart" and will attempt to use a site's native controls when on a complex site like Netflix, but will provide its own controls for all other websites.

## How to Install the Extension

Since this is not on the Chrome Web Store, you'll need to load it manually in "Developer mode".

1.  **Save the Files:**
    
    -   Create a new folder on your computer named `universal-video-controls`.
        
    -   Inside that folder, create another folder named `icons`.
        
    -   Save the `manifest.json` and `content.js` files directly inside the `universal-video-controls` folder.
        
    -   _Note:_ The `manifest.json` refers to icon files (`icon16.svg`, etc.). The extension will work without them, but Chrome will show a default icon. You can create your own simple icons and place them in the `icons`folder.
        
2.  **Open Chrome Extensions:**
    
    -   Open your Google Chrome browser.
        
    -   Navigate to `chrome://extensions` in the address bar.
        
3.  **Enable Developer Mode:**
    
    -   In the top-right corner of the extensions page, find the "Developer mode" toggle and switch it **on**.
        
4.  **Load the Extension:**
    
    -   Three new buttons will appear: "Load unpacked", "Pack extension...", and "Update".
        
    -   Click the **"Load unpacked"** button.
        
    -   A file dialog will open. Navigate to and select the `universal-video-controls` folder you created in step 1.
        
5.  **Done!**
    
    -   The "Universal Video Controls" extension should now appear in your list of extensions, and it is active immediately.
        

## How to Use

The extension will automatically find the main video on the page. A "▶️ Controls Active" indicator will briefly appear in the corner of your screen, letting you know it's ready for your commands.

### Keyboard Shortcuts

Key

Action

**`S`** or **`K`**

Play / Pause

**`A`**

Rewind 5 seconds

**`D`**

Fast-forward 5 seconds

**`J`**

Rewind 10 seconds

**`L`**

Fast-forward 10 seconds

**`M`**

Mute / Unmute

**`F`**

Toggle Fullscreen

**`↑`** (Up Arrow)

Increase volume by 5%

**`↓`** (Down Arrow)

Decrease volume by 5%

**`0`** - **`9`**

Seek to 0% - 90% of the video
```
