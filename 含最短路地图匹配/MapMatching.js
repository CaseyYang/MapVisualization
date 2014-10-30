var rawTraj = [],
    matchedTraj = []; //����ԭʼ�켣��ƥ��·����ע��matchedTraj�б������ÿ��·�ε���״���飬����������̣�matchedTraj��ֱ�ӱ���·����״��ԭ���Ƿ�ֹ���ڹ켣��ƥ�䵽ͬһ·��ʱ����ͬ·����β�����Ĵ������
var markerList = [],
    pathList = [],
    projectedPairList = []; //�������ߡ�������ӳ���ϵ���ߣ��Ա����
var propertiesForRawTraj = []; //����ԭʼ�켣���һЩ���ԣ����Ƿ�ƥ��ɹ���ԭʼ�켣���Ӧƥ��·����matchedTraj�е�������

//�ڵ�ͼ�ϲ���ʾƥ��·����յ�ͼ������Ԫ��
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

//����ض�div�е�ƥ��·������
function ClearTrajData() {
    var parentDiv = document.getElementById("pointslist");
    if (parentDiv.hasChildNodes()) {
        parentDiv.removeChild(parentDiv.firstChild);
    }
}

//��ʾ��ͼƥ����
function ShowMatchedTraj() {
    ReadIn(document.getElementById("selectsample").value);
    map.setCenter(rawTraj[0]);
    ShowRawTraj();
    ShowMatchedEdges();
}

//��ʾԭʼ�켣
function ShowRawTraj() {
    //��ʾԭʼ�켣������������
    var lineSymbol = {
        path: 'M 0,-1 0,1',
        strokeOpacity: 1,
        strokeColor: "#ED1C24",
        scale: 3
    };
    var path = new google.maps.Polyline({
        path: rawTraj, //��Ҫ��ʾ�켣�����һ���֣�pathTraj.slice(0,index)
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

//��ʾƥ��·��
function ShowMatchedEdges() {
    for (var i = 0; i < matchedTraj.length; i++) {
        var path = new google.maps.Polyline({
            path: matchedTraj[i], //��Ҫ��ʾ�켣�����һ���֣�pathTraj.slice(0,index)
            strokeWeight: 3,
            strokeColor: "#0000E3",
            map: map
        });
        pathList.push(path);
    }
}

//��ʾ�켣�����Ӧƥ��·����ӳ���ϵ
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

//�������ݼ�
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
                propertiesForRawTraj.push(matchedTraj.length); //ƥ��ɹ��򱣴�켣���Ӧƥ��·�ε��������
                var segment = [];
                for (j = 0; j < mapMatchingData[indexValue].matchedEdges[i].numOfFigures; j++) {
                    segment.push(new google.maps.LatLng(mapMatchingData[indexValue].matchedEdges[i].figures[j].y, mapMatchingData[indexValue].matchedEdges[i].figures[j].x));
                }
                matchedTraj.push(segment); //segment��Ӧһ��·�ε���״���飬matchedTraj�б���ľ��������Ľṹ
            } else {
                propertiesForRawTraj.push(-1); //δƥ��ɹ��򱣴�-1
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
        alert("����Խ�磡indexValue=" + indexValue);
    }
}