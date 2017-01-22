function analyzeThePage(){
    var h1,h2,h3,h4,h5,h6;
    _title=origin_content.replace(/^[\s\S]*?<title>([^<]*)<\/title>[\s\S]*$/ig,"$1");
    main_content=origin_content.replace(/<(script|head|style)[^>]*>[\S\s]*?<\/\1>/ig,"");
    ti=main_content.replace(/<p[^]*?>[^<]*<\/p>/ig,"");
    ti=ti.replace(/<(?!h|\/h)[^>]*>/ig,"");
     h1=ti.replace(/[\s\S]*?<h1[^>]*>\s*(<[^>]*>)*([^<]*)(<\/[^h][^>]*>)*<\/h1>[\s\S]*$/ig,"$2");
    h2=ti.replace(/[\s\S]*?<h2[^>]*>\s*(<[^>]*>)*([^<]*)(<\/[^h][^>]*>)*<\/h2>[\s\S]*$/ig,"$2");
    h3=ti.replace(/[\s\S]*?<h3[^>]*>\s*(<[^>]*>)*([^<]*)(<\/[^h][^>]*>)*<\/h3>[\s\S]*$/ig,"$2");
    h4=ti.replace(/[\s\S]*?<h4[^>]*>\s*(<[^>]*>)*([^<]*)(<\/[^h][^>]*>)*<\/h4>[\s\S]*$/ig,"$2");
    h5=ti.replace(/[\s\S]*?<h5[^>]*>\s*(<[^>]*>)*([^<]*)(<\/[^h][^>]*>)*<\/h5>[\s\S]*$/ig,"$2");
    h6=ti.replace(/[\s\S]*?<h6[^>]*>\s*(<[^>]*>)*([^<]*)(<\/[^h][^>]*>)*<\/h6>[\s\S]*$/ig,"$2");

//calc the title
  if (_title==null) {
    if(h1!=null) main_title=h1;
    else if(h2!=null) main_title=h2;
    else if(h3!=null) main_title=h3;
      else if(h4!=null) main_title=h4;
      else if(h5!=null) main_title=h5;
      else if(h6!=null) main_title=h6;
      else main_title="not known";
    }
    else {
      var arr=new Array();
      var minor=0;
      arr[0]=_title.search(h1.slice(0,2));
      arr[1]=_title.search(h2.slice(0,2));
      arr[2]=_title.search(h3.slice(0,2));
      arr[3]=_title.search(h4.slice(0,2));
      arr[4]=_title.search(h5.slice(0,2));
      arr[5]=_title.search(h6.slice(0,2));
      for (var i=0;i<6;i++){
        if (arr[i]>-1) minor=Math.min(minor,arr[i]);
      }
      switch(minor){
        case arr[0]: main_title=h1;break;
        case arr[1]: main_title=h2;break;
        case arr[2]: main_title=h3;break;
        case arr[3]: main_title=h4;break;
        case arr[4]: main_title=h5;break;
        case arr[5]: main_title=h6;break;
        default: main_title=_title;
      }
    }
    main_content=main_content.replace(/<[^>]*>/ig,"<br>");
    main_content=main_content.replace(/\s/ig,"");
    var cont_arr=main_content.split("<br>");
    cont_arr=cutEmpty(cont_arr);

    var keywords=main_title+" "+cont_arr.join("");


    main_keywords=getKeywordLists(keywords);

  function cutEmpty(str){
      var s=[];
      var num=[];
      var total=0;
      for (var i=0;i<str.length;i++){
        if (str[i].length>5){
          num.push(str[i].length);
          s.push(str[i]);
          total+=(str[i].length);
        }
      }
      var average=total/num.length-15;
//      alert("average:"+average+" total:"+total+" lines:"+num.length);
      var start_point=0;
      var end_point=0;
      for (var i=0;i<num.length;i++) {
        var counter=0;
        if (num[i]>average) {
          counter+=1;
          if (num[i+1]>average) counter+=1;
          if (num[i+2]>average) counter+=1;
          if (num[i+3]>average) counter+=1;
          if (num[i+4]>average) counter+=1;
          if (counter>2) {
            start_point=i;
            break;
          }
        }
      }
      for (var i=start_point;i<num.length;i++){
        if (i==num.length-1 && end_point==0) {end_point=i;break;}
        counter=0;
        if (num[i]<average){
          counter+=1;
          if (num[i+1]<average) counter+=1;
          if (num[i+2]<average) counter+=1;
          if (num[i+3]<average) counter+=1;
          if (num[i+4]<average) counter+=1;
          if (num[i+5]<average) counter+=1;
          if (num[i+6]<average) counter+=1;
          if (num[i+7]<average) counter+=1;
          if (counter>3) {
            end_point=i;
            break;
          }
        }
      }
      return s.slice(start_point,end_point);
    }

  function getKeywordLists(cont_obj){
      var cont_ob;
      cont_obj=cont_obj.toLowerCase();
      cont_ob=cont_obj.replace(/[\"“”，。,\(\).？?/|\-——&》*《.<>……^%$#￥@~`:：；;1234567890、啊啦的我呢吗哦]/ig," ");
      cont_ob=cont_ob.replace(/\s/ig,"");
      var lessen=cont_ob;
      var appeared_word="";
      while (lessen.length>0){
      if (appeared_word.match(lessen[0])){
          lessen=lessen.replace(lessen[0],"");
        }
        else {
          appeared_word+=lessen[0];
          lessen=lessen.replace(lessen[0],"");
        }
      }
    //get appeared_word 1st

      var appeared_info_list=(function(){
        var s=[];
        for (var i=0;i<appeared_word.length;i++){
          var k=(function(){
            var u=[];
            for (var j=0;j<cont_obj.length;j++){
              if (appeared_word[i]==cont_obj[j]) u.push(j);
            }
            return u;
          })();

          s.push({name:appeared_word[i],
                  pos:k,
                  len:k.length
                 });
        }
        return s;
      })();
      var repeated_list=[];
      appeared_word=
        (function(){
        var ss="";
        for (var i=0 ; i<appeared_info_list.length ; i++) {
          if (1<appeared_info_list[i].len) {
            ss+=appeared_info_list[i].name;
            repeated_list.push(appeared_info_list[i]);
          }
        }
        return ss;
      })();
      var last_result=[];
      var li_pos=[];
      if (repeated_list.length>0){
        for (var i=0;i<repeated_list.length;i++){
          var u=getCurrentList(repeated_list[i].pos);
          if (u!==undefined){if(last_result.length>0){
            var ss=0;
            for (var j=0;j<last_result.length;j++){
              if(last_result[j].word.match(u.word)!==null){ss+=1;}
            }
            if (ss<1) {last_result.push(u);
                      li_pos.push(u.rep);}
        } else {
          {last_result.push(u);
           li_pos.push(u.rep);}
        }
                            }}
      }

      for (var i=0;i<li_pos.length;i++){
        for (var j=li_pos.length-1;j>i;j--){
          if (li_pos[j]>li_pos[j-1]){
            var a=li_pos[j];
            var b=last_result[j];
            li_pos[j]=li_pos[j-1];
            li_pos[j-1]=a;
            last_result[j]=last_result[j-1];
            last_result[j-1]=b;
          }
        }
      }
      last_result=last_result.slice(0,10);

      function getCurrentList(current_group){
        var init_group=[];
        var o_text;
        (function(){
          for (var i=0;i<current_group.length;i++){
            var k=new Array();
          k[0]=current_group[i];
          init_group[i]=k;
          }})();
        var end_list=new Array();

        var word_obj=new parse(init_group,0);


        o_text=end_list[0];
        function parse(lis,nccccc){
          if ((lis.length<2)||(lis[0].length>10)){
            return {rep:-1};
          }
          else
          {
            this.tochoose=lis[0].map(function(a){
              return cont_obj[a];
            }).join("");
            var list=new Array();
            list=lis;
            list.map(function(a){a.push(a[a.length-1]+1);});
            this.group=[];
            this.chosen=[];
            for (var i=0;i<list.length;i++){
              if (($.inArray(this.tochoose+cont_obj[list[i][list[i].length-1]],this.chosen))===-1){
              if($.inArray(cont_obj[list[i][list[i].length-1]],appeared_word)!==-1){
                var s=new Array();
                s[0]=list[i];
                this.group.push(s);
                this.chosen.push(this.tochoose+cont_obj[list[i][list[i].length-1]]);
              }
              }
              else {

                for (var uu=0 ; uu<this.chosen.length ; uu++ )
                {
                  if (this.tochoose+cont_obj[list[i][list[i].length-1]]===this.chosen[uu])
                  {
                    this.group[uu].push(list[i]);
                  }
                }
              }
            }
            if (this.group.length===0){return {repvalue:-1};}
            var that=this;
            var su=(function(){
              var k=that.group[0].length;
              var max=0;
              var p=new Array();
              for (var i=0 ; i<that.group.length ; i++){
                if (that.group[i].length>k)
                {k=that.group[i].length;
                 max=i;}
              }

              p=that.group[max];
              if (end_list.length!==0){
              if (p.length===end_list[end_list.length-1].rep)
              {end_list.pop();}}
              end_list[end_list.length]={word:that.chosen[max],
                                         rep:p.length};
              return p;
            })();
            this.group=su.valueOf();
            var repval=(function(){
              if (su.length<1) {return -1;}
              else return su.length;
            })();
            this.child=[];
            var arg=new Array();
            arg=this.group;

            for (var i in arg){
            }
            if (arg.length<2||arg[0].length==0){this.child={repvalue:-1};}
            else this.child=new parse(arg,nccccc+1);
            return {group:this.group,
                    repvalue:repval,
                    child:this.child};
          }
        }
      return o_text;
      }
      return last_result;
    }                                      //getKeywordLists(){}end




    main_content=cont_arr.map(function(elem){
      return "<p class=\"upContentP\">"+elem+"</p>";
    }).join("");

    //set the percents
    current_key=main_content.length;
  }
