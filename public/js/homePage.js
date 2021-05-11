$(document).ready(function () {
  function getProp() {
    console.log("id");
  }
  const productTypes_dropdown = $("#displayProp");
  $.ajax({
    url: "/producttypes",
    type: "GET",
    dataType: "json",
    success: function (data) {
      productTypes_dropdown.empty();
      console.log(data);
      for (i of data) {
        const temp = `<button type="button" class="dropdown-item" onclick=getProp()>${i}</button>`;
        productTypes_dropdown.append(temp);
      }
    },
    error: function () {
      console.log("fdcsxz");
    },
  });
});
