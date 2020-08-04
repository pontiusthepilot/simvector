var map = {};

$(document).on('contextmenu', function (e)
{
    //console.log(e);
    if (e.target.offsetParent.id === "waypointsGrid") {
      return false;
    }
});

$(document).ready(function()
{

    simvector.init();

});

var simvector = 
{
    currowid: 0,
    newrowid: 0,
    markers: [],
    waypoints: [],
    curinfowindow: {},

    init: function()
    {
        var latLng = new google.maps.LatLng(0, 0);

        simvector.initMap(latLng);
        simvector.initObjects();
        simvector.initEvents();

    },

    initMap: function(latLng)
    {
        // Prepare the map options
        var mapOptions =
        {
          zoom: 3,
          center: latLng,
          zoomControl: true,
          mapTypeControl: true,
          mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
              position: google.maps.ControlPosition.TOP_RIGHT
          },
          scaleControl: true,
          streetViewControl: false,
          rotateControl: true,
          fullscreenControl: false,
          mapTypeId: google.maps.MapTypeId.TERRAIN,
          styles:
          [
              {
                "featureType": "administrative.country",
                "elementType": "geometry.stroke",
                "stylers": [
                  {
                    "visibility": "on"
                  }
                ]
              },
              {
                "featureType": "administrative.land_parcel",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "administrative.land_parcel",
                "elementType": "geometry.stroke",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "administrative.land_parcel",
                "elementType": "labels.icon",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "administrative.land_parcel",
                "elementType": "labels.text",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "administrative.land_parcel",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "administrative.land_parcel",
                "elementType": "labels.text.stroke",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "administrative.neighborhood",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "administrative.neighborhood",
                "elementType": "geometry.stroke",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "administrative.neighborhood",
                "elementType": "labels.icon",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "administrative.neighborhood",
                "elementType": "labels.text",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "administrative.neighborhood",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "administrative.province",
                "elementType": "geometry.stroke",
                "stylers": [
                  {
                    "visibility": "on"
                  }
                ]
              },
              {
                "featureType": "landscape.man_made",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "color": "#eee75e"
                  },
                  {
                    "visibility": "on"
                  },
                  {
                    "weight": 8
                  }
                ]
              },
              {
                "featureType": "landscape.man_made",
                "elementType": "geometry.stroke",
                "stylers": [
                  {
                    "color": "#eee75e"
                  },
                  {
                    "weight": 1
                  }
                ]
              },
              {
                "featureType": "landscape.natural",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "visibility": "on"
                  }
                ]
              },
              {
                "featureType": "landscape.natural.landcover",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "landscape.natural.landcover",
                "elementType": "geometry.stroke",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "landscape.natural.terrain",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "visibility": "on"
                  }
                ]
              },
              {
                "featureType": "landscape.natural.terrain",
                "elementType": "geometry.stroke",
                "stylers": [
                  {
                    "weight": 4
                  }
                ]
              },
              {
                "featureType": "poi.business",
                "elementType": "geometry.stroke",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "poi.business",
                "elementType": "labels.icon",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "poi.business",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "poi.business",
                "elementType": "labels.text.stroke",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "poi.park",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "poi.park",
                "elementType": "labels.icon",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "road.arterial",
                "elementType": "labels",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "road.highway",
                "elementType": "labels",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "road.local",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "transit.line",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "color": "#d2d2d2"
                  },
                  {
                    "visibility": "on"
                  }
                ]
              },
              {
                "featureType": "transit.station.airport",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "color": "#e2844b"
                  },
                  {
                    "visibility": "on"
                  }
                ]
              }
            ]
        };

        // Create the map, and place it in the map_canvas div
        // simvector.map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

        //Mark latitude and longitude
        grid = new Graticule(map, true);

        var a = grid.getGridInterval();

        mefGrid = new Mef(map, true);

        //Create the menu and attached it to the map
        var menu = new contextMenu({ map: map });

        menu.addItem('Departure', function (map, latLng) {
            simvector.addLocation(latLng, {type: 'Departure'});
        });

        menu.addItem('Destination', function (map, latLng) {
            simvector.addLocation(latLng, {type: 'Destination'});
        });

        menu.addItem('Waypoint', function (map, latLng) {
            simvector.addLocation(latLng, {type: 'Waypoint'});
        });

        menu.addSep();

        menu.addItem('Center Here', function (map, latLng) {
            map.panTo(latLng);
        });

    },

    initObjects: function()
    {
        $('#lat_long_dialog').dialog({
            resizable: false,
            height: "auto",
            width: 400,
            modal: true,
            autoOpen: false,
            dialogClass: 'dialog_style',
            create: function() {
              $(this).dialog('widget')
                // find the title bar element
                .find('.ui-dialog-titlebar')
                // alter the css classes
                .removeClass('ui-corner-all')
                .addClass('dialog_header_style');
            },
            open: function() {
              $(this).dialog('widget')
                // find the title bar element
                .find('.search_term').val('');
            },
            buttons: {
                "Search": function() {

                    position = geographic.parseCoordinates($('#lat_long_dialog_coords').val());

                    map.panTo(position);
                    map.setZoom(16);

                    $( this ).dialog( "close" );
              },
              Cancel: function() {
                $( this ).dialog( "close" );
              }
            }
          }
        );

        $('#address_dialog').dialog({
            resizable: false,
            height: "auto",
            width: 400,
            modal: true,
            autoOpen: false,
            dialogClass: 'dialog_style',
            create: function() {
              $(this).dialog('widget')
                // find the title bar element
                .find('.ui-dialog-titlebar')
                // alter the css classes
                .removeClass('ui-corner-all')
                .addClass('dialog_header_style');
            },
            open: function() {
              $(this).dialog('widget')
                // find the title bar element
                .find('.search_term').val('');
            },
            buttons: {
              "Search": function() {

                simvector.locateAddress($('#address_dialog_addess').val());

                $( this ).dialog( "close" );
              },
              Cancel: function() {
                $( this ).dialog( "close" );
              }
            }
          }
        );

        $('#waypoint_dialog').dialog({
            resizable: false,
            height: "auto",
            width: 1000,
            modal: true,
            autoOpen: false,
            dialogClass: 'dialog_style',
            create: function() {
              $(this).dialog('widget')
              // find the title bar element
              .find('.ui-dialog-titlebar')
              // alter the css classes
              .removeClass('ui-corner-all')
              .addClass('dialog_header_style');
            },
            buttons: {
              "Save": function() {

                rdata = {
                    waypoint:$('#wdWaypoint').val(),
                    placeName: $('#wdDescription').val(),
                    groundSpeed: $('#wdGroundSpeed').val(),
                    passingAlt: $('#wdPassingAltitude').val(),
                    notes: $('#wdNotes').val(),
                };

                $('#waypointsGrid').addRowData(simvector.currowid, rdata, 'last');

                $( this ).dialog( "close" );
              },
              Cancel: function() {
                $( this ).dialog( "close" );
              }
            }
          }
        );

        $("#waypointsGrid").jqGrid({
            caption: "Waypoints",
            rownumbers: true,
            datatype: "local",
            height: 410,
            width: $('#waypointsGridWrapper').width(),
            shrinkToFit: false,
            colModel: [
                { name: "heading", label: "Heading °M", width: '66px', sortable: false },
                { name: "waypoint", label: "Waypoint", width: "66px", sortable: false },
                { name: "placeName", label: "Description", width: "150px", sortable: false },
                { name: "distance", label: "Dist (nm)", width: '60px', sortable: false },
                { name: "time", label: "Time", width: '60px', sortable: false },
                { name: "trackM", label: "Track °M", width: '60px', sortable: false },
                { name: "trackT", label: "Track °T", width: '60px', sortable: false },
                { name: "groundSpeed", label: "GS (kts)", width: '60px', sortable: false },
                { name: "groundElevation", label: "MEF (ft)", width: '80px', sortable: false },
                { name: "latDMS", label: "Latitude", width: "90px", sortable: false },
                { name: "longDMS", label: "Longitude", width: "90px", sortable: false },
                { name: "passingAlt", label: "Passing Alt (ft)", width: "90px",sortable: false },
                { name: "notes", label: "Notes", width: '300px', sortable: false },
                { name: "latLong", label: "latLong", width: "50px", sortable: false, editable: false, hidden:true },
            ],
            onRightClickRow: function (id)
            {
                if (!$.isEmptyObject(simvector.curinfowindow))
                {
                    simvector.curinfowindow.close();
                }

                simvector.currowid = id;

                $('#wdWaypoint').val($("#waypointsGrid").getCell(simvector.currowid, 'waypoint'));
                $('#wdDescription').val($("#waypointsGrid").getCell(simvector.currowid, 'placeName'));
                $('#wdGroundSpeed').val($("#waypointsGrid").getCell(simvector.currowid, 'groundSpeed'));
                $('#wdPassingAltitude').val($("#waypointsGrid").getCell(simvector.currowid, 'passingAlt'));
                $('#wdNotes').val($("#waypointsGrid").getCell(simvector.currowid, 'notes'));

                var distance = $("#waypointsGrid").getCell(simvector.currowid, 'distance');

                $('#waypoint_dialog').dialog({
                    buttons: {
                      "Save": function() {

                        var wpg = $("#waypointsGrid");

                        wpg.setCell(simvector.currowid, 'waypoint', $('#wdWaypoint').val()),
                        wpg.setCell(simvector.currowid, 'placeName', $('#wdDescription').val()),
                        wpg.setCell(simvector.currowid, 'groundSpeed', $('#wdGroundSpeed').val()),
                        wpg.setCell(simvector.currowid, 'passingAlt', $('#wdPassingAltitude').val()),
                        wpg.setCell(simvector.currowid, 'notes', $('#wdNotes').val() === '' ? null : $('#wdNotes').val()),
                        wpg.setCell(simvector.currowid, 'latLong',latLng.lat() + ', ' + latLng.lng())
                        
                        time = $('#wdGroundSpeed').val() === 0 ? 0 : mathematic.roundTo(distance / $('#wdGroundSpeed').val() * 60, 2);

                        wpg.setCell(simvector.currowid, 'time', time),

                        $( this ).dialog( "close" );
                      },
                      Cancel: function() {
                        $( this ).dialog( "close" );
                      }
                    }
                  }
                );

                $('#waypoint_dialog').dialog('open');

            }  
        });
      
        $(window).bind('resize', function() {
            $("#waypointsGrid").setGridWidth($('#waypointsGridWrapper').width());
        });
      
    },

    initEvents: function()
    {
        $('#locationspannel').hide();

        $("[name='gohome']").click(function()
        {
            simvector.getCurrentPosition();
        });

        $("[name='address']").click(function()
        {
            $('#address_dialog').dialog('open');
        });

        $("[name='lat_long']").click(function()
        {
            $('#lat_long_dialog').dialog('open');
        });

        $("[name='show_data']").click(function()
        {
            var parent = this;

            $('#locationspannel').show(250);
          
            $("[name='show_data']").attr("disabled", "disabled");
          
        });
      
        $('#waypointsGridHide').click(function() 
        {
            var parent = this;

            $('#locationspannel').hide(250);
          
            $("[name='show_data']").removeAttr("disabled", "disabled");
          
        })
      
        $('#waypointsGridSave').click(function()
        {
          $('#waypointsGrid').restoreRow(simvector.currowid);
          
          var rows = $("#waypointsGrid").getRowData();

          var xml = simvector.writeFlightPlan(rows);
          
          var fplan = new File([xml], "simvector", {type: "text/xml"});
          
          var fn = simvector.getFileName(rows);
          
          saveAs(fplan, fn + '.pln');
          
        });

        $("[name='load_wpts']").click(function()
        {
            $('#file-input').click();
        });
      
        $('#file-input').change(function(e) {
            simvector.readSingleFile(e);
        });

    },

    addLocation: function(latLng, rdata, dialogNeeded = true)
    {
        var rtn = $.Deferred();
        var data, marker = {};

        $.when(geographic.getAddress(latLng), geographic.getElevation(latLng), geographic.getMagneticDeclination(latLng))
            .done(function(data1, data2, data3, fyiType, pan) {

                if (data1.status !== 'OK') {
                    window.alert(data1.message);
                } else if (data2.status !== 'OK') {
                    window.alert(data2.message);
                } else {
                    data = $.extend(data1, data2, data3);

                    data.dialogNeeded = dialogNeeded;
                  
                    switch (data.type) {
                    	case 'Departure':
                    	    icon =  {
                              path: google.maps.SymbolPath.CIRCLE,
                              scale: 4,
                              fillColor: "#F00",
                              fillOpacity: 0.4,
                              strokeWeight: 0.4
                          };
                    		break;
                    	case 'Destination':
                    	    icon =  {
                              path: google.maps.SymbolPath.CIRCLE,
                              scale: 4,
                              fillColor: "#F00",
                              fillOpacity: 0.4,
                              strokeWeight: 0.4
                          };
                    		break;
                    	case 'Waypoint':
                    	    icon =  {
                              path: google.maps.SymbolPath.CIRCLE,
                              scale: 4,
                              fillColor: "#00F",
                              fillOpacity: 0.4,
                              strokeWeight: 0.4
                          };
                    		break;
                    	default:
                    	    icon =  {
                              path: google.maps.SymbolPath.CIRCLE,
                              scale: 4,
                              fillColor: "#00F",
                              fillOpacity: 0.4,
                              strokeWeight: 0.4
                          };
                    		break;
                    }

                    var prevLatLng = $('#waypointsGrid').getCell(simvector.newrowid, 'latLong');

                    simvector.addWaypoint(geographic.parseCoordinates(prevLatLng), latLng, data).then(function(rdata)
                    {
                        if (rdata) {

                            var marker = simvector.addMarker(latLng, icon, rdata.placeName);

                            var infowindow = addInfoWindow(latLng, rdata, marker);

                            coords = latLng.lat()+', '+latLng.lng();

                            markerEntry = {};
                            markerEntry.marker = marker;
                            markerEntry.infowindow = infowindow;
                            markerEntry.rowid = simvector.newrowid;
                            markerEntry.type = data.type;

                            simvector.markers[coords] = markerEntry;

                            simvector.waypoints.push(latLng);

                            var polyline = new google.maps.Polyline({
                              path: simvector.waypoints,
                              strokeColor: "#FF0000",
                              strokeOpacity: 1.0,
                              strokeWeight: 2
                            });

                            polyline.setMap(map);

                        }
                      
                    });
                  
                    rtn.resolve(true);
                }
          })
          .fail(function(msg) {
              window.alert(msg);
          
              rtn.resolve(true);
          
          });
      
      return rtn.promise();
    },

    getCurrentPosition: function()
    {
        if( navigator.geolocation )
        {
            navigator.geolocation.getCurrentPosition(  function(position)
            {
                
                var coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                map.panTo(coords);
                map.setZoom(16);
            },
            simvector.fail);
        }
        else
        {
            alert("Sorry, your browser does not support geolocation services.");
        }
    },

    fail: function()
    {
          alert('Could not obtain location');
    },

    locateAddress: function(address)
    {
        var p = geographic.locateAddress(address);

        p.done(function(data)
        {

          map.panTo(data.latLng);
          map.setZoom(16);

        })
        .fail(function(msg)
        {
            window.alert(msg);
        });

    },

    extractPlaces: function(results)
    {

        let types = [];

        return geographic.extractPlaces(types, results);
    },

    // extractPlaces: function(results)
    // {

    //     var rtn =
    //     {
    //         country : false,
    //         state : false,
    //         placename : false
    //     };

    //     var types = ['natural_feature', 'point_of_interest', 'premise', 'locality', 'postal_town', 'administrative_area_level_1', 'country'];
    //     var exclude = ['bus_station'];
    //     var place = {};

    //     places = geographic.extractPlaces(types, results, exclude);

    //     for (let type of types)
    //     {
    //         place = places[type];
    //         if (place !== undefined)
    //         {
    //             break;
    //         }
    //     }

    //     var components = geographic.extractResults(types, place.address_components, exclude);

    //     for (let type of types)
    //     {
    //         var component = components[type];
    //         if (component !== undefined)
    //         {
    //             if ($.inArray('country', component.types) > -1)
    //             {
    //                 if (!rtn.country)
    //                 {
    //                     rtn.country = component.short_name;
    //                 }
    //             }
    //             else if ($.inArray('administrative_area_level_1', component.types) > -1)
    //             {
    //                 if (!rtn.state)
    //                 {
    //                     rtn.state = component.short_name;
    //                 }
    //             }
    //             else
    //             {
    //                 if (!rtn.placename)
    //                 {
    //                     rtn.placename = component.long_name;
    //                 }
    //             }
    //         }
    //     }

    //     if (rtn.country === 'GB')
    //     {
    //         if (rtn.state === 'Northern Ireland')
    //         {
    //             rtn.state = 'NI';
    //         }
    //         else
    //         {
    //             rtn.state = 'GB';
    //         }

    //         rtn.country = 'UK';

    //     }

    //     return rtn;

    // },

    addWaypoint: function(prevLatLng, latLng, data)
    {
        // var rtn = $.Deferred();
        // var place = simvector.extractPlaces(data.results);

        // var waypoint = Math.round(data.elevation[0].elevationFt).toString();
        // var tag = 'CB ';
        // var rdata = {};

        // switch(place['country'])
        // {
        //     case 'AU':
        //     case 'CA':
        //     case 'US':
        //     case 'UK':
        //       waypoint += place['state'];
        //       tag += place['state' ];
        //       break;
        //     default:
        //       waypoint += place['country'];
        //       tag += place['country'];
        //       break;
        // }
      
        let rtn = $.Deferred();
        let places = this.extractPlaces(data.results);

        let identifier = Math.round(data.elevation[0].elevationFt).toString();
        let tag = 'CB ';
        let rdata = {};

        switch(places.country)
        {
            case 'AU':
            case 'CA':
            case 'US':
            case 'UK':
              identifier += places.state;
              tag += places.state;
              break;
            default:
              identifier += places.country;
              tag += places.country;
              break;
        }

        $('#wdWaypoint').val(data.waypoint ? data.waypoint : identifier);
        // $('#wdDescription').val(places['placename'] === false ? waypoint : places['placename']);

        $('#wdDescription').find('option').remove().end()
        
        for (let place of places.places) {
             $('#wdDescription').append('<option value="'+place+'">'+place+'</option>');       
        }

        $('#wdGroundSpeed').val(0);
        $('#wdPassingAltitude').val(0);
        $('#wdNotes').val('');

        $('#waypoint_dialog').dialog({
            buttons: {
              "Save": function() {
            
                data.waypoint = $('#wdWaypoint').val();
                data.placeName = $('#wdDescription').val()
                data.groundSpeed = $('#wdGroundSpeed').val();
                data.passingAlt = $('#wdPassingAltitude').val();
                data.notes = $('#wdNotes').val();
                
                rdata = simvector.buildWaypointFromRecievedData(prevLatLng, latLng, data);

                $('#waypointsGrid').addRowData(simvector.newrowid, rdata, 'last');
                
                rtn.resolve(rdata);

                $( this ).dialog( "close" );
              },
              Cancel: function() {

                rtn.resolve(false);

                $( this ).dialog( "close" );
              }
            }
          }
        );
      
        if (!simvector.newrowid)
        {
            simvector.newrowid = 1;
        }
        else
        {
            simvector.newrowid++;
        }
      
        if (data.dialogNeeded) {
          $('#waypoint_dialog').dialog('open');
        } else {
          rdata = simvector.buildWaypointFromRecievedData(prevLatLng, latLng, data);
          
          $('#waypointsGrid').addRowData(simvector.newrowid, rdata, 'last');

          rtn.resolve(rdata);
        }

        return rtn.promise();

    },
  
    buildWaypointFromRecievedData: function(prevLatLng, latLng, data) {
      
      var dec = parseFloat(data.declination);
      
      rdata =
      {
          heading: prevLatLng === false ? 0 : mathematic.roundTo(mathematic.absoluteBearing(prevLatLng.lat(), prevLatLng.lng(), latLng.lat(), latLng.lng()) + dec, 0),
          waypoint: data.waypoint,
          placeName: data.placeName,
          distance: prevLatLng === false ? 0 : mathematic.roundTo(mathematic.calcDistance(prevLatLng, latLng).nauticalMiles, 2),
          groundSpeed: data.groundSpeed,
          groundElevation:parseInt(data.elevation[0].elevationFt),
          trackM: prevLatLng === false ? 0 : mathematic.roundTo(mathematic.absoluteBearing(prevLatLng.lat(), prevLatLng.lng(), latLng.lat(), latLng.lng()) + dec, 0),
          trackT: prevLatLng === false ? 0 : mathematic.roundTo(mathematic.absoluteBearing(prevLatLng.lat(), prevLatLng.lng(), latLng.lat(), latLng.lng()), 0),
          passingAlt: data.passingAlt,
          notes: data.notes,
          latDMS: geographic.latDecimalDegrees(geographic.parseDecimalDegrees(latLng.lat())),
          longDMS: geographic.lngDecimalDegrees(geographic.parseDecimalDegrees(latLng.lng())),
          latLong: latLng.lat() + ', ' + latLng.lng(),
          time: 0
      };

      rdata.time = rdata.groundSpeed == 0 ? 0 : mathematic.roundTo(rdata.distance / rdata.groundSpeed, 2);

      return rdata;
    },
  
    addMarker: function (latLng, icon = null, title=null)
    {
        // var rowData = {};
        var marker = new google.maps.Marker({
            position: latLng,
            map: map,
            title: title == null ? "Your current location!" : title,
            icon: icon
        });

        return marker;
    },

    readSingleFile:function(e)
    {
        var file = e.target.files[0];
        if (!file)
        {
          return;
        }

        var reader = new FileReader();

        reader.onload = function(e)
        {
            var contents = e.target.result;

            parser = new DOMParser();
            xmlDoc = parser.parseFromString(contents, "text/xml");

            var waypoints = xmlDoc.getElementsByTagName("ATCWaypoint");

            simvector.drawFlightPlanLeg(waypoints, 0);
        };

    reader.readAsText(file);

  },
  
  writeFlightPlan:function (rows)
  {

    parser = new DOMParser();
    var attrs = {},
        addTo = {parentNode:'', pnIndex:''},
        rowsEnd = rows.length - 1,
        wtype = '',
        newEle = '',
        icao = false;

    var sve = simvector.formatElevForFlightPlan;
    
    var xml  = parser.parseFromString('<?xml version="1.0" encoding="utf-8"?><SimBase.Document Type="AceXML" version="1,0"></SimBase.Document>', "application/xml");
    
    xmlScribe.writeNode(xml, "Descr", "SimBase.Document", "AceXML Document");
    
    xmlScribe.writeNode(xml, "FlightPlan.FlightPlan", "SimBase.Document", false);
    
    var textNode = rows[0].waypoint+' to '+rows[rowsEnd].waypoint;
    xmlScribe.writeNode(xml, "title", "FlightPlan.FlightPlan", textNode);
    
    xmlScribe.writeNode(xml, "FPType", "FlightPlan.FlightPlan", "VFR");
    xmlScribe.writeNode(xml, "CruisingAlt", "FlightPlan.FlightPlan", "3500");
    xmlScribe.writeNode(xml, "DepartureID", "FlightPlan.FlightPlan", rows[0].waypoint);
    
    xmlScribe.writeNode(xml, "DepartureLLA", "FlightPlan.FlightPlan", rows[0].latDMS+', '+rows[0].longDMS+', '+sve(rows[0].groundElevation, 6)+'.00');
    
    xmlScribe.writeNode(xml, "DestinationID", "FlightPlan.FlightPlan", rows[rowsEnd].waypoint);
    xmlScribe.writeNode(xml, "DestinationLLA", "FlightPlan.FlightPlan", rows[rowsEnd].latDMS+', '+rows[rowsEnd].longDMS+', '+sve(rows[rowsEnd].groundElevation, 6)+'.00');
    
    textNode = rows[0].waypoint+', '+rows[rowsEnd].waypoint;
    xmlScribe.writeNode(xml, "Descr", "FlightPlan.FlightPlan", textNode);
    
    xmlScribe.writeNode(xml, "DeparturePosition", "FlightPlan.FlightPlan", "10R");
    xmlScribe.writeNode(xml, "DepartureName", "FlightPlan.FlightPlan", rows[0].placeName);
    xmlScribe.writeNode(xml, "DestinationName", "FlightPlan.FlightPlan", rows[rowsEnd].placeName);
    
    xmlScribe.writeNode(xml, "AppVersion", "FlightPlan.FlightPlan");
    
    xmlScribe.writeNode(xml, "AppVersionMajor", "AppVersion", "10");

    xmlScribe.writeNode(xml, "AppVersionBuild", "AppVersion", "61472");
    
    for (i=0;i<rows.length;i++)
    {
      
      xmlScribe.writeNode(xml, "ATCWaypoint", "FlightPlan.FlightPlan");
      
      attrs = {id: rows[i].waypoint};
      xmlScribe.addAttrs(xml, "ATCWaypoint", attrs, i);
      
      addTo.parentNode = "ATCWaypoint"
      addTo.pnIndex = i;
      
      if  (i ===0 || i === rowsEnd) 
      {
        wtype = 'Airport';
        icao = rows[i].waypoint;
      }
      else
      {
        wtype = 'User';
        icao = false;
      }
      
      xmlScribe.writeNode(xml, "ATCWaypointType", addTo, wtype);
         
      xmlScribe.writeNode(xml, "WorldPosition", addTo,  rows[i].latDMS+', '+rows[i].longDMS+', '+sve(rows[i].groundElevation, 6)+'.00');
      
      if (icao)
      {
        
        xmlScribe.writeNode(xml, "ICAO", addTo);
        
        xmlScribe.createNode(xml, "ICAOIdent", addTo, rows[i].waypoint);
        
      }
      
    }
    
    var serializer = new XMLSerializer();
    var xmlString = serializer.serializeToString(xml);

    return xmlString;
  
  },
 
  getFileName:function (rows)
  {

    var  rowsEnd = rows.length - 1;

    var fn = rows[0].waypoint+'-'+rows[rowsEnd].waypoint;

    fn += ' '+rows[0].placeName +' to ' + rows[rowsEnd].placeName;

    return fn;
  
  },  
  
  drawFlightPlanLeg:function(waypoints, i) {

    var regEx = /([NSEW]\d{1,3}°\s\d{1,2}\'\s\d{1,2}.\d{1,2}\")|[+-]\d{6}.\d{2}/gi;

    var type = waypoints[i].getElementsByTagName("ATCWaypointType")[0].textContent;

    if (type == 'Airport') {
        if (i === 0) {
          type = 'Departure';
        }
        else {
          type = 'Destination';
        }

    }

    var string = waypoints[i].getElementsByTagName("WorldPosition")[0].textContent;
    var res = string.match(regEx);

    res.unshift(waypoints[i].getAttribute('id'));

    res.push(waypoints[i].getElementsByTagName("ATCWaypointType")[0].textContent);

    rdata = {
        waypoint:res[0],
        latDMS: res[1],
        longDMS: res[2],
        passingAlt:res[3],
        type: type
    };

    var lat = geographic.dms2decimal(rdata.latDMS);

    var lng = geographic.dms2decimal(rdata.longDMS);

    var latLng = new google.maps.LatLng(lat, lng);

    simvector.addLocation(latLng, rdata, false).then(function(rdata) {
      i++;
      if (i < waypoints.length) {
        simvector.drawFlightPlanLeg(waypoints, i);
      }
    })
  },
  
  formatElevForFlightPlan:function(elev, max)
  {
    
    var sign = false;
    str = elev.toString();

    if ($.inArray(str.substr(0,1), ['+','-']) >= 0)
    {
      sign = str.substr(0,1);
      str = str.substr(1);
    }

    str = str_pad(str, max);

    return sign ? sign+str : '+'+str;

  }
  
};

