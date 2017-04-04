var db = openDatabase("dbPenilaian", "1.0", "Daftar Nilai", 200000);  // Open SQLite Database 
var dataset;
var DataType;
 
function initDatabase(){
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
 
function createTable(){
    sqlStatement = "CREATE  TABLE  IF NOT EXISTS tblSiswa (idSiswa INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL  UNIQUE, idKelas INTEGER, txtNamaSiswa VARCHAR)";
	db.transaction(function (tx) { tx.executeSql(sqlStatement, [], console.log("SQL Success"), onError); });
    sqlStatement2 = "CREATE  TABLE  IF NOT EXISTS tblJurusan (idJurusan INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL  UNIQUE , txtJurusan VARCHAR)";
	db.transaction(function (tx) { tx.executeSql(sqlStatement2, [], console.log("SQL Success"), onError); });
    sqlStatement3 = "CREATE  TABLE  IF NOT EXISTS tblKelas (idKelas INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL  UNIQUE, idJurusan INTEGER, txtKelas VARCHAR)";
	db.transaction(function (tx) { tx.executeSql(sqlStatement3, [], console.log("SQL Success"), onError); });
    sqlStatement4 = "CREATE  TABLE  IF NOT EXISTS tblPenilaian (idPenilaian INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL  UNIQUE, txtPenilaian VARCHAR)";
	db.transaction(function (tx) { tx.executeSql(sqlStatement4, [], console.log("SQL Success"), onError); });
    sqlStatement4 = "CREATE  TABLE  IF NOT EXISTS tblPertemuan (idPertemuan INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL  UNIQUE, idKelas INTEGER, idMapel INTEGER, txtPertemuan VARCHAR)";
	db.transaction(function (tx) { tx.executeSql(sqlStatement4, [], console.log("SQL Success"), onError); });
    sqlStatement5 = "CREATE TABLE IF NOT EXISTS tblIndikator (idIndikator INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, idPenilaian INTEGER, idMapel INTEGER, txtIndikator VARCHAR)";
	db.transaction(function (tx) { tx.executeSql(sqlStatement5, [], console.log("SQL Success"), onError); });
    sqlStatement6 = "CREATE TABLE IF NOT EXISTS tblMapel (idMapel INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL  UNIQUE , txtMapel VARCHAR)";
	db.transaction(function (tx) { tx.executeSql(sqlStatement6, [], console.log("SQL Success"), onError); });
    sqlStatement7 = "CREATE TABLE IF NOT EXISTS tblDaftarNilai (idNilai INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, idSiswa INTEGER, idMapel INTEGER, idPertemuan INTEGER, idIndikator INTEGER, nilai INTEGER)";
	db.transaction(function (tx) { tx.executeSql(sqlStatement7, [], console.log("SQL Success"), onError); });
}

function onError(tx, error){
    alert(error.message);
}

function showDropdown(){
	$("#pilihJurusan").html("<option value='0'>Pilih Jurusan</option>");
	$("#pilihKelas").html("<option value='0'>Pilih Jurusan Terlebih Dahulu</option>");
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
	$("#pilihJurusan").change();
}

function getKelasFromJurusan(){
	if($("#pilihJurusan").val()==0){
		$("#pilihKelas").html("<option value='0'>Pilih Jurusan Terlebih Dahulu</option>");
	}else{
		$("#pilihKelas").html("<option value='0'>Pilih Kelas</option>");
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
	jurusan = $("#pilihJurusan").val();
	kelas = $("#pilihKelas").val();
	if((kelas == 0)||(jurusan==0)){
		alert("Pilih Jurusan dan Kelas terlebih dahulu untuk melihat daftar siswa.");
	}else{
		$("#tabel-daftar-siswa").html('');
		sqlStatement = "SELECT * FROM tblSiswa WHERE idKelas="+kelas;
		db.transaction(function (tx) {
			tx.executeSql(sqlStatement, [], function (tx, result) {
				dataset = result.rows;
				if(dataset.length == 0){
					$("#tabel-daftar-siswa").html('Data Siswa tidak dapat ditemukan. Klik tombol \"Tambah Siswa\" untuk menambahkan daftar siswa baru.');
				}
				for (var i = 0, item = null; i < dataset.length; i++) {
					item = dataset.item(i);
					var dataSiswa = "<tr><td>"+item['txtNamaSiswa']+"</td><td><a href='#' data-theme='b' class='ui-btn ui-icon-edit ui-btn-icon-notext ui-corner-all ui-btn-hover-b ui-btn-up-b'></a><a href='#' data-theme='b' class='ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all ui-btn-hover-b ui-btn-up-b'></a></td></tr>"
					$("#tabel-daftar-siswa").append(dataSiswa);
				}
			});
		});
	}
}

function showDaftarJurusan(){
	console.log("ShowDaftarJurusan");
	$("#tabel-daftar-jurusan").html('');
	sqlStatement = "SELECT * FROM tblJurusan";
	db.transaction(function (tx) {
		tx.executeSql(sqlStatement, [], function (tx, result) {
			dataset = result.rows;
			if(dataset.length == 0){
				$("#tabel-daftar-jurusan").html('Data Mapel tidak dapat ditemukan.');
			}
			for (var i = 0, item = null; i < dataset.length; i++) {
				item = dataset.item(i);
				var dataSiswa = "<tr><td>"+item['txtJurusan']+"</td><td><a href='#' data-theme='b' class='ui-btn ui-icon-edit ui-btn-icon-notext ui-corner-all ui-btn-hover-b ui-btn-up-b'></a><a href='#' data-theme='b' class='ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all ui-btn-hover-b ui-btn-up-b'></a></td></tr>"
				$("#tabel-daftar-jurusan").append(dataSiswa);
			}
		});
	});
}

function showDaftarMapel(){
	console.log("ShowDaftarMapel");
	$("#tabel-daftar-mapel").html('');
	sqlStatement = "SELECT * FROM tblMapel";
	db.transaction(function (tx) {
		tx.executeSql(sqlStatement, [], function (tx, result) {
			dataset = result.rows;
			if(dataset.length == 0){
				$("#tabel-daftar-mapel").html('Data Mapel tidak dapat ditemukan.');
			}
			for (var i = 0, item = null; i < dataset.length; i++) {
				item = dataset.item(i);
				var dataSiswa = "<tr><td>"+item['txtMapel']+"</td><td><a href='#' data-theme='b' class='ui-btn ui-icon-edit ui-btn-icon-notext ui-corner-all ui-btn-hover-b ui-btn-up-b'></a><a href='#' data-theme='b' class='ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all ui-btn-hover-b ui-btn-up-b'></a></td></tr>"
				$("#tabel-daftar-mapel").append(dataSiswa);
			}
		});
	});
}
function eksekusiSQL(){
	sqlStatement = $("#txtSQL").val();
	db.transaction(function (tx) { tx.executeSql(sqlStatement, [], alert("SQL Success"), onError); });
}

$(document).ready(function (){
    initDatabase();
	$("#searchDaftarSiswa").click(searchDaftarSiswa);
	$("#pilihJurusan").change(getKelasFromJurusan);
	$("#eksekusiSQL").click(eksekusiSQL);
});