// JavaScript source code
var points = [];//�����������ĵ㼯��
var matchingRates=[];//��������ƥ��������Ϣ
var correctRates = [];//��������ƥ�����Ϣ
var markers = [];//�����������
var currentInfoWindow = new google.maps.InfoWindow();

//�������ݼ�

function ReadIn() {
    currentCity = matchingCountData.city;
    for (var i = 0; i < matchingCountData.grids.length; i++) {
        points.push(new google.maps.LatLng(matchingCountData.grids[i].lat, matchingCountData.grids[i].lon));
        correctRates.push(matchingCountData.grids[i].correctRate);
        matchingRates.push(matchingCountData.grids[i].matchingRate);
    }
}

//��ʾԭʼ�켣������

function ShowGrids() {
    ReadIn();
    map.setCenter(points[0]);
    for (var i = 0; i < points.length; i++) {
        var marker = new google.maps.Circle({
            strokeColor: PickColor(correctRates[i]),
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: PickColor(correctRates[i]),
            fillOpacity: 0.5,
            map: map,
            center: points[i],
            radius: PickRadious(matchingRates[i])*20
        });
        markers.push(marker);
        AddInfoWindow(marker,i,points[i]);
    }
}

//���infoWindow

function AddInfoWindow(marker,i,position) {
    var infoWindow = new google.maps.InfoWindow({
        content: 'ƥ���: ' + correctRates[i],
        position: position
    });
    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.open(map);
    });
}

//�������Ԫ��

function ClearAll() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

//��������ѡ����ɫ
function PickColor(num){
    if(0<=num&&num<0.3){
        return "#FF8C00";
    }
    if(0.3<=num&&num<0.7){
        return "#008000";
    }
    if(0.7<=num&&num<=1){
        return "#0000FF";
    }
}

function PickRadious(num){
    if(num<=0.1){
        return 0.4;
    }
    if(num>0.1 && num<=0.3)
    {
        return 0.6;
    }
    if(num>0.3 && num<0.6){
        return 0.9;
    }
    if(num>0.6 && num<=1){
        return 1.2;
    }
}