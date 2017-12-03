if (window.ActiveXObject){
		xmlhttp=new ActiveXObject("Msxml2.XMLHTTP");		
	}else{
		xmlhttp=new XMLHttpRequest;
	}
xmlhttp.open("GET","publications/chonglin_journal.xml",false);
xmlhttp.send();
xmlDoc=xmlhttp.responseText;
if(window.ActiveXObject){
	xmlDoc = new ActiveXObject ("microsoft.xmldom");
	xmlDoc.loadXML(xmlhttp.responseText); 
}else{	
             var xmlDoc = new DOMParser().parseFromString(xmlDoc, "text/xml");
}
document.write("<table id=\"pub_list\" border='0'>");
var x=xmlDoc.getElementsByTagName("entry"); // search for journal articles

// sort publication list
var yearlist = [];
var xtemp = [];
for (var i = 0; i<x.length; i++)
{
    yearlist[i] = {year:parseInt(x[i].getElementsByTagName("year")[0].childNodes[0].nodeValue), index:i};
    //parseInt(x[i].getElementsByTagName("year")[0].childNodes[0].nodeValue);
}
yearlist.sort(function(a, b){return b.year-a.year});
for (var i = 0; i<x.length; i++)
{
    xtemp[i] = x[yearlist[i].index];
}
x = xtemp;

var oldyear = "0000";

for (i=0;i<x.length;i++)
{
    // check whether this is the begining of a new year
    if(x[i].getElementsByTagName("year").length!=0){
        var year = x[i].getElementsByTagName("year")[0].childNodes[0].nodeValue;
        oldyear = yearflag(year, oldyear);
    }
    document.write("<tr><td style=\"width:30px; vertical-align: top;\">");
    if(x[i].getElementsByTagName("article").length!=0){
        document.write('<itemnum>'+(i+1).toString()+'.</itemnum> ');
        document.write("</td><td>");    
        var bibstring='@Article{czhang_journal_'+(x.length-i).toString()+','; // initiate the bibtex item    
        bibstring = printarticle(x[i], bibstring);
    }
    if(x[i].getElementsByTagName("inproceedings").length!=0){
        document.write('<itemnum><a name="proceeding-'+(x.length-i).toString()+'">'+(x.length-i).toString()+'.</a></itemnum> ');
        document.write("</td><td>");    
        var bibstring='@Inproceedings{ysong_proceeding_'+(x.length-i).toString()+','; // initiate the bibtex item    
        bibstring = printproceeding(x[i], bibstring);
    }
    //write pdf
    if (x[i].getElementsByTagName("pdf").length!=0)
    {
	    if (x[i].getElementsByTagName("pdf")[0].childNodes.length!=0)
	    {
		document.write(" <a class=\"pdf\" style=\"text-decoration:none\" href=\"PDF/"
        				+x[i].getElementsByTagName("pdf")[0].childNodes[0].nodeValue
        				+"\" target=\"_blank\">"
        				+"<img src=\"img/pdf_logo.gif\""
					+"alt = \"[download PDF]\" title = \"download PDF\""
        				+"</a>");
	    }
	    
    }    
    // write bibtex
    bibstring = bibstring.substring(0, bibstring.length-5)+'</p>}'; // end of the bibtex item
    document.write(' <a class="pdf" onmouseover="" style="cursor: pointer; text-decoration:none" onclick="writeConsole(\''+bibstring+'\');">'
	    +'<img src="img/bibtex_logo.gif" alt = "[download bibtex]" title = "download bibtex" />'
	    +"</a>");
    document.write("</td></tr>");	
}
document.write("</table>");

