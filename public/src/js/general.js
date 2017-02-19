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
    // if (displayWidth('>', 767) && displayWidth('<', 992)) {
    //     console.log('tablet mode on');
    //     $(".view-top-articles-teaser").find('.row').each(function () {
    //         $(this).children().hide();
    //         $(this).children().slice(0,2).show();
    //
    //         //  $(this).find('.row').children().slice(3,4).hide();
    //     });
    // }

    // Breakpoints
    var screen_xs_min = 480,
        screen_sm_min = 750,
        screen_md_min = 992,
        screen_lg_min = 1200,
        screen_xs_max = screen_sm_min - 1,
        screen_sm_max = screen_md_min - 1,
        screen_md_max = screen_lg_min - 1;

    var query = {},
        didScroll,
        lastScrollTop = 0,
        delta = 5,
        navbarHeight,
        bannerHeight;

    $(document).ready(function () {
        // init slider
        var delay = 9000;
        if ($(".bxslider>li").length > 1) {
            var slider = $('.bxslider').bxSlider({
                mode: "vertical",
                controls: false,
                adaptiveHeight: false,
                pagerSelector: "#bxpager",
                slideMargin: 0,
                slideSelector: "li",
                auto: true,
                pause: delay,
                autoHover: false,
                onSlideAfter: function ($slideElement, oldIndex, newIndex) {
                    // fade in image
                    $slideElement.find(".slider-image").removeClass("fade-out");
                },
                onSliderLoad: function () {
                    // set first pager item active
                    $("#bxpager .bx-pager-item").eq(0).addClass("active");
                    // fade in first image
                    $(".bxslider li:not(.bx-clone)").eq(0).find(".slider-image").removeClass("fade-out");
                    $(".bx-pager-item").not(".processed").click(function () {
                        var $this = $(this);
                        slider.goToSlide($this.find("a").attr("data-slide-index"));
                        // once clicked, stop auto play
                        slider.stopAuto();
                    }).addClass("processed");
                },
                onSlideBefore: function ($slideElement, oldIndex, newIndex) {
                    // set active pager item
                    $("#bxpager .bx-pager-item.active").removeClass("active");
                    $("#bxpager .bx-pager-item").eq(newIndex).addClass("active");

                    // fade out active image (and all other images)
                    //$("#bxslider li").find(".slider-image").addClass("fade-out");

                    // hide next image (.fade-out must have transition 0s)
                    $slideElement.find(".slider-image").addClass("fade-out");
                }
            });

        }
        $('.top-view-header').parents().first().find('.row').css("margin-bottom", "0");
        if ($('.main-container.with-bg-image').length) {
            $('.main-container.with-bg-image').prepend('<div class="parallax-slider"></div>');

            $('.main-container.with-bg-image').parallax({
                speed: 0.2
            });
        }
        $(document).on('mouseenter', '#navbar.minimized', function() {
            $(this).removeClass('slide-out').addClass('slide-in');
        // }).on('mouseleave', '#navbar.minimized', function() {
        //     if (!$(this).hasClass('scrolling')) {
        //         $(this).removeClass('slide-in').addClass('slide-out');
        //     }
        });


        var headings = '.main-container >h1 , .main-container > h2';
        $(headings).each(function (index, element) {
            if ($(this).parent().prev().length == 0) {
                $(this).parent().css("padding-top", "100px");
            }
            else {
                var outerHeights = $(this).parent().prev().outerHeight() + 100;
                $(this).parent().prev().not('.primary-bg').outerHeight(outerHeights);
            }
        });


        if ($('body').find('.front-page-lower,.field-collection-container').length != 0) {
            //$('.front-page-lower,.field-collection-container').height($('.front-page-lower,.field-collection-container').height() + 100);
        }
        else {
            //   $('footer').prev().outerHeight($('footer').prev().outerHeight() + 100);

        }
        $('.only-text').find('h1').css("margin-top", "0px");

        $('#navbar > .container  >.row >.navbar-collapse .dropdown-toggle').click(function (e) {
            if (displayWidth('<', screen_md_min)) {
                e.preventDefault();
                e.stopPropagation();
                var $panel = $(this).next('.dropdown-menu');
                var $item = $(this).parent();
                console.log($panel);
                console.log($item);
                if ($item.hasClass('open')) {
                    console.log('Hello closed');

                    $panel.stop().slideUp(420, function () {
                        $(this).parent().removeClass('open');
                        $(this).removeAttr('style');
                    });
                }
                else {
                    $panel.hide();
                    $item.addClass('open');
                    console.log('Hello open');

                    $panel.stop(true, true).slideDown(420, function () {
                        $(this).removeAttr('style');
                    });
                }
            }
        });

        $('header').find('.block-search input').wrap('<div class="search-input-wrapper"></div>');
        $('header').find('.block-search .btn').click(function (e) {
            e.preventDefault();
            $('.block-search').toggleClass('show-search');
        });
        $('.panel-group,#accordion-1170,#accordion').find('a').click(function () {
            $(this).toggleClass("open");
        });

        // $('.nav-stub').on('mouseenter', function(event) {
        //     $('.navbar.navbar-default').addClass('nav-down');
        //     // $('.navbar.navbar-default').next().css({"margin-top": navbarHeight});
        // });
        //
        // $('.navbar.navbar-default').on('mouseleave', function(event) {
        //     $(this).removeClass('nav-down');
        //     console.log('leaving header');
        //     // $(this).next().css({"margin-top": 0});
        // })

        onResize();
        onScroll();
    });

    // $(window).load(function() {
    //     onResize();
    // });

    // $(window).on('scroll', function () {
    //     if (displayWidth('>', 767)) {
    //         didScroll = true;
    //     } else {
    //         didScroll = false;
    //     }
    // });
    //
    // // run hasScrolled() and reset didScroll status
    // setInterval(function () {
    //     if (didScroll) {
    //         hasScrolled();
    //         didScroll = false;
    //     }
    // }, 100);

    function hasScrolled() {
        // var st = $(this).scrollTop(),
        //     $header = $('.navbar.navbar-default');
        //
        //
        // if (st > navbarHeight) {
        //     // Make sure they scroll more than delta
        //     if (Math.abs(lastScrollTop - st) <= delta)
        //         return;
        //
        //     if (st > lastScrollTop) {
        //         $header.removeClass('nav-down').addClass('nav-up');
        //     } else {
        //         if (st + $(window).height() < $(document).height()) {
        //             $header.removeClass('nav-up').addClass('nav-down');
        //             // $header.next().css({"margin-top": navbarHeight});
        //         }
        //     }
        // } else if (st > lastScrollTop) {
        //     $header.removeClass('nav-down').removeClass('nav-up');
        // }
        //
        // lastScrollTop = st;
    }


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
        //match heigh on ansprechPartner
        $('.view-persons').find('.details-wrapper').matchHeight();
        $('.page-header-with-image').find('.col-sm-5,.col-sm-7').matchHeight();
        $('.bxslider').find('.col-md-70p').matchHeight();

        if (displayWidth('<', screen_md_min)) {
            var $detach_search = $('.region-navigation').find('.block-search').detach();
            if ($detach_search.length) {
                $detach_search.insertAfter('.navbar-toggle');
            }
        } else {
            $detach_search = $('.navbar-header').find('.block-search').detach();
            if ($detach_search.length) {
                $detach_search.prependTo('.region-navigation');
                // $detach_search.append($('.navbar-header'));
            }
        }

        if (displayWidth('<', screen_sm_min)) {
            var $detach_text_section = $('.text-section-move').detach();
            if ($detach_text_section.length) {
                $('#block-system-main').find('.container').first().prepend($detach_text_section);
                // $('#block-system-main').find('.primary-bg.full-width ').first().next().prepend($detach_text_section);
                // $detach_search.append($('.navbar-header'));
            }
            var $detach_image = $('.sponser-logo').detach();
            if ($detach_image.length) {
                $detach_image.insertAfter($('.front-page-lower').find('.t1'));
            }
        }
        if (displayWidth('>', screen_xs_max) && displayWidth('<', screen_md_min)) {
            var $detach_logo = $('.footer-logo').detach();
            if ($detach_logo.length) {
                $detach_logo.insertBefore($('.impressum'));
            }
        }



        // navbarHeight = $('#navbar').outerHeight();
        navbarHeight = 90;
        $('#navbar').next().css({"margin-top": navbarHeight});
        bannerHeight = $('#page-header').outerHeight();

        $('.select2-container--open').remove();
        $("select").select2({
            minimumResultsForSearch: -1,
            templateResult: function (item) {
                // No need to template the searching text
                if (item.loading) {
                    return item.text;
                }

                var term = query.term || '',
                    $result = markMatch(item.text, term);

                return $result;
            },
            language: {
                searching: function (params) {
                    // Intercept the query as it is happening
                    query = params;

                    // Change this to be appropriate for your application
                    return 'Searching…';
                }
            },
            placeholder: $('#edit-field-tags-tid').attr('placeholder')
        });
        $('#edit-field-tags-tid').addClass('ctools-auto-submit-exclude')
            .on('select2:select select2:unselect', function(event) {
                // from ctools autosubmit.js
                if ($.contains(document.body, this)) {
                    var $this = $(event.target.form);
                    $(this).trigger('change.select2');
                    if (!$this.hasClass('ctools-ajaxing')) {
                        $this.find('.ctools-auto-submit-click').click();
                    }
                }
            });
        $('.select2-search__field').addClass('ctools-auto-submit-exclude');
    }

    function markMatch (text, term) {
        // Find where the match is
        var match = text.toUpperCase().indexOf(term.toUpperCase());

        var $result = $('<span></span>');

        // If there is no match, move on
        if (match < 0) {
            return $result.text(text);
        }

        // Put in whatever text is before the match
        $result.text(text.substring(0, match));

        // Mark the match
        var $match = $('<span class="select2-rendered__match"></span>');
        $match.text(text.substring(match, match + term.length));

        // Append the matching text
        $result.append($match);

        // Put in whatever is after the match
        $result.append(text.substring(match + term.length));

        return $result;
    }

    function onScroll () {
        var scrollTop = $(window).scrollTop(),
            direction = scrollTop > lastScrollTop ? 'down' : scrollTop < lastScrollTop ? 'up' : '',
            $nav = $('#navbar'),
            $banner = $('#page-header');

        if (scrollTop + 20 < bannerHeight) {
            $nav.removeClass('shadow').addClass('no-shadow');
            $banner.removeClass('no-shadow').addClass('shadow');

        } else {
            $nav.removeClass('no-shadow').addClass('shadow');
            $banner.removeClass('shadow').addClass('no-shadow');
        }

        if (scrollTop + 20 >= bannerHeight && scrollTop + 20 < bannerHeight + navbarHeight) {
            $nav.addClass('scrolling');

        } else {
            $nav.removeClass('scrolling');
        }

        if (direction == 'up' && $nav.hasClass('minimized')) {
            $nav.removeClass('slide-out').addClass('slide-in');
        } else if (direction == 'down' && $nav.hasClass('slide-in')) {
            $nav.removeClass('slide-in').addClass('slide-out');
        }


        if (!$nav.hasClass('slide-in') && $nav.hasClass('scrolling')) {
            $nav.css('top', -(scrollTop - bannerHeight + 20));
            $nav.removeClass('minimized').removeClass('visible');
        } else if ($nav.hasClass('shadow')) {
            $nav.css('top', -(navbarHeight));
            $nav.addClass('minimized');
        } else {
            $nav.css('top', 0);
            $nav.addClass('visible');
        }

        lastScrollTop = scrollTop;
    }
})(jQuery.noConflict());