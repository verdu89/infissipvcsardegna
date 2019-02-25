jQuery(document).ready(function( $ ) {

  // Header fixed and Back to top button
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
      $('#header').addClass('header-fixed');
    } else {
      $('.back-to-top').fadeOut('slow');
      $('#header').removeClass('header-fixed');
    }
  });
  $('.back-to-top').click(function(){
    $('html, body').animate({scrollTop : 0},1500, 'easeInOutExpo');
    return false;

  });

  // Initiate the wowjs
  new WOW().init();

  // Initiate superfish on nav menu
  $('.nav-menu').superfish({
    animation: {opacity:'show'},
    speed: 400
  });

  // Mobile Navigation
  if( $('#nav-menu-container').length ) {
    var $mobile_nav = $('#nav-menu-container').clone().prop({ id: 'mobile-nav'});
    $mobile_nav.find('> ul').attr({ 'class' : '', 'id' : '' });
    $('body').append( $mobile_nav );
    $('body').prepend( '<button type="button" id="mobile-nav-toggle"><i class="fa fa-bars"></i></button>' );
    $('body').append( '<div id="mobile-body-overly"></div>' );
    $('#mobile-nav').find('.menu-has-children').prepend('<i class="fa fa-chevron-down"></i>');

    $(document).on('click', '.menu-has-children i', function(e){
      $(this).next().toggleClass('menu-item-active');
      $(this).nextAll('ul').eq(0).slideToggle();
      $(this).toggleClass("fa-chevron-up fa-chevron-down");
    });

    $(document).on('click', '#mobile-nav-toggle', function(e){
      $('body').toggleClass('mobile-nav-active');
      $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
      $('#mobile-body-overly').toggle();
    });

    $(document).click(function (e) {
      var container = $("#mobile-nav, #mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
       if ( $('body').hasClass('mobile-nav-active') ) {
          $('body').removeClass('mobile-nav-active');
          $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('#mobile-body-overly').fadeOut();
        }
      }
    });
  } else if ( $("#mobile-nav, #mobile-nav-toggle").length ) {
    $("#mobile-nav, #mobile-nav-toggle").hide();
  }

  // Smoth scroll on page hash links
  $('a[href*="#"]:not([href="#"])').on('click', function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {

      var target = $(this.hash);
      if (target.length) {
        var top_space = 0;

        if( $('#header').length ) {
          top_space = $('#header').outerHeight();

          if( ! $('#header').hasClass('header-fixed') ) {
            top_space = top_space - 20;
          }
        }

        $('html, body').animate({
          scrollTop: target.offset().top - top_space
        }, 1500, 'easeInOutExpo');

        if ( $(this).parents('.nav-menu').length ) {
          $('.nav-menu .menu-active').removeClass('menu-active');
          $(this).closest('li').addClass('menu-active');
        }

        if ( $('body').hasClass('mobile-nav-active') ) {
          $('body').removeClass('mobile-nav-active');
          $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('#mobile-body-overly').fadeOut();
        }
        return false;
      }
    }
  });

  // Porfolio filter
  // $("#portfolio-flters li").click ( function() {
  //   $("#portfolio-flters li").removeClass('filter-active');
  //   $(this).addClass('filter-active');

  //   var selectedFilter = $(this).data("filter");
  //   $("#portfolio-wrapper").fadeTo(100, 0);

  //   $(".portfolio-item").fadeOut().css('transform', 'scale(0)');

  //   setTimeout(function() {
  //     $(selectedFilter).fadeIn(100).css('transform', 'scale(1)');
  //     $("#portfolio-wrapper").fadeTo(300, 1);
  //   }, 300);
  // });

