export default class UserModel {
  constructor(id, name, email, password, type) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.type = type;
  }

  static createUser(name, email, password, type) {
    const newUser = new UserModel(
      usersCollection.length + 1,
      name,
      email,
      password,
      type
    );

    usersCollection.push(newUser);
    return newUser;
  }

  static authenticateUser(email, password) {
    const findUser = usersCollection.find((user) => {
      return user?.email == email && user?.password == password;
    });
    return findUser;
  }

  static getAllUser() {
    return usersCollection;
  }
}

const usersCollection = [
  new UserModel(
    0,
    "Saurabh Tiwari",
    "s.t.48826@gmail.com",
    "Sau@oo123",
    "seller"
  ),
];
