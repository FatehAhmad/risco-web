function setCopyrightDate(){
    year=new Date().getYear();
    if (year<1900)
      year+=1900;
    document.getElementById("currentYear").innerHTML = year;
  }
  
  setCopyrightDate();
  
  
  function getDate(){
    var today = new Date();
    var year = today.getFullYear();
    document.getElementById("currentDate").innerHTML = year;
  }
  
  getDate();