function printarticle(p,s){
    s=printauthorlist(p,s);
    
    s=printtitle(p,s);
    
    //write journal
    if(p.getElementsByTagName("journal").length!=0){        
	var journal = p.getElementsByTagName("journal")[0].childNodes[0].nodeValue;
        document.write(" <i>"+journal+"</i>");
	s += '<p>journal = {'+resolve_unicode(journal)+'},</p>';
	if (journal[journal.length-1]!=".") {document.write(". ");} else {document.write(" ");}	
    }    
    // write volume (issue)
    if(p.getElementsByTagName("volume").length!=0){
        document.write(" <issue>"+p.getElementsByTagName("volume")[0].childNodes[0].nodeValue+"</issue>");
	s += '<p>issue = {'+p.getElementsByTagName("volume")[0].childNodes[0].nodeValue+'},</p>';
        //write number
        if(p.getElementsByTagName("number").length!=0){
            document.write(" (<number>"+p.getElementsByTagName("number")[0].childNodes[0].nodeValue+"</number>),");
	    s += '<p>number = {'+p.getElementsByTagName("number")[0].childNodes[0].nodeValue+'},</p>';
        }
        else
        {
            document.write(",");
        }
    }
    //write pages
    if(p.getElementsByTagName("pages").length!=0){
        document.write(" <pages>"+p.getElementsByTagName("pages")[0].childNodes[0].nodeValue+"</pages>,");
	s += '<p>pages = {'+p.getElementsByTagName("pages")[0].childNodes[0].nodeValue+'},</p>';
    }
    //write month
    if(p.getElementsByTagName("month").length!=0){
        document.write(" <month>"+p.getElementsByTagName("month")[0].childNodes[0].nodeValue+"</month>, ");
	s += '<p>month = {'+p.getElementsByTagName("month")[0].childNodes[0].nodeValue+'},</p>';
    }
    //write year
    if(p.getElementsByTagName("year").length!=0){
        document.write(" <year>"+p.getElementsByTagName("year")[0].childNodes[0].nodeValue+"</year>");
	s += '<p>year = {'+p.getElementsByTagName("year")[0].childNodes[0].nodeValue+'},</p>';
    }
    //write note
    if(p.getElementsByTagName("note").length!=0){
        document.write(", <note>"+p.getElementsByTagName("note")[0].childNodes[0].nodeValue+"</note>");
	s += '<p>note = {{'+resolve_unicode(p.getElementsByTagName("note")[0].childNodes[0].nodeValue)+'}},</p>';
    }
    document.write('.');

    return s;
}

