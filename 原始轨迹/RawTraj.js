// JavaScript source code
var points = [];//保存原始轨迹采样点集合
var markers = [];//保存采样点标记
var timeStamps = [];//保存原始轨迹采样点的采集时间
var currentInfoWindow = new google.maps.InfoWindow();

//读入数据集

function ReadIn() {
    points = [];
    timeStamps = [];
    currentCity = data.city;
    for (var i = 0; i < data.points.length; i++) {
        points.push(new google.maps.LatLng(data.points[i].y, data.points[i].x));
        timeStamps.push(data.points[i].t);
    }
}

//显示原始轨迹采样点

function ShowRawTraj() {
    ReadIn();
    map.setCenter(points[0]);
    for (var i = 0; i < points.length; i++) {
        var marker = new google.maps.Marker({
            position: points[i],
            map: map
        });
        markers.push(marker);
        AddInfoWindow(marker,i,points[i]);
    }
}

//添加infoWindow

function AddInfoWindow(marker,i,position) {
    var infoWindow = new google.maps.InfoWindow({
        content: 'time: ' + timeStamps[i],
        position: position
    });
    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.open(map);
    });
}

//清除所有元素

function ClearRawTraj() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}