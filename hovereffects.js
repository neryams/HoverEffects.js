/*!
HoverEffects.js - https://github.com/neryams/hovereffects.js
Licensed under the MIT license - http://opensource.org/licenses/MIT
Copyright (c) 2015 Raymon Ohmori
For my beloved, Chloe Lam
*/

window.animate = function() {
	var animation_methods = {
	    erase: function(initialOpacity, brushSize, margin, spacing, randomness, duration) {
	    	var drawing;

	        var image = this.node;
	        var canvas = document.createElement('canvas');
	        var realWidth, realHeight;

	        var brush = {}
			for (var x = -brushSize; x <= brushSize; x++) {
				brush[x] = {};
				for (var y = -brushSize; y <= brushSize; y++) {
					//brush[x][y] = 255 * initialOpacity + 255 * (1 - initialOpacity) * (1 - Math.sqrt(x*x+y*y) / brushSize);
					brush[x][y] = 255 * (1 - initialOpacity) * (Math.sqrt(x*x+y*y) / brushSize) * (0.70/brushSize);
				}
			}

	        image.onload = function() {
			    var t = new Image();
			    t.src = (image.getAttribute ? image.getAttribute("src") : false) || image.src;
			    realWidth = t.width;
			    realHeight = t.height;

				canvas.width = image.offsetWidth;
				canvas.height = image.offsetHeight;
				init();
	        };

	        var init = function() {
				var ctx = canvas.getContext("2d");
				ctx.drawImage(image, 0, 0, realWidth, realHeight, 0, 0, canvas.width, canvas.height);
				image.setAttribute('style', 'display: none;');
	  			image.parentElement.insertBefore(canvas, image);

	  			var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	  			var data = imageData.data;
				for (var i = 0; i < data.length; i += 4) {
					data[i + 3] = initialOpacity * 255;
				}
    			ctx.putImageData(imageData, 0, 0);
	        }

	        var generatePath = function(position, path) {
	        	var angle = Math.PI / 6,
	        		xDiff = Math.cos(angle),
	        		yDiff = -Math.sin(angle),
	        		pathLength = 0,
	        		flips = 0,
	        		h = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height);
	        		
	        	while(position.x > margin - randomness - 1 && position.x - canvas.width < margin + randomness + 1 &&
	        			position.y > margin - randomness - 1 && position.y - canvas.height < margin + randomness + 1) {
	        		if(flips >= 2) {
	        			break;
	        		}
		        	position.x += xDiff;
		        	position.y += yDiff;

		        	if((position.x - margin      + Math.random() * randomness < 0 && xDiff < 0) || 
		        			(position.y - margin + Math.random() * randomness < 0 && yDiff < 0) || 
		        			(position.x + margin - Math.random() * randomness > canvas.width && xDiff > 0) || 
		        			(position.y + margin - Math.random() * randomness > canvas.height && yDiff > 0)) {
		        		if(angle > 0) {
		        			angle -= Math.PI * (1 - spacing + spacing * ((pathLength + margin + randomness * 5 * Math.random()) / (h + randomness * 5)));
		        		} 
		        		else {
		        			angle += Math.PI * (1 - spacing + spacing * ((pathLength + margin + randomness * 5 * Math.random()) / (h + randomness * 5)));
		        		}
						xDiff = Math.cos(angle);
						yDiff = -Math.sin(angle);
						flips++;
						pathLength = 0;
		        	} else {
		        		flips = 0;
		        		pathLength++;
		        	}

	        		var x = Math.floor(position.x),
	        			y = Math.floor(position.y);
	        		if(path.length === 0 || path[path.length - 1].x != position.x || path[path.length - 1].y != position.y) {
		        		path.push({
		        			x: x,
		        			y: y
		        		});
	        		}
	        	}
	        	return path;
	        }

	        var beginDrawing = function() {
				var ctx = canvas.getContext("2d");
	  			var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height),
	  				position = {x: margin, y: margin},
	  				step = 1,
	  				stepsPerFrame = 0,
	  				fps = 60;

	  			var data = imageData.data;

	  			// Get number of movements to break up the animation evenly for the duration
	  			var path = generatePath(position, []);
	        	var i = 0,
	        		stepsPerFrame = Math.ceil(path.length / (duration / fps));

	        	drawing = true;
	        	var draw = function(timestamp) {
	        		if(drawing) {
		        		if(i >= path.length) { // position[0] > canvas.width || position[1] > canvas.height
		        			drawing = false;
		        		}
		        		else {
		        			while(i < step * stepsPerFrame && i < path.length) {
			        			for (var x = -brushSize; x <= brushSize; x++) {
									for (var y = -brushSize; y <= brushSize; y++) {
										var yPos = path[i].y + y,
											xPos = path[i].x + x;

										if(yPos >= 0 && yPos < canvas.height && xPos >= 0 && xPos < canvas.width && Math.sqrt(x*x+y*y) < brushSize) {
											data[(xPos + yPos * canvas.width) * 4 + 3] += brush[x][y];
										}
									}
			        			}

		        				i++;
		        			}
			    			ctx.putImageData(imageData, 0, 0);

		    				step++;
		        		}
	        			window.requestAnimationFrame(draw);
	        		}
	        	}
	        	window.requestAnimationFrame(draw);
	        }
	        var cancelDrawing = function() {
	        	drawing = false;
				init();
	        }

	        return {
	        	element: canvas,
	        	beginDrawing: beginDrawing,
	        	cancelDrawing: cancelDrawing
	        }
	    }
	}, _animate;

	_animate = function(element) {
		if(typeof element === 'string') {
			this.node = document.querySelector(element);
		}
		else {
			this.node = element;
		}
	};
	_animate.prototype = animation_methods;

	return function(selector) {
	    return new _animate(selector);
	};
}();