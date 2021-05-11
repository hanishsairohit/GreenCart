const { ObjectId } = require("mongodb");
module.exports = {
  //tested
  checkString(parameter, name) {
    if (parameter === undefined) {
      throw `Please pass ${name} parameter to the function`;
    }
    if (typeof parameter != "string")
      throw `parameter ${name} must be of type string.`;
    if (parameter.trim().length === 0)
      throw `parameter cannot be an empty string.`;
  },

  //tested
  checkEmail(parameter) {
    this.checkString(parameter, "email");

    const emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailRe.test(String(parameter).toLowerCase())) {
      throw `Email is not in proper format.`;
    }
  },

  //tested
  checkStringObjectId(parameter, name) {
    this.checkString(parameter, name);
    // ref: https://stackoverflow.com/a/11989159
    if (!ObjectId.isValid(parameter))
      throw `Passed parameter ${name} is not a valid object ID.`;
  },

  //tested
  checkPassword(parameter) {
    if (parameter === undefined || parameter === null) {
      throw "Please pass a valid password";
    }

    if (typeof parameter === "string") {
      if (parameter.trim().length == 0) {
        throw "Password cannot be empty";
      }
    } else {
      throw `Password must be of type string`;
    }
  },

  // tested
  checkInt(parameter, name) {
    if (parameter === undefined) {
      throw `Please pass ${name} parameter to the function`;
    }
    if (typeof parameter != "number")
      throw `parameter ${name} must be of type Number.`;

    if (parameter.toString().split(".").length > 1)
      throw `Error! ${name} cannot be a float.`;
  },

  //tested
  checkObject(object, name) {
    if (typeof object === "undefined") {
      throw `Error! Please provide ${name} into the function`;
    }
    if (typeof object !== "object" || Array.isArray(object) || object === null)
      throw `Error! Parameter ${name} should be of object type.`;

    if (Object.keys(object).length == 0) {
      throw `${name} object should have atleast one key-value pair`;
    }
  },

  //tested
  checkFacet(facet) {
    if (facet === undefined) {
      throw `Please pass facet parameter to the function`;
    }

    if (!Array.isArray(facet)) {
      throw `Facet value should be of type Array`;
    }
    if (facet.length < 2) {
      throw `Item should have atleast two properties.`;
    }

    for (element of facet) {
      this.checkObject(element, "Element of Facet");
      this.checkString(element.property, "Property ");
      if (element.value === undefined || element.value === null) {
        throw `You must set a value for the property ${element.property} of facet.`;
      }

      if (
        typeof element.value !== "number" &&
        typeof element.value !== "string"
      ) {
        throw `The type of ${
          element.property
        } should be a number or string. It cannot be a type of ${typeof element.value}.`;
      }

      if (Object.keys(element).length !== 2) {
        throw `A facet Property should have only two keys i.e., property and value`;
      }
    }

    if (facet[0].property != "product_type") {
      throw `First element of Facet must have product_type property.`;
    }

    if (typeof facet[0].value !== "string") {
      throw `The value of product_type property must be a string.`;
    }
  },

  //tested
  checkStringOrInt(parameter, name) {
    if (parameter === undefined) {
      throw `Please pass ${name} parameter to the function`;
    }
    if (typeof parameter !== "string") {
      if (typeof parameter !== "number") {
        throw `parameter ${name} must be of type string or number.`;
      }
    } else {
      if (parameter.trim().length === 0)
        throw `parameter ${name} cannot be an empty string.`;
    }
  },

  //tested
  checkFilterProperties(properties) {
    if (typeof properties === "undefined") {
      throw "Please provide properties to filter products.";
    }

    this.checkObject(properties, "properties");

    if (properties["product_type"] === undefined) {
      throw "You must pass product_type property to filter products";
    }
    let count = 0;
    for (const [_, value] of Object.entries(properties)) {
      this.checkStringOrInt(value, "Property value");
      count = count + 1;
    }
  },

  //tested
  checkPropertiesOfProduct(properties) {
    if (typeof properties === undefined) {
      throw `Please pass properies list into addNewProductType method `;
    }

    if (!Array.isArray(properties)) {
      throw `Properties passing into addNewProductType method should be of array type.`;
    }

    if (properties.length < 2) {
      throw `You should pass atleast two properties into addNewProductType method.`;
    }

    for (obj of properties) {
      this.checkObject(obj, "property");

      if (obj["property"] === undefined) {
        throw "You should mention the name of each property";
      }

      this.checkString(obj["property"], "property");

      if (obj["value"] === undefined) {
        throw "You should mention the type of each property";
      }

      this.checkStringOrInt(obj["value"], "propery value");

      if (
        typeof obj["value"] !== "string" &&
        typeof obj["value"] !== "number"
      ) {
        throw "Property value type should be either string or number";
      }

      if (!(Object.keys(obj).length === 2)) {
        throw " A property object should have only two keys i.e., property and value.";
      }
    }

    // if (properties[0].property != "product_type") {
    //   throw `First element of properties list must have product_type property.`;
    // }
  },

  //Tested
  checkBoolean(boolValue, name) {
    if (typeof boolValue === undefined) {
      throw `Please pass ${name} parameter to the function`;
    }

    if (typeof boolValue !== "boolean") {
      throw `${name} parameter must be of type boolean`;
    }
  },

  //tested //should test again
  checkProperty(obj) {
    this.checkObject(obj, "Property");

    if (obj["name"] === undefined) {
      throw "You should mention the name of each property";
    }

    this.checkString(obj["name"], "propery name");

    if (obj["type"] === undefined) {
      throw "You should mention the type of each property";
    }

    this.checkString(obj["type"], "propery type");

    if (obj["type"] !== "string" && obj["type"] !== "number") {
      throw "Property type should be either string or number";
    }

    let noOfKeys = 2;

    if (obj["count"] !== undefined) {
      noOfKeys++;
    }

    if (obj["values"] !== undefined) {
      noOfKeys++;
    }

    if (!(Object.keys(obj).length === noOfKeys)) {
      throw " A property object should have  two properties i.e., name and type.";
    }
  },

  //tested
  checkPhoneNumber(phoneNumber) {
    this.checkString(phoneNumber, "Phone Number");
    if (phoneNumber.trim().length !== 10) {
      throw `Phone number must have 10 digits.`;
    }

    for (i of phoneNumber) {
      try {
        if (isNaN(parseInt(i))) {
          throw " ";
        }
        this.checkInt(parseInt(i));
      } catch {
        throw "Phone number string should only contain numbers.";
      }
    }
  },

  //tested
  //Zipcode can be any number
  checkAddress(address) {
    this.checkObject(address, "address");

    const keys_ = ["Line1", "Line2", "City", "State", "Country"];

    for (key of keys_) {
      if (address[key] === undefined) {
        throw `You should mention the ${key} of the address`;
      }
      this.checkString(address[key], key);
    }

    if (address["ZipCode"] === undefined) {
      throw "You should mention the ZipCode of the address";
    }

    this.checkInt(address["ZipCode"], "ZipCode");

    if (address["ZipCode"].toString().split(".").length > 1) {
      throw `ZipCode must not be float nor have "." `;
    }

    if (!(Object.keys(address).length === 6)) {
      throw " A property object should have only 6 keys i.e., Line1, Line2, City, State, Country and ZipCode .";
    }
  },
  checkFloat(parameter, name) {
    if (parameter === undefined) {
      throw `Please pass ${name} parameter to the function`;
    }
    if (typeof parameter != "number")
      throw `parameter ${name} must be of type Number.`;
  },
};