var portfolioIsotope = $('.portfolio-container').isotope({
    itemSelector: '.portfolio-item',
    layoutMode: 'fitRows'
  });

  $('#portfolio-flters li').on( 'click', function() {
    $("#portfolio-flters li").removeClass('filter-active');
    $(this).addClass('filter-active');

    portfolioIsotope.isotope({ filter: $(this).data('filter') });
  });

  // Clients carousel (uses the Owl Carousel library)
  $(".clients-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    responsive: { 0: { items: 2 }, 768: { items: 4 }, 900: { items: 6 }
    }
  });


  // jQuery counterUp
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 1000
  });


  // For use with dynamic Google maps
  if ($('#google-map').length) {
    var get_latitude = $('#google-map').data('latitude');
    var get_longitude = $('#google-map').data('longitude');

    function initialize_google_map() {
      var myLatlng = new google.maps.LatLng(get_latitude, get_longitude);
      var mapOptions = {
        zoom: 14,
        scrollwheel: false,
        center: myLatlng
      };
      var map = new google.maps.Map(document.getElementById('google-map'), mapOptions);
      var marker = new google.maps.Marker({
        position: myLatlng,
        map: map
      });
    }
    google.maps.event.addDomListener(window, 'load', initialize_google_map);
  }

// custom code

