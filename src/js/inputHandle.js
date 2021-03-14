import debounce from 'lodash.debounce';
import { alert, defaultModules } from '@pnotify/core/dist/PNotify.js';
import * as PNotifyMobile from '@pnotify/mobile/dist/PNotifyMobile.js';
import fetchCountries from '/js/fetchCountries.js';
import { defaults } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
import { Stack } from '@pnotify/core';

defaults.styling = 'brighttheme';
defaults.icons = 'brighttheme';

defaultModules.set(PNotifyMobile, {});

const inputRef = document.querySelector('.search');
const searchResultsRef = document.querySelector('.search-results');
inputRef.addEventListener('input', debounce(handleInput, 500));

function handleInput(event) {
  searchResultsRef.innerHTML = '';
  const countrySearchName = event.target.value;
  fetchCountries(countrySearchName)
    .then(data => {
      if (data.length > 10) {
        alert({
          text: 'Too many matches found. Please enter a more specific query!',
          type: 'error',
          delay: 4000,
          stack: new Stack({
            dir1: 'up',
          }),
        });
      }
      if (data.length >= 2 && data.length <= 10) {
        searchResultsRef.insertAdjacentHTML(
          'beforeend',
          createListCountriesTemplate(data),
        );
      }
      if (data.length === 1) {
        searchResultsRef.insertAdjacentHTML(
          'beforeend',
          createCountryPropertiesTemplate(data),
        );
      }
    })
    .catch(console.log);
}

function createListCountriesTemplate(data) {
  const template =
    '<ul class="country-list">' +
    data.reduce((acc, item) => {
      acc += `<li>${item.name}</li>`;
      return acc;
    }, '') +
    '</ul>';
  return template;
}

function createCountryPropertiesTemplate(data) {
  const templateLang = data[0].languages.reduce((acc, item) => {
    acc += `<li>${item.name}</li>`;
    return acc;
  }, '');
  const templateCountry = `<h2 class='country-name'>${data[0].name}</h2>
        <div class='wrapper'><div class='country-properties'>
      <p><span class='country-property'>Capital: </span>${data[0].capital}</p>
      <p><span class='country-property'>Population: </span>${data[0].population}</p>
      <h3 class='country-property'>Languages:</h3><ul>${templateLang}</ul></div>
      <img height='400px' src="${data[0].flag}" alt="flag"></img></div>`;
  return templateCountry;
}
