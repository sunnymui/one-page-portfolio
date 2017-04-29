///////////////
// FUNCTIONS //
///////////////

// Utility Functions

String.prototype.replaceAll = function(search, replace) {
    /*
    Extends the builtin string replace method with a replace all method.
    This will replace every occurence of a matched string.
    Args: search(string) is what youre looking for, replace(string) is
    what to replace it with
    return: string with the matched words replaced
    */
    if (replace === undefined) {
        return this.toString();
    }
    return this.split(search).join(replace);
};

function html(target) {
    /*
    Wrapper function object for allowing some chainable functions on passed in html.
    Args: target of the function, which typically would be an html string
    Returns: this, which would be the returned modified html in and object from the subfunctions
    */
    if (!(this instanceof html)) {
        return new html(target);
    }

    // initialize an html key with the value of the passed in target html
    this.html = target;

    // return itself as an object to allow chaining
    return this;
}

html.prototype.format = function(raw_data, placeholder, optional) {
    /*
    Takes raw data and inserts that data into a preformatted html string,
     replacing a placeholder with the actual data.
     Chainable function within the html function made by returning this.
     Placeholder string that the function looks for is set in the var.
     ex. <p>%data%</p> => <p>Hello</p>
     Args: the formatted html (string), the raw data to insert into that html (string/numbers)
     Return: the formatted html string with placeholder replaced by that data (string)
    */
    // default is that this isn't an optional part of the html
    optional = default_for(optional, false);
    // the default placeholder string to look for in the html
    placeholder = default_for(placeholder, '%data%');

    // check if this is an optional block/this key's value in the data is empty
    // if so then remove relevant html from the string since it's optional
    if (optional === true) {

        // placeholder text marking an optional block of text
        var optional_tag = '%?optional%';

        // if there's no data in the specified key run the regex to get the whole block
        if (raw_data.length === 0) {
            // regular expression to match anything enclosed in the optional tags
            // and containing the placeholder for the data we're looking at
            var optional_regex = new RegExp('%\\?optional%.*' + placeholder + '.*%\\?optional%', 'g');
            // remove the matched substrings enclosed by optional tags
            this.html = this.html.replaceAll(optional_regex, '');
        } else {
            // if there is data in the specified key, just remove the optional text placeholders
            this.html = this.html.replaceAll(optional_tag, '');
        }
    }

    // check the html for occurences of the placeholder and replace with provided data
    // set this.html to the result of the function so it can be returned
    this.html = this.html.replaceAll(placeholder, raw_data);

    // return the results as an object to allow chaining
    // when using this function, put .html at the end to get the value of the html
    return this;
};

html.prototype.wrap = function(data, placeholder, wrapper) {
    /*
    Checks the data to see if it has something, if so then it'll add a wrapper
    to the passed in html template where marked by the placeholders. Useful for links where
    they something might not have link data, but others items do--like an offline business
    in a list of work experience.
    So calling on <div>%?wrap%<p></p>%?wrap%</div>, if the data has something it'll add
    the wrapping code <div><wrapper><p></p></wrapper></div>
    otherwise itll just delete the placeholders.
    Args: data is the data field to check if it contains info(string),
          placeholder is where the wrapper will be inserted (string),
          wrapper is the wrapper html which will be split into opening and
          closing parts at the %data% placeholder
    Returns: formatted html string with placeholders replaced by wrapper. (string)
    */
    // check if data has been entered
    if (data.length !== 0) {
        // split html at the wrapper placeholders
        var split_html = this.html.split(placeholder);
        // split the wrapper at the %data% placeholder
        var split_wrapper = wrapper.split('%data%');

        // concatenate back together with the wrapper pieces where the placeholders were
        this.html = split_html[0] +
            split_wrapper[0] +
            split_html[1] +
            split_wrapper[1] +
            split_html[2];

    } else {
        // if no data just remove the placeholder text
        this.html = this.html.replaceAll(placeholder, '');
    }

    // to allow chaining return this object
    return this;
};

function first_letters(string) {
    /*
    Takes in a string and returns the first 2 letters of that string.
    Cuts out any white space before or after the string, so only gets actual letters.
    ex. for the string 'hello', the return will be 'he'
    Args: the word you want the first 2 letters of (string)
    Return: the first 2 letters (string)
    */
    // trim out white space from beginning and end
    var trimmed = string.trim();
    // get a slice of the string form beginning to 2nd character
    return trimmed.slice(0, 2);
}

function default_for(argument, value) {
    /*
    Sets a default argument for a function if specified argument is undefined.
    Args: argument in the function you're checking/setting default for, value of the default argument
    Return: undefined argument - default value, otherwise the user defined argument value
    */
    // checks if argument is undefined
    // ? : are conditional ternary operators meaning:
    // condition ?  value if true : value if false
    return typeof argument !== 'undefined' ? argument : value;
}

