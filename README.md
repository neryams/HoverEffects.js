#HoverEffects.js
`HoverEffects.js` is a collection of animated effects on images that are indended to be shown on hover or page load, etc.

##Basic Usage
1. Include the javascript file in your document's `head`

		<head> 
			<script src="hovereffects.js" type="text/javascript"></script>
		</head>

2. Insert the following javascript at the bottom of your body tag. Update the selector in the querySelectorAll function to select your images.

		<script>
		var hoverElements = document.querySelectorAll('img.hover_animate');

		for (var i = 0; i < hoverElements.length; ++i) {
		    var animation = animate(hoverElements[i]).erase(0.5, 10, 24, 0.08, 20, 4000);
		    animation.element.addEventListener( 'mouseover', animation.beginDrawing );
		    animation.element.addEventListener( 'mouseout', animation.cancelDrawing );	 
		}
		</script>

3. Invoke the animation plugin with the function `animate(element)`. You can then attach one of the animations available:

## Animations
*   `erase`: **An eraser effect painting over the image to make it opaque from being transparent**
  
        erase(initial opacity, brush radius, margin size, line distance, randomness, duration)

	* initial opacity:  Value from 0-1, where 1 is fully opaque and 0 is transparent
	* brush radius:     Size of the brush painting on the image
	* margin size:      How close the brush strokes get to the edge of the image
	* line distance:    How far apart the brush strokes are when painting
	* randomness:       Randomizes the margin size and the line distance. 5 is barely random, 20 is fairly random.
	* duration:         Time length of the animation in milliseconds