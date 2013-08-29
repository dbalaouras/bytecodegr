/*
 
 00. Functions
 01. Smooth Scroll ( ScrollTo )
 02. Navigation - Selected and sticky Navigation
 03. Flex Slider
 04. Fancybox
 */

// declare some global scope vars we use below
var $, window, document;


/* -- 00. Form submit -- */
var show_contact_form_alert = function(message, error) {
    "use strict";

    var  alert_cont = $('#contact_alert_container'),
        contact_alert = $('#contact_alert');

    if (error === true) {
        alert_cont.attr('class', 'alert alert-error').slideDown('normal');
    } else {
        alert_cont.attr('class', 'alert alert-success').slideDown('normal');
    }

    contact_alert.html(message);
};

var submit_contact_form = function() {
    "use strict";

    var name = $('#contact_name'),
        email = $('#contact_email'),
        message = $('#contact_message'),
        loader = $('#contact_loader'),
        name_val = name.val(),
        email_val = email.val(),
        message_val = message.val(),
        data = { name: name_val, email: email_val, message : message_val };

    if (name_val && email_val && message_val) {


        loader.addClass('icon-spin icon-spinner');

        $.post('ajax/send_msg', data, function(data) {

            if (data.status !== 0) { // got a problem

                // set proper class and show
                show_contact_form_alert(data.message, true);

            } else { // all went fine

                // set proper class and show
                show_contact_form_alert(data.message, false);

                // clear the message text area
                message.val('');
            }

            // hide the spinner
            loader.removeClass('icon-spin icon-spinner');

        }).error(function() {
            // show a generic error
            show_contact_form_alert("Your message could not be sent due to a <strong>cosmic collision</strong>" +
                " that takes place at the moment near the <strong>Milky Way</strong>!", true);

            // hide the spinner
            loader.removeClass('icon-spin icon-spinner');
        });

    } else {

        // some details are missing; show an error
        show_contact_form_alert("Please fill in all the details.", true);

        // hide the spinner
        loader.removeClass('iicon-spin icon-spinner');
    }
    return false;
};

/* -- 01. SCROLL TO  -- */


$('ul.nav a, #down_button a').click(function(e) {
    "use strict";
    $('html,body').scrollTo(this.hash, this.hash);
    e.preventDefault();
});

/* -- 02. NAVBAR STICKY + SELECTED  -- */

$(function() {
    "use strict";
    // Do our DOM lookups beforehand
    var nav_container = $(".navbar-wrapper"), nav = $(".navbar"), top_spacing = 0, waypoint_offset = -60,
        sections = $("section"), navigation_links = $("ul.nav a");

    nav_container.waypoint({
        handler: function(event, direction) {
            if (direction === 'down') {

                nav_container.css({'height': nav.outerHeight()});
                nav.stop().addClass("navbar-fixed-top").css("top", -nav.outerHeight()).animate({"top": top_spacing});

            } else {

                nav_container.css({'height': 'auto'});
                nav.stop().removeClass("navbar-fixed-top").css("top", nav.outerHeight() + waypoint_offset).animate({"top": ""});

            }

        },
        offset: function() {
            return -nav.outerHeight() - waypoint_offset;
        }
    });

    sections.waypoint({
        handler: function(event, direction) {

            var active_section = $(this),
                active_link = $('ul.nav a[href="#' + active_section.attr("id") + '"]');
            if (direction === "up") {
                active_section = active_section.prev();
            }

            navigation_links.removeClass("selected");
            active_link.addClass("selected");
        },
        offset: '25%'
    });
});

/* -- 03.  FLEX SLIDER -- */
$(window).load(function() {
    "use strict";
    $('.flexslider').flexslider({
        animation: "fade",
        controlNav: false,
        directionNav: false,
        slideshowSpeed: 3000
    });
});


/* -- 04. FANCYBOX -- */
$(document).ready(function() {
    "use strict";
    $(".fancybox-media").fancybox({
        arrows: true,
        padding: 0,
        closeBtn: true,
        openEffect: 'fade',
        closeEffect: 'fade',
        prevEffect: 'fade',
        nextEffect: 'fade',
        helpers: {
            media: {},
            overlay: {
                locked: false
            },
            buttons: false,
            title: {
                type: 'inside'
            }
        },
        beforeLoad: function() {
            var el, id = $(this.element).data('title-id');
            if (id) {
                el = $('#' + id);
                if (el.length) {
                    this.title = el.html();
                }
            }
        }
    });

    // bind a click action
    $('#contact_submit').click(function() {

        submit_contact_form();
        return false;
    });

    $('#close_contact_msg').click(function() {

        $('#contact_alert_container').slideUp();
        return false;

    });

});
