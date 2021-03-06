import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EnderecoDTO } from '../../models/endereco.dto';
import { StorageService } from '../../services/storage.service';
import { ClienteService } from '../../services/domain/cliente.service';
import { PedidoDTO } from '../../models/pedido.dto';
import { HomePage } from '../home/home';
import { CartService } from '../../services/domain/cart-service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@IonicPage()
@Component({
  selector: 'page-pick-adress',
  templateUrl: 'pick-adress.html',
})
export class PickAdressPage {

  items: EnderecoDTO[];
  pedido: PedidoDTO;//trafega ao longo das paginas preenchendo o pedido

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: StorageService,
    public clienteService: ClienteService,
    public cartService: CartService,
    ) {}

  ionViewDidLoad() {
    let localUser = this.storage.getLocalUser();
    if(localUser && localUser.email){
      this.clienteService.findByEmail(localUser.email)
        .subscribe(response =>{
          this.items = response["enderecos"];

          //primeira instanciação do PedidoDTO
          let cart = this.cartService.getCart();

          this.pedido = {
            cliente: {id: response["id"]},
            enderecoDeEntrega: null,
            pagamento: null,
            itens: cart.items.map(x => { return {quantidade: x.quantidade, produto: {id: x.produto.id}} })
          }
        },
        error => {
          if(error.status == 403){
            this.navCtrl.setRoot("HomePage");
          }
        });
    }else{
      this.navCtrl.setRoot("HomePage");
    }
  }

  nextPage(item: EnderecoDTO) {
    this.pedido.enderecoDeEntrega = {id: item.id};
    this.navCtrl.push("PaymentPage",{pedido: this.pedido});
  }


}
