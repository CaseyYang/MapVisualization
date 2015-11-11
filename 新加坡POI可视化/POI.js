// JavaScript source code
var points = [];//����POI����
var markers = [];//����POI���

//����POI����
function ReadInPOI() {
    points = [];
    currentCity = poiData.city;
    for (var i = 0; i < poiData.pois.length; i++) {
        points.push(new google.maps.LatLng(poiData.pois[i].latitude, poiData.pois[i].longtitude));
    }
}

//��ʾPOI
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

//���infoWindow
//function AddInfoWindow(marker,i,position) {
//    var infoWindow = new google.maps.InfoWindow({
//        content: 'time: ' + timeStamps[i],
//        position: position
//    });
//    google.maps.event.addListener(marker, 'click', function () {
//        infoWindow.open(map);
//    });
//}

//�������Ԫ��
function ClearPOI() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}