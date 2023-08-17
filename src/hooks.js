import { useEffect, useRef, useReducer } from 'react';

const parseDocumentation = (data) => {
    const el = document.createElement('html');
    el.innerHTML = '<html><head><title>titleTest</title></head><body>' + data.content + '</body></html>';
    const section = el.querySelector('.section');
    let currentId = null;
    const settings = {};
    for (const child of section.children) {
        if (child.id) {
            currentId = child.id;
        }
        if (currentId) {
            if (!settings[currentId]) {
                settings[currentId] = '';
            }
            const fixedHtml = child.outerHTML.replace(/href=/i, 'target="_blank" href=');
            settings[currentId] += fixedHtml;
        }
    }
    return settings;
}

export const useFetchDocumentation = () => {
	const cache = useRef({});
    const url = 'https://readthedocs.org/api/v3/embed/?format=json&url=https://open-sdg.readthedocs.io/en/latest/configuration/';

	const initialState = {
		status: 'idle',
		error: null,
		data: [],
	};

	const [state, dispatch] = useReducer((state, action) => {
		switch (action.type) {
			case 'FETCHING':
				return { ...initialState, status: 'fetching' };
			case 'FETCHED':
				return { ...initialState, status: 'fetched', data: action.payload };
			case 'FETCH_ERROR':
				return { ...initialState, status: 'error', error: action.payload };
			default:
				return state;
		}
	}, initialState);

	useEffect(() => {
		let cancelRequest = false;
		if (!url || !url.trim()) return;

		const fetchData = async () => {
			dispatch({ type: 'FETCHING' });
			if (cache.current[url]) {
				const data = cache.current[url];
				dispatch({ type: 'FETCHED', payload: data });
			} else {
				try {
					const response = await fetch(url);
					const data = await response.json();
                    const parsed = parseDocumentation(data);
					cache.current[url] = parsed;
					if (cancelRequest) return;
					dispatch({ type: 'FETCHED', payload: parsed });
				} catch (error) {
					if (cancelRequest) return;
					dispatch({ type: 'FETCH_ERROR', payload: error.message });
				}
			}
		};

		fetchData();

		return function cleanup() {
			cancelRequest = true;
		};
	}, [url]);

	return state;
};