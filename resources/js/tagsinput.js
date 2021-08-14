var Tagsinput = {
  taglist: null,
  taglistid: null,
  dragelement: null,
  dragindex: -1,
  dragtag: null,
  tagevents: {
    dragstart: function(e) {
      self = e.data.self;
      self.dragelement = jQuery(this);
      self.dragindex = jQuery(this).index();
      self.dragtag = jQuery(this).children(); //copie du tag
    },
    // on passe sur un el draggable
    dragenter: function(e) {
      e.preventDefault();
      jQuery(this).css('background-color','#c9c8be !important');
    },
    // on quitte un el draggable
    dragleave: function() {
      jQuery(this).css('background-color','');
    },
    // declenche tant qu on a pas lache l el
    dragover: function(e) {
      e.preventDefault();
    },
    // lache elt
    drop: function(e) {
      self = e.data.self;
      if (self.dragelement.parents('div').attr('id') != self.divthirdid || jQuery(this).index() == self.dragindex){
        return;
      }
      jQuery(this).css('background-color','');
      if (jQuery(this).index() < self.dragindex){
        jQuery('<li/>')
          .attr('draggable', true)
          .on(self.tagevents, {self : self})
          .append(self.dragtag)
          .insertBefore(jQuery(this));
      }else{
        jQuery('<li/>')
          .attr('draggable', true)
          .on(self.tagevents, {self : self})
          .append(self.dragtag)
          .insertAfter(jQuery(this));
      }
      self.dragelement.remove();
    },
    // fin du drag (même sans drop)
    dragend: function() {
    }
  },
  init: function(list, options){
    this.taglist = jQuery(list);
    this.taglistid = this.taglist.attr('id');
    this.options = options;
  },
  hasValue: function(data){
    if (this.options.checkunicity){
      var field = this.options.field;
      var valtocheck = data[field];
      return this.taglist.children().filter(function(idx, elt){ return jQuery(elt).children('span').data('tagdata')[field]== valtocheck}).length > 0;
    }else{
      return false;
    }
  },
  addtolist: function(varia){
    if (typeof varia === 'object'){
      if (Array.isArray(varia)){
        for (var i = 0; i < varia.length; i++){
          var el = varia[i];
          if (typeof el != 'object'){
            jQuery.error('Not object');
          }
          if (!this.hasValue(el)){
            this.buildtag(el);
          }
        }
      }else{
        if (!this.hasValue(varia)){
          this.buildtag(varia);
        }
      }
    }else{
      jQuery.error('Add: Bad init values');
    }
  },
  buildtag: function(data){
    var li = jQuery('<li></li>')
      .attr('draggable', true)
      .on(this.tagevents, {self : this});
    var removelink = jQuery('<a></a>')
      .attr('href', '#')
      .append(
        jQuery('<i></i>').addClass(this.options.tagremovebtnclass)
    )
    var tag = jQuery('<span></span>')
      .addClass('badge ' + this.options.tagclass)
      .data('tagdata', data)
      .html(data[this.options.taglabelelement])
      .append(removelink);
    removelink.on('click', {li: li, self: this, tag: tag}, function(e){
      e.preventDefault();
      e.data.li.remove();
      if (e.data.self.options.tagremovecallback != null){
        eval(e.data.self.options.tagremovecallback(e.data.tag, this));
      }
    });
    li.append(tag);
    this.taglist.append(li);
    if (this.options.tagaddcallback != null){
      var tag = li.children('span').first();
      eval(this.options.tagaddcallback(tag, this));
    }
  },
  reset: function(){
    this.taglist.html('');
  },
  count: function(){
    return this.taglist.children().length;
  },
  getArrayValues: function(){
    var res = new Array();
    var field = this.options.field;
    this.taglist.find('span').each(function(i,el){
      res.push(jQuery(el).data('tagdata')[field]);
    });
    return res;
  },
  getCommaSepValues: function(){
    var res = '';
    var field = this.options.field;
    this.taglist.find('span').each(function(i,el){
      if (res.length > 0){
          res += ',';
      }
      res += jQuery(el).data('tagdata')[field];
    });
    return res;
  },
  serialize: function(sChamp){
    var str ='';
    var field = this.options.field;
    this.taglist.find('span').each(function(i,el){
      if (i > 0){
        str += '&';
      }
      str += sChamp + '[]=' + jQuery(el).data('tagdata')[field];
    });
    return str;
  }
}

if (typeof Object.create !== 'function') {
	Object.create = function(o) {
		function F() { } // optionally move this outside the declaration and into a closure if you need more speed.
		F.prototype = o;
		return new F();
	};
}
// table builder function
(function(jQuery) {
	/* Create plugin */
	jQuery.fn.tagsinput = function(options)  {
		return this.each(function() {
			var element = jQuery(this);
			if (element.prop('tagName') != 'UL') throw 'not a UL';
			// Return early if this element already has a plugin instance
			if (element.data('tagsinput')) return element.data('tagsinput');
			var tagsinput = Object.create(Tagsinput);
			tagsinput.init(this, options);
			// pass options to plugin constructor
			element.data('tagsinput', tagsinput);
		});
	};
})(jQuery);
