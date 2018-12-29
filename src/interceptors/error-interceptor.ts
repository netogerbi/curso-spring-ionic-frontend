import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { Injectable } from "@angular/core";
import { StorageService } from "../services/storage.service";
import { AlertController } from "ionic-angular";

@Injectable()
export class  ErrorInterceptor implements HttpInterceptor{

  constructor(public storage: StorageService, public alertCtrl: AlertController){
  }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).catch((err,cautch)=>{

            let errorObj = err;
            if(errorObj.error){
                errorObj = errorObj.error;
            }
            if(!errorObj.status){
                errorObj = JSON.parse(errorObj);
            }

            switch (errorObj.status){
              case 401:
                this.handle401();
              case 403:
                this.handle403();
                break;
              default:
                this.handleDefaultError(errorObj);
            }

            console.log("Erro detectado pelo interceptor:\n",errorObj);
            return Observable.throw(errorObj);

        }) as any;
    }

    handleDefaultError(errorObj){
      let alert = this.alertCtrl.create({
        title: "Erro "+errorObj.status+": "+errorObj.error,
        message: errorObj.message,
        enableBackdropDismiss: false,
        buttons: [
          {
            text: "OK"
          }
        ]
      });
      alert.present();
    }

    handle401(): any {
      let alert = this.alertCtrl.create({
        title: "Erro 401: Falha de Autenticação",
        message: "Email ou senha incorretos!",
        enableBackdropDismiss: false,
        buttons: [
          {
            text: "OK"
          },
        ]
      });
      alert.present();
    }

    //caso possivel localuser invalido no storage, remove.
    handle403(){
      this.storage.setLocalUser(null);
    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
}
