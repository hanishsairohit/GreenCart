$(document).ready(function() {
    $("#add_product_sub").click(function() {
        // alert("Form submitted Successfully");
        $.ajax({
            url: '/product', // url where to submit the request
            type : "POST", // type of action POST || GET
            dataType : 'json', // data type
            data : $("#productForm").serialize(), // post data || get data
            success : function(result) {
                // you can see the result from the console
                // tab of the developer tools
                console.log(result);
            },
            error: function() {
                // console.log(xhr, resp, text);
            }
        })
    });
});