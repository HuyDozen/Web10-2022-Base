/**
 * Khi trang đã hoàn tất load
 */

$(document).ready(function(){
    try {
        // Gọi api lên 
        loadData(); 
        
        // Các sự kiện
        initEvents();


    } catch (error) {
        console.log(error);
    }
    
})

var newId = "";
var count = 0;
var select = 0;
var employeeId = null;

function hideLoading() {
    $("#dlg-loading").hide();
  }
  function showLoading() {
    $("#dlg-loading").show();
  }
function loadData() {

    // Hiển thị loading
    showLoading();

    // Gọi API lấy dữ liệu
    $.ajax({
        type: "GET",
        url: "https://amis.manhnv.net/api/v1/employees",
        async: true,
        success: function (res) {
            console.log(res);
            // Đưa nội dung bảng table về trống
            $("table#tbEmployee tbody").empty();
            
            // Lấy dữ liệu từ bảng nhân viên
            let ths = $("table#tbEmployee thead th");
            

            for(const emp of res) {
                //Duyệt từng cột trong tiêu đồ
                var trElement = $(`<tr></tr>`);
                
                // Lấy id từ bảng dữ liệu thông tin nhân viên
                
                for (const th of ths) {
                    
                    //Lấy ra propValue tương ứng vs các cột
                    const propValue = $(th).attr("propValue");
                    const format = $(th).attr("format");
                    
                   

                    //Lấy gtri tương ứng vs tên của propValue trong đối tượng
                    let  value = null; 
                    
                    if(propValue == "checkbox"){
                        
                        value = ` 
                        <div class="checkbox-tbl"></div>
                        `;
                    }
                    else if (propValue == "control"){
                        value = `<div class="control">
                        <div id="btnDel" class="text-control">Sửa</div>
                        <div class="control-icon icon-control"></div>
                    </div>`;
                    }
                    else
                        value = emp[propValue];
                    let classAlign = [];
                    let idAdd = [];
                    switch (format) {
                        case "workStatus":
                            switch (value) {
                                case 0:
                                    value = "Nghỉ việc";
                                    break;
                                case 1:
                                    value = "Đang làm việc"
                                    break;
                                case 2:
                                    value = "Thử việc"
                                    break;
                                default:
                                    break;
                            }
                            break;
                            case "emplName":
                                classAlign = "text-left";
                                idAdd = "emplName";
                                break;
                        case "gender":
                            switch (value) {
                                case 0:
                                    value = "Khác";
                                    break;
                                case 1:
                                    value = "Nam"
                                    break;
                                case 2:
                                    value = "Nữ"
                                    break;
                                case 3:
                                    value = null;
                                    break;
                                default:
                                    break;
                                }
                                break;
                        case "text-left":
                            classAlign = "text-left";
                            break;
                            case "text-right":
                            classAlign = "text-right";
                            break;
                        case "date":
                            value = formatDate(value);
                            classAlign = "text-center";
                            break;
                        case "money":
                            value = formatMoney(value);
                            // classAlign = "content-text__right";
                            break;
                        default:
                            break;
                    }
                    //Tạo thHTML:
                    let thHTML = `<td id='${idAdd}' class='${classAlign}'>${value ||""}</td>`;
                    //Đẩy vào trElement:
                    trElement.append(thHTML);
                }

                // Ẩn loading
                hideLoading();
                // Lấy ra số bản ghi
                count++;            

                getNumberRecord();



                //js binding
                $(trElement).data("id", emp.EmployeeId);
                $(trElement).data("entity", emp);
                $("table#tbEmployee tbody").append(trElement);


                
            }
        },
        error: function(res){
            
            console.log(res);
        }
    });
}

function getNumberRecord() {
    // Xác định phạm vi 
    var pagingBody = $(".maincontent--paging").find(".paging");
    // Xoá câu cảnh báo cũ đã có
    $(pagingBody).empty();

    // Build câu cảnh báo lỗi từ dialog đã có
        var pagingInnerHTML = 
    `
                            <div class="text-paging">Tổng số: ${count} bản ghi</div>
                            <div class="fliter">
                                <div class="dropdown-filter">
                                    <div text-filter>Số bản ghi/trang:</div>
                                    <div class="icon-filter-dropdown icon-arrow-right"></div>
                                </div>
                                <div class="text-filter">bản ghi</div>
                                <div class="icon-center icon-arrow-left"></div>
                                <div class="icon-center icon-arrow-right"></div>                              
                            </div>
    `;
    $(pagingBody).append(pagingInnerHTML);
  }

