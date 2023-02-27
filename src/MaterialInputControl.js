import React from 'react';
import {
  showAsRequired,
  ControlProps,
  isDescriptionHidden,
} from '@jsonforms/core';

import { Hidden, InputLabel } from '@mui/material';
import { FormControl, FormHelperText } from '@mui/material';
import merge from 'lodash/merge';
import { useFocus } from '@jsonforms/material-renderers';

export const MaterialInputControl = (props) => {
  const [focused, onFocus, onBlur] = useFocus();
  const {
    id,
    description,
    errors,
    label,
    uischema,
    visible,
    required,
    config,
    input
  } = props;
  const isValid = errors.length === 0;
  const appliedUiSchemaOptions = merge({}, config, uischema.options);

  const showDescription = !isDescriptionHidden(
    visible,
    description,
    focused,
    appliedUiSchemaOptions.showUnfocusedDescription
  );

  const firstFormHelperText = showDescription
    ? description
    : !isValid
    ? errors
    : null;
  const secondFormHelperText = showDescription && !isValid ? errors : null;
  const InnerComponent = input;

  const descriptionIds = [];
  const helpId1 = `${id}-help1`;
  const helpId2 = `${id}-help2`;
  if (firstFormHelperText) {
    descriptionIds.push(helpId1);
  }
  if (secondFormHelperText) {
    descriptionIds.push(helpId2);
  }
  const ariaDescribedBy = descriptionIds.join(' ');

  return (
    <Hidden xsUp={!visible}>
      <FormControl
        fullWidth={!appliedUiSchemaOptions.trim}
        onFocus={onFocus}
        onBlur={onBlur}
        id={id}
        variant={'standard'}
      >
        <InputLabel
          htmlFor={id + '-input'}
          error={!isValid}
          required={showAsRequired(required,
            appliedUiSchemaOptions.hideRequiredAsterisk)}
        >
          {label}
        </InputLabel>
        <InnerComponent
          {...props}
          id={id + '-input'}
          isValid={isValid}
          visible={visible}
          muiInputProps={{
            'aria-describedby': ariaDescribedBy
          }}
        />
        <FormHelperText id={helpId1} error={!isValid && !showDescription}>
          {firstFormHelperText}
        </FormHelperText>
        <FormHelperText id={helpId2} error={!isValid}>
          {secondFormHelperText}
        </FormHelperText>
      </FormControl>
    </Hidden>
  );
};
