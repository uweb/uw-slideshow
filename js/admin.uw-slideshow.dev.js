var Slideshow = Slideshow || {}

Slideshow.Slide = Backbone.Model.extend({

  defaults : {
      id    : null,
      title : null,
      text  : null,
      link  : null,
      dark  : null,
      darkmobile  : null, 
      image : '/wp-content/plugins/uw-slideshow/assets/placeholder.png',
      mobileimage : '/wp-content/plugins/uw-slideshow/assets/placeholder-mobile.png'
  },

})

Slideshow.Slides = Backbone.Collection.extend({

  model : Slideshow.Slide,

  parameters :
  {
    action : 'get_current_uw_slideshow'
  },


  defaults: {
    src : '',
  },

  url : function()
  {
    console.log(ajaxurl)
    return ajaxurl + '?' + jQuery.param( _.extend( this.parameters, { id : jQuery('#post_ID').val() } ) )    
  },

  initialize: function()
  {
    this.fetch()
  }

})


Slideshow.View = Backbone.View.extend({

  el : '#slideshow .inside',

  events : {
    'click .admin-slideshow-image' : 'openMediaFrame',
    'click .admin-slideshow-mobile-image' : 'openMobileMediaFrame',
    'click #add-new-slide' : 'addNewSlideBox',
    'click .remove-slide'  : 'removeSlide'
  },

  frameoptions : {
    frame: 'select',
    multiple: false,
    title: 'Select an image',
  },


  template :
      '<div class="slide" data-index="<%= id %>">' +
        '<div class="image">' +
          '<image class="admin-slideshow-image" src="<%= image %>" width="100%"/>' +
          '<input type="hidden" name="slides[<%= id %>][image]" value="<%= image %>"/>' +
        '</div>' +
        '<div class="mobile-image">' +
          '<image class="admin-slideshow-mobile-image" src="<%= mobileimage %>" width="100%"/>' +
          '<input type="hidden" name="slides[<%= id %>][mobileimage]" value="<%= mobileimage %>"/>' +
        '</div>' +
        '<div class="form">' +
          '<p>Title : <input type="text" name="slides[<%= id %>][title]" value="<%- title %>" /></p>' +
          '<p>Text  : <br/><textarea type="text" name="slides[<%= id %>][text]" style="resize:none; width:100%;" ><%- text %></textarea></p>' +
          '<p>Use darker text: <br/><input type="checkbox" name="slides[<%= id %>][dark]" style="width:auto" value="checked" <%= dark %> /> Desktop <br/><input type="checkbox" name="slides[<%= id %>][darkmobile]" style="width:auto" value="checked" <%= darkmobile %> /> Mobile</p>' +
          '<p>Link  :<input type="text" name="slides[<%= id %>][link]" value="<%- link %>" /></p>' +
          '<input type="hidden" name="slides[<%= id %>][id]" value="<%= id %>"/>' +
          '<a class="button-secondary remove-slide"> Remove </a>' +
        '</div>' +
      '</div>',

  initialize : function( options )
  {
    _.bindAll( this, 'render', 'addSlideBox', 'openMediaFrame', 'openMobileMediaFrame', 'selectImage', 'reorder', 'setIndex' )

    this.options = _.extend( {}, this.settings , this.$el.data(), options )

    this.collection.on( 'sync', this.render )
    this.collection.on( 'change', this.render )
    this.collection.on( 'remove', this.render )
    this.collection.on( 'add', this.render )

    this.mediaframe = wp.media.frames.frame = wp.media( this.frameoptions )
    this.mediaframe.on( 'select', this.selectImage );

    this.$el.sortable()
    this.$el.on( 'sortstop', this.reorder )
  },

  render : function()
  {
    this.$el.find('.slide').remove()
    _.each( this.collection.models, this.addSlideBox )

  },

  addSlideBox : function( slide, index )
  {
    var template = _.template( this.template );
    template = template( slide.toJSON() );
    this.$el.append( template )
  },

  openMediaFrame : function( e )
  {
    this.mobile = false;
    this.id = this.$( e.currentTarget ).closest('[data-index]').data().index
    this.mediaframe.open()
  },

  openMobileMediaFrame : function( e )
  {
    this.mobile = true;
    this.id = this.$( e.currentTarget ).closest('[data-index]').data().index
    this.mediaframe.open()
  },

  selectImage : function()
  {
    var media = this.mediaframe.state().get('selection').first().toJSON()
    if ( this.mobile )
     this.collection.get( this.id ).set( 'mobileimage', media.url )
    else
     this.collection.get( this.id ).set( 'image', media.url )
  },

  addNewSlideBox : function( e )
  {
    this.collection.push( new Slideshow.Slide({ id: _.uniqueId() }) )
  },

  removeSlide : function( e ) {
    this.collection.remove( this.$( e.currentTarget ).closest('[data-index]').data().index )
  },

  reorder : function()
  {
    _.map( this.$('[data-index]'), this.setIndex )
  },

  setIndex : function( element , index )
  {
    var id = jQuery(element).data().index
      , model = this.collection.get( id )
    this.collection.remove( id )
    this.collection.add( model, { at: index } )
  }


})

jQuery(document).ready( function() {
  Slideshow.view = new Slideshow.View({  collection: ( new Slideshow.Slides() ) })
})