function features(target) {
    /*

    Features functions enable additional functionality of some sort.
    Wrapper function for encapsulation of features functions.

    Args: target (string or jquery dom selector) - target element for a specific feature function

    */

    if (!(this instanceof features)) {
        return new features(target);
    }

    this.read_more = function(truncated_element, truncator_class) {
        /*
        Enables show/hide function in conjunction with a css class that shows/hides content.
        Searches for buttons that trigger show/hide behavior, then finds the content
        linked to that button and toggles the truncation class to show/hide content when clicked.
        Also changes the button text to either more or less to reflect the toggle action.
        Ex: <div class="description truncate">Some content</div>
            <a class="read-more" href="#">+ More</a>
            becomes:
            <div class="description">Some content</div>
            <a class="read-more" href="#">+ Less</a>
        Args: target (passed in outer features() scope) - the selector for
        the see more button that will trigger show/hide on click (),
        selector for the element that is currently being truncated by a css class (string),
        the class name to remove or add when the button is clicked, without the '.' (string)
        Returns: none
        */

        // the text for the button to switch between
        var more_text = '+ More';
        var less_text = '- Less';

        // when the button is clicked find the content, toggle class, and change button text
        $(target).click(function(e) {

            // cache the current button triggering the event
            var $this = $(this);
            // get the content element that's specifically related to the button pressed
            var current_content = $this.siblings(truncated_element);
            // toggle the truncation class
            $(current_content).toggleClass(truncator_class);

            // trim spaces to ensure consistent matches for the button text
            var button_text = $this.text().trim();
            // if button text says more, change to 'less', else change it to 'more'
            if (button_text == more_text) {
                $this.text(less_text);
            } else {
                $this.text(more_text);
            }

            // prevent default <a> behavior of jumping to top of page when clicking # links
            e.preventDefault();
        });
    };

    this.to_top = function() {
        /*
        Filters anchor elements by links pointing to #top then scrolls the window to
        the top of the document when an anchor is clicked with a smooth animation.
        Needs a jquery selector for the page (html, body) to scroll.
        Args: target (passed in outer features() scope) - the selector for the button
        that will trigger the jump to the top of the page
        Return: none
        */

        // animate scroll when to top button is clicked

        // when a to-top button is clicked,
        $(target).click(function(e) {
            // scroll the page to the top and animate the movement
            $page.animate({
                scrollTop: 0
            }, 'medium');
            // prevent default of clicking a link jumping to that location
            e.preventDefault();
        });
    };

    this.sticky_nav = function(fixed_class, nav_distance_from_top) {
        /*
        Makes header nav sticky when top of the window scrolls to the nav element's position.
        Requires a jquery cached selector for window.
        Args: target (passed in to outer features() scope) - the nav element to stickify,
        fixed_class (string) - the css class to apply to make the nav fixed position,
        nav_distance_from_top (numebr)- the pixel distance of the nav from the top of the page
        Return: none
        */

        // every scroll event check if current distance to top of the page is
        // greater than or equal to distance of the nav to the top
        if ($window.scrollTop() >= nav_distance_from_top) {
            // if distance is greater then we're below the nav position and if
            // equal the nav is right at the top of the page and should be stickied
            // so add the fixed class
            $(target).addClass(fixed_class);
        } else {
            // remove the stickying if we're scrolled above the nav's position
            $(target).removeClass(fixed_class);
        }

    };

    this.animate_visible = function(animation_class) {
        /*
        Animates items with the animated element class when visible in the window.
        Depends on the .visible jquery function mini plugin.
        Args: target (passed into outer features() scope) - the selected element(s) to load animations on
        animation_class - the css class applied to create the css animation
        Return: none
        */

        // loop through animated elements checking if theyre visible
        $(target).each(function(i, el) {
            // current elements
            var element = $(el);
            // check if they are visible
            if (element.visible(true)) {
                // add animation class if they are visible
                element.addClass(animation_class);
            }
        });

    };

    this.animate_nav_jump = function(nav_height) {
        /*
        Bind click handler to menu items so we can get a fancy scroll animation.
        Requires a cached jquery selector for the page.

        Args: target(passed in as arg via outer features() scope) - the nav link elements,
        nav_height(number) - pixel height of nav bar area to account for when scrolling to section
        Return: none
        */

        $(target).click(function(e) {
            // get the anchor link href
            var href = $(this).attr("href");
            // set offset equal to href then check if its a '#', if so set offset to 0
            // otherwise set it equal to the offset amount of the clicked anchor - nav height
            var offsetTop = href === "#" ? 0 : $(href).offset().top - nav_height + 1;
            // animate the scroll jump to the anchor location
            $page.stop().animate({
                scrollTop: offsetTop
            }, 300);
            // stop default behavior link jump
            e.preventDefault();
        });
    };

}