// InfoWindows must be defined in global scope.
function addInfoWindow(latLng, data, marker)
{
    var lat = mathematic.roundTo(latLng.lat(), 6);
    var lng = mathematic.roundTo(latLng.lng(), 6);

    var content = '<p><b>GPS:</b> '+lat+', '+lng+ '</p><p><b>DMS:</b> '+geographic.decimalDegrees2dms(lat+', '+lng) + '</p>';

    if (data.magDecl) {
       content += '<p><b>Magnetic declination:</b> ' + data.magDecl + '° </p>';
    }

    if (data.placeName) {
      content += '<p><b>Name:</b> ' + data.placeName + '</p>';
    }

    if (data.elevM) {
      content += '<p><b>Elevation:</b> ' + data.elevM + ' Meters, ' + data.elevFt + ' Feet </p>';
    }

    var infowindow = new google.maps.InfoWindow(
    {
      content: content
    });

    marker.addListener('click', function(){
        if (!$.isEmptyObject(simvector.curinfowindow))
        {
            simvector.curinfowindow.close();
        }

        infowindow.open(map, marker);

        simvector.curinfowindow = infowindow;

    });

    marker.addListener('rightclick', function(){
        var coords = this.position.lat()+', '+this.position.lng();
        var entry = simvector.markers[coords];

        $("#waypointsGrid").delRowData(entry.rowid);

        this.setMap(null);
    });

    return infowindow;

}

function str_pad(str, max) {
  
  str = str.toString();
  return str.length < max ? str_pad("0" + str, max) : str;
}