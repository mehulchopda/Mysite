(function($,sr){

    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    var debounce = function (func, threshold, execAsap) {
        var timeout;

        return function debounced () {
            var obj = this, args = arguments;
            function delayed () {
                if (!execAsap)
                    func.apply(obj, args);
                timeout = null;
            }

            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 100);
        };
    };
    // smartresize
    jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');

(function ($) {
    // Breakpoints
    var screen_xs_min = 480,
        screen_sm_min = 750,
        screen_md_min = 992,
        screen_lg_min = 1200,
        screen_xs_max = screen_sm_min - 1,
        screen_sm_max = screen_md_min - 1,
        screen_md_max = screen_lg_min - 1;

    $(document).ready(function () {

        var headings = '.main-container >h1 , .main-container > h2';
        onResize();
        onScroll();
    });






    /**
     * jQuery displayWidth - A simple Media Query check
     * @param  {string} comparison   Comparison condition. Possible values: Either one these: '>', '<', '>=', '<=' or a full, complex Media Query. The latter is risky because it will fail without a fallback in browsers that do not support the matchMedia function.
     * @param  {int+} width          Display width (in pixels)
     */
    window.displayWidth = function (comparison, width) {
        if (typeof(window.matchMedia) === 'function' && window.matchMedia !== undefined && window.matchMedia('screen and (max-width: 767px)') !== null) {
            if (width !== undefined && jQuery.isNumeric(width)) {
                width = Number(width);
                if (comparison === '>=') {
                    comparison = 'min-width';
                } else if (comparison === '<=') {
                    comparison = 'max-width';
                } else if (comparison === '>') {
                    comparison = 'min-width';
                    width++;
                } else if (comparison === '<') {
                    comparison = 'max-width';
                    width--;
                }
                return window.matchMedia('(' + comparison + ':' + width + 'px)').matches;
            } else {
                return window.matchMedia(comparison).matches;
            }
        } else {
            if (width === undefined || !jQuery.isNumeric(width)) {
                if (console !== undefined) {
                    console.log('Error: This Browser does not support media queries.');
                }
                return false;
            }
            if (window.current_window_width === undefined) {
                window.current_window_width = jQuery(window).outerWidth();
            }
            if (comparison === '>=') {
                return window.current_window_width >= width;
            } else if (comparison === '<=') {
                return window.current_window_width <= width;
            } else if (comparison === '>') {
                return window.current_window_width > width;
            } else if (comparison === '<') {
                return window.current_window_width < width;
            }
        }
    };

    $(document).on('ajaxComplete', function() {
       onResize();
    });
    $(window).smartresize(function() {
       onResize();
    });
    $(window).on('scroll', function() {
        onScroll();
    });
    function onResize() {
    }
    function onScroll () {
    }
})(jQuery.noConflict());