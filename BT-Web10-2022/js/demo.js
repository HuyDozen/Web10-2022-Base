// Nhập dữ liệu vào input mã  trong dialog nhân viên
$("#txtEmplCode").blur(function (){
       // Lấy giá trị nhập vào ô 
       var value = $(this).val(); 
       // Kiểm tra giá trị nhập vào 
       if(!value){
           // Giá trị bị trông ta hiện tooltip cho ô nhập và đỏ viền
           // $(".input-tooltip").addClass("tooltip");    
           $(".input-EmplCode").addClass("tooltip");  
           $(this).addClass("border-warning");               
       }
       else{
           // Giá trị không bị trông ta hiện tooltip cho ô nhập và đỏ viền
           $(".input-EmplCode").removeClass("tooltip");  
           $(this).removeClass("border-warning");               
       }
   })
   // Nhập dữ liệu vào input tên  trong dialog nhân viên
   $("#txtEmplName").blur(function (){
       // Lấy giá trị nhập vào ô 
       var value = $(this).val(); 
       // Kiểm tra giá trị nhập vào 
       if(!value){
           // Giá trị bị trông ta hiện tooltip cho ô nhập và đỏ viền
           // $(".input-tooltip").addClass("tooltip");    
           $(".input-EmplName").addClass("tooltip");  
           $(this).addClass("border-warning");               
       }
       else{
           // Giá trị không bị trông ta hiện tooltip cho ô nhập và đỏ viền
           $(".input-EmplName").removeClass("tooltip");  
           $(this).removeClass("border-warning");               
       }
   })
   // Nhập dữ liệu vào input đơn vị trong dialog nhân viên
   $("#txtEmplPosition").blur(function (){
       // Lấy giá trị nhập vào ô 
       var value = $(this).val(); 
       // Kiểm tra giá trị nhập vào 
       if(!value){
           // Giá trị bị trống ta hiện tooltip cho ô nhập và đỏ viền
           $(".input-EmplPosition").addClass("tooltip");  
           $(this).addClass("border-warning");               
       }
       else{
           // Giá trị không bị trống ta hiện tooltip cho ô nhập và đỏ viền
           $(".input-EmplPosition").removeClass("tooltip");  
           $(this).removeClass("border-warning");               
       }
   })