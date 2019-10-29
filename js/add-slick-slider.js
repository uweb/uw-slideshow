/**
 * Adds Slick Slideshow styles and functionality to each slideshow selected to use Slick.
 * Fade, arrows, and dots are the Slick settings that are activated by default.
 */

$( '.slideshow-id' ).each( function() {
    var addSlick = $( this ).val( );
    if ( addSlick === 'true' ) {
        var slideshowClass = $( this ).closest( '.find-slideshow' ).find( '.uw-slideshow' ).attr( 'class' );
        slideshowClass = '.' + slideshowClass.replace(/ /g, '.');
        var output = "";
        output += '\<script\>$("' + slideshowClass + '").slick({dots: true, arrows: true, fade: true, adaptiveHeight: true});\</script\>';
        $( 'body' ).append( output );
    }
} );