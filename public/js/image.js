$(document).ready(function() {
    $("img").each(function() {
        // Calculate aspect ratio and store it in HTML data- attribute
        var aspectRatio = $(this).width()/$(this).height();
        $(this).data("aspect-ratio", aspectRatio);

        // Conditional statement
        if(aspectRatio > 1) {
            // Image is landscape
            $(this).css({
                width: "100%",
                height: "auto"
            });
        } else if (aspectRatio < 1) {
            // Image is portrait
            $(this).css({
                maxWidth: "100%"
            });
        } else {
            // Image is square
            $(this).css({
                maxWidth: "100%",
                height: "auto"
            });            
        }
    });
})