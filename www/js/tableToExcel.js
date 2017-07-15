var tableToExcel = (function() {
  return function(table, name) {
    if (!table.nodeType) table = document.getElementById(table)
    window.location.href = 'http://makruvatech.com/in.php?filename='+ name +'&data=' + table.innerHTML
  }
})()