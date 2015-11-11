// JavaScript source code
var points = [];//保存POI集合
var markers = [];//保存POI标记

//读入POI集合
function ReadInPOI() {
    points = [];
    currentCity = poiData.city;
    for (var i = 0; i < poiData.pois.length; i++) {
        points.push(new google.maps.LatLng(poiData.pois[i].latitude, poiData.pois[i].longtitude));
    }
}

//显示POI
function ShowPOI() {
    ReadInPOI();
    map.setCenter(points[0]);
    for (var i = 0; i < points.length; i++) {
        var marker = new google.maps.Marker({
            position: points[i],
            map: map
        });
        markers.push(marker);
        //AddInfoWindow(marker, i, points[i]);
    }
}

//添加infoWindow
//function AddInfoWindow(marker,i,position) {
//    var infoWindow = new google.maps.InfoWindow({
//        content: 'time: ' + timeStamps[i],
//        position: position
//    });
//    google.maps.event.addListener(marker, 'click', function () {
//        infoWindow.open(map);
//    });
//}

//清除所有元素
function ClearPOI() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}