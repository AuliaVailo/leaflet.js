var latitude = -6.895029;
var longitude= 112.0627513;
var markers = new Array();

var mymap = L.map('mapid').setView([latitude,longitude ], 13);

var LeafIcon = L.Icon.extend({
    options: {
       iconSize:     [35, 39],
       //shadowSize:   [50, 64],
       iconAnchor:   [20, 38],
       //shadowAnchor: [4, 62],
       popupAnchor:  [-3, -35]
    }
});

var aku = new LeafIcon({
    iconUrl: './img/aku.png',
    //shadowUrl: '../aku.png'
})

var pos = new LeafIcon({
    iconUrl: './img/pos.png',
    //shadowUrl: '../aku.png'
})

var agp = new LeafIcon({
    iconUrl: './img/agp.png',
    //shadowUrl: '../aku.png'
})

var jnt = new LeafIcon({
    iconUrl: './img/jnt.png',
    //shadowUrl: '../aku.png'
})

var jne = new LeafIcon({
    iconUrl: './img/jne.png',
    //shadowUrl: '../aku.png'
})

var lainnya = new LeafIcon({
    iconUrl: './img/lain.png',
    //shadowUrl: '../aku.png'
})


L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
maxZoom: 18,
attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
id: 'mapbox.streets'
}).addTo(mymap);

/*
L.marker([latitude, longitude], {icon: aku}).addTo(mymap)
.bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();

L.circle([latitude, longitude], 500, {
color: 'red',
fillColor: '#f03',
fillOpacity: 0.5
}).addTo(mymap).bindPopup("I am a circle.");

var popup = L.popup();

function onMapClick(e) {
popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(mymap);
}

mymap.on('click', onMapClick);

*/

//html5 geotangging
if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position){
    latitude  = position.coords.latitude,
    longitude = position.coords.longitude;
        console.log("lat: "+latitude+",lng:"+longitude)
        L.marker([latitude, longitude], {icon: aku}).addTo(mymap).bindPopup("Anda sekarang berada d sini");;
        //map.setView(new L.LatLng(latitude, longitude), 13);
        //var abc = L.marker([latitude, longitude]).addTo(mymap);
        // move the map to have the location in its center
        mymap.panTo(new L.LatLng(latitude, longitude));

    });
} else{
    alert("Sorry, your browser does not support HTML5 geolocation.");
}

$("body").on("click", "#upload", function () {
    
    if(markers.length != 0){
        for(i=0;i<markers.length;i++) {
            mymap.removeLayer(markers[i]);
        }  
        console.log(markers);
    }
    
    //Reference the FileUpload element.
    var fileUpload = $("#fileUpload")[0];

    //Validate whether File is valid Excel file.
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();

            //For Browsers other than IE.
            if (reader.readAsBinaryString) {
                reader.onload = function (e) {
                    ProcessExcel(e.target.result);
                };
                reader.readAsBinaryString(fileUpload.files[0]);
            } else {
                //For IE Browser.
                reader.onload = function (e) {
                    var data = "";
                    var bytes = new Uint8Array(e.target.result);
                    for (var i = 0; i < bytes.byteLength; i++) {
                        data += String.fromCharCode(bytes[i]);
                    }
                    ProcessExcel(data);
                };
                reader.readAsArrayBuffer(fileUpload.files[0]);
            }
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid Excel file.");
    }
});
function ProcessExcel(data) {

    //Read the Excel File data.
    var workbook = XLSX.read(data, {
        type: 'binary'
    });

    //Fetch the name of First Sheet.
    var firstSheet = workbook.SheetNames[0];

    //Read all rows from First Sheet into an JSON array.
    var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);

    //Create a HTML Table element.
    var table = $("<table />");
    table[0].border = "1";

    //Add the header row.
    var row = $(table[0].insertRow(-1));

   //Add the header cells.
    var headerCell = $("<th />");
    headerCell.html("No");
    row.append(headerCell);

    var headerCell = $("<th />");
    headerCell.html("Kantor");
    row.append(headerCell);

    var headerCell = $("<th />");
    headerCell.html("Alamat");
    row.append(headerCell);

    var headerCell = $("<th />");
    headerCell.html("Latitude");
    row.append(headerCell);

    var headerCell = $("<th />");
    headerCell.html("Longitude");
    row.append(headerCell);

    var headerCell = $("<th />");
    headerCell.html("Jenis");
    row.append(headerCell);

    console.log(excelRows);

    //Add the data rows from Excel file.
    for (var i = 0; i < excelRows.length; i++) {
        var latt = excelRows[i].Latitude;
        var lngt = excelRows[i].Longitude;
        var gambar;

        if(excelRows[i].Jenis == 'pos'){
            gambar = pos;
        }else if(excelRows[i].Jenis == 'jnt'){
            gambar = jnt;
        }else if(excelRows[i].Jenis == 'jne'){
            gambar = jne;
        }else if(excelRows[i].Jenis == 'agen'){
            gambar = agp;
        }else{
            gambar = lainnya;
        }
        //Add the data row.
        var row = $(table[0].insertRow(-1));
        //console.log(row);

        //Add the data cells.
        var cell = $("<td />");
        cell.html(excelRows[i].No);
        row.append(cell);

        cell = $("<td />");
        cell.html(excelRows[i].Kantor);
        row.append(cell);

        cell = $("<td />");
        cell.html(excelRows[i].Alamat);
        row.append(cell);

        cell = $("<td />");
        cell.html(excelRows[i].Latitude);
        row.append(cell);

        cell = $("<td />");
        cell.html(excelRows[i].Longitude);
        row.append(cell);

        cell = $("<td />");
        cell.html(excelRows[i].Jenis);
        row.append(cell);

        if(latt != '' || lngt != ''){
            var marker = new L.marker([latt, lngt], {icon : gambar});
            markers.push(marker);
            mymap.addLayer(markers[i]);
            marker.bindPopup("<b>"+excelRows[i].Kantor+"</b><br />"+excelRows[i].Alamat);

            mymap.setView([latt, lngt], 10);
        }
        //this.markerMaps.push(marker);
    }

    var dvExcel = $("#dvExcel");
    dvExcel.html("");
    dvExcel.append(table);
};