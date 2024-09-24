const productBodyDom = document.getElementById("productBody");

const apiUrl = "http://localhost:4200/api/products";

function getProductData() {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmViMTdjMzJiMzkwNWE3ZTVhODRkOTUiLCJ1c2VyVHlwZSI6ImN1c3RvbWVyIiwiZW1haWwiOiJzLnQuNDg4MjZAZ21haWwuY29tIiwiaWF0IjoxNzI2ODEyODg3LCJleHAiOjE3MjY4MTY0ODd9.Z9OQ1gSUx7SUuiccCzAf-CKlh1uZr-LoQoj2CxNNmgg";
  fetch(apiUrl, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((res) => res.json())
    .then((response) => {
      console.log(response);

      response?.forEach((product) => {
        const tr = document.createElement("tr");

        const tdId = document.createElement("td");

        tdId.innerText = product._id;

        const tdName = document.createElement("td");

        tdName.innerText = product.name;

        const tdDesc = document.createElement("td");
        tdDesc.innerText = product.desc;

        const tdPrice = document.createElement("td");

        tdPrice.innerText = product.price;

        tr.append(tdId, tdName, tdDesc, tdPrice);

        productBodyDom.append(tr);
      });
    })
    .catch((err) => console.error(err));
}

getProductData();
