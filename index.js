IgeHtmlCanvas = new IgeClass ({
	
	init: function () {
		
	},
	
	initContainer: function () {
		// Remove the css and html containers if they exist
		$('#IgeHtmlCanvas_cssContainer').remove();
		$('#IgeHtmlCanvas_htmlContainer').remove();
		
		// Create the containers
		$('<style id="IgeHtmlCanvas_cssContainer"></style>').appendTo('head');
		$('<div id="IgeHtmlCanvas_htmlContainer" style="width:300px; height:300px; float:left; background-color:#333;"></div>').appendTo('body');
	},
	
	loadView: function (htmlPath, cssPath, callback) {
		if (cssPath) {
			$.ajax({
				url: cssPath,
				success: this.bind(function (data) { $('#IgeHtmlCanvas_cssContainer').html(data); }),
				error: function () { console.log('error: ', arguments); },
				dataType: 'text'
			});
		}
		
		if (htmlPath) {
			$.ajax({
				url: htmlPath,
				success: this.bind(function (data) { $('#IgeHtmlCanvas_htmlContainer').html(data); }),
				error: function () { console.log('error: ', arguments); },
				dataType: 'html'
			});
		}
	},
	
	renderHtml: function (html) {
		// Remove the canvas if it exists
		$('#IgeHtmlCanvas_canvas').remove();
		
		// Get the dimensions of the html container
		var canvasWidth = $('#IgeHtmlCanvas_htmlContainer').width();
		var canvasHeight = $('#IgeHtmlCanvas_htmlContainer').height();
		
		// Create the canvas
		$('<canvas id="IgeHtmlCanvas_canvas" width="' + canvasWidth + '" height="' + canvasHeight + '" style=""></canvas>').appendTo('body');
		
		// Get the canvas context
		var ctx = $('#IgeHtmlCanvas_canvas')[0].getContext('2d');
		
		// Create a white background
		ctx.fillStyle = '#000000';
		ctx.fillRect(0,0,canvasWidth, canvasHeight);
		
		// Loop through the elements of the view and render them to the canvas
		$('#IgeHtmlCanvas_htmlContainer').children().each(this.bind(function (index, elem) {
			var newItem = this._extractElementProperties(elem);
			newItem.elementIndex = index;
			
			//console.log(newItem);
			
			// Make sure all the images that this element requires are loaded first
			if (newItem.backgroundImage && newItem.backgroundImage != 'none') {
				// Create a new image element to load the image into
				var newImage = document.createElement('img');
				newImage.id = 'IgeHtmlCanvas_' + index;
				newItem._image = newImage;
				
				// Register the onload event
				newImage.onload = this.bind(function () {
					this._renderItem(ctx, newItem);
				});
				
				// Remove the fluff from the background image url string
				var finalUrl = newItem.backgroundImage.substr(4, newItem.backgroundImage.length - 5);
				
				if (finalUrl.substr(0, 1) == '"') {
					finalUrl = finalUrl.substr(1, finalUrl.length - 2);
				}
				
				// Load the image!
				newImage.src = finalUrl;
			} else {
				// No images so just render now
				this._renderItem(ctx, newItem);
			}
		}));
	},
	
	_extractElementProperties: function (element) {
		var newItem = {};
		var elem = $(element);
		
		// Get the element position relative to the document
		var offset = elem.offset();
		
		// Dimensions
		newItem.left = offset.left;
		newItem.top = offset.top;
		newItem.width = elem.width();
		newItem.height = elem.height();
		
		// Borders
		newItem.borderLeftWidth = elem.css('borderLeftWidth') || 0;
		newItem.borderTopWidth = elem.css('borderTopWidth') || 0;
		newItem.borderRightWidth = elem.css('borderRightWidth') || 0;
		newItem.borderBottomWidth = elem.css('borderBottomWidth') || 0;
		
		newItem.borderLeftColor = elem.css('borderLeftColor');
		newItem.borderTopColor = elem.css('borderTopColor');
		newItem.borderRightColor = elem.css('borderRightColor');
		newItem.borderBottomColor = elem.css('borderBottomColor');
		
		newItem.borderLeftStyle = elem.css('borderLeftStyle');
		newItem.borderTopStyle = elem.css('borderTopStyle');
		newItem.borderRightStyle = elem.css('borderRightStyle');
		newItem.borderBottomStyle = elem.css('borderBottomStyle');
		
		newItem.borderTopLeftRadius = elem.css('borderTopLeftRadius') || 0;
		newItem.borderTopRightRadius = elem.css('borderTopRightRadius') || 0;
		newItem.borderBottomLeftRadius = elem.css('borderBottomLeftRadius') || 0;
		newItem.borderBottomRightRadius = elem.css('borderBottomRightRadius') || 0;		
		
		// Background
		newItem.backgroundColor = elem.css('backgroundColor');
		newItem.backgroundImage = elem.css('backgroundImage');
		newItem.backgroundRepeat = elem.css('backgroundRepeat');
		//newItem.backgroundPosition = elem.css('backgroundPosition'); // Cannot be cross-browser identified at present
		
		this._clearPx(newItem);
		
		return newItem;
	},
	
	_renderItem: function (ctx, newItem) {
		// Border
		this._renderBackground(ctx, newItem);
		this._renderBorder(ctx, newItem);
	},
	
	_renderBackground: function (ctx, newItem) {
		var rad = Math.PI / 180;
		//newItem.left += 0.5;
		//newItem.top += 0.5;
		
		var widthPad = 0;
		var heightPad = 0;
		
		if (newItem.borderLeftWidth || newItem.borderTopWidth || newItem.borderRightWidth || newItem.borderBottomWidth) {
			newItem.top += (newItem.borderTopWidth / 2);
			newItem.height += (newItem.borderBottomWidth);
			
			newItem.left += (newItem.borderLeftWidth / 2);
			newItem.width += (newItem.borderRightWidth);
		}
		
		ctx.save();
		ctx.beginPath();
		
		// Top border
		ctx.moveTo(newItem.left + newItem.borderTopLeftRadius, newItem.top);
		ctx.lineTo(newItem.left + newItem.width - newItem.borderTopRightRadius, newItem.top);
		
		// Top-right corner
		ctx.arcTo(newItem.left + newItem.width, newItem.top, newItem.left + newItem.width, newItem.top + newItem.borderTopRightRadius, newItem.borderTopRightRadius);
		
		// Right border
		ctx.lineTo(newItem.left + newItem.width, newItem.top + newItem.height - newItem.borderBottomRightRadius);
		
		// Bottom-right corner
		ctx.arcTo(newItem.left + newItem.width, newItem.top + newItem.height, newItem.left + newItem.width - newItem.borderBottomRightRadius, newItem.top + newItem.height, newItem.borderBottomRightRadius);
		
		// Bottom border
		ctx.lineTo(newItem.left + newItem.borderBottomLeftRadius, newItem.top + newItem.height);
		
		// Bottom-left corner
		ctx.arcTo(newItem.left, newItem.top + newItem.height, newItem.left, newItem.top + newItem.height - newItem.borderBottomLeftRadius, newItem.borderBottomLeftRadius);
		
		// Left border
		ctx.lineTo(newItem.left, newItem.top + newItem.borderTopLeftRadius);
		
		// Top-left corner
		ctx.arcTo(newItem.left, newItem.top, newItem.left + newItem.borderTopLeftRadius, newItem.top, newItem.borderTopLeftRadius);		
		
		ctx.clip();
		
		// If there is a background colour, paint it here
		if (newItem.backgroundColor) {
		ctx.fillStyle = newItem.backgroundColor;
		ctx.fillRect(newItem.left, newItem.top, newItem.width, newItem.height);
		}
		
		// If there is a background image, paint it here
		if (newItem.backgroundImage && newItem.backgroundImage != 'none') {
			ctx.drawImage(newItem._image, newItem.left, newItem.top, newItem._image.width, newItem._image.height);
		}
		
		ctx.restore();
		
		if (newItem.borderLeftWidth || newItem.borderTopWidth || newItem.borderRightWidth || newItem.borderBottomWidth) {
			newItem.top -= (newItem.borderTopWidth / 2);
			newItem.height -= (newItem.borderBottomWidth);
			
			newItem.left -= (newItem.borderLeftWidth / 2);
			newItem.width -= (newItem.borderRightWidth);
		}
		
	},
	
	_renderBorder: function (ctx, newItem) {
		var rad = Math.PI / 180;
		
		//newItem.left += 0.5;
		//newItem.top += 0.5;
		
		if (newItem.borderLeftWidth || newItem.borderTopWidth || newItem.borderRightWidth || newItem.borderBottomWidth) {
			newItem.top += (newItem.borderTopWidth / 2);
			newItem.height += (newItem.borderBottomWidth);
			
			newItem.left += (newItem.borderLeftWidth / 2);
			newItem.width += (newItem.borderRightWidth);
		}
		
		if (newItem.borderTopWidth) {
			// Top-left corner top-half
			ctx.strokeStyle = newItem.borderTopColor;
			ctx.lineWidth = newItem.borderTopWidth;
			
			ctx.beginPath();
			ctx.arc(newItem.left + newItem.borderTopLeftRadius, newItem.top + newItem.borderTopLeftRadius, newItem.borderTopLeftRadius, 225 * rad, 270 * rad);
			ctx.stroke();
			
			// Top border
			ctx.beginPath();
			ctx.moveTo(newItem.left + newItem.borderTopLeftRadius, newItem.top);
			ctx.lineTo(newItem.left + newItem.width - newItem.borderTopRightRadius, newItem.top);
			ctx.stroke();
			
			// Top-right corner top-half
			ctx.beginPath();
			ctx.arc(newItem.left + newItem.width - newItem.borderTopRightRadius, newItem.top + newItem.borderTopRightRadius, newItem.borderTopRightRadius, -90 * rad, -45 * rad);
			ctx.stroke();
		}
		
		if (newItem.borderRightWidth) {
			// Top-right corner bottom-half
			ctx.strokeStyle = newItem.borderRightColor;
			ctx.lineWidth = newItem.borderRightWidth;
			
			ctx.beginPath();
			ctx.arc(newItem.left + newItem.width - newItem.borderTopRightRadius, newItem.top + newItem.borderTopRightRadius, newItem.borderTopRightRadius, -45 * rad, 0 * rad);
			ctx.stroke();
			
			// Right border
			ctx.beginPath();
			ctx.moveTo(newItem.left + newItem.width, newItem.top + newItem.borderTopRightRadius);
			ctx.lineTo(newItem.left + newItem.width, newItem.top + newItem.height - newItem.borderBottomRightRadius);
			ctx.stroke();
			
			// Bottom-right corner top-half
			ctx.beginPath();
			ctx.arc(newItem.left + newItem.width - newItem.borderBottomRightRadius, newItem.top + newItem.height - newItem.borderBottomRightRadius, newItem.borderTopRightRadius, 0 * rad, 45 * rad);
			ctx.stroke();
		}
		
		if (newItem.borderBottomWidth) {
			// Bottom-right corner bottom-half
			ctx.strokeStyle = newItem.borderBottomColor;
			ctx.lineWidth = newItem.borderBottomWidth;
			
			ctx.beginPath();
			ctx.arc(newItem.left + newItem.width - newItem.borderBottomRightRadius, newItem.top + newItem.height - newItem.borderBottomRightRadius, newItem.borderBottomRightRadius, 45 * rad, 90 * rad);
			ctx.stroke();
			
			// Bottom border
			ctx.beginPath();
			ctx.moveTo(newItem.left + newItem.width - newItem.borderBottomRightRadius, newItem.top + newItem.height);
			ctx.lineTo(newItem.left + newItem.borderBottomLeftRadius, newItem.top + newItem.height);
			ctx.stroke();
			
			// Bottom-left corner bottom-half
			ctx.beginPath();
			ctx.arc(newItem.left + newItem.borderBottomLeftRadius, newItem.top + newItem.height - newItem.borderBottomLeftRadius, newItem.borderBottomLeftRadius, 90 * rad, 135 * rad);
			ctx.stroke();
		}
		
		if (newItem.borderBottomWidth) {
			// Bottom-left corner top-half
			ctx.strokeStyle = newItem.borderLeftColor;
			ctx.lineWidth = newItem.borderLeftWidth;
			
			ctx.beginPath();
			ctx.arc(newItem.left + newItem.borderBottomLeftRadius, newItem.top + newItem.height - newItem.borderBottomLeftRadius, newItem.borderBottomLeftRadius, 135 * rad, 180 * rad);
			ctx.stroke();
			
			// Left border
			ctx.beginPath();
			ctx.moveTo(newItem.left, newItem.top + newItem.height - newItem.borderBottomLeftRadius);
			ctx.lineTo(newItem.left, newItem.top + newItem.borderTopLeftRadius);
			ctx.stroke();
			
			// Top-left corner bottom-half
			ctx.beginPath();
			ctx.arc(newItem.left + newItem.borderTopLeftRadius, newItem.top + newItem.borderTopLeftRadius, newItem.borderTopLeftRadius, 180 * rad, 225 * rad);
			ctx.stroke();
		}
		
		if (newItem.borderLeftWidth || newItem.borderTopWidth || newItem.borderRightWidth || newItem.borderBottomWidth) {
			newItem.top -= (newItem.borderTopWidth / 2);
			newItem.height -= (newItem.borderBottomWidth);
			
			newItem.left -= (newItem.borderLeftWidth / 2);
			newItem.width -= (newItem.borderRightWidth);
		}
		
		//newItem.left -= 0.5;
		//newItem.top -= 0.5;
	},	
	
	_clearPx: function (obj) {
		for (var i in obj) {
			if (obj[i].substr && obj[i].substr(obj[i].length - 2, 2) == 'px') {
				obj[i] = Number(obj[i].substr(0, obj[i].length - 2));
			}
		}
	},
	
});