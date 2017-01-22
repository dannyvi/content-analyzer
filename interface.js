  function loadBgPage(){
    var port=chrome.runtime.connect({name: "getpage"});
    port.postMessage({req:"get",addr:"insertpage.html"});
    port.onMessage.addListener(function(msg) {
      if (msg.req=="insertpage.html"){
        $("#initPart").fadeOut();
        setTimeout(function(){insertPage(msg);},500);
        port.disconnect();
      }
    });
  }


function runBar(){
    (function(){
      $("#bar").width(percents*14/10);
      $("#percent").text("分析中");
      if(percents<=99){
        chrome.runtime.sendMessage({req:"getpercent"});
        setTimeout(arguments.callee,50);
      }
      else {
        $("#bar").detach();
        $("#percent").detach();
        $("#initBar").append("<input class=\"buttons\" id=\"insertContent\" type=\"button\" value=\"open\"/>");
        $("#initBar").append("<input class=\"buttons\" id=\"closeInitBar\" type=\"button\" value=\"close\"/>");
        $("#closeInitBar").click(
          function(){
            $("#initPart").detach();
          }
        );
        $("#insertContent").click(loadBgPage);
      }
    }).call(this);

    chrome.runtime.sendMessage({req:"startanalyze"});
  }

function insertPage(msg) {
    var maxZindex = Math.max.apply(null,$.map($("body > *"),function(e,n){
      return parseInt($(e).css("z-index")) || 1;
      }));
    $("body").append("<div id=\"inner\">"+msg.content+"</div>");
    $("#inner").css("z-index",(maxZindex+1).toString());
    $("#inner").hide().fadeIn();
    $("#funcExit").click(function(){
      $("#inner").detach();
      $("#initPart").fadeIn();
    });

//insert content and keywords here to #contentWrapper and #?...not defined yet
    $("#contentContainer").html("<h1 id=\"upContentH\">"+main_title+"</h1>"+main_content);
//text(ti);
//    $("#keywordContainer").html(main_keywords);
  for (var i =0;i<main_keywords.length;i++){
    $("#keywordContainer").append(
      "<div style=\"width:100%;position:relative\"><span id=\""+main_keywords[i].word+"\" class=\"keys\">"+main_keywords[i].word+"</span>"+"<span class=\"rep\" style=\"float:right\">"+main_keywords[i].rep+"</span>"
    );
    var uu=main_keywords[i].word;
    $("#"+main_keywords[i].word).click(function(e){highLight(e.target.id);});
//    $("骄傲").click(function(){alert(main_keywords[i].word);});
    function highLight(str){

      $("#contentContainer").html($("#contentContainer").html().replace(/<span class="hhhl">([^>]*)<\/span>/ig,"$1"));
      $("#contentContainer").html($("#contentContainer").html().replace(RegExp(str,"ig"),"<span class=\"hhhl\">"+str+"</span>"));
      console.log(str);
    }
  }
  //--not implemented----

//content block
    calcScrollBar($("#scrollContent"),$("#contentWrapper"),$("#contentContainer"),"content",true);

 //menu block to come
//--not implemented-----
}


function calcScrollBar(scrollbg,wrapper,content,name,control){
  if (content.height()>wrapper.height())
  {
    //surface of the scorllbar
    var sb=$("<div id="+name+"ScrollBg class=\"scrollBg\" align=\"center\"></div>");
    var sf=$("<div class=\"scrollButton\"></div>");
    var sa=$("<div class=\"scrollBlock\"></div>");
    scrollbg.append(sa);
    scrollbg.append(sb);
    sb.append(sf);

//functional part


  var scrollLength=sb.height()-120;
  var distance= (function (){
    if (content.height()>wrapper.height()){
      return content.height()-wrapper.height()+100;
    }
    else return 0;
  })();
    var mousey=0, blockTop=0, newTop=0;

  dragEvent();
  sb.bind("click",barClick);
  sf.hover(function(){sb.unbind("click");},
           function(){sb.bind("click",barClick);}
          );
//wheel
  content.bind("mousewheel",function(event,delta){
    newTop = sf.position().top-sb.position().top;
    if (delta>0){newTop=newTop-scrollLength*0.1;}
    if (delta<0){newTop=newTop+scrollLength*0.1;}
    getScroll(newTop);
    event.stopPropagation();
    event.preventDefault();
  });

  if (control){
    $(document).bind("keydown",keyClick);
  }

    function keyClick(event){
      newTop = sf.position().top-sb.position().top;
      var Ckey = event.which;
      if(Ckey==38){
        newTop = newTop - 20;
        getScroll(newTop);
        event.stopPropagation();
        event.preventDefault();
      }
      if(Ckey==40){
        newTop = newTop + 20;
        getScroll(newTop);
        event.stopPropagation();
        event.preventDefault();
      }
      if(Ckey==33){
        newTop = newTop-(wrapper.height()/distance*scrollLength);
        getScroll(newTop);
        event.stopPropagation();
        event.preventDefault();
      }
      if(Ckey==34){
        newTop = newTop+(wrapper.height()/distance*scrollLength);
        getScroll(newTop);
        event.stopPropagation();
        event.preventDefault();
      }
    }
//bar click
  function barClick(e){
    newTop = parseInt(e.pageY - sb.offset().top);
    newTop = newTop-(sf.height()/2);
    getScroll(newTop);
  }
//drag
  function dragEvent(){

//drag event
    sf.mousedown(function(e){

      var pos=$(this).position();
      blockTop = parseInt(pos.top);
      mousey = e.pageY;
      $(document).bind("mousemove",blockMove);
      //scrollbg.unbind("mouseleave");
      function blockMove(event){
        newTop=parseInt(blockTop + (event.pageY-mousey));
        getScroll(newTop);
        event.stopPropagation();
        event.preventDefault();
      }
      $(document).mouseup(function(e){
        $(document).unbind("mousemove");
      });
    });
  }
//

//get the pixes already moved
    function getScroll(newTop){
      if(newTop<0){
        newTop=0;
      }
      var maxTop = sb.height()-sf.height();
      if(newTop>maxTop){
        newTop = maxTop;
      }
      sf.css({"top":newTop});
      var connTop = parseInt((newTop / scrollLength)*distance);
      if(connTop>0){connTop=connTop-1;}
      content.css({"top":0-connTop});
      return false;
    }
  }
}