var errorMess = [];
/**
 * Tạo các sự kiên cho các element
 */
function initEvents(){
    try {
        // Nhần nút thêm để hiển thị dialog thông tin nhân viên
            $("#btnAdd").click (function(){
            $("#dlgEmployeeInfor").show(); 

            // Xoá các tooltip cũ
            $(".input-EmplCode, .input-EmplName, .input-EmplPosition").removeClass("tooltip");  
            $("#txtEmployeeName, #txtEmployeeName, #txtEmployeeDepartment").removeClass("border-warning");    
            
            //Xoá toàn bộ thông tin trong ô nhập
            $('input').val(null);
                
            // Lấy mã id mới tự tăng
            getNewId();
            console.log(newId);

            $("#txtEmployeeCode").append(newId);
            
            // Khoanh vùng phạm vi
            var dlgTitleOfEpl = $("#dlgEmployeeInfor").find(".title-dialog");
            
            // Xoá câu cảnh báo cũ đã có
            $(dlgTitleOfEpl).empty();

            // Chuyển thành thêm mới nhân viên
            var warningInnerHTML = 
        `
        <div class="title-dialog"> Thêm nhân viên</div>
        `;
        $(dlgTitleOfEpl).append(warningInnerHTML);
            // Focus vào dialog nhập thông tin nhân viên
            $('#dlgEmployeeInfor input')[0].focus();
        });
        // Nhấn click biểu tượng x hoặc nút huỷ trong bảng dialog thông tin nhân viên để đóng bảng
        $(".btnClose").click(function () {            
            $(this).parents(".dialog").hide();
          })
        // Click vào nut trong thanh dropdown để ẩn hiện nó
        $(".btnDropdownPaging").click(function () {
            $(".dropdown-menu").toggle();
        });
        
        // Nhập dữ liệu vào input mã  trong dialog nhân viên
        $("#txtEmployeeCode").blur(function (){
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
        });
// Nhập dữ liệu vào input tên  trong dialog nhân viên
$("#txtEmployeeName").blur(function (){
    // Lấy giá trị nhập vào ô 
    var value = $(this).val(); 
    console.log(value);
    // Kiểm tra giá trị nhập vào 
    if(!value){
        // Giá trị bị trống ta hiện tooltip cho ô nhập và đỏ viền
        // $(".input-tooltip").addClass("tooltip");    
        $(".input-EmplName").addClass("tooltip");  
        $(this).addClass("border-warning");               
    }
    else{
        // Giá trị không bị trống ta hiện tooltip cho ô nhập và đỏ viền
        $(".input-EmplName").removeClass("tooltip");  
        $(this).removeClass("border-warning");               
    }
});
// Nhập dữ liệu vào input đơn vị trong dialog nhân viên
$("#txtEmployeeDepartment").blur(function (){
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
});
        
        // Nhập dữ liệu vào input email trong dialog nhân viên
        $("input[type='email']").blur(function() {
            //Kiem tra email
            var email = this.value;
            var isEmail = checkEmail(email);
            if(!isEmail){
                // Giá trị email không đúng định dạng ta hiện tooltip cho ô nhập và đỏ viền
                $(this).addClass("border-warning");   
                $(".input-EmplEmail").addClass("tooltip");
            }else{
                // Giá trị email đúng định dạng ta xoá tooltip cho ô nhập và đỏ viền
                $(this).removeClass("border-warning");
                $(".input-EmplEmail").removeClass("tooltip");   
            }
        });

        // Nhập dữ liệu vào input điện thoại đi động trong dialog nhân viên
        $("input[type='phoneNumber']").blur(function() {
            //Kiem tra email
            var phoneNumber = this.value;
            var isPhoneNumber = checkPhoneNumber(phoneNumber);
            if(!isPhoneNumber){
                // Giá trị email không đúng định dạng ta hiện tooltip cho ô nhập và đỏ viền
                $(this).addClass("border-warning");   
                $(".input-EmlPhoneNumber").addClass("tooltip");
            }else{
                // Giá trị email đúng định dạng ta xoá tooltip cho ô nhập và đỏ viền
                $(this).removeClass("border-warning");
                $(".input-EmlPhoneNumber").removeClass("tooltip");   
            }
        });

        // Nhập dữ liệu vào input điện thoại cố định trong dialog nhân viên
        $("input[type='landlinePhone']").blur(function() {
            //Kiem tra điện thoại cố định
            var landlinePhone = this.value;
            var isLandlinePhone = checkLandlinePhone(landlinePhone);
            if(!isLandlinePhone){
                // Giá trị điện thoại cố định không đúng định dạng ta hiện tooltip cho ô nhập và đỏ viền
                $(this).addClass("border-warning");   
                $(".input-EmplLandlinePhone").addClass("tooltip");
            }else{
                // Giá trị điện thoại cố định đúng định dạng ta xoá tooltip cho ô nhập và đỏ viền
                $(this).removeClass("border-warning");
                $(".input-EmplLandlinePhone").removeClass("tooltip");   
            }
        });
        // Click nút cất để lưu trữ thông tin sau khi hiện bảng sửa
        $("#btnSave").click(saveData);

        // Click nút cất và thêm để thêm mới dữ liệu
        $("#btnSave-Add").click(btnAddOnClick);

        // Click chọn cột trong bảng table thông tin nhân viên
        $("#tbEmployee tbody").on("click","tr",rowOnSelect); 

        // Click 2 lần chọn cột trong bảng table thông tin nhân viên để hiển thị dialog nhân viên
        $("#tbEmployee tbody").on("dblclick","tr",rowOnDblSelect); //on (func, element, selector)

        // Search trên thanh tìm kiếm nhân viên
        $('#search').keyup(searchInput);

        // Ấn biểu tượng refresh để load lại trang
        $("#btnRefresh").click(loadData);

    } catch (error) {
        console.log(error);
    }
}

