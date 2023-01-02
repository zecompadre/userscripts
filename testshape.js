
(function() {
    'use strict';
    async function pasteWKT() {
        try {
            const permission = await navigator.permissions.query({ name: 'clipboard-read' });
            if (permission.state === 'denied') {
                throw new Error('Not allowed to read clipboard.');
            }
            const text = await navigator.clipboard.readText();
            if(text.indexOf("POLYGON") !== -1)
            {
                document.getElementById("wktStringTextArea").value = text;
                plotWKT();
            }
        }
        catch (error) {
            console.error("pasteWKT:", error.message);
        }
    };
    
    /* globals $ */
    function resizeText() {
        var doc = $(document).height();
        var bar = $(".navbar").outerHeight();
        var map = (doc / 5) * 3;
        
        console.log(map);
        
        $("#map").height(map);
        var buttons = $(".btn-group.btn-group-md").outerHeight();
        var text = doc - (bar + map + buttons + 30);
        $("#wktStringTextArea").height(text);
    }
    window.onresize = resizeText;
    resizeText();

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
    
    pasteWKT();
    
})();
