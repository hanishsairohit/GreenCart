const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const products = data.products;
// const uuid = require('uuid').v4;

async function main() {
  const db = await dbConnection();
  await db.dropDatabase();
  await products.addProducts('Water Lilly','It is one of the most majestic plants to have in a water garden. It is by far the most exotic of all pond plants.Best grown in moist, acidic, humusy soils in part shade to full shade. Plants may be grown from seed, but will not flower for 4-5 years. Quicker and better results are obtained from planting corms which are sold by many bulb suppliers and nurseries.In addition, offsets from mature plants may be harvested and planted.','https://cdn3.volusion.com/zmypa.bvvnu/v/vspfiles/photos/WA27539PL-2.jpg','5','good to buy','15','null','null');
  await products.addProducts('Gulmohar Tree, Delonix regia', 'Enhance the beauty of your outdoor garden with an amazing flowering Gulmohar as avenue plant.Delonix regia is branched, broad, spreading, flat crowned deciduous tree. The attractive, semi deciduous leaves are elegant and fern like. Long, dark brown seed pods hang on the tree throughout the winter.The flowers of Delonix are large, with four spreading scarlet or orange-red petals and a fifth upright petal called the standard petal.','https://i.pinimg.com/originals/da/33/bf/da33bf18c254ea101672892c612679fb.jpg','58','Awesome plant','105','null','null');

   console.log('Done seeding database');

  await db.serverConfig.close();
}

main();