// Chua hoan thanh
// function delData()
// {
//      // Lấy ra value
//      employeeId = $(this).data("id");

//     // Gọi api xoá dữ liệu nhân viên theo id nhân viên
//     $.ajax({
//         type: "DELETE",
//         url: "https://amis.manhnv.net/api/v1/Employees/" + employeeId,
//         dataType: "json",
//         success: function (response) {
//             alert("Sửa thành công");

//             // Load lại dữ liệu
//             loadData();

//             // Ẩn form chi tiết nhân viên
//             $("#dlgEmployeeInfor").hide();
//             }
//         });
// }

function getNewId() {
    $.ajax({
        type: "GET",
        url: "https://amis.manhnv.net/api/v1/Employees/NewEmployeeCode",
        success: function (res) {
            newId = res;
            
        },
        error: function(res){
            console.log(res);
        }
    });
}
/**
 * Hàm sửa dữ liệu trong bảng thông tin nhân viên
 */
function saveData() {
    try {
        // Lấy dữ liệu trong input của bảng dialog nhân viên
        let inputs = $("#dlgEmployeeInfor input")
        var employee = {};

        // Build object
        for (const input of inputs) {
            const propValue = $(input).attr("propValue");

            // Lấy ra value
            if(propValue){
                let value = input.value;
                employee[propValue] = value;
            }
        }

        // Gọi api thực hiện cất dữ liệu
        $.ajax({
            type: "PUT",
            url: "https://amis.manhnv.net/api/v1/Employees/" + employeeId,
            data: JSON.stringify(employee),
            dataType: "json",
            contentType: "application/json",
            success: function (response) {
                alert("Sửa thành công");

                // Load lại dữ liệu
                loadData();

                // Ẩn form chi tiết nhân viên
                $("#dlgEmployeeInfor").hide();
            }
        });
    } catch (error) {
        console.log(error);
    }
    
  }

