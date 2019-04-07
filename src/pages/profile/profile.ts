import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageService } from '../../services/storage.service';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { API_CONFIG } from '../../config/api.config';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DomSanitizer } from '@angular/platform-browser';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  cliente: ClienteDTO;
  picture: string;
  cameraOn: boolean = false;
  profileImg: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: StorageService,
    public clienteService: ClienteService,
    private camera: Camera,
    private sanitizer: DomSanitizer) {
      
      this.profileImg = 'assets/img/avatar-blank.png';
  
    }

  ionViewDidLoad() {
    this.loadData();
  }

  loadData(){
    let localUser = this.storage.getLocalUser();
    if (localUser && localUser.email) {
      this.clienteService.findByEmail(localUser.email)
        .subscribe(response => {
          this.cliente = response as ClienteDTO; //apesar do objeto vir com campos a mais, este casting informa que haverá os campos do DTO
          //procura imagem no bucket
          this.getImageIfExists();
        },
          error => {
            if (error.status == 403) {
              this.navCtrl.setRoot("HomePage");
            }
          });
    } else {
      this.navCtrl.setRoot("HomePage");
    }
  }

  getImageIfExists() {
    this.clienteService.getImageFromBucket(this.cliente.id)
      .subscribe(response => {
        this.cliente.imageUrl = `${API_CONFIG.bucketBaseUrl}/cp${this.cliente.id}.jpg`;
        this.blobToDataUrl(response).then(dataUrl => {
          let str = dataUrl as string; //correção - convertendo url para base64 img
          this.profileImg = this.sanitizer.bypassSecurityTrustHtml(str);
        })
      },
      error => {
        this.profileImg = 'assets/img/avatar-blank.png';
      });
  }

  blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onerror = reject;
      reader.onload = (e) => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  getCameraPicture() {
    this.cameraOn = true;

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
     this.picture = 'data:image/png;base64,' + imageData;
     this.cameraOn = false;
    }, (err) => {
      this.cameraOn = false; // reativa botão da camera em casio de cancelamento
    });
  }

  getGalleryPicture() {

    this.cameraOn = true;

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.camera.getPicture(options).then((imageData) => {
     this.picture = 'data:image/png;base64,' + imageData;
     this.cameraOn = false;
    }, (err) => {
      this.cameraOn = false; // reativa botão da camera em casio de cancelamento
    });
  }

  sendPicture() {
    this.clienteService.uploadPictrue(this.picture)
      .subscribe(response => {
        this.picture = null;
        this.getImageIfExists();
      }, error => {
      });
  }

  cancel() {
    this.picture = null;
  }

}
