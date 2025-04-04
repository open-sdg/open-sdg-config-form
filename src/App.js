import React, { useState, useCallback } from 'react';
import { UPDATE_DATA, INIT } from '@jsonforms/core';
import {
    materialRenderers,
    materialCells,
} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { get, set } from 'lodash';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DownloadButton from './DownloadButton';
import SearchBar from './SearchBar';
import GoToRepositoryButton from './GoToRepositoryButton';
import GithubLoginButton from './GithubLoginButton';
import GithubPushButton from './GithubPushButton';
import GroupWithDescription, {
    groupWithDescriptionTester
} from './GroupWithDescription';
import TextWithDescription, {
    textWithDescriptionTester
} from './TextWithDescription';
import GroupWithAccordion, {
    groupWithAccordionTester
} from './GroupWithAccordion';

const App = () => {

    const theme = createTheme({
        components: {
            MuiTabs: {
                defaultProps: {
                    orientation: 'vertical',
                },
            },
            MuiAppBar: {
                defaultProps: {
                    sx: {
                        width: 'inherit',
                        marginRight: '16px'
                    }
                }
            },
            MuiFormControl: {
                defaultProps: {
                    variant: 'standard',
                },
            },
            MuiTextField: {
                defaultProps: {
                    variant: 'standard',
                },
            },
            MuiSelect: {
                defaultProps: {
                    variant: 'standard',
                },
            },
        },
    });

    function getTypeOfData(data) {
        return (data instanceof Array) ? 'array' : typeof data;
    }

    const middleware = useCallback((state, action, defaultReducer) => {
        if (action.type === INIT) {
            const newState = defaultReducer(state, action);
            // Explanation of this stuff:
            // Values in the YAML files like "5,5", when not wrapped in quotes,
            // get imported into the config form as the integer 55. So, we need
            // special checks for a few fields that may have this type of value
            // to make sure that they are converted back to strings with the comma.
            const dashArrayPaths = [
                'map_options.styleNormal.dashArray',
                'map_options.styleHighlighted.dashArray',
                'map_options.styleStatic.dashArray',
            ];
            dashArrayPaths.forEach((dashArrayPath => {
                const dashArrayValue = get(newState.data, dashArrayPath);
                if (typeof dashArrayValue === 'number') {
                    // Convert numbers like 55 into strings like "5,5".
                    set(newState.data, dashArrayPath, String(dashArrayValue).split('').join(','));
                }
            }));
            return newState;
        }
        else if (action.type === UPDATE_DATA) {
            const typeBefore = getTypeOfData(get(state.data, action.path));
            const newState = defaultReducer(state, action);
            const typeAfter = getTypeOfData(get(newState.data, action.path));
            if (typeAfter === 'undefined') {
                switch(typeBefore) {
                    case 'array':
                        set(newState.data, action.path, []);
                    default:
                        set(newState.data, action.path, '');
                }
            }
            return newState;
        }
        else {
            const newState = defaultReducer(state, action);
            return newState;
        }
    });

    const renderers = [
        ...materialRenderers,
        {
            tester: groupWithDescriptionTester,
            renderer: GroupWithDescription,
        },
        {
            tester: textWithDescriptionTester,
            renderer: TextWithDescription,
        },
        {
            tester: groupWithAccordionTester,
            renderer: GroupWithAccordion,
        },
    ];

    const {
        schema,
        uiSchema,
        initialData,
        configFilename,
        configFolder,
        githubClientId,
        githubProxyUrl,
        githubRepo,
        githubOwner,
        repoUrl,
        repositoryLink,
    } = opensdg.configForm;
    const [formData, setFormData] = useState(initialData);
    const [formErrors, setFormErrors] = useState(null);
    const jsonformsConfig = {
        showUnfocusedDescription: true,
    };
    return (
        <>
            <SearchBar
                schema={schema}
                uiSchema={uiSchema}
            />
            <DownloadButton
                formData={formData}
                formErrors={formErrors}
                filename={configFilename}
                uiSchema={uiSchema}
            />
            { githubClientId && githubProxyUrl &&
            <GithubLoginButton
                githubClientId={githubClientId}
                githubProxyUrl={githubProxyUrl}
            />
            }
            { githubClientId && githubProxyUrl &&
            <GithubPushButton
                formData={formData}
                formErrors={formErrors}
                filename={configFilename}
                folder={configFolder}
                githubRepo={githubRepo}
                githubOwner={githubOwner}
            />
            }
            { !githubClientId && !githubProxyUrl && repoUrl && repositoryLink &&
            <GoToRepositoryButton
                repoUrl={repoUrl}
                repositoryLink={repositoryLink}
            />
            }
            <div style={{display: 'flex'}}>
                <ThemeProvider theme={theme}>
                    <JsonForms
                        schema={schema}
                        uischema={uiSchema}
                        data={formData}
                        renderers={renderers}
                        config={jsonformsConfig}
                        cells={materialCells}
                        middleware={middleware}
                        onChange={({ data, errors }) => {
                            setFormData(data);
                            setFormErrors(errors);
                        }}
                    />
                </ThemeProvider>
            </div>
        </>
    )
}

export default App;
