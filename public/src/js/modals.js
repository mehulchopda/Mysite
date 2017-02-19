(function($) {
    "use strict";

    $(document).ready(function() {
        var $body = $('body');

        // appendModal('modal-newsletter');
        // appendModal('modal-contact');

        $('.open-modal').click(function(event) {
            event.preventDefault();
            var classes = $(this).attr('class'),
                modalClass = (classes.match(/(modal-.+)/) || ['form'])[0],
                $currentModalBody = $('.modal.' + modalClass + ' .modal-body');

            if ($currentModalBody.length == 0) {
                $currentModalBody = appendModal(modalClass);
            }

            if (!$('.modal.' + modalClass).hasClass('no-ajax')) {
                getAjaxContent($(this).attr('href'), $currentModalBody, function () {
                    $('.modal.' + modalClass).modal('show');
                });
            } else {
                $('.modal.' + modalClass).modal('show');
            }
        });

        $body.on('click', '.modal a', function(event) {
            event.preventDefault();
            getAjaxContent($(this).attr('href'), $(this).closest('.modal-body'));
        });

        $body.on('submit', '.modal form', function(event) {
            event.preventDefault();
            getAjaxContent($(this).attr('action'), $(this).closest('.modal-body'), null, 'POST', $(this).serialize());
        });
    });

    function getAjaxContent(url, container, callback, method, data) {
        callback = callback || function(){};
        method = method || 'GET';
        data = data || {};

        showSpinner();
        $.ajax({
            type: method,
            url: url,
            data: data,
            success: function(html) {
                var $content = $('<div />').html(html).find('.ajax-wrapper').removeClass('container');

                if ($content.length) {
                    container.html($content);
                    hideSpinner();
                    callback();

                } else {
                    location.href = '/';
                }
            },
            error: function(){
                alert("failure");
            }
        });
    }

    function showSpinner() {
        $('body').append(
            '<div class="spinner-backdrop fade in"></div>' +
            '<div class="spinner-holder fullscreen fade in"><div class="spinner"></div></div>'
        );
    }

    function hideSpinner() {
        var $spinner = $('.spinner-backdrop, .spinner-holder');
        $spinner.removeClass('in');
        $spinner.on('transitionend', function() {
            $(this).remove();
        });
    }


    function appendModal(className) {
        $('body').append(
            '<div class="modal fade '+ className +'" tabindex="-1" role="dialog">' +
            '  <div class="modal-dialog" role="document">' +
            '    <div class="modal-content">' +
            '      <div class="modal-header">' +
            '        <button type="button" class="close iconx-lightbox-close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"></span></button>' +
            '      </div>' +
            '      <div class="modal-body"></div>' +
            '    </div><!-- /.modal-content -->' +
            '  </div><!-- /.modal-dialog -->' +
            '</div><!-- /.modal -->'
        );

        return $('.modal.' + className + ' .modal-body');
    }
}(jQuery));