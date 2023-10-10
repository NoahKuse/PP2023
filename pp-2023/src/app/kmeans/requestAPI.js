'use client'
import {APIError} from '../utils/userErrors';
import {returnExcel} from '../utils/excelfilereader';

export const apiPostRequest = async (KPoints, dataArrayForWorking) => {

    /*
    Erstellung eines Form-Data Objektes. Innerhalb des Objektes können mittels eines Key, Value Verfahren
    einzelne Datei-Objekte erstellt werden.
     */
    const formData = new FormData();

    if (dataArrayForWorking) {
        /*
        Auslesen der manuellen Datenpunkte, diese werden anschließend als Datei, einem formData Objekt übergeben.
         */
        const dataPoints = {
            'data_points': dataArrayForWorking,
        };
        const jsonData = JSON.stringify(dataPoints);
        const file = new Blob([jsonData], {type: 'application/json'});
        formData.append('file', file, 'dataPoints.json');
    } else {
        /*
        Aufruf von returnExcel und hinzufügen der geladenen Datei einem formData-Objekt.
         */
        const file = await returnExcel();
        formData.append('file', file, `${file.name}`);
    }

    /*
    Die Url wird dynamisch generiert. Grund ist die Anforderung aus dem Backend, dass Parameter als Get übergeben werden,
    nur die Dateien werden mittels als Post übergeben.
     */
    const numberKRuns = '&number_kmeans_runs=20';
    const url = "https://kmeans-backend-dev-u3yl6y3tyq-ew.a.run.app/kmeans/";
    const newKForGet = 'k=' + KPoints;
    const urlBearbeitet = url + '?' + newKForGet + numberKRuns;

    return fetch(urlBearbeitet, {
        mode: 'cors',
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json',
        },
    })
        /*
        Behandlung des Responses der API, falls ein Error auftritt.
        */
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(errorData => {
                    APIError(errorData);
                    throw new Error(response.status + ' ' + response.statusText + ' ' + JSON.stringify(errorData));
                });
            }
        })
        /*
        Behandlung möglicher Fehler, globaler Kontext.
         */
        .catch(error => {
            throw error;
        });
};

export const apiGetStateOfTask = (taskId, maxVersuch) => {
    /*
    Generieren der Request-URl
     */
    const url = 'https://kmeans-backend-dev-u3yl6y3tyq-ew.a.run.app/kmeans/status/'
    const completeUrl = url + taskId;

    const aktuellesIntervall = 3000;

    /*
    Die Funktion makeRequest führt einen asynchronen Request an das Backend durch, um den Status der zu bearbeitenden
    Task zu bekommen.
     */
    const makeRequest = async () => {
        try {
            const result = await fetch(completeUrl, {
                method: 'GET',
                headers: {
                    "Accept": "application/json"
                }
            });

            /*
            Bei gültigem 200 Status und de
             */
            if (result.status === 200) {
                const response = await result.json();
                if (response.status === 'completed') {
                    return 1;
                } else if (maxVersuch > 0 && response.status === 'processing') {
                    await new Promise(resolve => setTimeout(resolve, aktuellesIntervall));
                    maxVersuch = maxVersuch - 1;
                    return makeRequest();
                } else {
                    new Error('Fehler beim Response: ' + response.status);
                }
            }
        } catch (err) {
            throw err;
        }
    };
    return makeRequest();
}

export const apiGetResult = async (taskId) => {
    /*
    Zusammengesetzte URL für den GET-Request.
     */
    const url = 'https://kmeans-backend-dev-u3yl6y3tyq-ew.a.run.app/kmeans/result/'
    const completeUrl = url + taskId;

    return fetch(completeUrl, {
        method: 'GET',
        headers: {
            "Accept": "application/json"
        }
    })
        /*
        Gibt das Ergebnis des Response-Promise zurück.
         */
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(errorText => {
                    APIError(errorText);
                    throw new Error('Fehler beim Response: ' + response.status + ' ' + errorText);
                });
            }
        })
        /*
        Behandlung möglicher Fehler, globaler Kontext.
         */
        .catch(err => {
            throw err;
        });
}

export const handleApiCommunication = async (resultPost) => {
    try {
        const resultGetStateOfTask = await apiGetStateOfTask(resultPost.TaskID, 10);

        /*
        Liefert die apiGetStateOfTask eine 1 zurück, ist der Response erfolgreich und kann verarbeitet werden.
         */
        if (resultGetStateOfTask === 1) {
            return await apiGetResult(resultPost.TaskID);

        }
    }
        /*
        Ist die Berechnung zu umfassend, dass das Zeitlimit reißt, wird dem Nutzer in dem catch-Block ein Error angezeigt.
         */ catch (err) {
        const error = {
            "detail": "Das Zeitlimit der Berechnung ist überschritten. " +
                "Bitte verringern Sie die Anzahl an Datensätzen oder die Anzahl K."
        }
        APIError(error);
    }
}
/*
Die Funktion nimmt einen Promise auf und führt diesen aus. Ebenfalls wir ein Parameter Timeout aufgenommen.
Ist der Timeout abgelaufen, wird ein fehler zurückgegeben. Andernfalls das Result des Promises.
 */
export const runWithTimeout = (promise, timeout) => {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), timeout)
        ),
    ]);
};