function printproceeding(p,s){
    s = printauthorlist(p,s);
    
    s = printtitle(p,s);
    
    //write proceeding
    if(p.getElementsByTagName("booktitle").length!=0){
        var proceeding = p.getElementsByTagName("booktitle")[0].childNodes[0].nodeValue;
	document.write(" In ");
	// write editors
	var editorlist = p.getElementsByTagName("editor"); //the author list       
	if (editorlist.length!=0){
            s += '<p>editor = {';
	    switch(editorlist.length)
	    {
		case 1: //single editor
		    printauthor(editorlist[0]);
                    s += resolve_unicode(editorlist[0].childNodes[0].nodeValue)+'0';
		    document.write(". ");
		    break;
		case 2: //two editors
		    printauthor(editorlist[0]);
                    s += resolve_unicode(editorlist[0].childNodes[0].nodeValue);
		    document.write(" and ");
                    s += ' and ';
		    printauthor(editorlist[1]);
                    s += resolve_unicode(editorlist[1].childNodes[0].nodeValue);
		    document.write(". ");
		    break;    
		default: //more than two editors
		    //from first to the secone last editor
		    for (var j=0;j<editorlist.length-1;j++)
		    {    
			printauthor(editorlist[j]);
                        s += resolve_unicode(editorlist[j].childNodes[0].nodeValue)+' and ';
			document.write(", ");
		    }
		    // and the last editor
		    document.write("and ");
		    printauthor(editorlist[editorlist.length-1]);
                    s += resolve_unicode(editorlist[editorlist.length-1].childNodes[0].nodeValue);
		    document.write(". ");
		    break;
	    }
	    document.write('(Ed.)');
            s +='},</p>'; // end of editor
	}
        document.write(" <proceeding>"+proceeding+"</proceeding>");
        s += '<p>booktitle = {{'+resolve_unicode(p.getElementsByTagName("booktitle")[0].childNodes[0].nodeValue)+'}},</p>';
        if (proceeding[proceeding.length-1]!=".") {document.write(". ");} else {document.write(" ");}
    }
    //write series
    if(p.getElementsByTagName("series").length!=0){
	if(p.getElementsByTagName("series")[0].childNodes.length!=0)
	{
	    var proceeding = p.getElementsByTagName("series")[0].childNodes[0].nodeValue;
	    document.write(" <proceeding>"+proceeding+"</proceeding>");
            s += '<p>series = {'+resolve_unicode(p.getElementsByTagName("series")[0].childNodes[0].nodeValue)+'},</p>';
	    if (proceeding[proceeding.length-1]!=".") {document.write(". ");} else {document.write(" ");}
	}        
    }
    //write volume
    if(p.getElementsByTagName("volume").length!=0){
	if(p.getElementsByTagName("volume")[0].childNodes.length!=0)
	{
	    var proceeding = p.getElementsByTagName("volume")[0].childNodes[0].nodeValue;
	    document.write("<proceeding>Vol. "+proceeding+"</proceeding>");
            s += '<p>volume = {'+resolve_unicode(p.getElementsByTagName("volume")[0].childNodes[0].nodeValue)+'},</p>';
	    if (proceeding[proceeding.length-1]!=".") {document.write(". ");} else {document.write(" ");}
	}        
    }
    //write pages
    if(p.getElementsByTagName("pages").length!=0){
        document.write(" <pages>pp. "+p.getElementsByTagName("pages")[0].childNodes[0].nodeValue+"</pages>,");
        s += '<p>pages = {'+resolve_unicode(p.getElementsByTagName("pages")[0].childNodes[0].nodeValue)+'},</p>';
    }
    //write publisher
    if(p.getElementsByTagName("publisher").length!=0){
        document.write(" "+p.getElementsByTagName("publisher")[0].childNodes[0].nodeValue+". ");
        s += '<p>publisher = {'+resolve_unicode(p.getElementsByTagName("publisher")[0].childNodes[0].nodeValue)+'},</p>';
    }
    //write organization
    if(p.getElementsByTagName("organization").length!=0){
        document.write(" "+p.getElementsByTagName("organization")[0].childNodes[0].nodeValue+". ");
        s += '<p>organization = {'+resolve_unicode(p.getElementsByTagName("organization")[0].childNodes[0].nodeValue)+'},</p>';
    }
    //write address
    if(p.getElementsByTagName("address").length!=0){
        document.write(" "+p.getElementsByTagName("address")[0].childNodes[0].nodeValue+", ");
        s += '<p>address = {'+resolve_unicode(p.getElementsByTagName("address")[0].childNodes[0].nodeValue)+'},</p>';
    }
    //write month
    if(p.getElementsByTagName("month").length!=0){
        document.write(" <month>"+p.getElementsByTagName("month")[0].childNodes[0].nodeValue+"</month>, ");
        s += '<p>month = {'+resolve_unicode(p.getElementsByTagName("month")[0].childNodes[0].nodeValue)+'},</p>';
    }
    //write year
    if(p.getElementsByTagName("year").length!=0){
        document.write(" <year>"+p.getElementsByTagName("year")[0].childNodes[0].nodeValue+"</year>");
        s += '<p>year = {'+resolve_unicode(p.getElementsByTagName("year")[0].childNodes[0].nodeValue)+'},</p>';
    }
    
    return s;
}    

function printauthorlist(p,s){
    var authorlist = p.getElementsByTagName("author"); //the author list
    s += '<p>author = {';
    switch(authorlist.length)
    {
        case 1: //single author
            printauthor(authorlist[0]);
            document.write(". ");
	    s += resolve_unicode(authorlist[0].childNodes[0].nodeValue);
            break;
        case 2: //two authors
            printauthor(authorlist[0]);
	    s += resolve_unicode(authorlist[0].childNodes[0].nodeValue);
            document.write(" and ");
	    s += ' and ';
            printauthor(authorlist[1]);
	    s += resolve_unicode(authorlist[1].childNodes[0].nodeValue);
            document.write(". ");	    
            break;    
        default: //more than two authors
            //from first to the secone last author
            for (var j=0;j<authorlist.length-1;j++)
            {    
                printauthor(authorlist[j]);
                document.write(", ");
		s += resolve_unicode(authorlist[j].childNodes[0].nodeValue)+' and ';
            }
            // and the last author
            document.write("and ");
            printauthor(authorlist[authorlist.length-1]);
	    s += resolve_unicode(authorlist[authorlist.length-1].childNodes[0].nodeValue);
            document.write(". ");
            break;
    }
    s +='},</p>'; // end of author
    return s;
}

