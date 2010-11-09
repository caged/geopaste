(function($) {
    //
    // plugin definition
    //
    var _animating = false;
    
    //tabSelector: selector to get to the link tags that represent the tabs
    //tabContentSelector: selector to get the content blocks that represent the tab content
    
    $.fn.tabcontrol = function(tabSelector, tabContentSelector, options) {
        
        // build main options before element iteration
        var opts = $.extend({},
        $.fn.tabcontrol.defaults, options);

        // iterate and reformat each matched element
        return this.each(function() {
          
            var $this = $(this);

            // build element specific options
            var o = $.meta ? $.extend({},
            opts, $this.data()) : opts;
            
            //set up our helper vars
            var $tabs = o.tabsInside ? $(tabSelector, this) : $(tabSelector);
            var $content = o.contentInside ? $(tabContentSelector, this) : $(tabContentSelector);
            
            var $cur = $content.first();
            var $curtab = $tabs.first();
            
            //check the url if we are using permalinks            
            if(o.usePermalinks){
              var hash = window.location.hash;
              if(hash != ""){
                $cur = $content.filter(hash);
                if($cur.length == 0){
                  //no results, must be an invalid hash
                  $cur = $content.first();
                  $curtab = $tabs.first();
                }else{
                  $curtab = $tabs.filter("[href="+hash+"]");
                }
              }
            }
            
            //get to the correct current state
            $curtab.addClass(o.selectedClass);
            $cur.addClass(o.selectedClass);
            $content.not("."+o.selectedClass).hide();
            
            //set up tab click events            
            $tabs.click(function(){
              //select the new tab
              if(!_animating){
                _animating = true;
                $.fn.tabcontrol.showTab(o, $tabs, $content , this);
              }
              return false;
            });

        });

    };

    //
    // define and expose our functions
    //
    
    $.fn.tabcontrol.resetAll = function(o, $tabs, $content, callback){
      var $visible = $content.filter(":visible");
      
      $tabs.removeClass(o.selectedClass);
      $content.removeClass(o.selectedClass);
      
      if(o.effect == false){
        $visible.hide();
        callback();
      }else if(o.effect == "fade"){
        $visible.fadeOut(o.effectDuration, callback);
      }else if(o.effect == "slide"){
        $visible.slideUp(o.effectDuration, callback);
      }
      
    }
    
    $.fn.tabcontrol.nextTab = function(){
      //future feature
    }
    
    $.fn.tabcontrol.prevTab = function(){
      //future feature
    }
    
    $.fn.tabcontrol.jumpTo = function(i){
      //future feature
    }
    
    $.fn.tabcontrol.showTab = function(o, $tabs, $content, el) {
      var href = $(el).attr('href'); 
      $(el).trigger("tab:beforechange", el, href);
      if(o.onBefore != false && typeof o.onBefore == "function")
      o.onBefore(o, $tabs, $content, el);
      
      if(o.usePermalinks)
      window.location.hash = href;
      
      //reset so no tabs are selected
      $.fn.tabcontrol.resetAll(o, $tabs, $content, function(){

        var finished = function(){
          _animating = false;
          if(o.onAfter != false && typeof o.onAfter == "function"){
            o.onAfter(o, $tabs, $content, el);
          }
        }
      
        if(o.effect == false){
          $(href).show();
          finished();
        }else if(o.effect == "fade"){
          $(href).fadeIn(o.effectDuration, function(){
            finished();
          });
        }else if(o.effect == "slide"){
          $(href).slideDown(o.effectDuration, function(){
            finished();
          });
        }
      
        $(href).addClass(o.selectedClass); //show and add class to our new tab
      }); 
      
      $(el).addClass(o.selectedClass); //add selected class to our tab
      $(el).trigger('tab:afterchange', el, href);
    };

    //
    // plugin defaults
    //
    $.fn.tabcontrol.defaults = {
        tabsInside: true, //search within the initial selector for the tabs
        contentInside: false, //search within the initial selector for the content
        selectedClass: "selected", //selected class
        onBefore: false, //before callback
        onAfter: false, //after callback
        effect: false, // false, "fade", "slide"
        effectDuration: "normal", //duration of effect
        usePermalinks: true
    };
})(jQuery);