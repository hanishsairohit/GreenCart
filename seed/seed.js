const dbConnection = require("../config/mongoConnection");
const data = require("../data/index");
const products = data.products;
const comments = data.comments;
const users = data.users;

const { ObjectId } = require("mongodb");
address = {
  street: "abcde",
  city: "NYC",
  state: "NY",
  code: "07307",
};

async function main() {
  const db = await dbConnection();
  await db.dropDatabase();
  const product1 = await products.addProducts(
    "Water Lilly",
    "It is one of the most majestic plants to have in a water garden. It is by far the most exotic of all pond plants.Best grown in moist, acidic, humusy soils in part shade to full shade. Plants may be grown from seed, but will not flower for 4-5 years. Quicker and better results are obtained from planting corms which are sold by many bulb suppliers and nurseries.In addition, offsets from mature plants may be harvested and planted.",
    "https://cdn3.volusion.com/zmypa.bvvnu/v/vspfiles/photos/WA27539PL-2.jpg",
    "5",
    "good to buy",
    "15",
    "null",
    "null"
  );
  const product2 = await products.addProducts(
    "Gulmohar Tree, Delonix regia",
    "Enhance the beauty of your outdoor garden with an amazing flowering Gulmohar as avenue plant.Delonix regia is branched, broad, spreading, flat crowned deciduous tree. The attractive, semi deciduous leaves are elegant and fern like. Long, dark brown seed pods hang on the tree throughout the winter.The flowers of Delonix are large, with four spreading scarlet or orange-red petals and a fifth upright petal called the standard petal.",
    "https://i.pinimg.com/originals/da/33/bf/da33bf18c254ea101672892c612679fb.jpg",
    "58",
    "Awesome plant",
    "105",
    "null",
    "null"
  );
  const user1 = await users.addUser(
    "Hanish",
    "Pallapothu",
    "02/02/1996",
    26,
    "9293258425",
    "hanishrohit@gmail.com",
    "hanishPassword",
    address,
    ""
  );
  const user2 = await users.addUser(
    "Hanish",
    "Pallapothu",
    "02/02/1996",
    25,
    "9293258425",
    "hanishrohit@gmail.com",
    "hanishPassword",
    address,
    ""
  );

  console.log("Done seeding database");
  console.log(ObjectId(user1._id));
  console.log(ObjectId(user2._id));

  await comments.addComment();

  await comments.addComment(
    ObjectId(user1._id),
    product1._id,
    "This plant is so good."
  );
  await comments.addComment(
    ObjectId(user2._id),
    product1._id,
    "This plant is so nice."
  );
  await comments.addComment(
    ObjectId(user1._id),
    product2._id,
    "This plant is not good."
  );
  await comments.addComment(
    ObjectId(user2._id),
    product2._id,
    "I wont recommend."
  );

  await db.serverConfig.close();
}

main();