// Plugin Functions

(function($) {

    /**
     * Copyright 2012, Digital Fusion
     * Licensed under the MIT license.
     * http://teamdf.com/jquery-plugins/license/
     *
     * @author Sam Sehnert
     * @desc A small plugin that checks whether elements are within
     *     the user visible viewport of a web browser.
     *     only accounts for vertical position, not horizontal.
     */

    $.fn.visible = function(partial) {

        var $t = $(this),
            $w = $(window),
            viewTop = $w.scrollTop(),
            viewBottom = viewTop + $w.height(),
            _top = $t.offset().top,
            _bottom = _top + $t.height(),
            compareTop = partial === true ? _bottom : _top,
            compareBottom = partial === true ? _top : _bottom;

        return ((compareBottom <= viewBottom) && (compareTop >= viewTop));

    };

})(jQuery);

function scrollspy(nav_link) {
    /*
    Minimal Scrollspy plugin
    https://jsfiddle.net/mekwall/up4nu/
    Modified and broken up into multiple encapsulated functions to make it so
    I can use one scroll listener for all my functions.
    Modified add/hide class behavior due to dom structure.
    */

    // return an instance of the object without needing the new keyword syntax
    if (!(this instanceof scrollspy)) {
        return new scrollspy(nav_link);
    }

    this.nav_item_map = function() {
        /*
        Creates an array of each nav anchor element using the map function.
        Used for the scrollspy highlighting function.
        Args: target(passed in via outer scroll spy function) - the nav anchor elements
        to create the mapped array with
        Return: a mapped array of each nav anchor element in the nav menu
        */

        return $(nav_link).map(function() {
            // gets the href for each nav link
            var item = $($(this).attr("href"));
            // return an item if it has an href
            if (item.length) {
                return item;
            }
        });
    };

    this.highlight = function(active_class, nav_item_map, nav_height) {
        /*
        Add active class to the nav item in the menu linked to the respective onpage
        anchor when the user has scrolled past or in it's respective section.
        Requires a cached jquery window selector.
        Args: target(passed in via outer scrollspy() scope) - the nav menu link elements
        nav_item_map(array) - the mapped array for the nav menu items,
        active_class(string) - css class to apply to nav menu items when active,
        nav_height(number) - height of the nav menu,
        */

        // initialize var for id storage
        var lastId;
        // Get container scroll position
        var fromTop = $window.scrollTop() + nav_height;

        // Get id of current scroll item
        var cur = nav_item_map.map(function() {
            // if the vertical position of the current item is less than the scrollbar position
            // return this item as the current
            if ($(this).offset().top < fromTop)
                return this;
        });

        // Get the id of the current element
        cur = cur[cur.length - 1];
        var id = cur && cur.length ? cur[0].id : "";

        if (lastId !== id) {
            lastId = id;
            // note: this section modified to make it work in a non ul-li-a structure
            var current_nav_link = 'nav a[href="#' + id + '"]';
            // clear any active classes on the nav links
            $(nav_link).removeClass(active_class);
            // add an active class to the current link corresponding to the section
            $(current_nav_link).addClass(active_class);
        }

    };

}

var $window = $(window);

// CSS Classes
var truncate_class = 'truncate lighter-gray';
var fixed_class = 'fixed-wrapper no-margin';
// class to add when element is visible
var fade_animate_class = 'fadeInDown';
var active_nav_class = 'active';

// DOM Selectors
var $nav = $('nav');
var $nav_link = $('nav a');
var description = '.description';
var $read_more_btn = $('.read-more');
// filter anchors in document linking to the top anchor
var $top_btn = $('a[href="#top"]');
// get element(s) with this class for animating
var $animated_element = $('.animated');
var $page = $('html, body');

// calculate height of the nav element
var nav_height = $nav.outerHeight() + 15;
// smooth animated nav link on page jumps
features($nav_link).animate_nav_jump(nav_height);
// smooth animated to top button jumping to top of the page
features($top_btn).to_top();

// Scroll Function Vars

// get the distance of the nav from the top of the window for sticky nav function
var nav_distance_from_top = $nav.offset().top;
// correct the nav distance to top of page if window is resized
$window.resize(function() {
    nav_distance_from_top = $nav.offset().top;
});
// mapped array of nav menu anchors for scrollspy plugin use
// var nav_map = scrollspy($nav_link).nav_item_map();

// Run scroll event dependent features
$window.scroll(function() {
    // sticky nav menu when scrolling past it's initial page location
    // features($nav).sticky_nav(fixed_class, nav_distance_from_top);
    // play css animation when an element is visible in the window
    features($animated_element).animate_visible(fade_animate_class);
    // Scrollspy Plugin to highlight nav menu items when you're in that section
    // scrollspy($nav_link).highlight(active_nav_class, nav_map, nav_height);
});
