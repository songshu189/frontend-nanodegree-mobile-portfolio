## Front end nano degree mobile portfolio projects

This project is for front-end nano-degree web development. It's github page is [here](http://songshu189.github.io/frontend-nanodegree-mobile-portfolio/views/pizza.html).

### Build instructions:

1. Clone the repo
2. Install [npm](https://github.com/npm/npm)
3. Install [Gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)
4. Run **npm install** in your cloned repo folder
5. To resize image, you need to install [ImageMagick](http://www.imagemagick.org/script/binary-releases.php)
6. Run **gulp** to optimize the project, the production code goes to **dist** folder
7. Test code at the **dist** folder, to inspect the site on your phone, you can run a local server

  ```bash
  $> cd /path/to/your-project-folder/dist
  $> python -m SimpleHTTPServer 8080
  ```

8. Open a browser and visit localhost:8080
9. Download and install [ngrok](https://ngrok.com/) to make your local server accessible remotely. Open another window to run **ngrok**.

  ``` bash
  $> cd /path/to/your-ngrok-folder
  $> ngrok http 8080
  ```

10. Copy the public URL ngrok gives you and try running it through PageSpeed Insights!


####Part 1: Optimize PageSpeed Insights score for index.html

With the following optimization, I get PageSpeed Insights speed of 95 mobile, 96 desktop:
 
1. Add media="print" to print.css link tag
2. Add asyn to google analytics.js script tag
The followings are done with gulp
3. Optimize jpg and png image with gulp-imagemin, resize and minimize views/pizzeria.jpg
4. Replace render blocking style.css (google font css) with minified source code
5. Minify html


####Part 2: Optimize Frames per Second in pizza.html

1. Change the number of background pizzas from 200 to 40, it's not needed for 25 lines of pizzas, I only keep 5 lines of pizza, (line 566).
2. Add style property "willChange" with value "transform" (line 572).
3. Add onScroll event function to call updatePositions with requestAnimationFrame (line 513).
4. Move document.querySelectorAll('.mover') to DOMContentLoaded function after pizza background created, it's with same value every scroll (line 576).
5. Move the phase calculation outside of the loop, and saved in a array (line 530).
6. Change the pizza element style.left to style.transform with value translateX (line 535).
7. Add style to movingPizza1 with values position="fixed", top="0px", left="0px", zIndex="-1" (line 561).


####Part 3: Computation Efficiency pizza.html

I didn't change the logic of resizing pizza, with dev tools I found that all pizzas with same size, so I only made following changes, original file line 425-458, new file 428-465:

In changePizzaSizes function, move the calculation of the newwidth to the outside of the main loop, only use the width of the first pizza to determin dx. In accordingly, change the parameters of determinDx from (elem, size) to (size, oldWidth, windowWidth).