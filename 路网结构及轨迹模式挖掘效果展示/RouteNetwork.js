var edges = []; //路网中路段集合：每个元素有如下几个字段：polylines（路段形状）；edgeId（路段ID）
var trajPatterns = []; //轨迹模式挖掘结果集合：每个元素有如下几个字段：polylines（路段形状）；edgeId（路段ID）；rate（热度）；center（中心点位置）
var localSemanticTypeColor = {};//保存路段颜色（同一种语义类型的路段拥有相同颜色）
var colorFlag = 1;

//随机选择颜色
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

//读入路网数据集
function ReadInEdges() {
    if (edges.length == 0) {
        for (var i = 0; i < routeNetwork.edges.length; i++) {
            var edge = {};
            edge.polylines = [];
            edge.id = routeNetwork.edges[i].edgeId;
            for (var j = 0; j < routeNetwork.edges[i].figures.length; j++) {
                edge.polylines.push(new google.maps.LatLng(routeNetwork.edges[i].figures[j].y, routeNetwork.edges[i].figures[j].x));
            }
            //生成语义路网时，对于不同语义类型随机分配不同颜色
            //if (localSemanticTypeColor[routeNetwork.edges[i].localSemanticType] == null) {
            //    localSemanticTypeColor[routeNetwork.edges[i].localSemanticType] = GetRandomColor();
            //}
            //edge.color = localSemanticTypeColor[routeNetwork.edges[i].localSemanticType];

            //生成特定粗粒度轨迹模式时，对两种语义类型分配红色和蓝色
            if (localSemanticTypeColor[routeNetwork.edges[i].localSemanticType] == null) {
                localSemanticTypeColor[routeNetwork.edges[i].localSemanticType] = GetCertainColor();
            }
            edge.color = localSemanticTypeColor[routeNetwork.edges[i].localSemanticType];
            edges.push(edge);
        }
        //TODO：读入trajs部分
        //for (var indexOfTrajs = 0; indexOfTrajs < routeNetwork.trajs.length; indexOfTrajs++) {

        //    new google.maps.LatLng(routeNetwork.trajPoints[i].y, routeNetwork.trajPoints[i].x);
        //}
    }
}

//读入轨迹模式挖掘结果
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

//显示路网
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
        alert("路网数据为空！");
    }
}

//显示采样点
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

//对给定的路段添加infoWindow
function AddRouteInfoWindow(i) {
    var infoWindow = new google.maps.InfoWindow({
        content: 'EdgeId: ' + edges[i].id,
        position: edges[i].polylines[0]
    });
    google.maps.event.addListener(edges[i].mapPolyline, 'click', function () {
        infoWindow.open(map);
    });
}

//显示轨迹模式挖掘结果
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

//对给定的轨迹模式添加infoWindow
function AddTrajPatternInfoWindow(i) {
    var infoWindow = new google.maps.InfoWindow({
        content: 'EdgeId: ' + trajPatterns[i].id + '<br />Rate: ' + trajPatterns[i].rate,
        position: trajPatterns[i].center
    });
    google.maps.event.addListener(trajPatterns[i].marker, 'click', function () {
        infoWindow.open(map);
    });
}

//清除路网
function ClearRouteNetworkPolylines() {
    for (var i = 0; i < edges.length; i++) {
        edges[i].mapPolyline.setMap(null);
    }
}

//清除轨迹模式挖掘结果
function ClearTrajPatternsPolylines() {
    for (var i = 0; i < trajPatterns.length; i++) {
        trajPatterns[i].mapPolyline.setMap(null);
        trajPatterns[i].marker.setMap(null);
    }
}

//查询指定Id的路段
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
    alert("未找到！");
}