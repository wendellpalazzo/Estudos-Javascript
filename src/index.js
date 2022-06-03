console.clear();
/**
 * Builder pattern is a design pattern
 * to provide a flexible solution for creating objects.
 * Builder pattern separates the construction of a complex
 * object from its representation.
 *
 * Builder pattern builds a complex object
 * using simple objects by providing a step by step approach.
 * It belongs to the creational patterns
 */

function userModel(fields) {
  this.id = fields.id;
  this.name = fields.name;
}

function userModel2(fields) {
  this.name = fields.name;
}

function userBuilder(Model) {
  function setId(v) {
    this.id = v;
    return this;
  }

  function setName(v) {
    this.name = v;
    return this;
  }

  function build() {
    const M = Model;
    return new M(this);
  }

  return {
    setName,
    setId,
    build
  };
}

// observer
//  -> Observers (escutando o subject, lembra de websocket?)
// -> Subject (alterar estado, notifica os observers)
function logger(d) {
  console.log("LOGGER", d);
}

function logger2(d) {
  console.warn("LOGGER 2", d);
}

// factory (criação de objetos)
function userFactory() {
  let users = [];
  let state = {
    observers: []
  };

  function subscribe(observerFunction) {
    state.observers.push(observerFunction);
  }

  function _notify(command) {
    console.log(`Notifying ${state.observers.length} observers`);

    for (const observerFunction of state.observers) observerFunction(command);
  }

  function _save(data) {
    const uIdx = _getUserIndex(data.id);

    if (!!uIdx) {
      users.push(data);
      _notify(`Criei o objeto -> ${JSON.stringify(data)}`);
      return ["Created 201", data];
    }

    users[uIdx] = { ...users[uIdx], ...data };
    _notify(`Atualizei o objeto ->", ${JSON.stringify(data)}`);
    return ["Updated 200", data];
  }

  function _getUserIndex(id) {
    return users.findIndex((user) => user.id === id);
  }

  function create(data) {
    const u = users.find((user) => user.id === data.id);

    if (u) return ["422", "Já existe"];

    return _save(data);
  }

  function update(data) {
    const u = users.find((user) => user.id === data.id);

    if (!u) return ["404 Not found"];

    return _save(data);
  }

  function find(id) {
    return users[_getUserIndex(id)];
  }

  function findAll() {
    return users;
  }

  function delete_one(id) {
    const uIdx = _getUserIndex(id);
    const _old = users[uIdx];

    if (uIdx !== -1) {
      users.splice(uIdx, 1);
      _notify(`"Removi o objeto ->", ${JSON.stringify(_old)}`);
      return ["204 No Content"];
    }

    return [
      "404 Not Found",
      "Não encontrei usuario para excluir com o id enviado"
    ];
  }

  return {
    findAll,
    create,
    update,
    find,
    delete_one,
    subscribe
  };
}

let uFactor = userFactory();
uFactor.subscribe(logger);
uFactor.subscribe(logger2);

let uWithBuilder = new userBuilder(userModel)
  .setId(2)
  .setName("wendell Palazzo 2");
console.log(uWithBuilder.build());

uWithBuilder = new userBuilder(userModel2)
  .setId(2)
  .setName("wendell Palazzo 2");
console.log(uWithBuilder.build());
// console.log(uWithBuilder);
// console.log(userBuilder().build({ id: 1, name: "wendell" }))

// // console.log("list", uFactor.findAll());
// console.log("create", uFactor.create({ id: 1, nome: "wendell" }));
// // console.log("list", uFactor.findAll());
// console.log("create", uFactor.create({ id: 1, nome: "wendell" }));
// // console.log("list", uFactor.findAll());
// console.log("update", uFactor.update({ id: 1, nome: "wendell 2" }));
// // console.log("list", uFactor.findAll());
// console.log("create", uFactor.create({ id: 2, nome: "william" }));
// console.log("get one", uFactor.find(1));
// console.log("delete one", uFactor.delete_one(2));
// // console.log("list", uFactor.findAll());
// setTimeout(() => {
//   console.log("delete one", uFactor.delete_one(1)); // console.log("list", uFactor.findAll());
// }, 1000);
