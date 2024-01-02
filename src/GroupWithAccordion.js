import { MaterialLayoutRenderer } from '@jsonforms/material-renderers';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Hidden,
  Typography,
  FormHelperText,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import { withJsonFormsLayoutProps } from '@jsonforms/react';
import { rankWith, uiTypeIs } from '@jsonforms/core';
import { useFetchDocumentation } from './hooks';

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
  const { status, data, error } = useFetchDocumentation();

  return (
    <Hidden xsUp={!visible}>
      {uischema.label &&
      <Typography className={'label-for-' + uischema.documentationKey}>{uischema.label}</Typography>
      }
      {uischema.description &&
      <FormHelperText>{uischema.description}</FormHelperText>
      }
      <MaterialLayoutRenderer {...layoutProps} />
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>More information on the {uischema.label} setting</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {status == 'fetched' &&
          <div className="docs-content" dangerouslySetInnerHTML={{__html: data[uischema.documentationKey]}}></div>
          }
          {status == 'fetching' &&
          <Typography>Loading, please wait...</Typography>
          }
          {status == 'error' &&
          <Typography>{error}</Typography>
          }
        </AccordionDetails>
      </Accordion>
    </Hidden>
  );
};

export default withJsonFormsLayoutProps(GroupWithAccordion);

export const groupWithAccordionTester = rankWith(1000, uiTypeIs('GroupWithAccordion'));
