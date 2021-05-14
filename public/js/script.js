$(document).ready(function () {
  let count = 0;

  function hasUserLikedThisProductBefore(productid) {
    let output = false;
    $.ajax({
      url: "/getUserLikedProducts/", // url where to submit the request
      type: "GET", // type of action POST || GET
      async: false,
      dataType: "json", // data type
      success: function (data) {
        console.log(data);
        for (i of data) {
          console.log(i._id);
          console.log(productid);

          console.log("frds");
          if (i._id === productid) {
            output = true;
            console.log(output, "hbnjm");
            break;
          }
        }
      },
      error: function () {},
    });

    console.log(output, "frd");

    return output;
  }

  const userLiked = hasUserLikedThisProductBefore(
    $(".product_like").attr("data-id")
  );

  if (userLiked) {
    $("#unliked").attr("id", "liked");
    console.log("fedsx");
  }

  function objectifyForm(formArray) {
    //serialize data function
    var returnArray = {};
    for (var i = 0; i < formArray.length; i++) {
      returnArray[formArray[i]["name"]] = formArray[i]["value"];
    }
    return returnArray;
  }

  $("#add_product_sub").click(function () {
    let i = 1;
    const facetList = [];
    const body = objectifyForm($("#productForm").serializeArray());
    facetList.push({ property: "product_type", value: body["product_type"] });
    while (i <= count) {
      facetList.push({
        property: $(`#prop_name${i}`).val(),
        value: $(`#prop_val${i}`).val(),
      });

      i++;
    }

    body["facet"] = facetList;

    console.log(body);

    $.ajax({
      url: "/product", // url where to submit the request
      type: "POST", // type of action POST || GET
      dataType: "json", // data type
      data: body, // post data || get data

      complete: function (e) {
        if (e.status == 200) {
          $("#error_msg").empty();
          $("#exampleModalLong").hide();
          $("#prod_modal_dialog").hide();
          location.reload();
        } else if (e.status == 400) {
          $("#error_msg").empty();
          $("#error_msg").append(
            `<p>Error! ${JSON.parse(e.responseText)["error"]}</p>`
          );
        } else {
          $("#error_msg").empty();
          $("#error_msg").append(
            "<p>Error! Please enter a valid data to add the product.</p>"
          );
        }
      },
    });
  });

  $("#add_property").click(function () {
    count = count + 1;
    const divTag = $("#properties");
    const add = `\
    <label for='name'>Property ${count}  Name </label>\
    <input type='text' name='name' class='form-control' id = 'prop_name${count}'>\
    <label for='value'>Property ${count} Value</label>\
    <input type='text' name='value' class='form-control' id = 'prop_val${count}'>`;

    divTag.append(add);
  });

  $(".delete_product").on("click", function (e) {
    var id = $(this).attr("data-id");
    $.ajax({
      url: "/product/" + id, // url where to submit the request
      type: "delete", // type of action POST || GET
      dataType: "json", // data type
      // data : id, // post data || get data
      success: function (data) {
        //    alert("deleted");
        location.reload();
      },
      error: function () {},
// <<<<<<< dhruveel-test
//     });
//   });

//   $(".product_click").on("click", function (e) {
//     var id = $(this).attr("data-id");
//     $.ajax({
//       url: "/products/product/" + id, // url where to submit the request
//       type: "GET", // type of action POST || GET
// =======
    });
  });

  $(".product_click").on("click", function (e) {
    var id = $(this).attr("data-id");
    $.ajax({
      url: "/products/product/" + id, // url where to submit the request
      type: "GET", // type of action POST || GET
      success: function (data) {
        window.location.href = "http://localhost:3000/products/product/" + id;
      },
      error: function () {},
    });
  });

  $(".buy_now").on("click", function (e) {
    var id = $(this).attr("data-id");
    alert("Product has beed added to Cart");
    $.ajax({
      url: "/addtocart/" + id, // url where to submit the request
      type: "patch", // type of action POST || GET
// >>>>>>> master
      success: function (data) {
        window.location.href = "http://localhost:3000/products/product/" + id;
      },
      error: function () {},
    });
  });
// <<<<<<< dhruveel-test

//   $(".buy_now").on("click", function (e) {
//     var id = $(this).attr("data-id");
//     alert("Product has beed added to Cart");
//     $.ajax({
//       url: "/product/addtocart/" + id, // url where to submit the request
//       type: "patch", // type of action POST || GET
//       success: function (data) {
//         console.log("now");
// =======

  $(".add_review").on("click", function (e) {
    e.preventDefault();
    var id = $(this).attr("data-id");

    const review = $("#reviewForm").serializeArray()[0]["value"]; // code to get the review text data

    $.ajax({
      url: "/product/comment/" + id, // url where to submit the request
      type: "patch", // type of action POST || GET
      data: { review: review },
      success: function (data) {
// >>>>>>> master
        window.location.href = "http://localhost:3000/products/product/" + id;
      },
      error: function () {},
    });
  });
// <<<<<<< dhruveel-test

//   $(".add_review").on("click", function (e) {
//     alert("dssadasf");
//     var id = $(this).attr("data-id");
//     $.ajax({
//       url: "/product/comment/" + id, // url where to submit the request
//       type: "patch", // type of action POST || GET
//       success: function (data) {
//         alert("dsfdfsf");
//         window.location.href = "http://localhost:3000/products/product/" + id;
// =======

  $(".product_like").on("click", function (e) {
    e.preventDefault();
    var id = $(this).attr("data-id");

    if (userLiked) {
      $.ajax({
        url: "/product/dislike/" + id, // url where to submit the request
        type: "patch", // type of action POST || GET
        success: function (data) {
          window.location.href = "http://localhost:3000/products/product/" + id;
          $("#unliked").attr("id", "liked");
          userLiked = false;
        },
        error: function () {},
      });
    } else {
      $.ajax({
        url: "/product/like/" + id, // url where to submit the request
        type: "patch", // type of action POST || GET
        success: function (data) {
          window.location.href = "http://localhost:3000/products/product/" + id;
          $("#liked").attr("id", "unliked");
          userLiked = true;
        },
        error: function () {},
      });
    }
  });

  $("#cart_btn").on("click", function (e) {
    var id = "609a9ffbe959bc914a4a5655";
    alert("eyreuty");
    $.ajax({
      url: "/addtocart/" + id, // url where to submit the request
      type: "patch", // type of action POST || GET
      success: function (data) {
        alert("noxvcxvw");
        window.location.href = "http://localhost:3000/addtocart/" + id;
// >>>>>>> master
      },
      error: function () {},
    });
  });
});
