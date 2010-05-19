/*!
 * jQuery Diagonal Matrix Fade Plugin
 * Examples and documentation at: http://jonobr1.com/
 * Copyright (c) 2010 Jono Brandel
 * For Prologue Films: http://prologue.com/
 * Version: .01 (18-MAY-2010)
 * Requires: jQuery v1.3.2 or later
 *
 * To Do:
 * + Extend Cycle or write own (based on jquery.cycle.lite.js)
 */
 
(function($) {
    
    // if $.support is not defined (pre jQuery 1.3) add what I need
    if($.support == undefined) {
        $.support = {
            opacity: !($.browser.msie)
        };
    }
    
    $.fn.diagonalFade = function(customOptions){
        var options = $.extend({},$.fn.diagonalFade.defaultOptions, customOptions); 
        return this.each(function(){
            var $this = $(this);
            
            // Get Container information
            var cw = $this.width();
            var ch = $this.height();
            
            var w  = $this.children(":first").width();
            var h  = $this.children(":first").height();
            
            // Calculate rows and Columns for our Matrix
            var m = parseInt(ch / h);
            var n = parseInt(cw / w);
            
            // Create an array to hold the order
            var a = new Array();
            var f = new Array();
            var b = 0;  // General purpose iterator
            for(var i = 0; i < m; i++) {
                a[i] = new Array(n);
                for(var j = 0; j < n; j++) {
                    a[i][j] = b;
                    b++;
                }
            }
            
            // Fade In or Fade Out
            switch(options.fade) {
                case 'in':
                    var o = 100;
                break;
                case 'out':
                    var o = 0;
                break;
            }
            
            // Iterate Diagonally through our object
            // then stuff it into a linear array
            if((options.fadeDirection_y == 'top-bottom' && options.fadeDirection_x == 'left-right')
                || (options.fadeDirection_y == 'bottom-top' && options.fadeDirection_x == 'right-left')) {
                for (var i = 0; i < m + n - 1; i++) {
                    var z1 = (i < n) ? 0 : i - n + 1;
                    var z2 = (i < m) ? 0 : i - m + 1;
                    var group = new Array();
                    for (var j = i - z2; j >= z1; j--) {
                        group.push(a[j][i - j]);
                    }
                    f.push(group);
                }
                if(options.fadeDirection_y == 'top-bottom' && options.fadeDirection_x == 'left-right') {
                    $this.children(":first").animate({
                        opacity: o
                    }, options.time, function() {
                        b = 0;
                        cascade($this, f, b, options.fadeDirection_x, options.fadeDirection_y, o);
                    });
                } else if(options.fadeDirection_y == 'bottom-top' && options.fadeDirection_x == 'right-left') {
                    $this.children(":last").animate({
                        opacity: o
                    }, options.time, function() {
                        b = f.length;
                        cascade($this, f, b, options.fadeDirection_x, options.fadeDirection_y, o);
                    });
                }
            } else if((options.fadeDirection_y == 'bottom-top' && options.fadeDirection_x == 'left-right')
                || (options.fadeDirection_y == 'top-bottom' && options.fadeDirection_x == 'right-left')) {
                for (var i = 1 - m; i < n; i++) {
                    var group = new Array();
                    for (var j = 0; j < m; j++) {
                        if ((i + j) >= 0 && (i + j) < n) {
                            group.push(a[j][i + j]);
                        }
                    }
                    f.push(group);
                }
                if(options.fadeDirection_y == 'bottom-top' && options.fadeDirection_x == 'left-right') {
                    var k = f[0][0] + 1;
                    $this.children(":nth-child("+k+")").animate({
                        opacity: o
                    }, options.time, function() {
                        b = 0;
                        cascade($this, f, b, options.fadeDirection_x, options.fadeDirection_y, o);
                    });
                } else if(options.fadeDirection_y == 'top-bottom' && options.fadeDirection_x == 'right-left') {
                    var k = f[f.length - 1][0] + 1;
                    $this.children(":nth-child("+k+")").animate({
                        opacity: o
                    }, options.time, function() {
                        b = f.length;
                        cascade($this, f, b, options.fadeDirection_x, options.fadeDirection_y, o);
                    });
                }
            }
        });
        
        function cascade(_t, _f, _i, _c_x, _c_y, _c_o) {
            var t = _t;
            var f = _f;
            var i = _i;
            var o = _c_o;
            var c_x = _c_x;
            var c_y = _c_y;
            var isTrigger = true;
            
            if((c_x == 'left-right' && c_y == 'top-bottom')
                || (c_x == 'left-right' && c_y == 'bottom-top')) {
                i++;
                if(f[i]) {
                    for(var j = 0; j < f[i].length; j++) {
                        var k = f[i][j] + 1;
                        t.children(":nth-child("+k+")").animate({
                            opacity: o
                        }, options.time, function() {
                            if(isTrigger) {
                                cascade(t, f, i, c_x, c_y, o);
                                isTrigger = false;
                            }
                        });
                    }
                } else {
                    if ($.isFunction(options.complete)) options.complete.apply(this);
                }
            } else if((c_x == 'right-left' && c_y == 'top-bottom')
                || (c_x == 'right-left' && c_y == 'bottom-top')) {
                i--;
                if(i >= 0) {
                    for(var j = 0; j < f[i].length; j++) {
                        var k = f[i][j] + 1;
                        t.children(":nth-child("+k+")").animate({
                            opacity: o
                        }, options.time, function() {
                            if(isTrigger) {
                                cascade(t, f, i, c_x, c_y, o);
                                isTrigger = false;
                            }
                        });
                    }
                } else {
                    if ($.isFunction(options.complete)) options.complete.apply(this);
                }
            }
        }
    };
    
    $.fn.diagonalFade.defaultOptions = {
        time: 100,
        fadeDirection_x: 'right-left',  // "left-right" || "right-left"
        fadeDirection_y: 'top-bottom',  // "top-bottom" || "bottom-top"
        fade: 'out',                    // "in" || "out"
        complete: null                  // Set Interval?
    }; 
})(jQuery);