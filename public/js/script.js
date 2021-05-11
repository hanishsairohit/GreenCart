$(document).ready(function() {
    $("#add_product_sub").click(function() {
        $.ajax({
            url: '/product', // url where to submit the request
            type : "POST", // type of action POST || GET
            dataType : 'json', // data type
            data : $("#productForm").serialize(), // post data || get data
            success : function(data) {
                $('#exampleModalLong').hide();
                $('#prod_modal_dialog').hide();
                location.reload();
            },
            error: function() {
                
            }
        })
    });

    $('.delete_product').on('click', function(e) {
        var id = $(this).attr('data-id');
        $.ajax({
            url: '/product/'+ id, // url where to submit the request
            type : "delete", // type of action POST || GET
            dataType : 'json', // data type
            // data : id, // post data || get data
            success : function(data) {
            //    alert("deleted");
                location.reload();
            },
            error: function() {
                
            }
        })
    });
    $('.product_click').on('click', function(e) {
        var id = $(this).attr('data-id');
        $.ajax({
            url: '/product/'+ id, // url where to submit the request
            type : "GET", // type of action POST || GET
            success : function(data) {
                window.location.href = 'http://localhost:3000/product/'+id;
            },
            error: function() {
                
            }
        })
    });
});