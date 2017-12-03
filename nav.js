document.write(
'<div style="height:20px"> </div>'+
'<div id="topruler" style="margin-bottom: 0px">'+
'        <table>'+
'            <tr><td height="5px"></td></tr>'+
'            <tr><td height="2px"></td></tr>'+
'        </table>'+
'    </div>');

document.write('<div id="title">'+'<h1>'+'Chonglin Zhang'+'</h1>'+'</div>');
    
  /*navigation bar*/
document.write(  
'  <div style="margin-bottom: 10px">'+
'    <ul id="navigation">'+
'        <li><a href="index.html">Home</a></li>'+
'        <li><a href="bio.html">Biography</a></li>'+
'        <li><a href="research.html">Research</a></li>'+
'        <li><a href="publication.html">Publications</a></li>'+
'        <li><a href="links.html">Links</a></li>'+
'        <li><a href="contact.html">Contact</a></li>'+
'    </ul>'+
'    </div>'
);

var aObj = document.getElementById('navigation').getElementsByTagName('a');
for(i=0;i<aObj.length;i++) {
    if(document.location.href.indexOf(aObj[i].href)>=0) {
        aObj[i].id='current';
        }
    }

window.onload=setActive;


