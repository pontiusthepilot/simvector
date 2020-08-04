var mathematic =
{
    roundTo: function (n, digits) {
        var negative = false;
        if (digits === undefined) {
            digits = 0;
        }
        if (n < 0) {
            negative = true;
            n = n * -1;
        }
        var multiplicator = Math.pow(10, digits);
        n = parseFloat((n * multiplicator).toFixed(11));
        n = (Math.round(n) / multiplicator).toFixed(digits);
        if (negative) {
            n = (n * -1).toFixed(digits);
        }
        return digits > 0 ? parseFloat(n) : parseInt(n);
    },

    toRadians: function (value) {
        return value * Math.PI / 180;
    },

    /**
     * @param rad - The radians to be converted into degrees
     * @return degrees
     */
    toDegrees : function(rad) {
        return rad * 180 / Math.PI;
    },

    calcDistance: function (fromLatLng, toLatLng)
    //This uses the ‘haversine’ formula to calculate the great-circle distance between two points.
    {
        distance = {
            kilometers: 0,
            statuteMiles: 0,
            nauticalMiles: 0
        };

        var earthRadius = 6371; // km
        var φ1 = this.toRadians(fromLatLng.lat());
        var φ2 = this.toRadians(toLatLng.lat());
        var Δφ = this.toRadians(toLatLng.lat()-fromLatLng.lat());
        var Δλ = this.toRadians(toLatLng.lng()-fromLatLng.lng());

        var halfChordSquared = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);

        var angularDistRad = 2 * Math.atan2(Math.sqrt(halfChordSquared), Math.sqrt(1-halfChordSquared));

        distance.kilometers = earthRadius * angularDistRad;
        distance.statuteMiles = distance.kilometers * 0.62137119;
        distance.nauticalMiles = distance.kilometers * 0.539957;

        return distance;
    },

    absoluteBearing : function (p1x,p1y,p2x,p2y) {

        // angle in radians
        var angleRadians = Math.atan2(p2y - p1y, p2x - p1x);

        // angle in degrees
        var angleDeg = this.toDegrees(angleRadians);

        if (angleDeg < 0) {
            bearing = 360 + angleDeg;
        }
        else {
            bearing = angleDeg;
        }

        return bearing;
    },

};