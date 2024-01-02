import React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const SearchBar = (props) => {
  const { schema, uiSchema } = props;
  const searchOptions = getSearchOptions(schema);
  const focusOnSetting = (event, value) => {
    const [key, categoryLabel] = getUiSchemaForOption(uiSchema, value);
    const tabs = document.getElementsByClassName('MuiTab-root');
    const tab = Array.from(tabs).find((element) => {
      return element.textContent === categoryLabel;
    });
    if (!tab) {
      alert('Unable to locate that setting.');
      return;
    }
    tab.click();
    const scrollToSetting = () => {
      const group = document.getElementsByClassName('label-for-' + value);
      if (group.length < 1) {
        alert('Unable to locate that setting.');
        return;
      }
      group[0].scrollIntoView();
    };
    setTimeout(scrollToSetting, 500);
  }
  return (
    <Autocomplete
      id="setting-search"
      freeSolo
      disableClearable
      options={searchOptions}
      onChange={focusOnSetting}
      renderInput={(params) => <TextField {...params} label="Search for a setting" />}
    />
  );
}

const getSearchOptions = (schema) => {
  return Object.entries(schema.properties).map(([key, value]) => {
    return key;
  });
}

// Returns an array of: [key, category label]
const getUiSchemaForOption = (uiSchema, option, match) => {
  if (typeof match === 'undefined') {
    match = [null, null];
  }
  if (uiSchema.type && uiSchema.type === 'Category') {
    match[1] = uiSchema.label;
  }
  if (uiSchema.documentationKey && uiSchema.documentationKey === option) {
    match[0] = uiSchema.documentationKey;
    return match;
  }
  if (uiSchema.elements && uiSchema.elements.length > 0) {
    for (const element of uiSchema.elements) {
      match = getUiSchemaForOption(element, option, match);
      if (match[0] != null) {
        break;
      }
    }
  }
  return match;
}

export default SearchBar;
