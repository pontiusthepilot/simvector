var geographic = {
    geocoder: new google.maps.Geocoder(),
    elev: new google.maps.ElevationService(),

    //** returns and address or a placename matching a given position **//
    getAddress: function(latLng) {

        const resutsObj = new $.Deferred();
        //Return object
        let rtnData = {};

        // Reverse geocode

        this.geocoder.geocode({ 'location': latLng }, function(results, status) {

            if (status === 'OK') {
                if (results[0]) {
                    rtnData.results = results;
                    rtnData.message = '';
                    rtnData.status = status;
                    resutsObj.resolve(rtnData);

                } else {

                    rtnData.results = results;
                    rtnData.message = 'No results found';
                    rtnData.status = status;
                    resutsObj.resolve(rtnData);

                }
            } else {

                resutsObj.reject('Geocoder failed due to: ' + status);

            }
        });

        return resutsObj.promise();

    },

    //** returns and address or a placename matching a given position **//
    getElevation: function(latLng) {

        const resutsObj = new $.Deferred();
        //Return object
        let rtnData = {};

        // Reverse geocode
        this.elev.getElevationForLocations({ 'locations': [latLng] }, function(results, status) {

            if (status === 'OK') {
                if (results[0]) {

                    results[0].elevationFt = results[0].elevation * 3.28084;

                    rtnData.elevation = results;
                    rtnData.message = '';
                    rtnData.status = status;
                    resutsObj.resolve(rtnData);

                } else {

                    results[0].elevationFt = 0;

                    rtnData.elevation = results;
                    rtnData.message = 'No results found';
                    rtnData.status = status;
                    resutsObj.resolve(rtnData);

                }
            } else {

                resutsObj.reject('The elevation service failed due to: ' + status);

            }
        });

        return resutsObj.promise();

    },

    //** returns and address or a placename matching a given position **//
    getMagneticDeclination: function(latLng) {

        const resutsObj = new $.Deferred();

        //Return object
        rtnData = {};

        //https://www.ngdc.noaa.gov/geomag/help/declinationHelp.html
        url = 'https://www.ngdc.noaa.gov/geomag-web/calculators/calculateDeclination?lat1=' + latLng.lat() + '&lon1=' + latLng.lng() + '&resultFormat=xml';

        $.ajax({
                url: url,
                type: 'get',
                dataType: 'xml'
            })
            .done(function(data) {
                $xml = $(data),
                    $declination = $xml.find('declination');

                rtnData.declination = $declination.text();

                resutsObj.resolve(rtnData);
            })
            .fail(function(jqXHR, textStatus) {
                resutsObj.reject('Magnetic declination search failed');
            });

        return resutsObj.promise();
    },

    // getCurrentPosition: function(position)
    // {
    //     if( navigator.geolocation )
    //     {
    //         // Call getCurrentPosition with  addLocationAndPan and failure callbacks
    //         navigator.geolocation.getCurrentPosition(  addLocationAndPan, fail );
    //     }
    //     else
    //     {
    //         alert("Sorry, your browser does not support geolocation services.");
    //     }
    // },

    locateAddress: function(address) {

        const resutsObj = new $.Deferred();
        const position = new google.maps.LatLng();
        let rtnData = {};

        this.geocoder.geocode({ address: address }, function(results, status) {
            if (status === 'OK') {
                latLng = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());

                rtnData = {
                    latLng: latLng,
                    formatted_address: results[0].formatted_address
                };
                resutsObj.resolve(rtnData);
            } else {
                resutsObj.reject('Failed to locate the address');
            }
        });

        return resutsObj;
    },

    locateLatLng: function(latLng) {

        if (/^[NS]\s?\d{1,2}\°\s?\d{1,2}\.?\d*['′]\,?\s?[EW]\s?\d{1,3}\°\s?\d{1,2}\.?\d*\s?['′]|^\d{1,2}\°\s?\d{1,2}\.?\d*['′]\s?[NS]\,?\s?\d{1,3}\°\s?\d{1,2}\.?\d*\s?['′]\s?[EW]|^[EW]\s?\d{1,3}\°\s?\d{1,2}\.?\d*\s?['′]\,?\s?[NS]\s?\d{1,2}\°\s?\d{1,2}\.?\d*['′]|^\d{1,3}\°\s?\d{1,2}\.?\d*\s?['′]\s?[EW]\,?\s?\d{1,2}\°\s?\d{1,2}\.?\d*['′]\s?[NS]/gmi.test(latLng)) // Degrees and decimal minutes.
        {
            return geographic.parseCoordinates(geographic.ddm2decimal(latLng));
        } else if (/^(?:[NS]\s?\d{1,2}?\°\s?\d{1,2}['′]\s?\d{1,2}\.?\d*\s?["″]\,?\s?[EW]\s?\d{1,3}?\°\s?\d{1,2}['′]\s?\d{1,2}\.?\d*\s?["″])|^(?:\d{1,2}?\°\s?\d{1,2}['′]\s?\d{1,2}\.?\d*\s?["″]\s?[NS]\,?\s?\d{1,3}?\°\s?\d{1,2}['′]\s?\d{1,2}\.?\d*\s?["″]\s?[EW])|^(?:[EW]\s?\d{1,3}?\°\s?\d{1,2}['′]\s?\d{1,2}\.?\d*\s?["″]\,?\s?[NS]\s?\d{1,2}?\°\s?\d{1,2}['′]\s?\d{1,2}\.?\d*\s?["″])|^(?:\d{1,3}?\°\s?\d{1,2}['′]\s?\d{1,2}\.?\d*\s?["″]\s?[EW]\,?\s?\d{1,2}?\°\s?\d{1,2}['′]\s?\d{1,2}\.?\d*\s?["″]\s?[NS])/gmi.test(latLng)) // Degrees, minites and seconds.
        {
            return geographic.parseCoordinates(geographic.dms2decimal(latLng, true));
        } else if (/^[NSEW]?\d+\°\d+['′][NSEW]?\s[NSEW]?\d+\°\d+['′][NSEW]?/.test(latLng)) // Degrees and minutes.
        {
            return geographic.parseCoordinates(geographic.dms2decimal(latLng, false));
        } else if (latLngArr = latLng.match(/^(\d{1,2}\.\d+)\°?\s*([NS])\,?\s*(\d{1,3}\.\d+)\°?\s*([EW])/mi)) // Decimal degrees (alphanumeric).
        // } else if (latLngArr = latLng.match(/^(\d{1,2}\.\d+)\°?\s*([NS])\,?\s*(\d{1,3}\.\d+)\°?\s*([EW])|([NS])\s*(\d{1,2}\.\d+)\°?\,?\s*([EW])\s*(\d{1,3}\.\d+)\°?|(\d{1,3}\.\d+)\°?\s*([EW])\,?\s*(\d{1,2}\.\d+)\°?\s*([NS])|([EW])\s*(\d{1,3}\.\d+)\°?\,?\s*([NS])\s*(\d{1,2}\.\d+)\°?/gmi)) // Decimal degrees (alphanumeric).
        {
            return geographic.parseCoordinates(geographic.ddNSEW2decimal(latLngArr));
        } else if (latLngArr = latLng.match(/^(?:Latitude)?\s?(\d{1,2}\.?\d+)\s?(?:longitude)\s?([+-]?\d{1,3}\.\d+)/mi)) // USGS.

        {
            // return geographic.parseCoordinates(geographic.USGS2decimal(latLngNumeric));
            return geographic.parseCoordinates(latLngArr[1] + ', ' + latLngArr[2]);

        } else // Decimal degrees (Numeric)
        {
            return (geographic.parseCoordinates(latLng));
        }

    },

    extractPlaces: function(types, results) {

        let placedata = {};
        placedata.country = '';
        placedata.state = '';

        let places = [];

        for (let result of results) {

            for (let address_comp of result.address_components) {
                places = places.concat(address_comp.long_name);

                if ($.inArray('country', address_comp.types) > -1) {
                    if (!placedata.country) {
                        placedata.country = address_comp.short_name;
                    }
                } else if ($.inArray('administrative_area_level_1', address_comp.types) > -1) {
                    if (!placedata.state) {
                        placedata.state = address_comp.short_name;
                    }
                }
            }

        }

        if (placedata.country === 'GB') {
            if (placedata.state === 'Northern Ireland') {
                placedata.state = 'NI';
            } else {
                placedata.state = 'GB';
            }

            placedata.country = 'UK';

        }

        placedata.places = Array.from(new Set(places));

        return placedata;
    },

    exclude: function(exList, resultTypes) {

        for (let resultType of resultTypes) {
            if (exList.indexOf(resultType) > -1) {
                return true;
            }
        }

        return false;
    },

    dms2decimal: function(dms, hasSeconds) {

        let gps = '';
        let gpsNs = '';
        let gpsEw = '';
        let degrees = 0;
        let degreesNorthSouth = '';
        let degreesEastWest = '';

        dms = dms.toUpperCase();

        let spiltAt = dms.search(' ');

        let checkParmeter = dms.slice(0, spiltAt);

        if (checkParmeter[0] == 'N' || 'S' || checkParmeter[checkParmeter.length - 1] == 'N' || 'S') {
            degreesNorthSouth = dms.slice(0, spiltAt);
            degreesEastWest = dms.slice(spiltAt + 1);
        } else {
            degreesEastWest = dms.slice(0, spiltAt);
            degreesNorthSouth = dms.slice(spiltAt + 1);
        }

        let nsParam = this.parseDms(degreesNorthSouth, hasSeconds);

        degrees = nsParam.degrees + (nsParam.minutes / 60);

        if (hasSeconds) {
            degrees += (nsParam.seconds / 3600);
        }

        gpsNs = (nsParam.nsew === 'S' ? '-' : '') + degrees;

        nsParam = this.parseDms(degreesEastWest, hasSeconds);

        degrees = nsParam.degrees + (nsParam.minutes / 60);

        if (hasSeconds) {
            degrees += (nsParam.seconds / 3600);
        }

        gpsEw = (nsParam.nsew === 'W' ? '-' : '') + degrees;

        gps = gpsNs + ', ' + gpsEw;

        return gps;
    },

    ddm2decimal: function(dms) {

        let gps = '';
        let gpsNs = '';
        let gpsEw = '';
        let degrees = 0;
        let degreesNorthSouth = '';
        let degreesEastWest = '';

        dms = dms.toUpperCase();

        let spiltAt = dms.search(' ');

        let checkParmeter = dms.slice(0, spiltAt);

        if (checkParmeter[0] == 'N' || 'S' || checkParmeter[checkParmeter.length - 1] == 'N' || 'S') {
            degreesNorthSouth = dms.slice(0, spiltAt);
            degreesEastWest = dms.slice(spiltAt + 1);
        } else {
            degreesEastWest = dms.slice(0, spiltAt);
            degreesNorthSouth = dms.slice(spiltAt + 1);
        }

        let nsParam = this.parseDdm(degreesNorthSouth);

        degrees = nsParam.degrees + nsParam.minutes / 60;

        gpsNs = (nsParam.nsew === 'S' ? '-' : '') + degrees;

        nsParam = this.parseDdm(degreesEastWest);

        degrees = nsParam.degrees + nsParam.minutes / 60;

        gpsEw = (nsParam.nsew === 'W' ? '-' : '') + degrees;

        gps = gpsNs + ', ' + gpsEw;

        return gps;
    },

    ddNSEW2decimal: function(dmsArray) {

        let gps = '';
        // let gpsNs = '';
        // let gpsEw = '';
        // let degrees = 0;
        let degreesNorthSouth = '';
        let degreesEastWest = '';

        if (!$.isNumeric(dmsArray[1])) {
          // Hemisphre precedes the coordinate N 33.2579° W 116.2334°
          if (dmsArray[1] == 'E' || dmsArray[1] == 'W') {
            //Latitude first
            degreesEastWest = (dmsArray[1] == 'W'? '-' : '') + dmsArray[2];
            degreesNorthSouth = (dmsArray[3] == 'S'? '-' : '') + dmsArray[4];
          } else {
            //Longitude first
            degreesNorthSouth = (dmsArray[1] == 'S'? '-' : '') + dmsArray[4];
            degreesEastWest = (dmsArray[3] == 'W'? '-' : '') + dmsArray[2];
          }
        } else {
          // Hemisphere follows the coordinate 33.2579° N 116.2334° W
          if (dmsArray[2] == 'E' || dmsArray[2] == 'W') {
            //Latitude first
            degreesEastWest = (dmsArray[2] == 'W'? '-' : '') + dmsArray[1];
            degreesNorthSouth = (dmsArray[4] == 'S'? '-' : '') + dmsArray[3];
          } else {
            //Longitude first
            degreesNorthSouth = (dmsArray[2] == 'S'? '-' : '') + dmsArray[1];
            degreesEastWest = (dmsArray[4] == 'W'? '-' : '') + dmsArray[3];
          }
        }

        // dms = dms.toUpperCase();

        // dmsArray = dms.match(/^(\d{1,2}\.\d+)\°?\s?([NS])\,?\s?(\d{1,3}\.\d+)\°?\s?([EW])/gm);

        // let spiltAt = dms.search(' ');
        //
        // let checkParmeter = dms.slice(0, spiltAt);
        //
        // if (checkParmeter[0] == 'N' || 'S' || checkParmeter[checkParmeter.length - 1] == 'N' || 'S') {
        //     // Lattitude first
        //     degreesNorthSouth = dms.slice(0, spiltAt);
        //     degreesEastWest = dms.slice(spiltAt + 1);
        // } else {
        //     // Lattitude first
        //     degreesEastWest = dms.slice(0, spiltAt);
        //     degreesNorthSouth = dms.slice(spiltAt + 1);
        // }
        //
        //
        // let nsParam = this.parseNSEWDd(degreesNorthSouth);
        // degrees = nsParam.degrees;
        //
        // gpsNs = (nsParam.nsew === 'S' ? '-' : '') + degrees;
        //
        // nsParam = this.parseNSEWDd(degreesEastWest);
        //
        // degrees = nsParam.degrees;
        //
        // gpsEw = (nsParam.nsew === 'W' ? '-' : '') + degrees;
        //
        // gps = gpsNs + ', ' + gpsEw;

        gps = degreesNorthSouth + ', ' + degreesEastWest;

        return gps;
    },


    parseNSEWDd: function(ddm) {

        let ddmObj = {};

        if ($.isNumeric(ddm[0])) {
            ddmObj.nsew = ddm[ddm.length - 1];
            ddmObj.degrees = parseFloat(ddm.substring(0, ddm.indexOf('°')));
        } else {
            ddmObj.nsew = ddm.substr(0, 1);
            ddmObj.degrees = parseFloat(ddm.substring(1, ddm.indexOf('°')));
        }

        return ddmObj;
    },

    parseDms: function(dms, hasSeconds = true) {

        let ddmObj = {};

        dms.replace("ʹ", "'");

        if ($.isNumeric(dms[0])) {
            ddmObj.nsew = dms[dms.length - 1];
            ddmObj.degrees = parseInt(dms.substring(0, dms.indexOf('°')));
        } else {
            ddmObj.nsew = dms.substr(0, 1);
            ddmObj.degrees = parseInt(dms.substring(1, dms.indexOf('°')));

        }

        ddmObj.minutes = parseFloat(dms.substring(dms.indexOf('°') + 1, dms.indexOf("'")));

        if (hasSeconds) {
            ddmObj.seconds = parseFloat(dms.substring(dms.indexOf("'") + 1));
        }

        return ddmObj;
    },

    parseDdm: function(ddm) {

        let ddmObj = {};

        if ($.isNumeric(ddm[0])) {
            ddmObj.nsew = ddm[ddm.length - 1];
            ddmObj.degrees = parseInt(ddm.substring(0, ddm.indexOf('°')));
        } else {
            ddmObj.nsew = ddm.substr(0, 1);
            ddmObj.degrees = parseInt(ddm.substring(1, ddm.indexOf('°')));
        }

        ddmObj.minutes = parseFloat(ddm.substring(ddm.indexOf('°') + 1));

        return ddmObj;
    },

    // decimalDegrees2dms: function(coords)
    // {
    //     let  dms = '';
    //     let  ddObj = {};
    //     let  seconds = 0;
    //     let  minutes = 0;

    //     position = this.parseCoordinates(coords);

    //     //Calculate degrees North-South

    //     ddObj = this.parseDecimalDegrees(position.lat());

    //     dms = (ddObj.nsew === '-' ? 'S' : 'N') + ddObj.degrees + '°';

    //     minutes = Math.floor(60 * ddObj.minutes);
    //     dms += minutes;

    //     seconds = 3600 * ddObj.minutes - 60 * minutes;

    //     dms += '"' + seconds.toFixed(1) + "'";

    //     //Calculate degrees East-West

    //     ddObj = this.parseDecimalDegrees(position.lng());

    //     dms += ' ' + ddObj.nsew === '-' ? 'W' : 'N' + ddObj.degrees + '°';

    //     minutes = Math.floor(60 * ddObj.minutes);
    //     dms += minutes;

    //     seconds = 3600 * ddObj.minutes - 60 * minutes;
    //     dms += '"' + seconds.toFixed(1) + "'";

    //     return dms;

    // },

    //input  coords  float  decimal degrees
    //output dms     string degrees minutes and decimal seconds
    decimalDegrees2dms: function(coords) {

        var dms = '';
        var ddObj = {};
        var seconds = 0;
        var minutes = 0;

        position = this.parseCoordinates(coords);

        //Calculate degrees North-South

        dms = this.latDecimalDegrees(this.parseDecimalDegrees(position.lat()))

        //Calculate degrees East-West

        dms += ', ' + this.lngDecimalDegrees(this.parseDecimalDegrees(position.lng()));

        return dms;

    },

    //input  coord  float  decimal degrees?
    //output dms    string degrees minutes and seconds
    latDecimalDegrees: function(coord) {

        dms = (coord.nsew === '-' ? 'S' : 'N') + coord.degrees + '°';

        minutes = Math.floor(60 * coord.minutes);
        dms += minutes;

        seconds = 3600 * coord.minutes - 60 * minutes;

        dms += '"' + seconds.toFixed(2) + "'";

        return dms;

    },

    //input  coord  float  decimal degrees?
    //output dms    string degrees minutes and seconds
    lngDecimalDegrees: function(coord) {

        var dms = (coord.nsew == '-' ? 'W' : 'E') + coord.degrees + '°';

        minutes = Math.floor(60 * coord.minutes);
        dms += minutes;

        seconds = 3600 * coord.minutes - 60 * minutes;
        dms += '"' + seconds.toFixed(2) + "'";

        return dms;

    },

    parseDecimalDegrees: function(coord) {

        let ddObj = {};
        ddObj.nsew = coord < 0 ? '-' : '+';
        ddObj.degrees = Math.floor(Math.abs(coord));

        ddObj.minutes = parseFloat((Math.abs(coord) - ddObj.degrees).toFixed(6));

        return ddObj;

    },

    parseCoordinates: function(coordStr) {

        if (coordStr) {
            let spiltAt = coordStr.search(', ');
            let position = {};

            let northSouth = parseFloat(coordStr.slice(0, spiltAt).trim());
            let eastWest = parseFloat(coordStr.slice(spiltAt + 1).trim());

            if (isNaN(northSouth) || isNaN(eastWest)) {
                return 'Invalid Coordinates';
            }

            latLng = new google.maps.LatLng(northSouth, eastWest);

            return latLng;
        }

        return false;

    },

};

// module.exports = geographic;