function searchInput(){
    var regex = new RegExp($('#search').val(), "i");
    var rows = $('table tr:gt(0)');
    rows.each(function () {
      title = $(this).children("#emplName").html()
      if (title.search(regex) != -1) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
}

function rowOnSelect() {
    try {
        // Nhấn 1 lần hiện lần 2 ẩn
        $(this).toggleClass("row--selected");
    } catch (error) {
        console.log(error);
    }
  }

/**
 * Hàm hiển thị các trường dữ liệu của danh sách nhân viên 
 */
function rowOnDblSelect() {
    try {

        // Lấy id và data nhân viên của bản ghi hiện tại
        var employee = $(this).data("entity");
        employeeId = $(this).data("id");
        console.log(employeeId);

        $.ajax({
            type: "GET",
            url: "https://amis.manhnv.net/api/v1/Employees/" + employeeId,
            success: function (res) {
                  // Thêm màu cho dòng
                $(this).addClass("row--selected");

                // Hiển thị dialog nhân viên
                $("#dlgEmployeeInfor").show(); 

                // Xoá các tooltip cũ
                $(".input-EmplCode, .input-EmplName, .input-EmplPosition").removeClass("tooltip");  
                $("#txtEmployeeName, #txtEmployeeName, #txtEmployeeDepartment").removeClass("border-warning");   

                $("#txtEmployeeCode").val(employee.EmployeeCode);
                $("#txtEmployeeName").val(employee.EmployeeName);
                $("#txtEmployeeDepartment").val(employee.DepartmentName);
                $("#txtEmployeePosition").val(employee.PositionName);
                $("#dateEmployee").val(formatDate(employee.DateOfBirth));
                $("#identifyNumEmployee").val(employee.IdentityNumber);
                $("#dateIdentify").val(employee.IdentityDate);
                $("#identifyPlace").val(employee.IdentityPlace);
                $("#txtEmail").val(employee.Email);
                $("#phoneNumberEpl").val(employee.PhoneNumber);
                $("#landlinePhoneEpl").val(employee.TelephoneNumber);
                $("#addressEpl").val(employee.Address);
                $("#accountBank").val(employee.BankAccountNumber);
                $("#nameBank").val(employee.BankName);
                $("#branchBank").val(employee.BankBranchName);
                
            },
            error: function (res){
                console.log(res);
            }
        });
        
       
        // // Thêm màu cho dòng
        // $(this).addClass("row--selected");

        // // Hiển thị dialog nhân viên
        // $("#dlgEmployeeInfor").show(); 

        // // Xoá các tooltip cũ
        // $(".input-EmplCode, .input-EmplName, .input-EmplPosition").removeClass("tooltip");  
        // $("#txtEmployeeName, #txtEmployeeName, #txtEmployeeDepartment").removeClass("border-warning");   

        // $("#txtEmployeeCode").val(employee.EmployeeCode);
        // $("#txtEmployeeName").val(employee.EmployeeName);
        // $("#txtEmployeePosition").val(employee.DepartmentId);
        // $("#txtEmployeePosition").val(employee.PositionName);
        // $("#dateEmployee").val(formatDateForDlg(employee.DateOfBirth));
        // $("#identifyNumEmployee").val(employee.IdentityNumber);
        // $("#dateIdentify").val(employee.IdentityDate);
        // $("#identifyPlace").val(employee.IdentityPlace);


        
    } catch (error) {
        console.log(error);
    }
  }

function btnAddOnClick() {
    try {

        // Validate dữ liệu
        validateData();

        //Nếu không hợp lệ --> Đưa ra thông báo lỗi 
        if(errorMess.length > 0){
            showDialogWarning();
            return;
        }
        // Nếu hợp lệ --> Gọi API cất dữ liệu
        CallApiAddData();
        //Nếu API trả về mã thành công -> Hiển thị toast message thông báo thành công
        alert("Thêm mới thành công");

        // Load lại dữ liệu
        loadData();

        // Ẩn form chi tiết nhân viên
        $("#dlgEmployeeInfor").hide();
        // Nếu API trả về lỗi --> Hiển thị thông báo lỗi
    } catch (error) {
        
    }
}

/**
 * Chưa hoàn thành
 * Gọi api 
 */
function CallApiAddData(){
    try {
       // Build đối tượng nhân viên
       var employee = {
            EmployeeCode: $("#txtEmployeeCode").val(),
            EmployeeName: $("#txtEmployeeName").val(),
            DepartmentId: $("#txtEmployeePosition").val(),
       }
       
        // Gọi api
        $.ajax({
            type: "POST",
            url: "https://amis.manhnv.net/api/v1/Employees",
            data: JSON.stringify(employee),
            dataType: "jon",
            contentType: "application/json",
            success: function (response) {
                // console.log("success: ",response);
                
            },
            error: function (response) {

                // var statusCode = response.status;
                // switch (statusCode)
                // {
                //     case 400:
                //         var msg = response.responseJSON.userMsg;
                //         // Hiển thị thông báo lỗi
                        
                //         break;
                //     default:
                //         break;
                // }
                // console.log("error: ",response);

              }
        });
    } catch (error) {
        console.log(error);
    }
}

/**
 * Hiển thị dialog cảnh báo
 */
function showDialogWarning(){
    try {
        // Hiển thị Dialog Warning
        $("#dlgWarning").show();

        // Xác định phạm vi 
        var dialogBody = $("#dlgWarning").find(".mbox-title");
        // Xoá câu cảnh báo cũ đã có
        $(dialogBody).empty();

        // Build câu cảnh báo lỗi từ dialog đã có
        for (const msg of errorMess) {
            var warningInnerHTML = 
        `
        <div class="mbox-row-content">    
            <div class="icon-mbox icon-warning"></div>
            <div class="text-warning">${msg}</div>
        </div>
        `
        ;
        $(dialogBody).append(warningInnerHTML);
        }
        
        

    } catch (error) {
        console.log(error);
    }
}

function validateData() {
    try {
        errorMess = [];
        // Validate dữ liệu
        validateRequired();
    } catch (error) {
        console.log(error);
    }
  }

function validateRequired() 
{
    // Lấy tất cả trường dữ liệu thông tin bắt buộc
    var inputRequired = $("#dlgEmployeeInfor input[required]");

    // Validate từng trường thông tin
    for (const input of inputRequired) {
        var value = input.value;
        if(!value){
            $(input).addClass("border-warning");
            var note = $(input).attr("note");
            errorMess.push(`${note} không được để trống.`);
        }
        else{
            // $(input).removeClass("border-warning");
            
        }
    }

    // Trả về kết quả kèm thông báo lỗi
}



/**
 * 
 * Hàm kiểm tra email nhập vào phải có cú pháp abc@def.com
 * Author: TQHuy (11/10/2022)
 * @param {any} email 
 * @returns 
 */
function checkEmail(email){
    try{
        const re =
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return email.match(re);
    }
    catch(error){
        console.log(error);
    }
    
}

/**
 * Hàm kiểm tra số điện thoại nhập vào phải là số
 * Author: TQHuy (11/10/2022)
 * @param {any} phoneNumber 
 * @returns 
 */
function checkPhoneNumber(phoneNumber){
    const pattern = /^\d{10}$/;
    return phoneNumber.match(pattern )
}
/**
 * Hàm kiểm tra số điện thoại cố định nhập vào phải có dạng (012) 345-6789
 */
function checkLandlinePhone(landlinePhone){
    const pattern = /^\(?([0-9]{3})\)? ?([0-9]{3})?-?([0-9]{4})$/;
    return landlinePhone.match(pattern )
}
    
/**
 * Hàm định dạng ngày/tháng/năm 
 */
 function formatDate(date) {
    try {
        if(date) {
            date = new Date(date);
            //Ngay
            if(date.getDate() < 10)
                dateValue = String("0" + date.getDate());
            else 
                dateValue = String(date.getDate());
                   
            //Thang
            if (date.getMonth() < 10)
                month = String("0" + (date.getMonth() + 1));//Thang lay tu 0
            else 
            month = String(date.getMonth() + 1);//Thang lay tu 0
            
            //Nam
            let year = date.getFullYear();
            return `${dateValue}/${month}/${year}`; 
        }else{
            return "";
        }
        return `tháng/ngày/năm`;
    } catch (error) {
        console.log(error)
    }
}
/**
 * Hàm định dạng date cho ô nhập dữ liệu khách hàng
 * @param {any} date 
 * @returns 
 */
function formatDateForDlg(date) {
    try {
        if(date) {
            date = new Date(date);
            //Ngay
            if(date.getDate() < 10)
                dateValue = String("0" + date.getDate());
            else 
                dateValue = String(date.getDate());
                   
            //Thang
            if (date.getMonth() < 10)
                month = String("0" + (date.getMonth() + 1));//Thang lay tu 0
            else 
            month = String(date.getMonth() + 1);//Thang lay tu 0
            
            //Nam
            let year = date.getFullYear();
            return `${month}/${date}/${year}`; 
        }else{
            return "";
        }
        return `tháng/ngày/năm`;
    } catch (error) {
        console.log(error)
    }
}
/**
 * Hàm định dạng tiền 0vnd
 */
 function formatMoney(money){
    try{
        money =  new Intl.NumberFormat('vn-VI', {
            currency: 'VND',
            style: 'currency',
    }).format(money);
    return money;
    } catch(error) {
        console.log(error);
}
}