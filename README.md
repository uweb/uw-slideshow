# UW Slideshow plugin for WordPress

This is the slider behind [UW.edu](http://uw.edu) as well as many other sites across the UW WordPress network 
such as [the IMA](http://uw.edu/ima). 

The default layout is the one that appears on the IMA website. 


The plugin creates a private custom post type with an drag and drop interface for arranging slides. 
Each slide has a designated shortcode that can be used.


There is a method that creates a JSON feed of the slideshows allowing the creation of the custom templates.
The function `UW_Slideshow::get_latest_slideshow()` returns a JSON object of the most recently created slideshow 
which can be used in any template file. You can loop through the individual slides and template them accordingly. 
