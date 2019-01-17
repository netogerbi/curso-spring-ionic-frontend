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

  items: ProdutoDTO[] = []; //inicia uma lista do tipo ProdutoDTO vazia

  page: number = 0;

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
    this.produtoService.findByCategoria(categoria_id, this.page, 10) //chama a partir da pagina que esta com 10 produtos em cada pagina
      .subscribe(response => {
        let start = this.items.length;
        this.items = this.items.concat( response["content"] ); //concatena com alista vazia
        let end = this.items.length-1;
        loader.dismiss();
        this.loadImageUrls(start, end);
      },
      error => {
        loader.dismiss();
      });
  }

  loadImageUrls(start: number, end: number){
    for(let i=start; i <= end; i++){
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
    this.page=0;
    this.items = [];
    this.loadData();
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  doInfinite(infiniteScroll) {
    this.page++; //incrementa a pagina
    this.loadData(); //chama o carregamento de dados na próxima pagina
    setTimeout(() => {
      infiniteScroll.complete();
    }, 1000);
  }

}
