const viewSection = document.querySelector(".view-section");
const contactsSection = document.querySelector(".contacts-section");
const serverURL = 'http://localhost:3000/';
const contactsURL = 'http://localhost:3000/contacts/';
const addressesURL = 'http://localhost:3000/addresses/';

const state = {
  contacts: [],
  selectedContact: null,
  isContact: null
};

function getContacts() {
  fetch(contactsURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      state.contacts = data;
      renderContactsList();
    });
}

function renderContactsList() {
  const listEl = document.createElement("ul");
  listEl.className = "contacts-list";
  for (let i = 0; i < state.contacts.length; i++) {
    const contact = state.contacts[i];
    const listItemEl = renderContactListItem(contact);
    listEl.append(listItemEl);
  }
  contactsSection.append(listEl);
}

function renderAddressSection(address) {
  const containerEl = document.createElement("section");
  const headingEl = document.createElement("h2");
  headingEl.innerText = "Address";
  containerEl.append(headingEl);
  const streetText = document.createElement("p");
  streetText.innerText = address.street;
  containerEl.append(streetText);
  const cityText = document.createElement("p");
  cityText.innerText = address.city;
  containerEl.append(cityText);
  const postCodeText = document.createElement("p");
  postCodeText.innerText = address.postCode;
  containerEl.append(postCodeText);
  return containerEl;
}

function renderContactView() {
  const contact = state.selectedContact;
  if (!contact) {
    return; 
  }
  viewSection.innerHTML = "";
  const containerEl = document.createElement("article");
  containerEl.className = "center light-shadow address-card";
  const headingEl = document.createElement("h1");
  const fullName = `${contact.firstName} ${contact.lastName}`;
  headingEl.innerText = fullName;
  containerEl.append(headingEl);
  const addressSectionEl = renderAddressSection(contact.address);
  containerEl.append(addressSectionEl);
  viewSection.append(containerEl);
}

function renderContactListItem(contact) {
  const listItemEl = document.createElement("li");
  const headingEl = document.createElement("h3");
  const fullName = `${contact.firstName} ${contact.lastName}`;
  headingEl.innerText = fullName;
  listItemEl.append(headingEl);
  const viewBtn = document.createElement("button");
  viewBtn.className = "button grey";
  viewBtn.innerText = "View";
  viewBtn.addEventListener("click", function () {
    state.selectedContact = contact;
    renderContactView();
  });
  listItemEl.append(viewBtn);
  const editBtn = document.createElement("button");
  editBtn.className = "button blue";
  editBtn.innerText = "Edit";
  editBtn.addEventListener("click", function () {
    state.selectedContact = contact;
    state.isContact = true;
    renderContactForm();
  });
  listItemEl.append(editBtn);
  return listItemEl;
}

function getContactInfo(){
  const newContact = {
    firstName: document.querySelector('#first-name-input').value,
    lastName: document.querySelector('#last-name-input').value,
    blockContact: document.querySelector('#block-checkbox').checked
  }
  return newContact;
}

function getAddressInfo(){
  const newAddress = {
    street: document.querySelector('#street-input').value,
    city: document.querySelector('#city-input').value,
    postCode: document.querySelector('#post-code-input').value
  }
  return newAddress;
}

function saveContact(contact, address, method, id = ''){
  fetch(contactsURL + id, {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(contact)
  })
  .then(function (response) { 
    if ( response.ok ) {
      fetch(addressesURL + id, {
          method: method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(address)
        })
    }
  })
}

function createContact(){
  const newContact = getContactInfo();
  Object.assign(newContact, {id : state.contacts.length + 1}, {addressId: state.contacts.length + 1});
  const newAddress = getAddressInfo();
  Object.assign(newAddress, {id : state.contacts.length + 1});
  saveContact(newContact, newAddress, 'POST');
}

function modifyContact(){
  const newContact = getContactInfo();
  const newAddress = getAddressInfo();
  for (const key in state.selectedContact){
    if(state.selectedContact[`${key}`] === newContact[`${key}`]){
      delete newContact[`${key}`];
    }
  }
  for (const key in state.selectedContact.address){
    if(state.selectedContact.address[`${key}`] === newAddress[`${key}`]){
      delete newAddress[`${key}`];
    }
  }
  saveContact(newContact, newAddress, 'PATCH', state.selectedContact.id);
}

