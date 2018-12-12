var homeConfigue = {
    pageSize: 5,
    pageIndex:1
};

var homeController = {
    init: function () {
        homeController.loadData();
        homeController.registerEvent();
    },
    registerEvent: function () {
        //Bắt sự kiện chỉnh sửa Salary
        $('.txtSalary').off('keypress').on('keypress', function (e) {
            //Neu ban phim enter
            if (e.which == 13) {
                alert("Hello");
                //Lay id
                var id = $(this).data('id');
                //Lay gia tri
                var value = $(this).val();

                //Goi ham cap nhat du lieu
                homeController.updateSalary(id, value);
            }
        });

        // Bắt sự kiện AddNeww
        $('#btnAddNew').off('click').on('click', function () {
            $('#modelAddUpdate').modal('show'); //Hiện popup
            homeController.resetForm(); // reset lai Form
        });

        // Bắt sự kiên Edit
        $('.btn-edit').off('click').on('click', function () {
            $('#modelAddUpdate').modal('show'); //Hiện popup
            var id = $(this).data('id');    //Lay id 
            homeController.loadDetail(id);
        });

        // Bắt sự kiên Delete
        $('.btn-delete').off('click').on('click', function () {
            var id = $(this).data('id');    //Lay id de o ngoai, neu de o trong id se khong co
            bootbox.confirm("Bạn có muốn xóa bản ghi này!", function (result)
            {               
                homeController.deleteEmployee(id);
            });
        });

        // Bắt sự kiện click Search
        $('#btnSearch').off('click').on('click', function () {
            homeController.loadData(true);
        });

        //Xu ly su kien nut Reset
        $('#btnReset').off('click').on('click', function () {
            $('#txtNameS').val('');
            $('#ddlStatus').val('');
            homeController.loadData(true);
        });

        //Xu ly su kien nut Save cua Popup
        $('#btnSave').off('click').on('click', function () {           
            homeController.saveData();
        });

        //Bắt sự kiện Name search
        $('#txtNameS').off('keypress').on('keypress', function (e) {
            //Neu ban phim enter
            if (e.which == 13) {              
                homeController.loadData(true);
            }
        });

        //Bắt sự kiện Name search
        $('#ddlStatus').off('keypress').on('keypress', function (e) {
            //Neu ban phim enter
            if (e.which == 13) {
                homeController.loadData(true);
            }
        });

        
    },

    deleteEmployee:function(id){
        //Goi Ajax de xu ly
        $.ajax({
            url: '/Home/Delete',
            type: 'POST',
            dataType: 'json',
            data: { id: id },  //Ep kieu sang String de truyen len Model
            success: function (response) {
                if (response.status) {
                    bootbox.alert({
                        message: "Delete Success!",
                        callback: function () {
                            //console.log('This was logged in the callback!');
                            homeController.loadData(true);  //Load lai du lieu
                        }
                    })

                } else {
                    bootbox.alert(response.message);
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    },
    loadDetail:function(id){
        //Goi Ajax de xu ly load
        $.ajax({
            url: '/Home/GetDetail',
            type: 'GET',
            dataType: 'json',
            data: { id: id },  //Ep kieu sang String de truyen len Model
            success: function (response) {
                if (response.status) {
                    var data = response.data;   //Lay du lieu tu Controller len de xu ly
                    //alert("Update Success");

                    // Day du lieu len Popup
                    $('#txtName').val(data.Name);
                    $('#txtSalary').val(data.Salary);
                    $('#ckStatus').prop('checked',data.Status);
                    $('#hdID').val(data.ID);

                } else {
                    bootbox.alert(response.message);
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    },
    resetForm: function () {
        $('#hdID').val('0');
        $('#txtName').val('');
        $('#txtSalary').val(0);
        $('#ckStatus').prop('checked', true)
    },
    saveData: function () {
        //Lay du lieu, ta co the validatin form ở đây chưa validation
        var name = $('#txtName').val();
        var salary = parseFloat($('#txtSalary').val()); //Ep kieu sang thap phan
        var status = $('#ckStatus').prop('checked');
        var id = parseInt($('#hdID').val()); // ep kieu sang Int


        //Lay thuoc tinh doi tuong
        var data = {
            ID: id,
            Name: name,
            Salary: salary,
            Status: status
        };
        //Goi Ajax de xu ly
        $.ajax({
            url: '/Home/SaveData',
            type: 'POST',
            dataType: 'json',
            data: { model: JSON.stringify(data) },  //Ep kieu sang String de truyen len Model
            success: function (response) {
                if (response.status) {
                    bootbox.alert({
                        message: "Save Success!",
                        callback: function () {
                            //console.log('This was logged in the callback!');
                            $('#modelAddUpdate').modal('hide'); //Ẩn popup
                            homeController.loadData();  //Load lai du lieu
                        }
                    })
                    
                } else {
                    bootbox.alert(response.message);
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    },
    updateSalary: function (id, value) {
        //Lay thuoc tinh doi tuong
        var data = {
            ID: id,
            Salary: value
        };

        $.ajax({
            url: '/Home/Update',
            type: 'POST',
            dataType: 'json',
            data: { model: JSON.stringify(data) },  //Ep kieu sang String de truyen len Model
            success: function (response) {
                if (response.status) {
                    bootbox.alert("Cap nhat thanh cong!");
                } else {
                    bootbox.alert("Cap nhat that bai!");
                }
            }
        });
    },
    loadData: function (changePageSize) {
        var name = $('#txtNameS').val();
        var status = $('#ddlStatus').val();
        $.ajax({
            url: '/Home/LoadData',
            type: 'Get',
            data: {
                name: name,
                status:status,
                page: homeConfigue.pageIndex,
                pageSize: homeConfigue.pageSize
            },
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var data = response.data;
                    var html = '';
                    var template = $('#data-template').html();

                    $.each(data, function (i,item) {
                        html += Mustache.render(template, {
                            ID: item.ID,
                            Name: item.Name,
                            Salary: item.Salary,
                            Status: item.Status == true ? "<span class=\"label label-success\">Active</span>" : "Locked"
                        })
                    })

                    $('#tblData').html(html);

                    //Phan trang
                    homeController.pagination(response.total, function () {
                        homeController.loadData();
                    }, changePageSize);

                    //Nghe sự kiện
                    homeController.registerEvent();
                }
            }
        })
    },
    pagination: function (totalRow, callback, changePageSize) {

        //Tong so trang
        var totalPage = Math.ceil( totalRow/homeConfigue.pageSize);

        // Unbind pagination if it existed of click change pagesize
        if ($('#pagination a').length === 0 || changePageSize === true) {
            $('#pagination').empty();
            $('#pagination').removeData("twbs-pagination");
            $('#pagination').unbind("page");
        }

        $('#pagination').twbsPagination({
            totalPages: totalPage,
            visiblePages: 10,
            onPageClick: function (event, page) {
               // $('#page-content').text('Page ' + page);
               // homeController.loadData(); // Goi lai ham LoadData
                homeConfigue.pageIndex = page;
                setTimeout(callback,100);
            }
        });
    }
}

homeController.init();