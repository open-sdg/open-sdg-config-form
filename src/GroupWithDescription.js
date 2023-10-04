import isEmpty from 'lodash/isEmpty';
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Link,
  Tooltip,
  IconButton,
  Hidden
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
    let link, linkText;
    const description = props.schema.description;
    if (props.schema.links && props.schema.links.length > 0) {
      link = props.schema.links[0].href;
      linkText = props.schema.links[0].rel;
    }

    return (
    <Hidden xsUp={!visible}>
      <Card style={style}>
        {!isEmpty(label) && (
          <CardHeader
            title={label}
            action={(
              <Tooltip title={description}>
                <IconButton
                  aria-label={linkText + ' (opens in a new tab)'}
                  href={link}
                  target="_blank"
                >
                  <HelpIcon />
                </IconButton>
              </Tooltip>
            )}
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
