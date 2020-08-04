import { Table, TableFSP } from "../dist/esm/table.js";
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

const otherColumns = [];

for(let i = 0; i < 200; i++) {
  otherColumns.push({
    key: faker.random.uuid(),
    label: faker.lorem.words()
  });
}

for(let i = 0; i < 100; i++) {
  const icons = ["fa-home", "fa-edit", "fa-trash"];
  icons.sort(() => Math.random() - 0.5);
  const row = {
    icon: icons[0],
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    tel: faker.phone.phoneNumber(),
    email: faker.internet.email()
  };
  for(let col of otherColumns) {
    row[col.key] = faker.lorem.words();
  }

  data.push(row);
}

const tbl = new Table({
  multiSorting: true,
  page: 1,
  perPage: 20,
  dataFetcher: () => {
    const fsp = new TableFSP(tbl);
    return fsp.processData(data);
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
    sortingModes: ["ASC", null]
  },
  {
    key: "tel",
    label: "Phone"
  },
  {
    key: "email",
    label: "E-mail"
  },
  ...otherColumns
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
