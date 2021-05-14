const dbConnection = require("../config/mongoConnection");
const data = require("../data/index");
const products = data.products;
const comments = data.comments;
const users = data.users;
const productType = data.productType;
const admin = data.admin;

const { ObjectId } = require("mongodb");

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
    ],
    67.5
  );

  const product2 = await products.addProduct(
    "China seeds",
    "seeds are from china",
    "https://i.pinimg.com/originals/da/33/bf/da33bf18c254ea101672892c612679fb.jpg",
    "seed.js",
    9,
    [
      { property: "product_type", value: "seed" },
      { property: "color", value: "brown" },
      { property: "number of seeds", value: 70 },
    ],
    45.5
  );

  const product3 = await products.addProduct(
    "China seeds 2",
    "seeds are from china mainland",
    "https://i.pinimg.com/originals/da/33/bf/da33bf18c254ea101672892c612679fb.jpg",
    "seed.js",
    10,
    [
      { property: "product_type", value: "seed" },
      { property: "color", value: "white" },
      { property: "weight of each seed", value: 2 },
      { property: "number of packets ", value: 5 },
    ],
    10.5
  );

  const product4 = await products.addProduct(
    "french fertilizer",
    "seeds are from french",
    "https://i.pinimg.com/originals/da/33/bf/da33bf18c254ea101672892c612679fb.jpg",
    "seed.js",
    43,
    [
      { property: "product_type", value: "fertilizer" },
      { property: "color", value: "pink" },
      { property: "Imported from", value: "china" },
    ],
    3.9
  );

  const product49 = await products.addProduct(
    "french fertilizer",
    "fertilizer from french",
    "https://i.pinimg.com/originals/da/33/bf/da33bf18c254ea101672892c612679fb.jpg",
    "seed.js",
    23,
    [
      { property: "product_type", value: "fertilizer" },
      { property: "color", value: "pink" },
      { property: "weather", value: "summer" },
    ],
    3.6
  );

  const product5 = await products.addProduct(
    "Indian Yellow Plants",
    "Plants from Indian Subcontinent",
    "https://i.pinimg.com/originals/da/33/bf/da33bf18c254ea101672892c612679fb.jpg",
    "seed.js",
    3,
    [
      { property: "product_type", value: "plant" },
      { property: "suitable_weather", value: "sunny" },
      { property: "lifetime (in Years)", value: 20 },
    ],
    3.67
  );

  const product6 = await products.addProduct(
    "Plant 4",
    "Plants with yellow flowers",
    "https://i.pinimg.com/originals/da/33/bf/da33bf18c254ea101672892c612679fb.jpg",
    "seed.js",
    25,
    [
      { property: "product_type", value: "plant" },
      { property: "color", value: "yellow" },
      { property: "lifetime (in Years)", value: 40 },
    ],
    45
  );

  const product7 = await products.addProduct(
    "seeds 5",
    "chilli seeds",
    "https://i.pinimg.com/originals/da/33/bf/da33bf18c254ea101672892c612679fb.jpg",
    "seed.js",
    44,
    [
      { property: "product_type", value: "seed" },
      { property: "color", value: "blue" },
      { property: "suitable_weather", value: "summer" },
    ],
    25
  );

  const product8 = await products.addProduct(
    "fertilizer 3",
    "good rated fertilizers",
    "https://i.pinimg.com/originals/da/33/bf/da33bf18c254ea101672892c612679fb.jpg",
    "seed.js",
    3,
    [
      { property: "product_type", value: "fertilizer" },
      { property: "Imported from", value: "india" },
      { property: "weight", value: "Medium" },
    ],
    32.45
  );

  const product9 = await products.addProduct(
    "Indian Yellow Plants",
    "Plants from Indian Subcontinent",
    "https://i.pinimg.com/originals/da/33/bf/da33bf18c254ea101672892c612679fb.jpg",
    "seed.js",
    10,
    [
      { property: "product_type", value: "plant" },
      { property: "suitable_weather", value: "cold" },
      { property: "lifetime (in Years)", value: 20 },
    ],
    25
  );

  const product11 = await products.addProduct(
    "Indian Yellow Plants",
    "Plants from Indian Subcontinent",
    "https://i.pinimg.com/originals/da/33/bf/da33bf18c254ea101672892c612679fb.jpg",
    "seed.js",
    1,
    [
      { property: "product_type", value: "fertilizer" },
      { property: "suitable_weather", value: "rainy" },
      { property: "weight", value: "Medium sized" },
      { property: "height", value: 20 },
      { property: "height", value: 40 },
    ],
    34
  );

  const product99 = await products.addProduct(
    "Indian Yellow Plants",
    "Plants from Indian Subcontinent",
    "https://i.pinimg.com/originals/da/33/bf/da33bf18c254ea101672892c612679fb.jpg",
    "seed.js",
    1,
    [
      { property: "product_type", value: "fertilizer" },
      { property: "suitable_weather", value: "sunny" },
      { property: "weight", value: "Medium sized" },
    ],
    33
  );

  const product10 = await products.addProduct(
    "Indian Yellow Plants",
    "Plants from Indian Subcontinent",
    "https://i.pinimg.com/originals/da/33/bf/da33bf18c254ea101672892c612679fb.jpg",
    "seed.js",
    1,
    [
      { property: "product_type", value: "fertilizer" },
      { property: "weight int", value: 20 },
      { property: "number of packets", value: 43 },
    ],
    3
  );

  const user1 = await users.addUser(
    "Hanish",
    "Pallapothu",
    "9293258425",
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

  // //608359c8aa00751b1ebd7546
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
  console.log(c1Info);

  console.log("+");

  // const commentsList = await products.getProductComments(product2);
  // console.log(commentsList);

  // console.log("Done seeding database");

  await products.addLike(product2, user1._id);

  await users.userPurchasesAProduct(user1._id, product2);
  await users.userViewsAProduct(user1._id, product10);
  await users.userLikesAProduct(user2._id, product2);

  const prop_ = {
    product_type: "plant",
  };

  console.log(await products.filterProducts(prop_));

  //   await products.deleteProduct(product1, 34);
  //   await products.deleteProduct(product6, 24);
  await db.serverConfig.close();
}

main();