//Contact
  $('form.contactForm').submit(function() {

    var f = $(this).find('.form-group'),
      ferror = false,
      emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;

    f.children('input').each(function() { // run all inputs

      var i = $(this); // current input
      var rule = i.attr('data-rule');

      if (rule !== undefined) {
        var ierror = false; // error flag for current input
        var pos = rule.indexOf(':', 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case 'required':
            if (i.val() === '') {
              ferror = ierror = true;
            }
            break;

          case 'minlen':
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;

          case 'email':
            if (!emailExp.test(i.val())) {
              ferror = ierror = true;
            }
            break;

          case 'checked':
            if (! i.is(':checked')) {
              ferror = ierror = true;
            }
            break;

          case 'regexp':
            exp = new RegExp(exp);
            if (!exp.test(i.val())) {
              ferror = ierror = true;
            }
            break;



        }
        i.next('.validation').html((ierror ? (i.attr('data-msg') !== undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
      }
    });
    f.children('textarea').each(function() { // run all inputs

      var i = $(this); // current input
      var rule = i.attr('data-rule');

      if (rule !== undefined) {
        var ierror = false; // error flag for current input
        var pos = rule.indexOf(':', 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case 'required':
            if (i.val() === '') {
              ferror = ierror = true;
            }
            break;

          case 'minlen':
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;
        }
        i.next('.validation').html((ierror ? (i.attr('data-msg') != undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
      }
    });
    f.children('div').each(function() { // run all inputs

      var i = $(this); // current input
      var rule = i.attr('data-rule');

      if (rule !== undefined) {
        var ierror = false; // error flag for current input
        var pos = rule.indexOf(':', 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case 'captcha':
            if (grecaptcha && grecaptcha.getResponse().length == 0) {


              ferror = ierror = true;
            }
            break;

          case 'minlen':
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;
        }
        i.next('.validation').html((ierror ? (i.attr('data-msg') != undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
      }

    });
    if (ferror) return false;
    else var str = $(this).serialize();
    $.ajax({
      type: "POST",
      url: "https://script.google.com/macros/s/AKfycbz-XnpWOP1-v2cosUGetAKXOghnP0EocCVQXy-7zA/exec",

      data: str,
      error: function(data) {
         alert('messaggio inviato');

          $("#sendmessage").addClass("show");
          $("#errormessage").removeClass("show");
          $('#allegaButton').removeClass('hide');
          $('#textAllega').addClass('hide');


      },
      success: function(data){
        alert('messaggio inviato');


          $("#sendmessage").addClass("show");
          $("#errormessage").removeClass("show");
          $('#allegaButton').removeClass('hide');
          $('#textAllega').addClass('hide');


      }
    });
    $('.contactForm').find("input, textarea").val("");
    return false;
  });



  var options = {
    title: '&#x1F36A; Accetti i Cookies & le Privacy Policy?',
    message: 'Per poter gestire al meglio la tua navigazione su questo sito verranno temporaneamente memorizzate' +
        ' alcune informazioni in piccoli file di testo denominati cookie. È molto importante che tu sia informato e che accetti la politica sulla privacy e sui cookie di questo sito Web. Per ulteriori informazioni, leggi la nostra politica sulla privacy e sui cookie.',
    delay: 600,
    expires: 1,
    link: 'cookiepolicy.html',
    onAccept: function(){
      var myPreferences = $.fn.ihavecookies.cookie();
      console.log('Yay! The following preferences were saved...');
      console.log(myPreferences);
    },
    uncheckBoxes: true,
    acceptBtnLabel: 'Accetta i Cookies',
    moreInfoLabel: 'More information',
    cookieTypesTitle: 'Select which cookies you want to accept',
    fixedCookieTypeLabel: 'Essential',
    fixedCookieTypeDesc: 'These are essential for the website to work correctly.'
  }



  $('body').ihavecookies(options);

  if ($.fn.ihavecookies.preference('marketing') === true) {
    console.log('This should run because marketing is accepted.');
  }

  $('#ihavecookiesBtn').on('click', function(){
    $('body').ihavecookies(options, 'reinit');
  });


});





$('#allegaButton').click(function(){
  window.open('https://script.google.com/macros/s/AKfycbyx2lFsAoAi9GfGsN1WvtWlz_PJYtGe3mwBM17_roF8rHw5CZ0/exec');
  $('#allegaButton').addClass('hide');

  });

$('#konfiguratorLink').click(function () {

  window.open('http://konfigurator.aluplast.net');

});








/*!
 * ihavecookies - jQuery plugin for displaying cookie/privacy message
 * v0.3.2
 *
 * Copyright (c) 2018 Ketan Mistry (https://iamketan.com.au)
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */
(function($) {

  /*
  |--------------------------------------------------------------------------
  | Cookie Message
  |--------------------------------------------------------------------------
  |
  | Displays the cookie message on first visit or 30 days after their
  | last visit.
  |
  | @param event - 'reinit' to reopen the cookie message
  |
  */
  $.fn.ihavecookies = function(options, event) {

    var $element = $(this);

    // Set defaults
    var settings = $.extend({
      cookieTypes: [
        {
          type: 'Site Preferences',
          value: 'preferences',
          description: 'These are cookies that are related to your site preferences, e.g. remembering your username, site colours, etc.'
        },
        {
          type: 'Analytics',
          value: 'analytics',
          description: 'Cookies related to site visits, browser types, etc.'
        },
        {
          type: 'Marketing',
          value: 'marketing',
          description: 'Cookies related to marketing, e.g. newsletters, social media, etc'
        }
      ],
      title: 'Cookies & Privacy',
      message: 'Cookies enable you to use shopping carts and to personalize your experience on our sites, tell us which parts of our websites people have visited, help us measure the effectiveness of ads and web searches, and give us insights into user behavior so we can improve our communications and products.',
      link: '/privacy-policy',
      delay: 2000,
      expires: 30,
      moreInfoLabel: 'More information',
      acceptBtnLabel: 'Accept Cookies',
      advancedBtnLabel: 'Customise Cookies',
      cookieTypesTitle: 'Select cookies to accept',
      fixedCookieTypeLabel:'Necessary',
      fixedCookieTypeDesc: 'These are cookies that are essential for the website to work correctly.',
      onAccept: function(){},
      uncheckBoxes: false
    }, options);

    var myCookie = getCookie('cookieControl');
    var myCookiePrefs = getCookie('cookieControlPrefs');
    if (!myCookie || !myCookiePrefs || event == 'reinit') {
      // Remove all instances of the cookie message so it's not duplicated
      $('#gdpr-cookie-message').remove();

      // Set the 'necessary' cookie type checkbox which can not be unchecked
      var cookieTypes = '<li><input type="checkbox" name="gdpr[]" value="necessary" checked="checked" disabled="disabled"> <label title="' + settings.fixedCookieTypeDesc + '">' + settings.fixedCookieTypeLabel + '</label></li>';

      // Generate list of cookie type checkboxes
      preferences = JSON.parse(myCookiePrefs);
      $.each(settings.cookieTypes, function(index, field) {
        if (field.type !== '' && field.value !== '') {
          var cookieTypeDescription = '';
          if (field.description !== false) {
            cookieTypeDescription = ' title="' + field.description + '"';
          }
          cookieTypes += '<li><input type="checkbox" id="gdpr-cookietype-' + field.value + '" name="gdpr[]" value="' + field.value + '" data-auto="on"> <label for="gdpr-cookietype-' + field.value + '"' + cookieTypeDescription + '>' + field.type + '</label></li>';
        }
      });

      // Display cookie message on page
      var cookieMessage = '<div id="gdpr-cookie-message"><h4>' + settings.title + '</h4><p>' + settings.message + ' <a href="' + settings.link + '">' + settings.moreInfoLabel + '</a><div id="gdpr-cookie-types" style="display:none;"><h5>' + settings.cookieTypesTitle + '</h5><ul>' + cookieTypes + '</ul></div><p><button id="gdpr-cookie-accept" type="button">' + settings.acceptBtnLabel + '</button></p></div>';
      setTimeout(function(){
        $($element).append(cookieMessage);
        $('#gdpr-cookie-message').hide().fadeIn('slow', function(){
          // If reinit'ing, open the advanced section of message
          // and re-check all previously selected options.
          if (event == 'reinit') {
            $('#gdpr-cookie-advanced').trigger('click');
            $.each(preferences, function(index, field) {
              $('input#gdpr-cookietype-' + field).prop('checked', true);
            });
          }
        });
      }, settings.delay);

      // When accept button is clicked drop cookie
      $('body').on('click','#gdpr-cookie-accept', function(){
        // Set cookie
        dropCookie(true, settings.expires);

        // If 'data-auto' is set to ON, tick all checkboxes because
        // the user hasn't clicked the customise cookies button
        $('input[name="gdpr[]"][data-auto="on"]').prop('checked', true);

        // Save users cookie preferences (in a cookie!)
        var prefs = [];
        $.each($('input[name="gdpr[]"]').serializeArray(), function(i, field){
          prefs.push(field.value);
        });
        setCookie('cookieControlPrefs', JSON.stringify(prefs), 365);

        // Run callback function
        settings.onAccept.call(this);
      });

      // Toggle advanced cookie options
      $('body').on('click', '#gdpr-cookie-advanced', function(){
        // Uncheck all checkboxes except for the disabled 'necessary'
        // one and set 'data-auto' to OFF for all. The user can now
        // select the cookies they want to accept.
        $('input[name="gdpr[]"]:not(:disabled)').attr('data-auto', 'off').prop('checked', false);
        $('#gdpr-cookie-types').slideDown('fast', function(){
          $('#gdpr-cookie-advanced').prop('disabled', true);
        });
      });

    } else {
      var cookieVal = true;
      if (myCookie == 'false') {
        cookieVal = false;
      }
      dropCookie(cookieVal, settings.expires);
    }

    // Uncheck any checkboxes on page load
    if (settings.uncheckBoxes === true) {
      $('input[type="checkbox"].ihavecookies').prop('checked', false);
    }

  };

  // Method to get cookie value
  $.fn.ihavecookies.cookie = function() {
    var preferences = getCookie('cookieControlPrefs');
    return JSON.parse(preferences);
  };

  // Method to check if user cookie preference exists
  $.fn.ihavecookies.preference = function(cookieTypeValue) {
    var control = getCookie('cookieControl');
    var preferences = getCookie('cookieControlPrefs');
    preferences = JSON.parse(preferences);
    if (control === false) {
      return false;
    }
    if (preferences === false || preferences.indexOf(cookieTypeValue) === -1) {
      return false;
    }
    return true;
  };

  /*
  |--------------------------------------------------------------------------
  | Drop Cookie
  |--------------------------------------------------------------------------
  |
  | Function to drop the cookie with a boolean value of true.
  |
  */
  var dropCookie = function(value, expiryDays) {
    setCookie('cookieControl', value, expiryDays);
    $('#gdpr-cookie-message').fadeOut('fast', function() {
      $(this).remove();
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Set Cookie
  |--------------------------------------------------------------------------
  |
  | Sets cookie with 'name' and value of 'value' for 'expiry_days'.
  |
  */
  var setCookie = function(name, value, expiry_days) {
    var d = new Date();
    d.setTime(d.getTime() + (expiry_days*24*60*60*1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
    return getCookie(name);
  };

  /*
  |--------------------------------------------------------------------------
  | Get Cookie
  |--------------------------------------------------------------------------
  |
  | Gets cookie called 'name'.
  |
  */
  var getCookie = function(name) {
    var cookie_name = name + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(cookie_name) === 0) {
        return c.substring(cookie_name.length, c.length);
      }
    }
    return false;
  };

}(jQuery));