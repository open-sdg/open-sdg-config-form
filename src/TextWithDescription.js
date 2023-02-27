import React from 'react';
import {
  isStringControl,
  rankWith
} from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { MuiInputText } from './duplicates/MuiInputText';
import { MaterialInputControl } from './MaterialInputControl';

export const TextWithDescription = (props) => (
  <MaterialInputControl {...props} input={MuiInputText} />
);

export const textWithDescriptionTester = rankWith(
  2,
  isStringControl
);
export default withJsonFormsControlProps(TextWithDescription);
