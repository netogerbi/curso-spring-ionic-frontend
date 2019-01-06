import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { httpFactory } from "@angular/http/src/http_module";
import { ProdutoDTO } from "../../models/produto.dto";

@Injectable()
export class ProdutoService{

  constructor (public http: HttpClient){
  }

  findByCategoria(categoria_id: string): Observable<ProdutoDTO[]> {
    return this.http.get<ProdutoDTO[]>(API_CONFIG.baseUrl+`/produtos/?categorias=${categoria_id}`);
  }

  getSmallImageFromBucket(id: string) : Observable<any> {
    let url = `${API_CONFIG.bucketBaseUrl}/prod${id}-small.jpg`;
    return this.http.get(url, {responseType: "blob"});
  }

}
