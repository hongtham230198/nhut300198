window.onload = init;

function init() {

    var container = document.getElementById('popup');
    var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');

    /**
     * Create an overlay to anchor the popup to the map.
     */
    var overlay = new ol.Overlay( /** @type {olx.OverlayOptions} */ ({
        element: container,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    }));
    /**
     * Add a click handler to hide the popup.
     * @return {boolean} Don't follow the href.
     */
    closer.onclick = function() {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };

    var center1 = [11871819.171012152, 1229646.7537582985]
    var map = new ol.Map({
        view: new ol.View({
            center: center1,
            zoom: 11,
        }),
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        overlays: [overlay],
        target: 'map',
        view: new ol.View({
            center: [11871819.171012152, 1229646.7537582985],
            zoom: 13
        })
    });


    var vung_phuong = new ol.layer.Image({
        source: new ol.source.ImageWMS({
            url: 'http://localhost:8080/geoserver/DoAnGis/wms',
            params: { 'LAYERS': 'DoAnGis:vungranhgioiphuongtxtdm_region' },
            serverType: 'geoserver'
        })
    });

    var ubnd = new ol.layer.Image({
        source: new ol.source.ImageWMS({
            url: 'http://localhost:8080/geoserver/DoAnGis/wms',
            params: { 'LAYERS': 'DoAnGis:ubnd_point' },
            serverType: 'geoserver'
        })
    });
    var benh_nhan = new ol.layer.Image({
        source: new ol.source.ImageWMS({
            url: 'http://localhost:8080/geoserver/DoAnGis/wms',
            params: { 'LAYERS': 'DoAnGis:bn_point' },
            serverType: 'geoserver'
        })
    });
    map.addLayer(vung_phuong);
    map.addLayer(ubnd);
    map.addLayer(benh_nhan);

    vung_phuong.setOpacity(1);
    benh_nhan.setOpacity(2);
    ubnd.setOpacity(0.3);

    map.on('singleclick', function(evt) {
        document.getElementById('information').innerHTML = "Loading... please wait...";

        var view = map.getView();
        var viewResolution = view.getResolution();
        var source = benh_nhan.getSource();
        var url = source.getFeatureInfoUrl(
            evt.coordinate, viewResolution, view.getProjection(), {
                'INFO_FORMAT': 'application/json',
                'FEATURE_COUNT': 50
            });

        if (url) {
            $.ajax({
                type: "POST",
                url: url,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                success: function(n) {
                    var content = "<table>";
                    for (var i = 0; i < n.features.length; i++) {
                        var feature = n.features[i];
                        var featureAttr = feature.properties;
                        content += " <tr> <td> Tên bệnh nhân: " + featureAttr["hoten"] + "</td>" +
                            "<tr> <td> Tuổi: " + featureAttr["tuoi"] + " </td></tr>" +
                            "<tr> <td> Nghề nghiệp: " + featureAttr["nghenghiep"] + " </td></tr>" +
                            "<tr> <td> Địa chỉ: " + featureAttr["diachi"] + " </td></tr>" +


                            "</tr>"
                    }
                    content += "</table>";
                    $("#information").html(content);
                    $("#popup-content").html(content);
                    overlay.setPosition(evt.coordinate);
                }
            });
        }

    });







    $("#chk_vungtdm").change(function() {
        if ($("#chk_vungtdm").is(":checked")) {
            vung_phuong.setVisible(true);
        } else {
            vung_phuong.setVisible(false);
        }
    });
    $("#chk_hodan").change(function() {
        if ($("#chk_hodan").is(":checked")) {
            ho_dan.setVisible(true);
        } else {
            ho_dan.setVisible(false);
        }
    });
    $("#chk_ubnd").change(function() {
        if ($("#chk_ubnd").is(":checked")) {
            ubnd.setVisible(true);
        } else {
            ubnd.setVisible(false);
        }
    });

};