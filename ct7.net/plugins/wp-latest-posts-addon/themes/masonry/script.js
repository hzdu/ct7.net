if(typeof($wplp_grids) == "undefined") {
    var $wplp_grids = {};
}
(function($) {
    !function(a){a.fn.extend({BlackAndWhite:function(b){"use strict";var c=this,d={hoverEffect:!0,webworkerPath:!1,responsive:!0,invertHoverEffect:!1,speed:500,onImageReady:null,intensity:1};b=a.extend(d,b);var e=b.hoverEffect,f=b.webworkerPath,g=b.invertHoverEffect,h=b.responsive,i="number"==typeof b.intensity&&b.intensity<1&&b.intensity>0?b.intensity:1,j=a.isPlainObject(b.speed)?b.speed.fadeIn:b.speed,k=a.isPlainObject(b.speed)?b.speed.fadeOut:b.speed,l=document.all&&!window.opera&&window.XMLHttpRequest?!0:!1,m=" -webkit- -moz- -o- -ms- ".split(" "),n={},o=function(a){if(n[a]||""===n[a])return n[a]+a;var b=document.createElement("div"),c=["","Moz","Webkit","O","ms","Khtml"];for(var d in c)if("undefined"!=typeof b.style[c[d]+a])return n[a]=c[d],c[d]+a;return a.toLowerCase()},p=function(){var a=document.createElement("div");return a.style.cssText=m.join("filter:blur(2px); "),!!a.style.length&&(void 0===document.documentMode||document.documentMode>9)}(),q=!!document.createElement("canvas").getContext,r=a(window),s=function(){return"undefined"!=typeof Worker?!0:!1}(),t=(o("Filter"),[]),u=s&&f?new Worker(f+"BnWWorker.js"):!1,v=function(b){a(b.currentTarget).find(".BWfade").stop(!0,!0)[g?"fadeOut":"fadeIn"](k)},w=function(b){a(b.currentTarget).find(".BWfade").stop(!0,!0)[g?"fadeIn":"fadeOut"](j)},x=function(a){"function"==typeof b.onImageReady&&b.onImageReady(a)},y=function(){return t.length?(u.postMessage({imgData:t[0].imageData,intensity:i}),void(u.onmessage=function(a){t[0].ctx.putImageData(a.data,0,0),x(t[0].img),t.splice(0,1),y()})):(u.terminate&&u.terminate(),void(u.close&&u.close()))},z=function(a,b,c,d){var e=b.getContext("2d"),f=0;e.drawImage(a,0,0,c,d);var g=e.getImageData(0,0,c,d),h=g.data,j=h.length;if(u)t.push({imageData:g,ctx:e,img:a});else{for(;j>f;f+=4){var k=.3*h[f]+.59*h[f+1]+.11*h[f+2];h[f]=~~(k*i+h[f]*(1-i)),h[f+1]=~~(k*i+h[f+1]*(1-i)),h[f+2]=~~(k*i+h[f+2]*(1-i))}e.putImageData(g,0,0),x(a)}},A=function(b,c){var d,e=b[0],f=e.src,h=b.width(),j=b.height(),k=b.position(),l={position:"absolute",top:k.top,left:k.left,display:g?"none":"block"};if(q&&!p){var m=e.width,n=e.height;d=a('<canvas class="BWfade" width="'+m+'" height="'+n+'"></canvas>'),d.css(l),d.prependTo(c),z(e,d.get(0),m,n)}else l[o("Filter")]="grayscale("+100*i+"%)",d=a("<img src="+f+' width="'+h+'" height="'+j+'" class="BWFilter BWfade" /> '),d.css(a.extend(l,{filter:"progid:DXImageTransform.Microsoft.BasicImage(grayscale=1)"})),d.prependTo(c),x(e)};return this.init=function(){c.each(function(b,c){var d=a(c),e=d.find("img");e.width()?A(e,d):e.on("load",function(){A(e,d)})}),u&&y(),e&&(c.on("mouseleave",v),c.on("mouseenter",w)),h&&r.on("resize orientationchange",c.resizeImages)},this.resizeImages=function(){c.each(function(b,c){var d=a(c).find("img:not(.BWFilter)"),e=l?a(d).prop("width"):a(d).width(),f=l?a(d).prop("height"):a(d).height();a(this).find(".BWFilter, canvas").css({width:e,height:f})})},this.init(b)}})}(jQuery);
    
    //render masonry
    function render_masonry(widget_params){
        imagesLoaded($('#masonrycontainer_' + widget_params.id), function () {
            $wplp_grids[widget_params.id] = $('#masonrycontainer_' + widget_params.id).masonry({
                gutter: 10,
                itemSelector: '.masonry'
            });
        });
    }

    //start render mansory layout after window loaded
    $(document).ready(function () {
        // $(window).load(function() {
            $('[id^="wplp_widget_"].masonry').each(function(){
                    var widget_id = $(this).data('post');
                    var widget_params = window['WPLP_'+widget_id];
                    if(widget_params !== undefined) {
                        $('#masonrycontainer_'+widget_params.id).trigger('click');
                            render_masonry(widget_params);
                    }
            });
        // });
    });

})( jQuery );