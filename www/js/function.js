
var db = openDatabase("dbPenilaian", "1.0", "Daftar Nilai", 200000);  // Open SQLite Database 
var dataset;
var DataType;
 
function initDatabase()  // Function Call When Page is ready.
{
    try {
        if (!window.openDatabase)  // Check browser is supported SQLite or not.
        {
            alert('Databases are not supported in this browser.');
        }
        else {
            createTable();  // If supported then call Function for create table in SQLite
        }
    } catch (e) {
        if (e == 2) {
            // Version number mismatch. 
            console.log("Invalid database version.");
        } else {
            console.log("Unknown error " + e + ".");
        }
        return;
    }
}
 
function createTable()  // Function for Create Table in SQLite.
{
    sqlStatement = "CREATE  TABLE  IF NOT EXISTS tblJurusan (idJurusan INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL  UNIQUE , txtJurusan VARCHAR)";
	db.transaction(function (tx) { tx.executeSql(sqlStatement, [], console.log("SQL Success"), onError); });
    sqlStatement = "CREATE  TABLE  IF NOT EXISTS tblKelas (idKelas INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL  UNIQUE, idJurusan INTEGER, txtKelas VARCHAR)";
	db.transaction(function (tx) { tx.executeSql(sqlStatement, [], console.log("SQL Success"), onError); });
    sqlStatement = "CREATE  TABLE  IF NOT EXISTS tblSiswa (idSiswa INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL  UNIQUE, idKelas INTEGER, txtNamaSiswa VARCHAR)";
	db.transaction(function (tx) { tx.executeSql(sqlStatement, [], console.log("SQL Success"), onError); });
}

function onError(tx, error) // Function for Hendeling Error...
{
    alert(error.message);
}

function showDropdown(){
	$("#pilihJurusan").html("<option value='0'>Pilih Jurusan</option>");
	$("#pilihKelas").html("<option>Pilih Jurusan Terlebih Dahulu</option>");
	sqlStatement = "SELECT * FROM tblJurusan";
	db.transaction(function (tx) {
        tx.executeSql(sqlStatement, [], function (tx, result) {
            dataset = result.rows;
            for (var i = 0, item = null; i < dataset.length; i++) {
                item = dataset.item(i);
                var opsiJurusan = "<option value='"+item['idJurusan']+"'>"+item['txtJurusan']+"</option>";
                $("#pilihJurusan").append(opsiJurusan);
            }
        });
    });
}

function getKelasFromJurusan(){
	if($("#pilihJurusan").val()==0){
		$("#pilihKelas").html("<option>Pilih Jurusan Terlebih Dahulu</option>");
	}else{
		$("#pilihKelas").html("<option>Pilih Kelas</option>");
		sqlStatement = "SELECT * FROM tblKelas WHERE idJurusan="+$("#pilihJurusan").val();
		db.transaction(function (tx) {
			tx.executeSql(sqlStatement, [], function (tx, result) {
				dataset = result.rows;
				for (var i = 0, item = null; i < dataset.length; i++) {
					item = dataset.item(i);
					var opsiJurusan = "<option value='"+item['idKelas']+"'>"+item['txtKelas']+"</option>";
					$("#pilihKelas").append(opsiJurusan);
				}
			});
		});
	}
	$("#pilihKelas").change();
}

function searchDaftarSiswa(){
	v = $("#pilihJurusan").val();
	console.log(v);
}

function eksekusiSQL(){
	sqlStatement = $("#txtSQL").val();
	db.transaction(function (tx) { tx.executeSql(sqlStatement, [], alert("SQL Success"), onError); });
}

$(document).ready(function () // Call function when page is ready for load..
{
    initDatabase();
	$("#searchDaftarSiswa").click(searchDaftarSiswa);
	$("#pilihJurusan").change(getKelasFromJurusan);
	$("#eksekusiSQL").click(eksekusiSQL);
});