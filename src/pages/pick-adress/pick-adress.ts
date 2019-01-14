import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EnderecoDTO } from '../../models/endereco.dto';

/**
 * Generated class for the PickAdressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pick-adress',
  templateUrl: 'pick-adress.html',
})
export class PickAdressPage {

  items: EnderecoDTO[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.items = [{
      id: "1",
      logradouro: "Rua dos Operários",
      numero: "709",
      complemento: null,
      bairro: "Bela Vista",
      cep: "13840000",
      cidade: {
        id: "1",
        nome: "Mogi Guaçu",
        estado: {
          id: "1",
          nome: "São Paulo"
        }
      }
    },
    {
      id: "2",
      logradouro: "Rua dos Programadores",
      numero: "1000",
      complemento: null,
      bairro: "Eldourado",
      cep: "13840000",
      cidade: {
        id: "2",
        nome: "Campinas",
        estado: {
          id: "1",
          nome: "São Paulo"
        }
      }
    }]
  }

}
