import { Injectable } from "@angular/core";

@Injectable()
export class ImageUtilService {

  dataUriToBlob(dataUri){
    var byteString = atob(dataUri.split(",")[1]); //retorna somente o base64 da imagem sem o mime type
    var mimeString = dataUri.split(",")[0].split(":")[1].split(";")[0]; //retorna o mime type ex: image/png
    var ab = new ArrayBuffer(byteString.length); //cria um buffer com o array com o tamanho da string da imagem
    var ia = new Uint8Array(ab); //o array buffer ja cria isto!!!
    for(var i = 0; i < byteString.length; i++){
      ia[i] = byteString.charCodeAt(i); //coloca o unicode de cada caractere em uma posição do array, mas por que?
    }
    return new Blob([ab], { type: mimeString });
  }
}
