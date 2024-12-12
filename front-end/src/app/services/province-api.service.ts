import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProvinceApiService {

  private baseUrl = 'http://localhost:8087/api/locations'; 
  constructor(private http: HttpClient) {}

  getProvinces(): Observable<any> {
    return this.http.get(`${this.baseUrl}/provinces`);
  }

  getDistricts(provinceCode: string): Observable<any> {
    console.log("province code : " + provinceCode)
    return this.http.get(`${this.baseUrl}/districts/${provinceCode}`);
  }

  getWards(districtCode: string): Observable<any> {
    console.log("districCode : " + districtCode);
    return this.http.get(`${this.baseUrl}/wards/${districtCode}`);
  }
}
