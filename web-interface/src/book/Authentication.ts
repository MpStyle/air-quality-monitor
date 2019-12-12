export const authentication = (secretKey: string): Promise<boolean> => {
    return new Promise((resolve, _reject) => {
        setTimeout(function () {
            resolve(secretKey === '1234');
        }, 500);
    });

    // const url = process.env.REACT_APP_AIR_QUALITY_DATA_REMOTE_URL as string;

    // return fetch(`${url}/authentication`, {
    //     method: 'POST',
    //     body: JSON.stringify({ secretKey: secretKey })
    // })
    //     .then((response): Promise<boolean> => {
    //         return response.json();
    //     });
};