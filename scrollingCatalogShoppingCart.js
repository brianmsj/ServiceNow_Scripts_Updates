//Scrolling Catalog Shopping Cart
//Create Catalog Client Script for the Catalog Item and place the following inside an OnLoad function.
//Can be used in a Variable Set for use with all Catalog Items.
!function(t){t.fn.jScroll=function(n){function o(t){this.min=t.offset().top,
	this.originalMargin=parseInt(t.css("margin-top"),10)||0,this.getMargin=function(n)
	{var o=t.parent().height()-t.outerHeight(),r=this.originalMargin;return n.scrollTop()>=this.min&&
		(r=r+i.top+n.scrollTop()-this.min),r>o&&(r=o),{marginTop:r+"px"}}}var i=t.extend({},t.fn.jScroll.defaults,n);
		return this.each(function(){var n=t(this),r=window;t("div.cms_layout_container",window.parent.document).length>0&&
			(r=window.parent);var e=t(r);t("div.touch_scroll").length>0&&(e=t("div.touch_scroll"));var s=new o(n);e.scroll
			(function(){n.stop().animate(s.getMargin(e),i.speed)})})},t.fn.jScroll.defaults={speed:"slow",top:10}}(jQuery),$j
		("#sc_cart_contents").jScroll({top:20,speed:1500});
