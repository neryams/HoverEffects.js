/*!
HoverEffects.js - https://github.com/neryams/hovereffects.js
Licensed under the MIT license - http://opensource.org/licenses/MIT
Copyright (c) 2015 Raymon Ohmori
For my beloved, Chloe Lam
*/

window.animate = function() {
	var animation_methods = {
	    erase: function(options) {
	    	var defaultOptions = {
		    		initialOpacity: 0.5,
		    		brushSize: 10, 
		    		margin: 24,
		    		spacing: 1,
		    		randomness: 0,
		    		duration: 3000
		    	},
	    		spacingMult = 0.08,
	        	imageElement = this.node;
	        	
	        options = merge(defaultOptions, options || {});

	    	var drawing = false,
	        	canvas = document.createElement('canvas'),
				image = new Image(),
				baseImageDataArray,
	    		imageData;

	        var brush = {}
			for (var x = 0; x <= options.brushSize * 2; x++) {
				brush[x] = {};
				for (var y = 0; y <= options.brushSize * 2; y++) {
					var r = Math.sqrt((x - options.brushSize) * (x - options.brushSize) +
						(y - options.brushSize) * (y - options.brushSize));

					if(r < options.brushSize) {
						//brush[x][y] = 255 * options.initialOpacity + 255 * (1 - options.initialOpacity) * (1 - Math.sqrt(x*x+y*y) / options.brushSize);
						brush[x][y] = 255 * (1 - options.initialOpacity) * (r / options.brushSize) * (0.70/options.brushSize);
					} else {
						brush[x][y] = 0;
					}
				}
			}

	        image.onload = function() {
				canvas.width = imageElement.width;
				canvas.height = imageElement.height;

				var ctx = canvas.getContext("2d");
				ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
	  			imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	  			var data = imageData.data;
				for (var i = 0; i < data.length; i += 4) {
					data[i + 3] = options.initialOpacity * 255;
				}
				baseImageDataArray = new Uint8ClampedArray(data);

				init();
	  			imageElement.parentElement.insertBefore(canvas, imageElement);
				imageElement.parentElement.removeChild(imageElement);
	        };

	        var init = function() {
				var ctx = canvas.getContext("2d");
				imageData.data.set(baseImageDataArray);
    			ctx.putImageData(imageData, 0, 0);
	        }

	        var generatePath = function(position, path) {
	        	var angle = Math.PI / 6,
	        		xDiff = Math.cos(angle),
	        		yDiff = -Math.sin(angle),
	        		pathLength = 0,
	        		flips = 0,
	        		h = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height);
	        		
	        	while(position.x > options.margin - options.randomness - 1 && position.x - canvas.width < options.margin + options.randomness + 1 &&
	        			position.y > options.margin - options.randomness - 1 && position.y - canvas.height < options.margin + options.randomness + 1) {
	        		if(flips >= 2) {
	        			break;
	        		}
		        	position.x += xDiff;
		        	position.y += yDiff;

		        	if((position.x - options.margin      + Math.random() * options.randomness < 0 && xDiff < 0) || 
		        			(position.y - options.margin + Math.random() * options.randomness < 0 && yDiff < 0) || 
		        			(position.x + options.margin - Math.random() * options.randomness > canvas.width && xDiff > 0) || 
		        			(position.y + options.margin - Math.random() * options.randomness > canvas.height && yDiff > 0)) {
		        		if(angle > 0) {
		        			angle -= Math.PI * (1 - options.spacing * spacingMult + options.spacing * spacingMult * ((pathLength + options.margin + options.randomness * 5 * Math.random()) / (h + options.randomness * 5)));
		        		} 
		        		else {
		        			angle += Math.PI * (1 - options.spacing * spacingMult + options.spacing * spacingMult * ((pathLength + options.margin + options.randomness * 5 * Math.random()) / (h + options.randomness * 5)));
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
	  			var position = {x: options.margin, y: options.margin},
	  				frame = 1,
	  				stepsPerFrame = 0,
	  				tpf = (60 / 1000);

	  			var data = imageData.data;

	  			// Get number of movements to break up the animation evenly for the duration
	  			var path = generatePath(position, []);
	        	var i = 0,
	        		stepsPerFrame = path.length / (options.duration * tpf);

	        	drawing = true;

	        	var draw = function(timestamp) {
	        		if(drawing) {
		        		if(i >= path.length) { // position[0] > canvas.width || position[1] > canvas.height
		        			drawing = false;
		        		}
		        		else {
		        			while(i < frame * stepsPerFrame && i < path.length) {
			        			for (var x = 0; x <= options.brushSize * 2; x++) {
									for (var y = 0; y <= options.brushSize * 2; y++) {
										if(brush[x][y]) {
											var yPos = path[i].y + y - options.brushSize,
												xPos = path[i].x + x - options.brushSize;

											if(yPos >= 0 && yPos < canvas.height && xPos >= 0 && xPos < canvas.width) {
												data[(xPos + yPos * canvas.width) * 4 + 3] += brush[x][y];
											}
										}
									}
			        			}

		        				i++;
		        			}
			    			ctx.putImageData(imageData, 0, 0);

		    				frame++;
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
			
			image.src = (imageElement.getAttribute ? imageElement.getAttribute("src") : false) || imageElement.src;

	        return {
	        	element: canvas,
	        	beginDrawing: beginDrawing,
	        	cancelDrawing: cancelDrawing
	        }
	    }
	}, _animate;

	// simple implementation based on $.extend() from jQuery
	var merge = function() {
	    var obj, name, copy,
	        target = arguments[0] || {},
	        i = 1,
	        length = arguments.length;

	    for (; i < length; i++) {
	        if ((obj = arguments[i]) !== null) {
	            for (name in obj) {
	                copy = obj[name];

	                if (target === copy) {
	                    continue;
	                }
	                else if (copy !== undefined) {
	                    target[name] = copy;
	                }
	            }
	        }
	    }

	    return target;
	};

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

/* requestAnimationFrame polyfill by Paul Irish */
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
