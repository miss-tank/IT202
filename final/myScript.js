
var stopID_List=[];

var stopName_List=[];
var mapID_List=[];
var prevURL="https://polar-garden-75406.herokuapp.com/apiPassThru.php?apiEndpoint=";
var i=0;
var eta_time=document.getElementById("ETA");
var x=0;
var etatime=0;
var url_String;
var now = new Date();
var favListName=[];
var favListID=[];
var favListUrl=[];
var index = 0;
var String_ETA=[];
var clone;
var StringTime="";


var CTA_FavoriteStop = [];


var  eta_url="http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx&key=02e9143f2a704f948d2e32fa5901872c&outputType=JSON";

window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

         //prefixes of window.IDB objects
         window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
         window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

         if (!window.indexedDB) {
          window.alert("Your browser doesn't support a stable version of IndexedDB.")
        }

        var db;
        var request = window.indexedDB.open("FavouriteStation", 1);

        request.onerror = function(event) {
          console.log("error: ");
        };
        request.onsuccess = function(event) {
          db = request.result;
          console.log("success: "+ db);
        };



        request.onupgradeneeded = function(event) {
          var db = event.target.result;
          var objectStore = db.createObjectStore("FavouriteStation", {keyPath: "id"});

          for (var i in CTA_FavoriteStop) {
           objectStore.add(CTA_FavoriteStop[i]);
         }
       }

       function read() {
        var transaction = db.transaction(["FavouriteStation"]);
        var objectStore = transaction.objectStore("FavouriteStation");
        var request = objectStore.get("00-03");

        request.onerror = function(event) {
         alert("Unable to retrieve daa from database!");
       };

       request.onsuccess = function(event) {
               // Do something with the request.result!
               if(request.result) {
                alert("Name: " + request.result.name + ", Age: " + request.result.age + ", Email: " + request.result.email);
              }

              else {
                alert("Kenny couldn't be found in your database!");
              }
            };
          }


          function readAll()
          {
            var objectStore = db.transaction("FavouriteStation").objectStore("FavouriteStation");

            objectStore.openCursor().onsuccess = function(event) {
             var cursor = event.target.result;

             if (cursor) {
              favListID[index]= cursor.key;
              favListName[index] = cursor.value.name;
              favListUrl[index] = cursor.value.url;
              getTimes(cursor.value.url);
              String_ETA[index]= StringTime;
              StringTime="";
              console.log( "ETA *********** ->  " + String_ETA[index]);
              index++;
              cursor.continue();

            }

            else {
              console.log("FavouriteStations are ");



                index=0;
                $.each(favListID,function(i,v)
                {
                  console.log("in forloop");
                  clone=$("#template").clone();
                  clone.attr('id','temp2')
                  clone.find(".b .c .d .e").text(favListName[index]);
                  clone.find(".b").css('background-color',"cyan");

                  //console.log("this is before " + String_ETA + "****");

                  clone.find(".b .c .d .TimeOfArrival").text(String_ETA[index]);


                  //console.log("this is after");
                  clone.removeClass("hidden");
                  index++;

            $("body").append(clone );
          });

            }
          };

        }


        function printdata(){
for(index=0;index<favListID.length;index++)
              {
                 console.log(favListName[index] + " - " + favListID[index] + " - " + favListUrl[index] + " - "+  String_ETA[index] );

                }
              }




