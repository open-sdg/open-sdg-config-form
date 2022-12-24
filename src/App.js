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

const App = () => {
    const opensdg = {
        configForm: {
            schema: {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "minLength": 3,
                        "description": "Please enter your name"
                    },
                    "vegetarian": {
                        "type": "boolean"
                    },
                    "birthDate": {
                        "type": "string",
                        "format": "date"
                    },
                    "nationality": {
                        "type": "string",
                        "enum": [
                            "DE",
                            "IT",
                            "JP",
                            "US",
                            "RU",
                            "Other"
                        ]
                    },
                    "personalData": {
                        "type": "object",
                        "properties": {
                            "age": {
                                "type": "integer",
                                "description": "Please enter your age."
                            },
                            "height": {
                                "type": "number"
                            },
                            "drivingSkill": {
                                "type": "number",
                                "maximum": 10,
                                "minimum": 1,
                                "default": 7
                            }
                        },
                        "required": [
                            "age",
                            "height"
                        ]
                    },
                    "occupation": {
                        "type": "string"
                    },
                    "postalCode": {
                        "type": "string",
                        "maxLength": 5
                    }
                },
                "required": [
                    "occupation",
                    "nationality"
                ]
            },
            uiSchema: {
                "type": "VerticalLayout",
                "elements": [
                    {
                        "type": "HorizontalLayout",
                        "elements": [
                            {
                                "type": "Control",
                                "scope": "#/properties/name"
                            },
                            {
                                "type": "Control",
                                "scope": "#/properties/personalData/properties/age"
                            },
                            {
                                "type": "Control",
                                "scope": "#/properties/birthDate"
                            }
                        ]
                    },
                    {
                        "type": "Label",
                        "text": "Additional Information"
                    },
                    {
                        "type": "HorizontalLayout",
                        "elements": [
                            {
                                "type": "Control",
                                "scope": "#/properties/personalData/properties/height"
                            },
                            {
                                "type": "Control",
                                "scope": "#/properties/nationality"
                            },
                            {
                                "type": "Control",
                                "scope": "#/properties/occupation",
                                "suggestion": [
                                    "Accountant",
                                    "Engineer",
                                    "Freelancer",
                                    "Journalism",
                                    "Physician",
                                    "Student",
                                    "Teacher",
                                    "Other"
                                ]
                            }
                        ]
                    }
                ]
            },
            initialData: {
                "name": "John Doe",
                "vegetarian": false,
                "birthDate": "1985-06-02",
                "personalData": {
                    "age": 34
                },
                "postalCode": "12345"
            },
            configFilename: 'foo.yml',
            githubClientId: 'd057ffc62f01ce8f3376',
            //proxyUrl: 'https://open-sdg-github-auth-production.up.railway.app',
            repository: 'https://github.com/brockfanning/configtesting',
            proxyUrl: 'http://localhost:4000',
        }
    }

    const theme = createTheme({
        components: {
            MuiTabs: {
                defaultProps: {
                    //orientation: 'vertical',
                },
            },
        },
    });

    const {
        schema,
        uiSchema,
        initialData,
        configFilename,
        githubClientId,
        proxyUrl,
        repository,
    } = opensdg.configForm;
    const loggedIn = localStorage.getItem('accessToken') !== null;
    const [data, setData] = useState(initialData);
    const [errors, setErrors] = useState(null);
    return (
        <>
            <DownloadButton
                data={data}
                errors={errors}
                filename={configFilename}
            />
            { githubClientId && proxyUrl &&
            <GithubLoginButton
                githubClientId={githubClientId}
                proxyUrl={proxyUrl}
            />
            }
            { loggedIn &&
            <GithubPushButton
                proxyUrl={proxyUrl}
                data={data}
                errors={errors}
                filename={configFilename}
                repository={repository}
            />
            }
            <ThemeProvider theme={theme}>
                <div>
                    <JsonForms
                        schema={schema}
                        uischema={uiSchema}
                        data={data}
                        renderers={materialRenderers}
                        cells={materialCells}
                        onChange={({ data, errors }) => {
                            setData(data);
                            setErrors(errors);
                        }}
                    />
                </div>
            </ThemeProvider>
        </>
    )
}

export default App;
