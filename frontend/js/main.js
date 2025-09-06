
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('bookingForm');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const data = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            from: document.getElementById('from').value,
            to: document.getElementById('to').value,
            datetime: document.getElementById('datetime').value
        };

        try {
            const response = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            document.getElementById('bookingMessage').innerHTML =
                `<div class="alert alert-success">Booking successful! Reference: ${result.id || ''}</div>`;
            form.reset();
        } catch (error) {
            document.getElementById('bookingMessage').innerHTML =
                `<div class="alert alert-danger">Booking failed. Please try again later.</div>`;
        }
    });
});

async function loadReservations() {
    try {
        const response = await fetch('http://localhost:5000/api/bookings');
        const reservations = await response.json();
        const tbody = document.querySelector('#reservationsTable tbody');
        tbody.innerHTML = '';
        if (reservations.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">No reservations found.</td></tr>';
        } else {
            reservations.forEach(r => {
                tbody.innerHTML += `
    <tr>
        
        <td>${r.name || ''}</td>
        <td>${r.email || ''}</td>
        <td>${r.phone || ''}</td>
        <td>${r.from || ''}</td>
        <td>${r.to || ''}</td>
        <td>${r.datetime || ''}</td>
        <td>${r.approvedBy || ''}</td>
        <td>
            <input type="checkbox"
                ${r.approved ? 'checked disabled' : ''}
                onclick="handleApproveClick('${r._id || r.id}', this)">
        </td>
    </tr>
`;
            });
        }
    } catch (error) {
        document.getElementById('dashboardMessage').innerHTML =
            `<div class="alert alert-danger">Failed to load reservations.</div>`;
    }
}
let approveReservationId = null;
window.handleApproveClick = function(id, checkbox) {
    // Only allow checking, not unchecking, and only if not already approved
    if (checkbox.checked && !checkbox.disabled) {
        approveReservationId = id;
        document.getElementById('approvalModal').style.display = 'flex';
    } else {
        // Prevent unchecking or clicking if already approved
        checkbox.checked = true;
    }
};

// Modal button handlers
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('approvalModal');
    const confirmBtn = document.getElementById('approveConfirmBtn');
    const cancelBtn = document.getElementById('approveCancelBtn');

    confirmBtn.onclick = async function () {
        if (approveReservationId) {
            await window.approveReservation(approveReservationId, true);
            modal.style.display = 'none';
            approveReservationId = null;
            loadReservations();
        }
    };
    cancelBtn.onclick = function () {
        modal.style.display = 'none';
        approveReservationId = null;
        loadReservations();
    };
});
window.approveReservation = async function (id, approved) {
    let approvedBy = prompt("Enter your name to approve this reservation:");
    if (!approvedBy) return; // Cancel if no name entered
    try {
        await fetch(`http://localhost:5000/api/bookings/${id}/approve`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ approved, approvedBy })
        });
    } catch (error) {
        alert('Failed to update approval status.');
    }
};

