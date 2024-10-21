import { TIMEOUT_SEC } from '../config/config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} seconds`));
    }, s * 1000);
  });
};

export const AJAX = async function (
  url,
  uploadRecipe = undefined,
  urlHeaders = undefined
) {
  try {
    const fetchPro = uploadRecipe
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadRecipe),
        })
      : fetch(url, {
          method: 'GET',
          ...(urlHeaders && { headers: urlHeaders }),
          contentType: 'application/json',
        });

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (err) {
    throw err;
  }
};
