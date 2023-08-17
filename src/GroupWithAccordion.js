import { MaterialLayoutRenderer } from '@jsonforms/material-renderers';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Hidden,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import { withJsonFormsLayoutProps } from '@jsonforms/react';
import { rankWith, uiTypeIs } from '@jsonforms/core';

const GroupWithAccordion = (props) => {
  const { uischema, schema, path, visible, renderers } = props;

  const layoutProps = {
    elements: uischema.elements,
    schema: schema,
    path: path,
    direction: 'column',
    visible: visible,
    uischema: uischema,
    renderers: renderers,
  };
  const documentationId = uischema.documentationKey + '-documentation';
  return (
    <Hidden xsUp={!visible}>
      <Typography>{uischema.label}</Typography>
      <MaterialLayoutRenderer {...layoutProps} />
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>More information on the {uischema.label} setting</Typography>
        </AccordionSummary>
        <AccordionDetails id={documentationId}>
          <Typography>Loading, please wait...</Typography>
        </AccordionDetails>
      </Accordion>
    </Hidden>
  );
};

export default withJsonFormsLayoutProps(GroupWithAccordion);

export const groupWithAccordionTester = rankWith(1000, uiTypeIs('GroupWithAccordion'));
