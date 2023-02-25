/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import isEmpty from 'lodash/isEmpty';
import merge from 'lodash/merge';
import React from 'react';
import {
  isBooleanControl,
  RankedTester,
  rankWith,
  ControlProps,
  isDescriptionHidden
} from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { FormControlLabel, FormHelperText, Tooltip, Hidden } from '@mui/material';
import { MuiCheckbox } from './MuiCheckbox';

export const CheckboxWithDescription = ({
  data,
  visible,
  label,
  id,
  enabled,
  uischema,
  schema,
  rootSchema,
  handleChange,
  errors,
  path,
  config,
  description
}) => {

  const isValid = errors.length === 0;
  const appliedUiSchemaOptions = merge({}, config, uischema.options);

  const showDescription = !isDescriptionHidden(
    visible,
    description,
    false,
    appliedUiSchemaOptions.showUnfocusedDescription
  );

  const showTooltip = !showDescription && !isDescriptionHidden(
    visible,
    description,
    true,
    true
  );

  const firstFormHelperText = showDescription
    ? description
    : !isValid
    ? errors
    : null;
  const secondFormHelperText = showDescription && !isValid ? errors : null;

  const descriptionIds = [];
  const tooltipId = `${id}-tip`;
  const helpId1 = `${id}-help1`;
  const helpId2 = `${id}-help2`;
  if (showTooltip) {
    descriptionIds.push(tooltipId);
  }
  if (firstFormHelperText) {
    descriptionIds.push(helpId1);
  }
  if (secondFormHelperText) {
    descriptionIds.push(helpId2);
  }
  const ariaDescribedBy = descriptionIds.join(' ');

  return (
    <Hidden xsUp={!visible}>
      <Tooltip id={tooltipId} title={(showTooltip) ? description : ''}>
        <FormControlLabel
          label={label}
          id={id}
          control={
            <MuiCheckbox
              id={`${id}-input`}
              isValid={isEmpty(errors)}
              data={data}
              enabled={enabled}
              visible={visible}
              path={path}
              uischema={uischema}
              schema={schema}
              rootSchema={rootSchema}
              handleChange={handleChange}
              errors={errors}
              config={config}
              inputProps={{
                'aria-describedby': ariaDescribedBy
              }}
            />
          }
        />
      </Tooltip>
      <FormHelperText id={helpId1} error={!isValid && !showDescription}>
        {firstFormHelperText}
      </FormHelperText>
      <FormHelperText id={helpId2} error={!isValid}>
        {secondFormHelperText}
      </FormHelperText>
    </Hidden>
  );
};

export const checkboxWithDescriptionTester = rankWith(
  3,
  isBooleanControl
);
export default withJsonFormsControlProps(CheckboxWithDescription);
