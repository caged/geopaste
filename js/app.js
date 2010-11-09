$(function() {    
  var mapel = $('#map'),
      po = org.polymaps,
      lightstyle = 5870,
      darkstyle  = 1960,
      svg = po.svg('svg'),
      map = po.map()
      .container(mapel[0].appendChild(svg))
      .center({lat: 45.5250, lon: -122.6515})
      .zoom(13)
      .add(po.interact())
      
  map.add(po.image()
      .url(po.url("http://{S}tile.cloudmade.com"
      + "/16d73702b7824b57830171b5da5c3c85" // http://cloudmade.com/register
      + "/" + lightstyle + "/256/{Z}/{X}/{Y}.png")
      .hosts(["a.", "b.", "c.", ""])));

  map.add(po.compass()
    .zoom('small')
    .position('top-left')
    .radius(30)
    .pan('none'))
    
    $('#main ul.menu').tabcontrol('li a', ".panel", {
      effect: "fade",
      effectDuration: 75,
      onAfter: function(o, tabs, content, el) {
        el = $(el)
        var anchor = el.attr('href'),
            h2 = $('#main h2.wcontrols')
        if(anchor == '#geojson') {
          h2.text('Edit GeoJSON Source')
        } else if(anchor == '#map') {
          h2.text('Edit GeoJSON Map')
          // force the map to recompute its demensions if its container was hidden
          // on page load
          map.resize() 
        } else {
          h2.text('GeoJSON Tree Viewer')
        }
        
      }
    });
  
  $('textarea.geojson').bind('keyup', function() {
    var el = $(this),
        out = el.val(),
        features = $.parseJSON(out).features
    
        
    map.add(po.geoJson()
      .features(features)
      .on('load', load))
        
    // out = out.replace(/(FeatureCollection|Feature|Point|MultiPoint|LineString|MultiLineString|Polygon|MultiPolygon|GeometryCollection)|("[A-Za-z0-9_-]+":)/g, function(match) {
    //   return '<span class="type">' + match + '</span>'
    // })
    
    el.val(out)
  })
  
  function load(data) {    
    $.each(data.features, function() {
      var el = this.element,
          type = this.data.geometry.type.toLowerCase()
          
      el.setAttribute('class', type)
      
      switch(type) {
        case "point":
          el.setAttribute('r', 6)
          break
      }
    })
  }

})