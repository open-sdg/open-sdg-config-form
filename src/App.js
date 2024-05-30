import React, { useState } from 'react';
import {
    materialRenderers,
    materialCells,
} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
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
