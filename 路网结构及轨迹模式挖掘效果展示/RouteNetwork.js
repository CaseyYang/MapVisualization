var edges = []; //·����·�μ��ϣ�ÿ��Ԫ�������¼����ֶΣ�polylines��·����״����edgeId��·��ID��
var trajPatterns = []; //�켣ģʽ�ھ������ϣ�ÿ��Ԫ�������¼����ֶΣ�polylines��·����״����edgeId��·��ID����rate���ȶȣ���center�����ĵ�λ�ã�
var localSemanticTypeColor = {};//����·����ɫ��ͬһ���������͵�·��ӵ����ͬ��ɫ��
var colorFlag = 1;

//���ѡ����ɫ
function GetRandomColor() {
    return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
    //return '#CE0000';
}

function GetCertainColor() {
    if (colorFlag == 1) {
        colorFlag = 2;
        return '#3A5FCD';
    }
    else {
        return '#FF0000';
    }

}

//����·�����ݼ�
function ReadInEdges() {
    if (edges.length == 0) {
        for (var i = 0; i < routeNetwork.edges.length; i++) {
            var edge = {};
            edge.polylines = [];
            edge.id = routeNetwork.edges[i].edgeId;
            for (var j = 0; j < routeNetwork.edges[i].figures.length; j++) {
                edge.polylines.push(new google.maps.LatLng(routeNetwork.edges[i].figures[j].y, routeNetwork.edges[i].figures[j].x));
            }
            //��������·��ʱ�����ڲ�ͬ��������������䲻ͬ��ɫ
            //if (localSemanticTypeColor[routeNetwork.edges[i].localSemanticType] == null) {
            //    localSemanticTypeColor[routeNetwork.edges[i].localSemanticType] = GetRandomColor();
            //}
            //edge.color = localSemanticTypeColor[routeNetwork.edges[i].localSemanticType];

            //�����ض������ȹ켣ģʽʱ���������������ͷ����ɫ����ɫ
            if (localSemanticTypeColor[routeNetwork.edges[i].localSemanticType] == null) {
                localSemanticTypeColor[routeNetwork.edges[i].localSemanticType] = GetCertainColor();
            }
            edge.color = localSemanticTypeColor[routeNetwork.edges[i].localSemanticType];
            edges.push(edge);
        }
        //TODO������trajs����
        //for (var indexOfTrajs = 0; indexOfTrajs < routeNetwork.trajs.length; indexOfTrajs++) {

        //    new google.maps.LatLng(routeNetwork.trajPoints[i].y, routeNetwork.trajPoints[i].x);
        //}
    }
}

//����켣ģʽ�ھ���
function ReadInTrajPatterns() {
    if (trajPatterns.length == 0) {
        for (var i = 0; i < distinctEdges.edges.length; i++) {
            var trajPattern = {};
            trajPattern.id = distinctEdges.edges[i].edgeId;
            trajPattern.rate = distinctEdges.edges[i].rate;
            trajPattern.polylines = [];
            var totalLat = 0, totalLon = 0;
            var pointCount = distinctEdges.edges[i].figures.length;
            for (var j = 0; j < pointCount; j++) {
                trajPattern.polylines.push(new google.maps.LatLng(distinctEdges.edges[i].figures[j].y, distinctEdges.edges[i].figures[j].x));
                totalLat += distinctEdges.edges[i].figures[j].y;
                totalLon += distinctEdges.edges[i].figures[j].x;
            }
            trajPattern.center = new google.maps.LatLng(totalLat / pointCount, totalLon / pointCount);
            trajPatterns.push(trajPattern);
        }
    }
}

//��ʾ·��
function ShowRouteNetwork() {
    ReadInEdges();
    if (edges.length > 0 && edges[0].polylines.length > 0) {
        map.setCenter(edges[0].polylines[0]);
        for (var i = 0; i < edges.length; i++) {
            edges[i].mapPolyline = new google.maps.Polyline({
                path: edges[i].polylines,
                strokeWeight: 4,
                strokeColor: edges[i].color,
                map: map
            });
            //AddRouteInfoWindow(i);
        }
    }
    else {
        alert("·������Ϊ�գ�");
    }
}

//��ʾ������
function ShowDBSCANResult() {
    map.setCenter(new google.maps.LatLng(data.clusters[0].points[0].y, data.clusters[0].points[0].x));
    for (var index = 0; index < data.clusters.length; index++) {
        var color = GetColor();
        for (var pointIndex = 0; pointIndex < data.clusters[index].points.length; pointIndex++) {
            var ppCircle = new google.maps.Circle({
                strokeColor: color,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: color,
                fillOpacity: 0.35,
                map: map,
                center: new google.maps.LatLng(data.clusters[index].points[pointIndex].y, data.clusters[index].points[pointIndex].x),
                radius: 25
            });
        }
    }
}

//�Ը�����·�����infoWindow
function AddRouteInfoWindow(i) {
    var infoWindow = new google.maps.InfoWindow({
        content: 'EdgeId: ' + edges[i].id,
        position: edges[i].polylines[0]
    });
    google.maps.event.addListener(edges[i].mapPolyline, 'click', function () {
        infoWindow.open(map);
    });
}

//��ʾ�켣ģʽ�ھ���
function ShowTrajPatternResult() {
    ReadInTrajPatterns();
    if (trajPatterns.length > 0 && trajPatterns[0].polylines.length > 0) {
        map.setCenter(trajPatterns[0].polylines[0]);
        for (var i = 0; i < trajPatterns.length; i++) {
            trajPatterns[i].mapPolyline = new google.maps.Polyline({
                path: trajPatterns[i].polylines,
                strokeWeight: 4,
                strokeColor: GetColor(),
                map: map
            });
            trajPatterns[i].marker = new google.maps.Circle({
                strokeColor: "#ED1C24",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#ED1C24",
                fillOpacity: 0.35,
                map: map,
                center: trajPatterns[i].center,
                radius: trajPatterns[i].rate
            });
            AddTrajPatternInfoWindow(i);
        }
    }
}

//�Ը����Ĺ켣ģʽ���infoWindow
function AddTrajPatternInfoWindow(i) {
    var infoWindow = new google.maps.InfoWindow({
        content: 'EdgeId: ' + trajPatterns[i].id + '<br />Rate: ' + trajPatterns[i].rate,
        position: trajPatterns[i].center
    });
    google.maps.event.addListener(trajPatterns[i].marker, 'click', function () {
        infoWindow.open(map);
    });
}

//���·��
function ClearRouteNetworkPolylines() {
    for (var i = 0; i < edges.length; i++) {
        edges[i].mapPolyline.setMap(null);
    }
}

//����켣ģʽ�ھ���
function ClearTrajPatternsPolylines() {
    for (var i = 0; i < trajPatterns.length; i++) {
        trajPatterns[i].mapPolyline.setMap(null);
        trajPatterns[i].marker.setMap(null);
    }
}

//��ѯָ��Id��·��
function QueryEdge() {
    var edgeId = document.getElementById("EdgeIdInput").value;
    for (var i = 0; i < edges.length; i++) {
        if (edges[i].id == edgeId) {
            var infoWindow = new google.maps.InfoWindow({
                content: 'EdgeId: ' + edges[i].id,
                position: edges[i].polylines[0]
            });
            infoWindow.open(map);
            return;
        }
    }
    alert("δ�ҵ���");
}