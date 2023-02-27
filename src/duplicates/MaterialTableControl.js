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
import union from 'lodash/union';
import {
  DispatchCell,
  JsonFormsStateContext,
  useJsonForms
} from '@jsonforms/react';
import startCase from 'lodash/startCase';
import range from 'lodash/range';
import React, { Fragment, useMemo } from 'react';
import {
  FormHelperText,
  Grid,
  Hidden,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
} from '@mui/material';
import {
  ArrayLayoutProps,
  ControlElement,
  errorsAt,
  formatErrorMessage,
  JsonSchema,
  Paths,
  Resolve,
  JsonFormsRendererRegistryEntry,
  JsonFormsCellRendererRegistryEntry,
  encode
} from '@jsonforms/core';
import { resolveSchema } from '@jsonforms/core';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpIcon from '@mui/icons-material/Help';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import ArrowUpward from '@mui/icons-material/ArrowUpward';

import { WithDeleteDialogSupport } from './DeleteDialog';
import NoBorderTableCell from './NoBorderTableCell';
import TableToolbar from './TableToolbar';
import { ErrorObject } from 'ajv';
import merge from 'lodash/merge';

// we want a cell that doesn't automatically span
const styles = {
  fixedCell: {
    width: '150px',
    height: '50px',
    paddingLeft: 0,
    paddingRight: 0,
    textAlign: 'center'
  },
  fixedCellSmall: {
    width: '50px',
    height: '50px',
    paddingLeft: 0,
    paddingRight: 0,
    textAlign: 'center'
  }
};

const generateCells = (
  Cell,
  schema,
  rowPath,
  enabled,
  cells
) => {
  if (schema.type === 'object') {
    return getValidColumnProps(schema).map(prop => {
      const cellPath = Paths.compose(rowPath, prop);
      const props = {
        propName: prop,
        schema,
        title: schema.properties?.[prop]?.title ?? startCase(prop),
        description: schema.properties?.[prop]?.description ?? null,
        rowPath,
        cellPath,
        enabled,
        cells
      };
      return <Cell key={cellPath} {...props} />;
    });
  } else {
    // primitives
    const props = {
      schema,
      rowPath,
      cellPath: rowPath,
      enabled
    };
    return <Cell key={rowPath} {...props} />;
  }
};

const getValidColumnProps = (scopedSchema) => {
  if (scopedSchema.type === 'object' && typeof scopedSchema.properties === 'object') {
    return Object.keys(scopedSchema.properties).filter(
      prop => scopedSchema.properties[prop].type !== 'array'
    );
  }
  // primitives
  return [''];
};

const EmptyTable = ({ numColumns }) => (
  <TableRow>
    <NoBorderTableCell colSpan={numColumns}>
      <Typography align='center'>No data</Typography>
    </NoBorderTableCell>
  </TableRow>
);

const TableHeaderCell = React.memo(({ title, description }) => (
  <TableCell>
    {title}
    <Tooltip title={description} sx={{ marginLeft: 1 }}>
      <HelpIcon />
    </Tooltip>
  </TableCell>
));

const ctxToNonEmptyCellProps = (
  ctx,
  ownProps
) => {
  const path =
    ownProps.rowPath +
    (ownProps.schema.type === 'object' ? '.' + ownProps.propName : '');
  const errors = formatErrorMessage(
    union(
      errorsAt(
        path,
        ownProps.schema,
        p => p === path
      )(ctx.core.errors).map((error) => error.message)
    )
  );
  return {
    rowPath: ownProps.rowPath,
    propName: ownProps.propName,
    schema: ownProps.schema,
    rootSchema: ctx.core.schema,
    errors,
    path,
    enabled: ownProps.enabled,
    cells: ownProps.cells || ctx.cells,
    renderers: ownProps.renderers || ctx.renderers
  };
};

const controlWithoutLabel = (scope) => ({
  type: 'Control',
  scope: scope,
  label: false
});

const NonEmptyCellComponent = React.memo(({path, propName, schema, rootSchema, errors, enabled, renderers, cells, isValid}) => {
  return (
    <NoBorderTableCell>
      {schema.properties ? (
        <DispatchCell
          schema={Resolve.schema(
            schema,
            `#/properties/${encode(propName)}`,
            rootSchema
          )}
          uischema={controlWithoutLabel(`#/properties/${encode(propName)}`)}
          path={path}
          enabled={enabled}
          renderers={renderers}
          cells={cells}
        />
      ) : (
        <DispatchCell
          schema={schema}
          uischema={controlWithoutLabel('#')}
          path={path}
          enabled={enabled}
          renderers={renderers}
          cells={cells}
        />
      )}
      <FormHelperText error={!isValid}>{!isValid && errors}</FormHelperText>
    </NoBorderTableCell>
  );
});

const NonEmptyCell = (ownProps) => {
  const ctx = useJsonForms();
  const emptyCellProps = ctxToNonEmptyCellProps(ctx, ownProps);

  const isValid = isEmpty(emptyCellProps.errors);
  return <NonEmptyCellComponent {...emptyCellProps} isValid={isValid}/>
};

