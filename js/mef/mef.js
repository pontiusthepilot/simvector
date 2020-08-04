// MEF for google.maps v3
//
// Adapted from Bill Chadwick 2006 http://www.bdcc.co.uk/Gmaps/BdccGmapBits.htm
// which is free for any use.
//
// This work is licensed under the Creative Commons Attribution 3.0 Unported
// License. To view a copy of this license, visit
// http://creativecommons.org/licenses/by/3.0/ or send a letter to Creative
// Commons, 171 Second Street, Suite 300, San Francisco, California, 94105,
// USA.
//
// Matthew Shen 2011
//
// Reworked some more by Bill Chadwick ...
//
// Customised by Chris Beckhelling to:
//      Limit maximum graticule resolution to 0.5 degrees.
//      Include meridians at 0.5 degree intervals.
//      Display a maximum elevation figure for each 0.5 degree quadrangle.

var Mef = (function() {

    var numLines = 10;

    var mins = [
        30, // 0.5
        60, // 1
        60 * 2,
        60 * 5,
        60 * 10,
        60 * 20,
        60 * 30,
    ];

    var dLat,
        dLng;

    function _(map, sexagesimal) {
        // default to decimal intervals
        // this.sex_ = sexagesimal || false;
        this.set('container', document.createElement('DIV'));

        this.show();

        this.setMap(map);
    }
    _.prototype = new google.maps.OverlayView();
    _.prototype.addDiv = function(div) {
        this.get('container').appendChild(div);
    },
    _.prototype.onAdd = function() {
        var self = this;
        this.getPanes().mapPane.appendChild(this.get('container'));

        function redraw() {
            self.draw();
        }
        this.idleHandler_ = google.maps.event.addListener(this.getMap(), 'idle', redraw);

        function changeColor() {
            self.draw();
        }
        changeColor();
        this.typeHandler_ = google.maps.event.addListener(this.getMap(), 'maptypeid_changed', changeColor);
    };
    _.prototype.clear = function() {
        var container = this.get('container');
        while (container.hasChildNodes()) {
            container.removeChild(container.firstChild);
        }
    };
    _.prototype.onRemove = function() {
        this.get('container').parentNode.removeChild(this.get('container'));
        this.set('container', null);
        google.maps.event.removeListener(this.idleHandler_);
        google.maps.event.removeListener(this.typeHandler_);
    };
    _.prototype.show = function() {
        this.get('container').style.visibility = 'visible';
    };
    _.prototype.hide = function() {
        this.get('container').style.visibility = 'hidden';
    };

    function leThenReturn(x, l, d) {
        for (var i = 0; i < l.length; i += 1) {
            if (x <= l[i]) {
                return l[i];
            }
        }
        return d;
    }

    function latLngToPixel(overlay, lat, lng) {
        return overlay.getProjection().fromLatLngToDivPixel(
      new google.maps.LatLng(lat, lng));
    };

    // calculate rounded MEF interval in decimals of degrees for supplied
    // lat/lon span return is in minutes
    function gridInterval(dDeg, mins) {
        return leThenReturn(Math.ceil(dDeg / numLines * 6000) / 100, mins, 30) / 60;
    }

    function npx(n) {
        return n.toString() + 'px';
    }

    function makeMEFLabel(color, x, y, text) {
        var d = document.createElement('DIV');
        var s = d.style;
        s.position = 'absolute';
        s.left = npx(x);
        s.top = npx(y);
        s.color = color;
        s.opacity = 0.8;
        s.width = '3em';
        if (this.map.getZoom() < 10) {
            s.fontSize = '2em';
        }
        else {
            s.fontSize = '3em';
        }
        s.fontStyle = 'bold';
        s.whiteSpace = 'nowrap';
        d.innerHTML = text;
        return d;
    };

    function eqE(a, b, e) {
        if (!e) {
            e = Math.pow(10, -6);
        }
        if (Math.abs(a - b) < e) {
            return true;
        }
        return false;
    }

    // Redraw the MEF based on the current projection and zoom level
    _.prototype.draw = function() {

        this.clear();

        // determine graticule interval
        var bnds = map.getBounds();
        if (!bnds) {
            // The map is not ready yet.
            return;
        }

        var sw = bnds.getSouthWest(),
            ne = bnds.getNorthEast();

        var l = sw.lng(),
            b = sw.lat(),
            r = ne.lng(),
            t = ne.lat();

        // grid interval in degrees
        // var mins = mins_list(this);
        dLat = dLng = gridInterval(t - b, mins);

        // round iteration limits to the computed grid interval
        l = Math.floor(l / dLng) * dLng;
        b = Math.floor(b / dLat) * dLat;
        t = Math.ceil(t / dLat) * dLat;
        r = Math.ceil(r / dLng) * dLng

        if (r == l) l += dLng;

        if (r < l) r += 360.0;

        if (dLat == 0.5) {
            for (la = b; la <= t; la += dLat) {
                for (var lo = l; lo < r; lo += dLng) {

                    var p = latLngToPixel(this, la + 0.25, lo + 0.25)

                    // Position the MEF in the center of the quadrangle
                    var py = p.y -20;
                    var px = p.x -10;

                    this.addDiv(makeMEFLabel("#00f",
                        px, py, "<div class='mef'>2<sup>1</sup></div"));
                }
            }
        }
    };

    return _;
})();