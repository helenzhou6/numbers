$(document).ready(function(){var e=$(".input"),n=e.find("input"),t=$(".js-text"),a=function(n){e.attr("data-shadow",n)},o=function(e,n){$(".property").find(".is-bold").removeClass("is-bold");var a=parseInt(e),o="If you know a distinctive fact about this number, please <a href='mailto:efriedma@stetson.edu'>e-mail</a> me.";n[a]?(o=n[a].description,$("."+n[a].property).addClass("is-bold")):""===e&&(o='Type a number between <span class="number">0</span> to <span class="number">9999</span>'),t.html(o)};n.val()&&a(n.val()),n.on("keydown",function(e){($(this).val().length>3&&46!=e.keyCode&&8!=e.keyCode&&37!=e.keyCode&&39!=e.keyCode||69===e.keyCode||189===e.keyCode||190===e.keyCode||187===e.keyCode)&&e.preventDefault()}),$.ajax("/Numnumbers.json").done(function(e){n.focus(),n.on("input",function(n){n.preventDefault();var t=$(this).val();a(t),o(t,e),history.pushState(t,null,t)}),window.addEventListener("popstate",function(t){t.preventDefault();var s=window.location.pathname.substring(1);o(s,e),n.val(s),a(s)})})});