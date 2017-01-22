var origin_content=$("html").html();
var main_title="";
var _title="";
var ti;
var main_content="";
var main_keywords;
var percents= 0;
var current_key=0;
$(document).ready( function(){
  chrome.runtime.onMessage.addListener(
    function (msg) {
      if (msg.req=="init" && $("#initPart").length==0){
        $("body").append(msg.content);
        runBar();}
      if (msg.req=="startanalyzeme"){
        analyzeThePage();
      }
      if (msg.req=="getpercent"){
        getThePercentage();
      }
    });
});

function getThePercentage(){
    if (percents<89) percents=percents+10;
    else percents = current_key*100/main_content.length;
  }

//add the scrollBar with  background, wrapper, and the text container