function getTimes(url)
{
  console.log("this is the url in new stuff " + url);
StringTime="";

$.getJSON(url, function( data )
{
  $( ".result" ).html( data );
  $.each(data, function(i,v)
  {
   var array=v.eta;
   console.log("thsi si array ");
   console.log(array);

   for(i=0;i<array.length;i++)
   {
    console.log("in the check for cloop ");
        //console.log(v.eta[i].arrT);
        var str = v.eta[i].arrT;
        var destination = v.eta[i].destNm;
        var station_name= v.eta[i].staNm;
        var hours = str.substring(11, 13);
        var minutes = str.substring(14, 16);
        var seconds= str.substring(17, 19);
        var now_minute = now.getMinutes();
        console.log(minutes-now_minute);
        var diff= minutes-now_minute;

        StringTime= diff + "  -  "+StringTime + "" ;
        console.log("this is my string "+ StringTime);
      }

    });
});

        //console.log("this is my string outside "+ StringTime);
}








       $( document ).ready(function()
       {
        start();


      //populate();
      console.log( "ready!" );
    });

       function start()
       {
        $.get( "https://data.cityofchicago.org/resource/8mj8-j3c4.json?", function( data )
        {

          $( ".result" ).html( data );
          $.each(data, function(i,v)
          {
                         //$("body").append(v.stopID+ " <br>");
                        //document.getElementById('stopID').innerHTML = v.stop_id + " <br>";
                        //document.getElementById('stopName').innerHTML = v.stop_name + " <br>";
                        stopID_List[i]=v.stop_id;
                        stopName_List[i]=v.stop_name;
                        mapID_List[i]=v.map_id;
                        i++;

                      });

          openCity(event, 'user')

        });
      }


      function populateETA()
      {
$.getJSON(url_String, function( data )
{
  console.log(data);
  $( ".result" ).html( data );
  $.each(data, function(i,v)
  {
   var array=v.eta;
   for(i=0;i<array.length;i++)
   {
        //console.log(v.eta[i].arrT);
        var str = v.eta[i].arrT;
        var destination = v.eta[i].destNm;
        var station_name= v.eta[i].staNm;
        var hours = str.substring(11, 13);
        var minutes = str.substring(14, 16);
        var seconds= str.substring(17, 19);
        var now_minute = now.getMinutes();
        var diff= minutes-now_minute;
         if(diff<0)
        {
           diff = diff+60;
        }
        $('#ETA').append(diff +" mins");
        $('#StationName').append(station_name);
        $('#Travelling_Direction').append(destination);
        $('#ETA').append('<br>');
        $('#StationName').append('<br>');
        $('#Travelling_Direction').append('<br>');
        $('#ETA').append('<br>');
        $('#StationName').append('<br>');
        $('#Travelling_Direction').append('<br>');
        openCity(event, 'map');
      }
      etatime++;
    });
});

url_String="";


      }



function  addToFav()
{


          $("#ETA").empty();
  $("#StationName").empty();
  $("#Travelling_Direction").empty();
  etatime=0;

        var value2 = document.getElementById("dropdown2").value;


url_String="";
 url_String= prevURL+ eta_url+"&mapid="+mapID_List[value2];

//eta_url="http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?key=02e9143f2a704f948d2e32fa5901872c&outputType=JSON&mapid=40830";

//populateETA();
add(mapID_List[value2],stopName_List[value2],url_String);

}


function add(map_id, a_StationName, string_url) {
          var request = db.transaction(["FavouriteStation"], "readwrite")
          .objectStore("FavouriteStation")
          .add({ id: map_id, name: a_StationName , url : string_url});

          request.onsuccess = function(event) {
           alert("added  to database");
         };

         request.onerror = function(event) {
           alert("Unable to add data in database! ");
         }
       }





      function showETA()
      {
         $("#ETA").empty();
  $("#StationName").empty();
  $("#Travelling_Direction").empty();

        var value = document.getElementById("dropdown1").value;

        console.log("you choose this "+ stopName_List[value]);
        console.log("you choose this "+ stopID_List[value]);
        console.log("you choose this-> "+ mapID_List[value]);

         url_String= prevURL+ eta_url+"&mapid="+mapID_List[value];

//eta_url="http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?key=02e9143f2a704f948d2e32fa5901872c&outputType=JSON&mapid=40830";
populateETA();
}



function addFavouite()
{
  var dropDown12 = document.getElementById("dropdown2");
     //var display = new Array("1", "2", "3", "4");
     //var values = new Array("5", "6", "7", "8");
     for(var i = 0; i < stopName_List.length; i++) {
      dropDown12[dropDown12.length] = new Option(stopName_List[i], i);
    }
}






function populate()
{
 var dropDown = document.getElementById("dropdown1");
     //var display = new Array("1", "2", "3", "4");
     //var values = new Array("5", "6", "7", "8");
       console.log("this is te lengddth "+ stopName_List.length);

     for(var i = 0; i < stopName_List.length; i++) {
      dropDown[dropDown.length] = new Option(stopName_List[i], i);
    }
  }

  function openCity(evt, cityName)
  {
    var i, tabcontent, tablinks;
    populate();
    addFavouite();

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++)
    {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
  }


  if('serviceWorker' in navigator) {
    navigator.serviceWorker
    .register('sw.js')
    .then(function() { console.log("Service Worker Registered"); });
  }

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-59325548-2', 'auto');
  ga('send', 'pageview');
