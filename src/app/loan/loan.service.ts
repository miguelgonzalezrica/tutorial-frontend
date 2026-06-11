import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Pageable } from '../core/model/page/Pageable';
import { Loan } from './model/Loan';
import { PaginatedData } from '../core/model/page/PaginatedData';
import { HttpClient } from '@angular/common/http';

export const formatDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

@Injectable({
providedIn: 'root'
})
export class LoanService { 

    protected readonly http = inject(HttpClient);

    private baseUrl = 'http://localhost:8080/loan'; 

    
    getLoans(pageable: Pageable, gameId?: number, clientId?: number, activeDate?: Date) {
        let formattedDate = null;
        if(activeDate){
            formattedDate = formatDate(activeDate);
        }
        return this.http.post<PaginatedData<Loan>>(this.baseUrl,{pageable,gameId,clientId,activeDate: formattedDate});
    }

    saveLoan(loan: Loan): Observable<Loan> {
        const { id } = loan;
        const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;
        return this.http.put<Loan>(url, loan);
    }

    deleteLoan(idLoan: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${idLoan}`);
    }
}