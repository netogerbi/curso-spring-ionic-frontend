import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CidadeService } from '../../services/domain/cidade.service';
import { EstadoService } from '../../services/domain/estado.service';
import { CidadeDTO } from '../../models/cidade.dto';
import { EstadoDTO } from '../../models/estado.dto';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  formGroup: FormGroup;
  cidades: CidadeDTO[];
  estados: EstadoDTO[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public cidadeService: CidadeService,
    public estadoService: EstadoService) {

      this.formGroup = formBuilder.group({
        nome:["",[Validators.required,Validators.minLength(5),Validators.maxLength(120)]],
        email:["",[Validators.required,Validators.email]],
        tipo:["1",[Validators.required]],
        cpfOuCnpj:["",[Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
        senha:["",[Validators.required]],
        logradouro:["",[Validators.required]],
        numero:["",[Validators.required]],
        complemento:["",[]],
        bairro:["",[Validators.required]],
        cep:["",[Validators.required]],
        telefone1:["",[Validators.required]],
        telefone2:["",[]],
        telefone3:["",[]],
        estadoId:[null,[]],
        cidadeId:["",[]]
      });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
    this.estadoService.findAll()
      .subscribe(response =>{
        this.estados = response;
        this.formGroup.controls.estadoId.setValue(this.estados[0].id);
      },
      error => {});

  }

  updateCidades(){
    let estado_id = this.formGroup.value.estadoId;
    this.cidadeService.findAll(estado_id)
      .subscribe(response =>{
        this.cidades = response;
        this.formGroup.controls.cidadeId.setValue(null);
      },
      error => {});
  }

  signupUser(){
    console.log("Form enviado com sucesso!");
  }

}
