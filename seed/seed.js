const dbConnection = require("../config/mongoConnection");
const data = require("../data/index");
const products = data.products;
const comments = data.comments;
const users = data.users;
const productType = data.productType;
const admin = data.admin;

const { ObjectId } = require("mongodb");
const { use } = require("../routes/users");
address = {
  street: "abcde",
  city: "NYC",
  state: "NY",
  code: "07307",
};

async function main() {
  const db = await dbConnection();
  await db.dropDatabase();
  const product1 = await products.addProduct(
    "Water Lilly",
    "It is one of the most majestic plants to have in a water garden. It is by far the most exotic of all pond plants.Best grown in moist, acidic, humusy soils in part shade to full shade. Plants may be grown from seed, but will not flower for 4-5 years. Quicker and better results are obtained from planting corms which are sold by many bulb suppliers and nurseries.In addition, offsets from mature plants may be harvested and planted.",
    "https://cdn3.volusion.com/zmypa.bvvnu/v/vspfiles/photos/WA27539PL-2.jpg",
    "seed.js",
    34,
    [
      { property: "product_type", value: "plant" },
      { property: "color", value: "green" },
      { property: "weight", value: 55 },
    ]
  );

  const product2 = await products.addProduct(
    "China seeds",
    "seeds are from china",
    "https://i.pinimg.com/originals/da/33/bf/da33bf18c254ea101672892c612679fb.jpg",
    "seed.js",
    10,
    [
      { property: "product_type", value: "seed" },
      { property: "color", value: "brown" },
      { property: "number_of_seeds", value: 45 },
    ]
  );

  //firstName, lastName, phoneNumber, emailId, password, address
  const user1 = await users.addUser(
    "Hanish",
    "Pallapothu",
    9293258425,
    "hanishrohit@gmail.com",
    "hanishPassword",
    {
      Line1: "332 Webster Ave",
      Line2: "Apt #2L",
      City: "Jersey City",
      State: "New Jersey",
      Country: "USA",
      ZipCode: 07307,
    }
  );
  const user2 = await users.addUser(
    "Dhruv",
    "D",
    "02/02/1997",
    23,
    "9293258420",
    "Dhriv@gmail.com",
    "DhruvDhruv",
    {
      Line1: "332 Webster Ave",
      Line2: "Apt #2R",
      City: "Jersey City",
      State: "New Jersey",
      Country: "USA",
      ZipCode: 07307,
    }
  );

  //608359c8aa00751b1ebd7546
  const c1 = await comments.addComment(
    user1._id,
    product1,
    "This plant is so good."
  );
  const c2 = await comments.addComment(
    user2._id,
    product1,
    "This plant is so nice."
  );
  const c3 = await comments.addComment(
    user1._id,
    product2,
    "This plant is not good."
  );
  const c4 = await comments.addComment(
    user2._id,
    product2,
    "I wont recommend."
  );

  const c1Info = await comments.getComment(c1);
  //   console.log(c1Info);

  console.log("Done seeding database");

  //   await products.addLike(product1, user1._id);

  // below code is for testing database functions.

  //   const productsInfp = await products.getAllProducts();
  const userData = await users.getUser(user1._id);
  const produtInf = await products.getProductById(product1);

  //   const productsList1 = await products.searchProduct("harvested");

  const prop = { color: "green", product_type: "plant" };

  const productsList1 = await products.filterProducts(prop);

  console.log(productsList1);

  const properties = [
    { name: "plant_height", type: "number" },
    { name: "plant_color", type: "string" },
  ];

  const itemType1 = await productType.addNewProductType(
    "plant",
    properties,
    20
  );
  const itemType2 = await productType.addNewProductType("seed", properties, 20);
  const itemType3 = await productType.addNewProductType(
    "fertilizer",
    properties,
    20
  );

  // const doesExist = await productType.doesProductTypeExist("plant");

  const add_property = {
    name: "plant_weight",
    type: "number",
  };

  const help = await productType.updatePropertiesOfProduct(
    "plant",
    add_property
  );

  const doesExist = await productType.doesPropertyOfProductTypeExist(
    "plant",
    add_property
  );

  const admin1 = await admin.addAdmin(
    "Hanish",
    "Pallapothu",
    "fdsc",
    [product1],
    "gmail.com"
  );

  //admin.getAdmin("dsf") function tested.

  const update1 = await admin.adminAddsAProduct(product2, ObjectId(admin1));
  const update2 = await admin.adminDeletesAProduct(product1, ObjectId(admin1));

  console.log(admin1);

  console.log(doesExist);

  // console.log(doesExist);

  // console.log(itemType1);
  // console.log(itemType2);
  // console.log(itemType3);

  //   const productsList = await users.getUserLikedProdcuts(user1._id);
  //   console.log(productsList);

  //   console.log(userData);

  //   const commentsOfprp = await products.getProductComments(product1);
  //   console.log("Ddd");
  //   console.log(commentsOfprp);
  //   const commentsOfuser = await users.getUserComments(user1._id);

  //   console.log(produtInf);

  await db.serverConfig.close();
}

main();
