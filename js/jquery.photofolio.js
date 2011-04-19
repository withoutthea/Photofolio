
// basic logging wrapper
(function($){
	$.log = function(debug) {
		if (window.console && console.debug) {
			console.debug(debug);
		}
	};
})(jQuery);

// IE doesn't support Array.indexOf ... argh ...
if(!Array.indexOf){
    Array.prototype.indexOf = function(obj){
        for(var i=0; i<this.length; i++){
            if(this[i]==obj){
                return i;
            }
        }
        return -1;
    }
}



(function($) {

    $.photofolio = { version : '0.2' }

    $.fn.photofolio = function(options)
    {
        // global vars
        var images = Array(),
            thumbs = Array();

        $.photofolio.defaults = {
            // @TODO -> All these here for the growth of the project ... not implement in Photofolio itself yet!
            /*'thumbnails' => true,
            'showNav' => true,
            'navPosition' => 'top-center',
            'slideshow' => false,
            'timer' => '5',
            'lightbox' => false,
            'thumbHeight' => 'auto',
            'thumbWidth' => 'auto',
            'imageHeight' => 'auto',
            'imageWidth' => 'auto',
            'containerHeight' => 'auto',
            'containerWidth' => 'auto',*/
            
            containerClass : 'photofolio-container',
            navPosition : 'top-center',
            thumbnailPosition : 'below',
            leftNavImage : 'images/leftNav.png',
            rightNavImage : 'images/rightNav.png'
        }

        $.photofolio.current = null;
        $.photofolio.currentIndex = 0;

        $.photofolio.go = function()
        {
            //var settings = opts;

            // build the required markup
            // 1. setup container
            // 2. setup image wrapper
            // 3. setup captions, if selected

            // step one
            var markup = '<div class="' + opts.containerClass + '">';

            // if nav belongs on top or left or right
            if (opts.navPosition.indexOf('bottom') == -1)
                markup += '<div class="photofolio-nav"></div>';
            
            // if thumbnails are 'beside'
            if (opts.thumbnailPosition == 'beside') {
                markup += '<div class="photofolio-thumbnails" style="float: left;"><ul class="photofolio-thumbnails-list"></ul></div>';
            }

            // step two
            markup += '<div class="photofolio-image-wrapper">' +
                        '<div class="photofolio-image-wrapper-nav photofolio-image-wrapper-nav-left"><img src="' + opts.leftNavImage + '" alt="Previous Image" class="photofolio-image-wrapper-nav-left-image" style="display: none;" /></div>' +
                        '<div class="photofolio-image-wrapper-nav photofolio-image-wrapper-nav-right"><img src="' + opts.rightNavImage + '" alt="Next Image" class="photofolio-image-wrapper-nav-right-image" style="display: none;" /></div>' +
                        '</div>';

            // step three
            markup += '<div class="photofolio-image-caption-wrapper"><span class="photofolio-caption"></span></div>';

            // if thumbnails are 'below'
            if (opts.thumbnailPosition != 'beside')
                markup += '<div class="photofolio-thumbnails"><ul class="photofolio-thumbnails-list"></ul></div>';

            // clean up step one
            markup += '</div>'

            var container = $(markup).insertBefore(this);
            
            // init prev/next images
            // @TODO -> Implement first/last detection to hide prev/next images
            $('.photofolio-image-wrapper-nav').hover(
                function() { $(this).children('img').show(); },
                function() { $(this).children('img').hide(); }
            );
            $('.photofolio-image-wrapper-nav-left-image').click(function() { $.photofolio.prev(); });
            $('.photofolio-image-wrapper-nav-right-image').click(function() { $.photofolio.next(); });

            // markup is done, load our images
            $(this).children('li').each($.photofolio.loadImages);

            // show the first image
            // @TODO -> Implement a history device
            $.photofolio.firstImage();

            //$(this).hide();
            $(this).remove();

            return false;

        }

        $.photofolio.loadImages = function()
        {
            // right now, this only supports <li><img.../></li> methods
            // @TODO -> Add <li><a href=""><img.../></a></li> where <img/> is thumbnail

            // bring scope
            var self = this, $self = $(this),
            // find images
            image = $self.children('img');

            // get src and hide it
            var src = image.hide().attr('src');

            images.push(src);

            var imgLoader = new Image();

            $(imgLoader).load($.photofolio.loadThumbnail(image)).attr('src', src); //.addClass('photofolio-imageid-' + images.indexOf(src));
            $('.photofolio-image-wrapper').append($('<div />').addClass('photofolio-image photofolio-imageid-' + images.indexOf(src)).append(imgLoader).hide());
        }

        $.photofolio.loadThumbnail = function(img)
        {
            var thumb = img.clone(true).addClass('photofolio-thumbnail').hide();

            // local copy of src
            var src = img.attr('src');

            // only supports automatically scaled thumbnails currently
            // @TODO -> Add no-scale thumbnail support
            // @TODO -> Add thumbnail scale options

            var w = img.width(), h = img.height();
            
            if (w < h)
            {
                thumb.css({ height: 'auto', width: '80px', marginTop: '-20.5px' });
            }
            else
            {
                thumb.css({ width: 'auto', height: '80px', marginLeft: '-20.5px' });
            }

            thumb.click(function() { $.photofolio.show(src) });

            // @TODO -> Add hover effects to thumbnails
            // @TODO -> Add next/prev arrows to larger image

            $('.photofolio-thumbnails-list').append($('<li />').addClass('photofolio-thumb photofolio-thumbid-' + images.indexOf(src)).append(thumb));
            thumb.show();

            // delete previous image
            img.remove();
        }

        $.photofolio.show = function(img)
        {
            // set new active src
            $.photofolio.current = img;
            $.photofolio.currentIndex = images.indexOf($.photofolio.current);
            
            // remove classes from previous image and thumbnail
            $('.photofolio-active').removeClass('photofolio-active').hide();
            $('.photofolio-active-thumb').removeClass('photofolio-active-thumb').fadeTo(400, 0.5);

            // add classes to new image and thumbnail
            $('.photofolio-imageid-' + $.photofolio.currentIndex).addClass('photofolio-active').show();
            $('.photofolio-thumbid-' + $.photofolio.currentIndex).addClass('photofolio-active-thumb').fadeTo(400, 1.0);
        }

        $.photofolio.next = function()
        {
            // get the next object
            $next = $('.photofolio-active-thumb').next();

            // if there's nothing (end of list), do nothing
            if ($next.length <= 0) return;

            // hide previous image and activate new image
            $.photofolio.show($next.children('img').attr('src'));
        }

        $.photofolio.prev = function()
        {
            // get the prev object
            $prev = $('.photofolio-active-thumb').prev();

            // if there's nothing (beginning of list), do nothing
            if ($prev.length <= 0) return;

            // hide previous image and activate new image
            $.photofolio.show($prev.children('img').attr('src'));
        }

        $.photofolio.firstImage = function()
        {
            // get the first child of the ul and it's src (defaults to index 0 currently)
            $.photofolio.show(images[$.photofolio.currentIndex]);

            // fade out non-active thumbnails
            $('.photofolio-thumb').not('.photofolio-thumbid-' + $.photofolio.currentIndex).each(function() {
                $(this).fadeTo('slow', 0.5);
            });
        }

        // config defaults
        var opts = $.extend($.photofolio.defaults, options);

        // bind left/right key presses to prev/next functions
        $(document).unbind('keydown').keydown(function(e) {
            switch (e.keyCode)
            {
                case 37:
                    $.photofolio.prev();
                    break;
                case 39:
                    $.photofolio.next();
                    break;
            }
        });

        return this.each($.photofolio.go);
        
    };

})(jQuery);