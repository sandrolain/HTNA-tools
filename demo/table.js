import { Table } from "../dist/esm/table.js";
import { getFragmentFromHTML } from "../dist/esm/dom.js";
import { addStyleLinkToHead, addStyleToHead } from "../dist/esm/css.js";

addStyleLinkToHead("https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css");
addStyleToHead(/*css*/`
  th[data-sorting]  {
    cursor: pointer;
  }
  th[data-sorting]::after {
    display: inline-block;
    width: 1em;
    text-align: right;
    font-family: "FontAwesome";
    content: "\\f0dc";
    opacity: 0.5;
  }
  th[data-sorting="ASC"]::after {
    content: "\\f0dd";
    opacity: 1;
  }
  th[data-sorting="DESC"]::after {
    content: "\\f0de";
    opacity: 1;
  }
`);

const data = [];

for(let i = 0; i < 100; i++) {
  const icons = ["fa-home", "fa-edit", "fa-trash"];
  icons.sort(() => Math.random() - 0.5);
  data.push({
    icon: icons[0],
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    tel: faker.phone.phoneNumber(),
    email: faker.internet.email()
  });
}

const tbl = new Table({
  multiSorting: true,
  applyPagination: true,
  applySorting: true,
  page: 1,
  perPage: 10,
  dataFetcher: () => {
    return data.slice(0);
  },
  selectable: true
});

tbl.setColumns([
  {
    key: "icon",
    label: "",
    renderValue: (value) => getFragmentFromHTML(`<i class="fa ${value}"></i>`)
  },
  {
    key: "firstName",
    label: "Firstname",
    sortingModes: ["ASC", "DESC", null]
  },
  {
    key: "lastName",
    label: "Lastname",
    sortingModes: ["ASC"]
  },
  {
    key: "tel",
    label: "Phone"
  },
  {
    key: "email",
    label: "E-mail"
  }
]);

tbl.onData(() => {
  console.log(tbl.dataset);
  console.log(tbl.tableNode);
});

tbl.triggerDataFetcher();

// setInterval(() => {
//   tbl.triggerDataFetcher();
// }, 5000);

document.getElementById("cnt").appendChild(tbl.tableNode);

const btn = document.createElement("button");
btn.innerHTML = "Get Selected";
btn.addEventListener("click", () => {
  alert(JSON.stringify(tbl.getSelected()));
});
document.getElementById("cnt").appendChild(btn);
