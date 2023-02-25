import React, { useState } from 'react';
import {
    materialRenderers,
    materialCells,
} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DownloadButton from './DownloadButton';
import GithubLoginButton from './GithubLoginButton';
import GithubPushButton from './GithubPushButton';
import CheckboxWithDescription, {
    checkboxWithDescriptionTester
} from './CheckboxWithDescription';
import GroupWithDescription, {
    groupWithDescriptionTester
} from './GroupWithDescription';
import ArrayWithDescription, {
    arrayWithDescriptionTester
} from './ArrayWithDescription';

const App = () => {

    const theme = createTheme({
        components: {
            MuiTabs: {
                defaultProps: {
                    //orientation: 'vertical',
                },
            },
        },
    });

    const renderers = [
        ...materialRenderers,
        {
            tester: checkboxWithDescriptionTester,
            renderer: CheckboxWithDescription,
        },
        {
            tester: groupWithDescriptionTester,
            renderer: GroupWithDescription,
        },
        {
            tester: arrayWithDescriptionTester,
            renderer: ArrayWithDescription,
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
    } = opensdg.configForm;
    const [formData, setFormData] = useState(initialData);
    const [formErrors, setFormErrors] = useState(null);
    const jsonformsConfig = {
        //showUnfocusedDescription: true,
    };
    return (
        <>
            <DownloadButton
                formData={formData}
                formErrors={formErrors}
                filename={configFilename}
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
            <ThemeProvider theme={theme}>
                <div>
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
                </div>
            </ThemeProvider>
        </>
    )
}

export default App;
