import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';



//Async validator. retorna un observable que eventalmente va a decir si el campo es valido o no
export const imageTypeValidator = (control: AbstractControl): Promise<{[key: string]: any} | null> | Observable<{[key: string]: any} | null> =>{
    if(typeof control.value === 'string'){
        return of(null); //in case we have an image path instead of the blob file, we emit an observable with of() that completes instantly
    }
    const file = control.value as File; //el archivo del input
    const fileReader = new FileReader();
    const fileReaderObservable = Observable.create((observer: Observer<{[key: string]: any} | null>) =>{ //creating a new observable, observer dictates when the observable emits new values
        fileReader.addEventListener("loadend", () =>{
            const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
            let header = "";
            let isValid = false;
            for (let i = 0; i < arr.length; i++) {          //Really complex (and copied) JS code that tells me if a file is an image or not.
            header += arr[i].toString(16);
            }
            switch (header) {
            case "89504e47":
                isValid = true;
                break;
            case "ffd8ffe0":
            case "ffd8ffe1":
            case "ffd8ffe2":
            case "ffd8ffe3":
            case "ffd8ffe8":
                isValid = true;
                break;
            default:
                isValid = false; // Or you can use the blob.type as fallback
                break;
            }
            if(isValid){
                observer.next(null);
            }
            else{
                observer.next({invalidFileType: true});
            }
            observer.complete();
        });
    });
    fileReader.readAsArrayBuffer(file); //executes the async code
    return fileReaderObservable;
};