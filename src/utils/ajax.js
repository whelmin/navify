/* Ajax */
const XHR = () => window.XMLHttpRequest ? new window.XMLHttpRequest() : new window.ActiveXObject('Microsoft.XMLHTTP');
// get
function get(url) {
    return new Promise((resolve, reject) => {
        const xhr = XHR();
        xhr.open('GET', url, true);
        xhr.timeout = 10000; // 超时时间
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                let res = {};
                if (xhr.status >= 200 && xhr.status < 400) {
                    try {
                        res = JSON.parse(xhr.responseText);
                        resolve(res);
                    } catch (e) {
                        res = {
                            code: xhr.status,
                            response: xhr.responseText,
                        };
                        reject(res);
                    }
                } else {
                    res = {
                        code: xhr.status,
                        response: xhr.responseText,
                    };
                    reject(res);
                }
            }
        };
        xhr.send();
    });
}

export default {
    get,
};
