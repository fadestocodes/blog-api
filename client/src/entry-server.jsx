import React from 'react';
import {StaticRouter} from 'react-router-dom/server';
import App from './App';

export default function render(url, context){
    return (
        <StaticRouter location = {url} context = {context}>
            <App />
        </StaticRouter>
    );
};