$(document).ready(function () {
    "use strict";

    var window_width = $(window).width(),
        window_height = window.innerHeight,
        header_height = $(".default-header").height(),
        header_height_static = $(".site-header.static").outerHeight(),
        fitscreen = window_height - header_height;

    $(".fullscreen").css("height", window_height)
    $(".fitscreen").css("height", fitscreen);

    //------- Niceselect  js --------//  

    if (document.getElementById("default-select")) {
        $('select').niceSelect();
    };
    if (document.getElementById("default-select2")) {
        $('select').niceSelect();
    };

    //------- Lightbox  js --------//  

    $('.img-gal').magnificPopup({
        type: 'image',
        gallery: {
            enabled: true
        }
    });

    $('.play-btn').magnificPopup({
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false
    });

    //------- Datepicker  js --------//  

    $(function () {
        $("#datepicker").datepicker();
        $("#datepicker2").datepicker();
    });


    //------- Superfist nav menu  js --------//  

    $('.nav-menu').superfish({
        animation: {
            opacity: 'show'
        },
        speed: 400
    });


    if ($(".site-content").hasClass("instagram")) {
        footerIntagram();
    }


    function footerIntagram() {
        var feed = new Instafeed({
            target: "footer-ig-stream",
            get: "user",
            limit: 6,
            resolution: 'standard_resolution',
            userId: 2159114835,
            accessToken: "2159114835.9e667eb.7a37f9b944ea4023b94541c661cbf43d",
            template: '<a href="{{image}}" class="mfp-ig-popup" data-effect="mfp-zoom-in" title="{{title}}"><img src="{{image}}" alt="{{caption}}"></a>',
            after: function () {
                $(".mfp-ig-popup").magnificPopup({
                    type: "image",
                    removalDelay: 500, //delay removal by X to allow out-animation
                    image: {
                        cursor: null
                    },
                    gallery: {
                        enabled: true // set to false to disable gallery
                    },
                    callbacks: {
                        beforeOpen: function () {
                            // just a hack that adds mfp-anim class to markup 
                            this.st.image.markup = this.st.image.markup.replace("mfp-figure", "mfp-figure mfp-with-anim");
                            this.st.mainClass = this.st.el.attr("data-effect");
                        }
                    },
                    midClick: true
                });
            }
        });
        feed.run();
    }


    //------- Mobile Nav  js --------//  

    if ($('#nav-menu-container').length) {
        var $mobile_nav = $('#nav-menu-container').clone().prop({
            id: 'mobile-nav'
        });
        $mobile_nav.find('> ul').attr({
            'class': '',
            'id': ''
        });
        $('body').append($mobile_nav);
        $('body').prepend('<button type="button" id="mobile-nav-toggle"><i class="lnr lnr-menu"></i></button>');
        $('body').append('<div id="mobile-body-overly"></div>');
        $('#mobile-nav').find('.menu-has-children').prepend('<i class="lnr lnr-chevron-down"></i>');

        $(document).on('click', '.menu-has-children i', function (e) {
            $(this).next().toggleClass('menu-item-active');
            $(this).nextAll('ul').eq(0).slideToggle();
            $(this).toggleClass("lnr-chevron-up lnr-chevron-down");
        });

        $(document).on('click', '#mobile-nav-toggle', function (e) {
            $('body').toggleClass('mobile-nav-active');
            $('#mobile-nav-toggle i').toggleClass('lnr-cross lnr-menu');
            $('#mobile-body-overly').toggle();
        });

        $(document).on('click', function (e) {
            var container = $("#mobile-nav, #mobile-nav-toggle");
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                if ($('body').hasClass('mobile-nav-active')) {
                    $('body').removeClass('mobile-nav-active');
                    $('#mobile-nav-toggle i').toggleClass('lnr-cross lnr-menu');
                    $('#mobile-body-overly').fadeOut();
                }
            }
        });
    } else if ($("#mobile-nav, #mobile-nav-toggle").length) {
        $("#mobile-nav, #mobile-nav-toggle").hide();
    }

    //------- Smooth Scroll  js --------//  

    $('.nav-menu a, #mobile-nav a, .scrollto').on('click', function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            if (target.length) {
                var top_space = 0;

                if ($('#header').length) {
                    top_space = $('#header').outerHeight();

                    if (!$('#header').hasClass('header-fixed')) {
                        top_space = top_space;
                    }
                }

                $('html, body').animate({
                    scrollTop: target.offset().top - top_space
                }, 1500, 'easeInOutExpo');

                if ($(this).parents('.nav-menu').length) {
                    $('.nav-menu .menu-active').removeClass('menu-active');
                    $(this).closest('li').addClass('menu-active');
                }

                if ($('body').hasClass('mobile-nav-active')) {
                    $('body').removeClass('mobile-nav-active');
                    $('#mobile-nav-toggle i').toggleClass('lnr-times lnr-bars');
                    $('#mobile-body-overly').fadeOut();
                }
                return false;
            }
        }
    });

    $(document).ready(function () {

        $('html, body').hide();

        if (window.location.hash) {

            setTimeout(function () {

                $('html, body').scrollTop(0).show();

                $('html, body').animate({

                    scrollTop: $(window.location.hash).offset().top - 108

                }, 1000)

            }, 0);

        } else {

            $('html, body').show();

        }

    });

    //------- Header Scroll Class  js --------//  

    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('#header').addClass('header-scrolled');
        } else {
            $('#header').removeClass('header-scrolled');
        }
    });

    //------- Google Map  js --------//  

    if (document.getElementById("map")) {
        google.maps.event.addDomListener(window, 'load', init);

        function init() {
            var mapOptions = {
                zoom: 11,
                center: new google.maps.LatLng(40.6700, -73.9400), // New York
                styles: [{
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [{
                        "color": "#e9e9e9"
                    }, {
                        "lightness": 17
                    }]
                }, {
                    "featureType": "landscape",
                    "elementType": "geometry",
                    "stylers": [{
                        "color": "#f5f5f5"
                    }, {
                        "lightness": 20
                    }]
                }, {
                    "featureType": "road.highway",
                    "elementType": "geometry.fill",
                    "stylers": [{
                        "color": "#ffffff"
                    }, {
                        "lightness": 17
                    }]
                }, {
                    "featureType": "road.highway",
                    "elementType": "geometry.stroke",
                    "stylers": [{
                        "color": "#ffffff"
                    }, {
                        "lightness": 29
                    }, {
                        "weight": 0.2
                    }]
                }, {
                    "featureType": "road.arterial",
                    "elementType": "geometry",
                    "stylers": [{
                        "color": "#ffffff"
                    }, {
                        "lightness": 18
                    }]
                }, {
                    "featureType": "road.local",
                    "elementType": "geometry",
                    "stylers": [{
                        "color": "#ffffff"
                    }, {
                        "lightness": 16
                    }]
                }, {
                    "featureType": "poi",
                    "elementType": "geometry",
                    "stylers": [{
                        "color": "#f5f5f5"
                    }, {
                        "lightness": 21
                    }]
                }, {
                    "featureType": "poi.park",
                    "elementType": "geometry",
                    "stylers": [{
                        "color": "#dedede"
                    }, {
                        "lightness": 21
                    }]
                }, {
                    "elementType": "labels.text.stroke",
                    "stylers": [{
                        "visibility": "on"
                    }, {
                        "color": "#ffffff"
                    }, {
                        "lightness": 16
                    }]
                }, {
                    "elementType": "labels.text.fill",
                    "stylers": [{
                        "saturation": 36
                    }, {
                        "color": "#333333"
                    }, {
                        "lightness": 40
                    }]
                }, {
                    "elementType": "labels.icon",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "transit",
                    "elementType": "geometry",
                    "stylers": [{
                        "color": "#f2f2f2"
                    }, {
                        "lightness": 19
                    }]
                }, {
                    "featureType": "administrative",
                    "elementType": "geometry.fill",
                    "stylers": [{
                        "color": "#fefefe"
                    }, {
                        "lightness": 20
                    }]
                }, {
                    "featureType": "administrative",
                    "elementType": "geometry.stroke",
                    "stylers": [{
                        "color": "#fefefe"
                    }, {
                        "lightness": 17
                    }, {
                        "weight": 1.2
                    }]
                }]
            };
            var mapElement = document.getElementById('map');
            var map = new google.maps.Map(mapElement, mapOptions);
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(40.6700, -73.9400),
                map: map,
                title: 'Snazzy!'
            });
        }
    }

    //------- Mailchimp js --------//  

    $(document).ready(function () {
        $('#mc_embed_signup').find('form').ajaxChimp();
    });

});

