
(function() {
    'use strict';
    
    /* globals $ */
    var doc = $(document).height();
    var bar = $(".navbar").outerHeight();
    var map = $("#map").outerHeight();
    var buttons = $(".btn-group.btn-group-md").outerHeight();
    var text = doc - (bar + map + buttons + 20);
    $("#wktStringTextArea").css("height", text);
    
    async function pasteImage() {
        try {
            const permission = await navigator.permissions.query({ name: 'clipboard-read' });
            if (permission.state === 'denied') {
                throw new Error('Not allowed to read clipboard.');
            }
            const text = await navigator.clipboard.readText();
            if(text.indexOf("POLYGON") !== -1)
            {
                document.getElementById("wktStringTextArea").value = text;
                var btn = document.querySelector('.btn-group.btn-group-md button:last-of-type');
                btn.click();
            }
        }
        catch (error) {
            console.error(error.message);
        }
    };

    fill = new ol.style.Fill({
        color: 'rgba(0,91,170, 0.4)'
    });
    stroke = new ol.style.Stroke({
        color: '#000',
        width: 2
    });

    styles = [
        new ol.style.Style({
            image: new ol.style.Circle({
                fill: fill,
                stroke: stroke,
                radius: 5
            }),
            fill: fill,
            stroke: stroke
        })
    ];
    document.querySelector('.navbar-brand').innerText = "Shape Tester";
    document.querySelector('.navbar-nav').remove();

    document.querySelector('.btn-group-vertical').style.display = "none";
    document.getElementById("wktStringTextArea").style.fontSize = "0.75rem";
    pasteImage();
})();
