import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDrugDrugInteractionResponse, IDrugRxcuiResponse } from '@interfaces/home/i-drug-drug-interaction';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DrugDrugInteractionService {

  constructor(private http: HttpClient) { }

  getDrugRxcuiUrl: string = "https://rxnav.nlm.nih.gov/REST/drugs.json"
  getDrugDrugInteractionUrl: string = "https://rxnav.nlm.nih.gov/REST/interaction/list.json"

  getDrugRxcui(genericDrugName: string): Observable<{api: IDrugRxcuiResponse, genericName: string}>{
    let params = new HttpParams().set("name", genericDrugName?.replace(/,|\+/g, '/'));
    return this.http.get<IDrugRxcuiResponse>(this.getDrugRxcuiUrl, {params})
      .pipe(map(api => {return {api: api, genericName: genericDrugName}}));
  }

  getDrugDrugInteraction(rxcuis: string[]): Observable<IDrugDrugInteractionResponse>{
    rxcuis = rxcuis.filter(r => r);
    let params = new HttpParams().set("rxcuis", rxcuis.join(" "));
    console.log('params', params);
    return this.http.get<IDrugDrugInteractionResponse>(this.getDrugDrugInteractionUrl, {params});
  }
}
