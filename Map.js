// JavaScript source code
var map;
var currentCity;

// 显示向Google查询的两点间行车路线代码
//var directionsDisplay = new google.maps.DirectionsRenderer();
//var directionsService = new google.maps.DirectionsService();
//var latlngStart = new google.maps.LatLng(data[0].y, data[0].x);//路线起点
//var latlngDestination = new google.maps.LatLng(data[data.length-1].y, data[data.length-1].x);//路线终点
//var requestRoute = {
//    origin: latlngStart,
//    destination: latlngDestination,
//    travelMode: google.maps.DirectionsTravelMode.DRIVING
//};
//directionsService.route(requestRoute, function (response, status) {
//    if (status == google.maps.DirectionsStatus.OK) {
//        directionsDisplay.setDirections(response);
//    }
//});

//页面加载初始化

//OSM
function Initialize(city) {
    //如果存在下拉菜单
    if (document.getElementById('selectsample')) {
        //生成样例下拉菜单
        var selectObj = document.getElementById("selectsample");
        for (var i = 0; i < mapMatchingData.length; i++) {
            var selectitem = new Option("轨迹" + (i + 1), i);
            selectObj.options.add(selectitem);
        }
    }
    //初始化地图
    geoCoder = new google.maps.Geocoder();
    lastInfoWindow = new google.maps.InfoWindow();
    geoCoder.geocode({
        'address': city
    },
        function (results, state) {
            if (state = google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    var latlng = results[0].geometry.location;
                    var mapTypeIds = [];
                    for (var type in google.maps.MapTypeId) {
                        mapTypeIds.push(google.maps.MapTypeId[type]);
                    }
                    mapTypeIds.push("OSM");
                    var myOptions = {
                        zoom: 10,
                        center: latlng,
                        mapTypeId: "OSM",
                        mapTypeControlOptions: {
                            mapTypeIds: mapTypeIds
                        }
                    };
                    map = new google.maps.Map((document.getElementById("map_canvas")), myOptions);
                    map.mapTypes.set("OSM", new google.maps.ImageMapType({
                        getTileUrl: function (coord, zoom) {
                            return "http://tile.openstreetmap.org/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
                        },
                        tileSize: new google.maps.Size(256, 256),
                        name: "OpenStreetMap",
                        maxZoom: 18
                    }));
                    //显示向Google查询的两点间行车路线代码
                    //directionsDisplay.setMap(map);
                }
            } else {
                alert("错误代码：" + state);
            }
        });
}

//Google Map
//function Initialize(city) {
//    //初始化地图
//    geoCoder = new google.maps.Geocoder();
//    geoCoder.geocode({
//        'address': city
//    },
//    function (results, state) {
//        if (state = google.maps.GeocoderStatus.OK) {
//            if (results[0]) {
//                var latlng = results[0].geometry.location;
//                var myOptions = {
//                    zoom: 10,
//                    center: latlng,
//                    mapTypeId: google.maps.MapTypeId.ROADMAP
//                };
//                map = new google.maps.Map((document.getElementById("map_canvas")), myOptions);

//                //google.maps.event.addListener(map, 'click', function (e) {
//                //    var position = e.latLng;
//                //    friends.push(position);
//                //    var marker = new google.maps.Marker({
//                //        position: position,
//                //        map: map
//                //    });

//                //    google.maps.event.addListener(marker, 'click', function () {
//                //        var position = marker.getPosition();
//                //        friends.pop(position);
//                //        marker.setMap(null);
//                //    });
//                //});

//                //显示向Google查询的两点间行车路线代码
//                //directionsDisplay.setMap(map);
//            }
//        }
//        else {
//            alert("错误代码：" + state);
//        }
//    });
//}