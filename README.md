# HTML+CSS to Canvas Renderer

## What can I do with it?
Convert HTML styled with CSS into canvas image data.
## Why would I do that?
There are so many reasons why this is useful but the main purpose of this project was to allow developers to create user interfaces in HTML that could then be rendered either in a browser or via some other technology such as OpenGL on a iPhone (for instance).
## What does it currently support?
You can convert any simple HTML styled with CSS into a canvas image. It currently supports DIV tags. Haven't done any testing with other elements yet and will MOST DEFINITELY not support input tags!

Supported CSS:

* Border settings for left, top, right, bottom including widths, colours and radius
* Background colours
* Background images
* Element positions
* Element dimensions

## What should be added for the future?

* z-index
* opacity
* text inside an element
* background repeat
* border styles (like dashed etc)

## How do I run the demo myself?
Extract the files to a web server (AJAX is in use so this will NOT run off a normal folder).

Load ./test/index.html

Click the "Render" button top-right.

You can edit the HTML that the test renders by editing the ./views/test1.html and ./views/test1.css files.

#License
This code is free to use, distribute, modify, copy, and whatever else you care to do with it. If you make a change that is beneficial, please consider forking this project and then submitting a pull request!

#Isogenic Game Engine
This project is part of the Isogenic Game Engine, an HTML5 Networked, MMO, Isometric and 2D, Canvas or DOM, Realtime game engine for the modern web. http://www.isogenicengine.com.

If you like this project, please +1 us on our site!

A large amount of our work goes to open-source projects so please support us!
