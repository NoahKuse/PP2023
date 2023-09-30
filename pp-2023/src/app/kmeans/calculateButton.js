'use client'
import {UseInputKPoints} from './input-k-points';
import {kMeansAlgorithm} from '../utils/kmeans';
import {HandleDynamicGeneratedInputFields} from './create-save-manuel-input';

export function HandleCalculateButtonClick() {

    const {numberOfClusters} = UseInputKPoints();
    const {inputDataArray} = HandleDynamicGeneratedInputFields();

    const noDataMessage = "Bitte geben Sie entweder ein manuell Ihre Datenpunkte ein" +
        " oder eine XSLX- CSV-Datei!"

    /*
    Die Funktion handleClick steuert als Controller die Anwendungslogik, welche Daten verwendet werden und wo diese verarbeitet werden.
     */
    const handleClick = () => {
        const kPoints = validateKPoints(numberOfClusters);
        const inputDataSrc = checkInputSource();
        const localCalculation = checkLocalOrServer();
        let result = 1;

        if (!localCalculation) {
            if (inputDataSrc === "local") {
                // TODO validieren der eingegeben Daten
                console.log(dataSet);
                result = kMeansAlgorithm(dataSet, kPoints);
                console.log(result);
                return result;
            }
        }

        console.log(numberOfClusters); // Testet Funktion der K-Eingabe
    };

    const checkInputSource = () => {
        if (inputDataArray.length !== 0) {
           return "local";
        }
        // TODO --> Checken, ob eine Datei vorhanden ist (nicht auslesen!)
        else {
            alert(noDataMessage);
            return false;
        }
    }

    const checkLocalOrServer = () => {
        //TODO --> Auswertung, ob die Berechnung lokal oder auf dem Server erfolgt
    }

    /*
    validateKPoints validiert die K-Points, dass diese immer als Number übergeben werden.
     */
    const validateKPoints = (numberOfClusters) => {
        if (typeof numberOfClusters !== "number") {
            return parseInt(numberOfClusters);
        } else {
            return numberOfClusters;
        }
    };

    const dataSet = [
        [2, 3],
        [2, 4],
        [3, 3],
        [4, 5],
        [5, 4],
        [6, 5],
        [9, 7],
        [10, 8],
        [11, 8],
    ];

    return handleClick;
}

export function CalculateButton() {
    const handleCalculateButtonClick = HandleCalculateButtonClick();

    return (
        <button
            type="button"
            className='compute-btn button'
            onClick={handleCalculateButtonClick}
        >
            Berechnen
        </button>
    );
}
