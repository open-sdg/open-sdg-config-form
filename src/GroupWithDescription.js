import isEmpty from 'lodash/isEmpty';
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Hidden,
} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import {
  rankWith,
  uiTypeIs,
  withIncreasedRank,
} from '@jsonforms/core';
import {
  MaterialLayoutRenderer,
} from '@jsonforms/material-renderers'
import { withJsonFormsLayoutProps } from '@jsonforms/react';

export const groupTester = rankWith(2, uiTypeIs('Group'));
const style = { marginBottom: '10px' };

const GroupWithDescriptionComponent = React.memo(({ visible, enabled, uischema, label, ...props }) => {
    const description = props.schema.description;

    return (
    <Hidden xsUp={!visible}>
      <Card style={style}>
        {!isEmpty(label) && (
          <CardHeader
            title={label}
            subheader={description}
          />
        )}
        <CardContent>
          <MaterialLayoutRenderer {...props} visible={visible} enabled={enabled} elements={uischema.elements} />
        </CardContent>
      </Card>
    </Hidden>
  );
});

export const GroupWithDescriptionRenderer = ({ uischema, schema, path, visible, enabled, renderers, cells, direction, label, description }) => {
  return (
    <GroupWithDescriptionComponent
      elements={uischema.elements}
      schema={schema}
      path={path}
      direction={direction}
      visible={visible}
      enabled={enabled}
      uischema={uischema}
      renderers={renderers}
      cells={cells}
      label={label}
    />
  );
};

export default withJsonFormsLayoutProps(GroupWithDescriptionRenderer);

export const groupWithDescriptionTester = withIncreasedRank(
  2,
  groupTester
);
