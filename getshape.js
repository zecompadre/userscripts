(function () {
   
    window.addEventListener('load', function () {
        setTimeout(function() {
        var closeMsg = function (e) {
            var msg = document.getElementById("map-shape-message");
            if (msg) {
                msg.remove();
            }
            msg = document.getElementById("map-undo-message");
            if (msg) {
                msg.remove();
            }
            return false;
        };

        var filter = document.getElementById("listing-filter");
        var button = document.createElement("li");
        button.innerHTML = '<a id="listing-shape-button" href="/" title="Copiar Shape" class="btn regular smaller icon-draw"> Copiar Shape</a>';
        filter.insertBefore(button, filter.firstChild);

        addStyle('.btn.regular.smaller.icon-draw::before { color: white; }\n.btn.regular.smaller.icon-draw{ background-color: #005baa; color: white; box-shadow: none;}');

        button.onclick = function (e) {

            closeMsg();

            var data = [];
            var shapeType = "POLYGON((###))";
            window.DrawManager.getCollection().forEach(col => {
                var polygons = col.latLngs.getArray().reduce((x, c, v) => {
                    var data = c.getArray().reduce((k, b, u) => {
                        k.push(b.lng() + " " + b.lat());
                        return k;
                    }, []);
                    data.push(data[0]);
                    x.push(data);
                    return x;
                }, []);

                data.push(polygons.join(","));
            });
            
            if (data.length > 1) {
                shapeType = "MULTIPOLYGON(((###)))";
            }

            copyToCipboard(shapeType.replace("###", data.join("),(")));

            var bc = document.querySelectorAll(".breadcrumb-navigation > li > a");
            var cur = document.querySelector(".breadcrumb-navigation-current-level");

            if (bc.length === 0) {
                bc = document.querySelectorAll(".breadcrumb-geo > ul > li > a");
                cur = document.querySelector(".breadcrumb-geo > ul > li:last-child");
            }

            var text = "Zona visível";
            if (bc) {
                var bcText = [];
                bc.forEach(a => {
                    bcText.push(a.innerText);
                });
                if (cur) {
                    bcText.push(cur.innerText);
                }
                if (bcText.length > 0) {
                    text = bcText.join(", ");
                }
            }

            var msg = document.getElementById("map-undo-message");
            if (msg) {
                msg.remove();
            }

            msg = document.createElement("div");
            msg.id = "map-shape-message";
            msg.classList.add("map-message");
            msg.classList.add("feedback");
            msg.classList.add("contextual");
            msg.classList.add("warning");
            msg.style.width = "100%";
            msg.style.textAlign = "center";
            msg.innerHTML = "SHAPE " + titleCase(text) + ", copiada para o clipboard<br />Verificar -> <a href='https://wkt-playground.zecompadre.com/' target='_shapetest'> Shape Test!</a>";

            var close = document.createElement("a");
            close.classList.add("icon-close");
            close.classList.add("close-btn");
            close.style.cursor = "pointer";
            close.style.position = "absolute";
            close.style.right = "5px";
            close.style.top = "5px";

            close.onclick = closeMsg;

            msg.appendChild(close);

            var map = document.getElementById("map-placeholder");

            var shapeclose = document.querySelector(".delete-cross-button.icon-close");
            if (shapeclose) {
                document.querySelector(".delete-cross-button.icon-close").onclick = closeMsg;
            }

            map.insertBefore(msg, map.firstChild);

            return false;
        };

        }, 3000);
    }, false);
})();
