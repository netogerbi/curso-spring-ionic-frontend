import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';
import { API_CONFIG } from '../../config/api.config';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  items: ProdutoDTO[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public produtoService: ProdutoService,
    public loadingControler: LoadingController
    ) {}

  ionViewDidLoad() {
    this.loadData();
  }

  loadData(){
    let categoria_id = this.navParams.get("categoria_id"); //pegando parametros da navegação
    let loader = this.presentLoader();
    this.produtoService.findByCategoria(categoria_id)
      .subscribe(response => {
        this.items = response["content"];
        loader.dismiss();
        this.loadImageUrls();
      },
      error => {
        loader.dismiss();
      });
  }

  loadImageUrls(){
    for(let i=0; i<this.items.length; i++){
      let item = this.items[i];
      this.produtoService.getSmallImageFromBucket(item.id)
        .subscribe(response =>{
          item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`;
        },
        error => {});//se nao colocar o erro, o programa tenta carregar e para a aplicação pois nao consegue encontrar
    }
  }

  showDetail(produto_id: string){
    this.navCtrl.push("ProdutoDetailPage",{produto_id:produto_id});
  }

  presentLoader(){
    let loader = this.loadingControler.create({
      content: "Aguarde...",
    });
    loader.present();
    return loader;
  }

  doRefresh(refresher) {
    this.loadData();
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }


}
