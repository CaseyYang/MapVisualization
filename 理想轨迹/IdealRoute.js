// JavaScript source code
var edges = [];
var routeNetworkPolylines = []; //��������
var infoWindows = []; //�������ݴ���
var edgeIds = [];//�����id��Ϣ
var trajPoints = [];//�������Ϣ
var cityCircle;
var circleOption;
var markerList = [];//����ͼ���б����Ϣ
var cuurentCity;
var lastInfoWindow; //������һ�����ݴ���
var currentInfoWindow = new google.maps.InfoWindow();
var rawTraj = [];

//�������ݼ�
function ReadInEdges() {
    edges = [];
    currentCity = data.city;
    for (var i = 0; i < data.edges.length; i++) {
        var edge = [];
        edgeIds.push(data.edges[i].edgeId);
        for (var j = 0; j < data.edges[i].figures.length; j++) {
            edge.push(new google.maps.LatLng(data.edges[i].figures[j].y, data.edges[i].figures[j].x));
        }
        edges.push(edge);
    }
    //TODO������trajs����
    //for (var indexOfTrajs = 0; indexOfTrajs < data.trajs.length; indexOfTrajs++) {
    //    new google.maps.LatLng(data.trajPoints[i].y, data.trajPoints[i].x);
    //}
}

//��ʾ·��
function ShowRouteNetwork() {
    ReadInEdges();
    map.setCenter(edges[0][0]);
    for (var i = 0; i < edges.length; i++) {
        var currentIndex = i;
        var path = new google.maps.Polyline({
            path: edges[i],
            strokeWeight: 4,
            strokeColor: "#00000",
            map: map
        });
        routeNetworkPolylines.push(path);
        AddInfoWindow(i, edges[i][0], path);
    }
}

//��ʾԭʼ�켣
function ShowTrajPoints() {
    ReadIn(0);
    for (var index = 0; index < rawTraj.length; index++) {
        var marker = new google.maps.Circle({
            strokeColor: "#ED1C24",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#ED1C24",
            fillOpacity: 0.35,
            map: map,
            center: rawTraj[index],
            radius: 1//25
        });
    }
}

//���infoWindow
function AddInfoWindow(i, position) {
    var infoWindow = new google.maps.InfoWindow({
        content: 'EdgeId: ' + edgeIds[i],
        position: position
    });
    google.maps.event.addListener(routeNetworkPolylines[i], 'click', function () {
        infoWindow.open(map);
    });
}

//�������Ԫ��
function ClearRouteNetwork() {
    for (var i = 0; i < routeNetworkPolylines.length; i++) {
        routeNetworkPolylines[i].setMap(null);
    }
    for (var i = 0; i < markerList.length; i++) {
        markerList[i].setMap(null);
    }
}

//���ѡ����ɫ
function GetColor() {
    return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
    //return '#CE0000';
}

//��ѯָ��Id��·��
function QueryEdge() {
    var edgeId = document.getElementById("EdgeIdInput").value;
    for (var i = 0; i < edgeIds.length; i++) {
        if (edgeIds[i] == edgeId) {
            var infoWindow = new google.maps.InfoWindow({
                content: 'EdgeId: ' + edgeIds[i],
                position: edges[i][0]
            });
            infoWindow.open(map);
            return;
        }
    }
    alert("δ�ҵ���");
}

//�������ݼ�
function ReadIn(indexValue) {
    rawTraj = [];
    matchedTraj = [];
    propertiesForRawTraj = [];
    var i = 0;
    var j = 0;
    if (indexValue < mapMatchingData.length) {
        currentCity = mapMatchingData[indexValue].city;
        while (i < mapMatchingData[indexValue].trajPoints.length) {
            rawTraj.push(new google.maps.LatLng(mapMatchingData[indexValue].trajPoints[i].y, mapMatchingData[indexValue].trajPoints[i].x));
            //if (mapMatchingData[indexValue].matchedEdges[i].numOfFigures > 0) {
            //    propertiesForRawTraj.push(matchedTraj.length); //ƥ��ɹ��򱣴�켣���Ӧƥ��·�ε��������
            //    var segment = [];
            //    for (j = 0; j < mapMatchingData[indexValue].matchedEdges[i].numOfFigures; j++) {
            //        segment.push(new google.maps.LatLng(mapMatchingData[indexValue].matchedEdges[i].figures[j].y, mapMatchingData[indexValue].matchedEdges[i].figures[j].x));
            //    }
            //    matchedTraj.push(segment); //segment��Ӧһ��·�ε���״���飬matchedTraj�б���ľ��������Ľṹ
            //} else {
            //    propertiesForRawTraj.push(-1); //δƥ��ɹ��򱣴�-1
            //}
            i++;
        }
        //for (i = mapMatchingData[indexValue].trajPoints.length; i < mapMatchingData[indexValue].matchedEdges.length; i++) {
        //    var segment = [];
        //    if (mapMatchingData[indexValue].matchedEdges[i].numOfFigures > 0) {
        //        for (j = 0; j < mapMatchingData[indexValue].matchedEdges[i].numOfFigures; j++) {
        //            segment.push(new google.maps.LatLng(mapMatchingData[indexValue].matchedEdges[i].figures[j].y, mapMatchingData[indexValue].matchedEdges[i].figures[j].x));
        //        }
        //        matchedTraj.push(segment);
        //    }
        //}
    } else {
        alert("����Խ�磡indexValue=" + indexValue);
    }
}