function printtitle(p,s){
    //write title    
    if(p.getElementsByTagName("title").length!=0){ // if title exists
        if(p.getElementsByTagName("doi").length!=0){ // if doi is provided
            document.write("<a class=\"url\" href=\"http://dx.doi.org/"+p.getElementsByTagName("doi")[0].childNodes[0].nodeValue+"\" target=\"_blank\" title=\"link to the article's webpage\">");
	   s += '<p>doi = {'+p.getElementsByTagName("doi")[0].childNodes[0].nodeValue+'},</p>';
        }
        else
        {
            if(p.getElementsByTagName("url").length!=0){ // or if url is provided
                document.write("<a class=\"url\" href=\""+p.getElementsByTagName("url")[0].childNodes[0].nodeValue+"\" target=\"_blank\" title=\"link to the article's webpage\">");
		s += '<p>url = {'+p.getElementsByTagName("url")[0].childNodes[0].nodeValue+'},</p>';
            }
        }
        var title = p.getElementsByTagName("title")[0].childNodes[0].nodeValue;
	title = print_string(title);
	s += '<p>title = {{'+resolve_unicode(title)+'}},</p>';
        document.write("<thetitle>"+title+"</thetitle>"); // remove all "{ "and "}" in the title string
        if(p.getElementsByTagName("url").length!=0 || p.getElementsByTagName("doi").length!=0){ // if url or doi is provided
            document.write("</a>");
        }
        document.write(".");
    }
    
    return s;
}

function printauthor(au){ // this function print author's name
    var name = au.childNodes[0].nodeValue;
    if (name.indexOf(",")!=-1) // surname first format
    {
        // divide the name into surname and firstnaem by comma
        var surname = name.substring(0,name.indexOf(","));              
        var firstname = name.substring(name.indexOf(",")+1,name.length);
    }
    
    // remove all spaces at the beginning and end of the firstname
    while (firstname[0]==" ") {firstname=firstname.substring(1,firstname.length);} 
    while (firstname[firstname.length-1]==" ") {firstname=firstname.substring(0,firstname.length-1);}
    
    var firstnamehead=""
    var firstnametail=firstname;
    
    while (firstnametail.indexOf(" ")!=-1) // while there are other spaces in the tail
    {
        // divide the firstname into head and tail part at the position of space 
        firstnamehead = firstnamehead+firstnametail[0]+". ";
        firstnametail = firstnametail.substring(firstnametail.indexOf(" ")+1,firstnametail.length);
        
        // remove all spaces at the beginning of the firstnametail
        while (firstnametail[0]==" ") {firstnametail=firstnametail.substring(1,firstnametail.length);}
    }
    firstname = firstnamehead + firstnametail[0]+"."
    
    // enhance "C. Zhang"
    if (surname=="Zhang" && firstname.indexOf("C.")!=-1){document.write("<b>")};
    document.write(firstname+" "+surname);
    if (surname=="Zhang" && firstname.indexOf("C.")!=-1){document.write("</b>")};
}

function yearflag (year, oldyear) // divide the publication list by year, return oldyear
{
    if (year!=oldyear) // a new year
    {
        // refresh oldyear
        oldyear = year;
	document.write("<tr height=\"0px\"><td><a name=\"journal-"+year.toString()+"\">"+"</a></td></tr>");
    }
    return oldyear;
}

function print_string(string)
{
    string = string.replace(/\[sub\]/g,'<sub>');
    string = string.replace(/\[\/sub\]/g,'</sub>');
    string = string.replace(/\[sup\]/g,'<sup>');
    string = string.replace(/\[\/sup\]/g,'</sup>');
    string = string.replace(/\[br\]/g,'<br />');
    return string;
}

function resolve_unicode(string)
{
    //string = string.replace(/\"/g, '&#x22;');
    //string = string.replace(/\'/g,'\\\'');
    //string = string.replace(/%/g, '\\\\%');
    //string = string.replace(/<sub>/g,'$_\\\\text{');
    //string = string.replace(/<\/sub>/g,'}$');
    //string = string.replace(/<sup>/g,'$^text{');
    //string = string.replace(/<\/sup>/g,'}$');
    return string;
}
