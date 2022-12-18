
(function() {
    'use strict';
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

    window.fill = new window.ol.style.Fill({
        color: 'rgba(0,91,170, 0.4)'
    });
    window.stroke = new window.ol.style.Stroke({
        color: '#000',
        width: 2
    });

    window.styles = [
        new window.ol.style.Style({
            image: new window.ol.style.Circle({
                fill: window.fill,
                stroke: window.stroke,
                radius: 5
            }),
            fill: window.fill,
            stroke: window.stroke
        })
    ];
    document.querySelector('.navbar-brand').innerText = "Shape Tester";
    document.querySelector('.navbar-nav').remove();

    document.querySelector('.btn-group-vertical').style.display = "none";
    document.getElementById("wktStringTextArea").style.fontSize = "0.75rem";
    pasteImage();
})();