function deleteContact(id){
  fetch(contactsURL + id, {
  method: 'DELETE'
  })
  .then(function (response) { 
    if ( response.status === 200 ) {
      fetch(addressesURL + id, {
          method: 'DELETE'
        })
    }
  });
}

function renderContactForm(){
  viewSection.innerText = '';

  const newContForm = document.createElement('form');
  newContForm.className = 'form-stack light-shadow center contact-form';

  const h1 = document.createElement('h1');
  h1.innerText = 'Create Contact';

  const firstNameLabel = document.createElement('label');
  firstNameLabel.setAttribute('for', 'first-name-input');
  firstNameLabel.innerText = 'First Name:';

  const firstNameInput = document.createElement('input');
  firstNameInput.setAttribute('type', 'text');
  firstNameInput.setAttribute('name', 'first-name-input');
  firstNameInput.id = 'first-name-input';

  const lastNameLabel = document.createElement('label');
  lastNameLabel.setAttribute('for', 'last-name-input');
  lastNameLabel.innerText = 'Last Name:';

  const lastNameInput = document.createElement('input');
  lastNameInput.setAttribute('type', 'text');
  lastNameInput.setAttribute('name', 'last-name-input');
  lastNameInput.id = 'last-name-input';

  const streetLabel = document.createElement('label');
  streetLabel.setAttribute('for', 'street-input');
  streetLabel.innerText = 'Street:';

  const streetInput = document.createElement('input');
  streetInput.setAttribute('type', 'text');
  streetInput.setAttribute('name', 'street-input');
  streetInput.id = 'street-input';

  const cityLabel = document.createElement('label');
  cityLabel.setAttribute('for', 'city-input');
  cityLabel.innerText = 'City:';

  const cityInput = document.createElement('input');
  cityInput.setAttribute('type', 'text');
  cityInput.setAttribute('name', 'city-input');
  cityInput.id = 'city-input';

  const postCodeLabel = document.createElement('label');
  postCodeLabel.setAttribute('for', 'post-code-input');
  postCodeLabel.innerText = 'Post Code:';

  const postCodeInput = document.createElement('input');
  postCodeInput.setAttribute('type', 'text');
  postCodeInput.setAttribute('name', 'post-code-input');
  postCodeInput.id = 'post-code-input';

  const checkboxDiv = document.createElement('div');
  checkboxDiv.className = 'checkbox-section';
  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.setAttribute('name', 'block-checkbox');
  checkbox.id = 'block-checkbox';
  const checkboxLabel = document.createElement('label');
  checkboxLabel.setAttribute('for', 'block-checkbox');
  checkboxLabel.innerText = 'Block';

  checkboxDiv.append(checkbox, checkboxLabel);

  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'actions-section';
  const button = document.createElement('button');
  button.className = 'button blue';
  button.setAttribute('type', 'submit');
  button.innerText = 'Create';
  button.id = 'create-btn';
  button.addEventListener('click', function(event){
    event.preventDefault();
    if(state.isContact){
      modifyContact();
    }
    else {
      createContact();
    }
  });

  actionsDiv.append(button);

  newContForm.append(h1, firstNameLabel, firstNameInput, lastNameLabel, lastNameInput, streetLabel, streetInput, cityLabel, cityInput, postCodeLabel, postCodeInput, checkboxDiv, actionsDiv);
  viewSection.append(newContForm);

  if(state.isContact){
    renderContactToEdit(actionsDiv);
  }
}

function listenNewContactButton() {
  const btn = document.querySelector(".new-contact-btn");
  btn.addEventListener("click", function() {
    state.isContact = false;
    renderContactForm();
  });
}

function renderContactToEdit(div){
  const contact = state.selectedContact;
  document.querySelector('#first-name-input').value = contact.firstName;
  document.querySelector('#last-name-input').value = contact.lastName;
  document.querySelector('#street-input').value = contact.address.street;
  document.querySelector('#city-input').value = contact.address.city;
  document.querySelector('#post-code-input').value = contact.address.postCode;
  document.querySelector('#create-btn').innerText = 'Modify';
  document.querySelector('#block-checkbox').checked = contact.blockContact;

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'button blue';
  deleteBtn.setAttribute('type', 'submit');
  deleteBtn.innerText = 'Delete';

  deleteBtn.addEventListener('click', function(event) {
    event.preventDefault();
    deleteContact(contact.id);
  });

  div.append(deleteBtn);
}

function main() {
  listenNewContactButton();
  getContacts();
}

main();