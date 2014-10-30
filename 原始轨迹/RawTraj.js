// JavaScript source code
var points = [];//����ԭʼ�켣�����㼯��
var markers = [];//�����������
var timeStamps = [];//����ԭʼ�켣������Ĳɼ�ʱ��
var currentInfoWindow = new google.maps.InfoWindow();

//�������ݼ�

function ReadIn() {
    points = [];
    timeStamps = [];
    currentCity = data.city;
    for (var i = 0; i < data.points.length; i++) {
        points.push(new google.maps.LatLng(data.points[i].y, data.points[i].x));
        timeStamps.push(data.points[i].t);
    }
}

//��ʾԭʼ�켣������

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

//���infoWindow

function AddInfoWindow(marker,i,position) {
    var infoWindow = new google.maps.InfoWindow({
        content: 'time: ' + timeStamps[i],
        position: position
    });
    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.open(map);
    });
}

//�������Ԫ��

function ClearRawTraj() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}