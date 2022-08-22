window.onload = init;

function init(){
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAvA7mnEc9BPHgsHLNnUksMrK9WBgZjkew",
    authDomain: "dashboard-otdr.firebaseapp.com",
    databaseURL: "https://dashboard-otdr-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "dashboard-otdr",
    storageBucket: "dashboard-otdr.appspot.com",
    messagingSenderId: "56851184421",
    appId: "1:56851184421:web:6141263c467fbc6512b8cc",
    measurementId: "G-C2CVKF2DQ2"
  };
  firebase.initializeApp(config);
  
  showHistory();
}

function mergeGridCells(table) {
  $(table).each(function () {
    $(table).find('td').each(function () {
      var $this = $(this);
      var col = $this.index();
      var html = $this.html();
      var row = $(this).parent()[0].rowIndex;
      var span = 1;
      var cell_above = $($this.parent().prev().children()[col]);

      while (cell_above.html() === html) { 
        span += 1; 
        cell_above_old = cell_above; 
        cell_above = $(cell_above.parent().prev().children()[col]); 
      }

      if (span > 1) {
        $(cell_above_old).attr('rowspan', span);
        $this.hide();
      }

    });
  });

}

function showHistory(){

  firebase.database().ref().child("data").once('value', function(snapshot) {

    if(snapshot.exists()){

      var docs = '';
      snapshot.forEach(function(func){
        var key = func.key;
        var data = func.val();
        docs += '<tr>' +
        '<td>'+ data.pengujian +'</td>'+
        '<td>'+ data.kemiringan +'</td>'+
        '<td>'+ data.redaman +'</td>'+
        '<td>'+ data.keterangan +'</td>'+
        '<td align="center" width="10%">'+
        '<button class="btn btn-danger delete-data" child="history" id-data = "'+key+'">'+
        '<span class="fa fa-trash"></span>'+
        '</button>'+
        '</td>'+
        "</tr>";

      });
      $('#table-history').append(docs);
      // mergeGridCells('#dataTables-history');
      $(document).ready(function(){
        $('#dataTables-history').DataTable( {

          dom: 'Bfrtip',
          buttons: [
          'copyHtml5',
          'excelHtml5',
          'csvHtml5',
          'pdfHtml5'
          ]
        } );

      });
      if(docs !== ""){
        var documents = document.getElementsByClassName('delete-data');
        for (var i = 0; i < documents.length; i++) {
          documents[i].addEventListener("click",deleteData,false);
        }
      }   
    }
    else{

    }    
  });
}

function deleteData() {
  swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this data!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {
      var child = this.getAttribute("child");
      var id = this.getAttribute("id-data");
      if(child == "data"){
        var ref_id = firebase.database().ref().child("data-product-registered").child(id);
      }
      if(child == "history"){
        var ref_id = firebase.database().ref().child("history").child(id);
      }
      if(child == "scan"){
        var ref_id = firebase.database().ref().child("data-product-scanned").child(id);
      }
      ref_id.remove();
      swal("Your data has been deleted!", {
        icon: "success",
      })
      .then((value) => {
        window.location.reload();
      });

    } else {
    }
  });

}
