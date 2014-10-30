var rawTraj = [],
    matchedTraj = []; //保存原始轨迹和匹配路径；注意matchedTraj中保存的是每段路段的形状数组，详见其填充过程；matchedTraj不直接保存路段形状的原因是防止相邻轨迹点匹配到同一路段时，相同路段首尾相连的错误出现
var markerList = [],
    pathList = [],
    projectedPairList = []; //保存折线、坐标点和映射关系连线，以便清空
var propertiesForRawTraj = []; //保存原始轨迹点的一些属性；如是否匹配成功、原始轨迹点对应匹配路径在matchedTraj中的索引等

//在地图上不显示匹配路线清空地图上所有元素
function ClearAllElements() {
    for (i = 0; i < pathList.length; i++) {
        pathList[i].setMap(null);
    }
    for (i = 0; i < markerList.length; i++) {
        markerList[i].setMap(null);
        if (i < projectedPairList.length) {
            projectedPairList[i].setMap(null);
        }
    }
    projectedPairList.length = pathList.length = markerList.length = 0;
    matchedTraj.length = rawTraj.length = 0;
}

//清除特定div中的匹配路线数据
function ClearTrajData() {
    var parentDiv = document.getElementById("pointslist");
    if (parentDiv.hasChildNodes()) {
        parentDiv.removeChild(parentDiv.firstChild);
    }
}

//显示地图匹配结果
function ShowMatchedTraj() {
    ReadIn(document.getElementById("selectsample").value);
    map.setCenter(rawTraj[0]);
    ShowRawTraj();
    ShowMatchedEdges();
}

//显示原始轨迹
function ShowRawTraj() {
    //显示原始轨迹采样点间的虚线
    var lineSymbol = {
        path: 'M 0,-1 0,1',
        strokeOpacity: 1,
        strokeColor: "#ED1C24",
        scale: 3
    };
    var path = new google.maps.Polyline({
        path: rawTraj, //若要显示轨迹数组的一部分：pathTraj.slice(0,index)
        strokeOpacity: 0,
        icons: [{
            icon: lineSymbol,
            offset: '0',
            repeat: '20px'
        }],
        map: map
    });
    pathList[pathList.length] = path;
    for (var index = 0; index < rawTraj.length; index++) {
        var marker = new google.maps.Circle({
            strokeColor: "#ED1C24",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#ED1C24",
            fillOpacity: 0.35,
            map: map,
            center: rawTraj[index],
            radius: 25
        });
        markerList.push(marker);
    }
}

//显示匹配路径
function ShowMatchedEdges() {
    for (var i = 0; i < matchedTraj.length; i++) {
        var path = new google.maps.Polyline({
            path: matchedTraj[i], //若要显示轨迹数组的一部分：pathTraj.slice(0,index)
            strokeWeight: 3,
            strokeColor: "#0000E3",
            map: map
        });
        pathList.push(path);
    }
}

//显示轨迹点和相应匹配路径的映射关系
function ShowProjectedRelation() {
    var i = 0;
    for (i = 0; i < rawTraj.length; i++) {
        if (propertiesForRawTraj[i] != -1) {
            var lineSymbol = {
                path: 'M 0,-1 0,1',
                strokeOpacity: 1,
                strokeColor: "#000000",
                scale: 2
            };
            var projectedPair = [];
            projectedPair.push(rawTraj[i]);
            projectedPair.push(matchedTraj[propertiesForRawTraj[i]][0]);
            var path = new google.maps.Polyline({
                path: projectedPair,
                strokeOpacity: 0,
                icons: [{
                    icon: lineSymbol,
                    offset: '0',
                    repeat: '20px'
                }],
                map: map
            });
            projectedPairList.push(path);
        }
    }
}

//读入数据集
function ReadIn(indexValue) {
    rawTraj = [];
    matchedTraj = [];
    propertiesForRawTraj = [];
    var i = 0;
    var j = 0;
    currentSampleIndex = indexValue;
    if (indexValue < mapMatchingData.length) {
        currentCity = mapMatchingData[indexValue].city;
        while (i < mapMatchingData[indexValue].trajPoints.length) {
            rawTraj.push(new google.maps.LatLng(mapMatchingData[indexValue].trajPoints[i].y, mapMatchingData[indexValue].trajPoints[i].x));
            if (mapMatchingData[indexValue].matchedEdges[i].numOfFigures > 0) {
                propertiesForRawTraj.push(matchedTraj.length); //匹配成功则保存轨迹点对应匹配路段的起点索引
                var segment = [];
                for (j = 0; j < mapMatchingData[indexValue].matchedEdges[i].numOfFigures; j++) {
                    segment.push(new google.maps.LatLng(mapMatchingData[indexValue].matchedEdges[i].figures[j].y, mapMatchingData[indexValue].matchedEdges[i].figures[j].x));
                }
                matchedTraj.push(segment); //segment对应一个路段的形状数组，matchedTraj中保存的就是这样的结构
            } else {
                propertiesForRawTraj.push(-1); //未匹配成功则保存-1
            }
            i++;
        }
        for (i = mapMatchingData[indexValue].trajPoints.length; i < mapMatchingData[indexValue].matchedEdges.length; i++) {
            var segment = [];
            if (mapMatchingData[indexValue].matchedEdges[i].numOfFigures > 0) {
                for (j = 0; j < mapMatchingData[indexValue].matchedEdges[i].numOfFigures; j++) {
                    segment.push(new google.maps.LatLng(mapMatchingData[indexValue].matchedEdges[i].figures[j].y, mapMatchingData[indexValue].matchedEdges[i].figures[j].x));
                }
                matchedTraj.push(segment);
            }
        }
    } else {
        alert("索引越界！indexValue=" + indexValue);
    }
}