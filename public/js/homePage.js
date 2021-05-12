$(document).ready(function () {
  const productTypes_dropdown = $("#displayProp");
  const filterDiv = $("#filterDiv");

  function objectifyForm(formArray) {
    //serialize data function
    var returnArray = {};
    for (var i = 0; i < formArray.length; i++) {
      returnArray[formArray[i]["name"]] = formArray[i]["value"];
    }
    return returnArray;
  }

  $.ajax({
    url: "/producttypes",
    type: "GET",
    dataType: "json",
    success: function (data) {
      productTypes_dropdown.empty();
      console.log(data);
      for (i of data) {
        const temp = `<button type="button" class="dropdown-item" value="${i}">${i}</button>`;
        productTypes_dropdown.append(temp);
      }
    },
    error: function () {
      console.log("fdcsxz");
    },
  });

  $(document).on("click", ".dropdown-item", function (e) {
    const product_type = $(this).val();
    filterDiv.empty();
    $.ajax({
      url: `/properties/${product_type}`,
      type: "GET",
      dataType: "json",
      success: function (data) {
        let formData = `<form id ="filterData">`;
        for (prop of data) {
          if (prop.type == "number") {
            formData =
              formData +
              `
            <div>
            <label for ="${prop.name}"> ${prop.name} (max value)</label>
            <input type = "number" id = "${prop.name}"name= "${prop.name}">
            </div>`;
          } else {
            formData =
              formData +
              `
              <div>
              <label for ="${prop.name}"> ${prop.name}</label>
              <input type = "text" id = "${prop.name}"name= "${prop.name}">
              </div>`;
          }
        }

        formData =
          formData + `<input type="button" value="filter" id="filterButton" />`;

        formData =
          formData +
          `<input type="hidden" value="${product_type}" name="product_type">`;

        formData = formData + `</form>`;
        filterDiv.append(formData);
      },
      error: function () {
        console.log("fdcsxz");
      },
    });
  });

  $(document).on("click", "#filterButton", function (e) {
    const filterData = $("#filterData").serializeArray();

    const prop_list = objectifyForm(filterData);

    for (i of Object.keys(prop_list)) {
      if (prop_list[i] == "") {
        delete prop_list[i];
      }
    }

    console.log(prop_list);

    $.ajax({
      url: `/filter`,
      type: "POST",
      dataType: "json",
      data: prop_list,
      success: function (data) {
        console.log(data);
      },
      error: function () {},
    });
  });
});