const NonEmptyRowComponent = 
  ({
    childPath,
    schema,
    rowIndex,
    openDeleteDialog,
    moveUpCreator,
    moveDownCreator,
    enableUp,
    enableDown,
    showSortButtons,
    enabled,
    cells,
    path
  }) => {
    const moveUp = useMemo(() => moveUpCreator(path, rowIndex),[moveUpCreator, path, rowIndex]);
    const moveDown = useMemo(() => moveDownCreator(path, rowIndex),[moveDownCreator, path, rowIndex]);
    return (
      <TableRow key={childPath} hover>
        {generateCells(NonEmptyCell, schema, childPath, enabled, cells)}
        {enabled ? (
          <NoBorderTableCell
            style={showSortButtons ? styles.fixedCell : styles.fixedCellSmall}
          >
            <Grid
              container
              direction='row'
              justifyContent='flex-end'
              alignItems='center'
            >
              {showSortButtons ? (
                <Fragment>
                  <Grid item>
                    <IconButton aria-label={`Move up`} onClick={moveUp} disabled={!enableUp} size='large'>
                      <ArrowUpward />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <IconButton
                      aria-label={`Move down`}
                      onClick={moveDown}
                      disabled={!enableDown}
                      size='large'>
                      <ArrowDownward />
                    </IconButton>
                  </Grid>
                </Fragment>
              ) : null}
              <Grid item>
                <IconButton
                  aria-label={`Delete`}
                  onClick={() => openDeleteDialog(childPath, rowIndex)}
                  size='large'>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </NoBorderTableCell>
        ) : null}
      </TableRow>
    );
  };
export const NonEmptyRow = React.memo(NonEmptyRowComponent);

const TableRows = ({
  data,
  path,
  schema,
  openDeleteDialog,
  moveUp,
  moveDown,
  uischema,
  config,
  enabled,
  cells
}) => {
  const isEmptyTable = data === 0;

  if (isEmptyTable) {
    return <EmptyTable numColumns={getValidColumnProps(schema).length + 1} />;
  }

  const appliedUiSchemaOptions = merge({}, config, uischema.options);

  return (
    <React.Fragment>
      {range(data).map((index) => {
        const childPath = Paths.compose(path, `${index}`);

        return (
          <NonEmptyRow
            key={childPath}
            childPath={childPath}
            rowIndex={index}
            schema={schema}
            openDeleteDialog={openDeleteDialog}
            moveUpCreator={moveUp}
            moveDownCreator={moveDown}
            enableUp={index !== 0}
            enableDown={index !== data - 1}
            showSortButtons={appliedUiSchemaOptions.showSortButtons || appliedUiSchemaOptions.showArrayTableSortButtons}
            enabled={enabled}
            cells={cells}
            path={path}
          />
        );
      })}
    </React.Fragment>
  );
};

export class MaterialTableControl extends React.Component {
  addItem = (path, value) => this.props.addItem(path, value);
  render() {
    const {
      label,
      path,
      schema,
      rootSchema,
      uischema,
      errors,
      openDeleteDialog,
      visible,
      enabled,
      cells
    } = this.props;

    const parentSchema = resolveSchema(rootSchema, '#/properties/' + path, rootSchema);
    let link, linkText, description;
    if (parentSchema) {
      description = parentSchema.description;
      if (parentSchema.links && parentSchema.links.length > 0) {
        link = parentSchema.links[0].href;
        linkText = parentSchema.links[0].rel;
      }
    }
    else {
      console.log('no parentSchema');
    }
    const controlElement = uischema;
    const isObjectSchema = schema.type === 'object';
    const headerCells = isObjectSchema
      ? generateCells(TableHeaderCell, schema, path, enabled, cells)
      : undefined;

    return (
      <Hidden xsUp={!visible}>
          <Table>
          <TableHead>
            <TableToolbar
              errors={errors}
              label={
                <>
                  <Typography variant="h5" component="h5">
                    { label }
                    <Tooltip title={description}>
                      <IconButton
                        aria-label={linkText + ' (opens in a new tab)'}
                        href={link}
                        target="_blank"
                      >
                        <HelpIcon />
                      </IconButton>
                    </Tooltip>
                  </Typography>
                </>
              }
              addItem={this.addItem}
              numColumns={isObjectSchema ? headerCells.length : 1}
              path={path}
              uischema={controlElement}
              schema={schema}
              rootSchema={rootSchema}
              enabled={enabled}
            />
            {isObjectSchema && (
              <TableRow>
                {headerCells}
                {enabled ? <TableCell /> : null}
              </TableRow>
            )}
          </TableHead>
          <TableBody>
            <TableRows openDeleteDialog={openDeleteDialog} {...this.props} />
          </TableBody>
        </Table>
      </Hidden>
    );
  }
}
