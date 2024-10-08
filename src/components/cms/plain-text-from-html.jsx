import React from 'react';

const PlainTextFromHTML = ({ htmlString }) => {
    const removeHTMLTags = (string) => {
        const doc = new DOMParser().parseFromString(string, 'text/html');
        return doc.body.textContent;
    };

    const plainText = removeHTMLTags(htmlString);

    return <>{plainText}</>;
};

export default PlainTextFromHTML;
