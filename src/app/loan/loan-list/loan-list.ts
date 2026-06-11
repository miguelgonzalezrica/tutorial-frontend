import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LoanEdit } from '../loan-edit/loan-edit';
import { LoanService } from '../loan.service';
import { Loan } from '../model/Loan';
import { Pageable } from '../../core/model/page/Pageable';
import { DialogConfirmation } from '../../core/dialog-confirmation/dialog-confirmation';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { Game } from '../../game/model/Game';
import { Client } from '../../client/model/Client';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { GameService } from '../../game/game';
import { ClientService } from '../../client/client.service';

@Component({
    selector: 'app-loan-list',
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatTableModule, CommonModule, FormsModule, MatPaginator, MatFormFieldModule, MatSelectModule, MatInputModule, MatDatepickerModule, MatNativeDateModule],
    templateUrl: './loan-list.html',
    styleUrl: './loan-list.scss',
    providers: [provideNativeDateAdapter()]
})
export class LoanList implements OnInit {
    pageNumber: number = 0;
    pageSize: number = 5;
    totalElements: number = 0;

    protected readonly clients = signal<Client[]>([]);
    protected readonly games = signal<Game[]>([]);
    protected readonly date = signal<Date | null>(null);
    protected readonly filterGame = signal<Game | null>(null);
    protected readonly filterClient = signal<Client | null>(null);
    protected readonly filterDate = signal<Date | null>(null);

    protected readonly gameService = inject(GameService);
    protected readonly clientService = inject(ClientService);

    dataSource = new MatTableDataSource<Loan>();
    
    displayedColumns: string[] = ['id', 'gameName', 'clientName', 'loanDate', 'returnDate', 'action'];

    constructor(private loanService: LoanService, public dialog: MatDialog) {}

    ngOnInit(): void {
        this.gameService.getGames().subscribe((games) => this.games.set(games));

        this.clientService
            .getClients()
            .subscribe((categories) => this.clients.set(categories));

        this.loadPage();
    }

    loadPage(event?: PageEvent) {
        const pageable: Pageable = {
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            sort: [
                {
                    property: 'id',
                    direction: 'ASC',
                },
            ],
        };

        if (event != null) {
            pageable.pageSize = event.pageSize;
            pageable.pageNumber = event.pageIndex;
        }

        this.loanService.getLoans(pageable).subscribe((data) => {
            this.dataSource.data = data.content;
            this.pageNumber = data.pageable.pageNumber;
            this.pageSize = data.pageable.pageSize;
            this.totalElements = data.totalElements;
        });
    }

    createLoan() {
        const dialogRef = this.dialog.open(LoanEdit, {
            data: {},
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.ngOnInit();
        });
    }

    editLoan(loan: Loan) {
        const dialogRef = this.dialog.open(LoanEdit, {
            data: { loan: loan },
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.ngOnInit();
        });
    }

    deleteLoan(loan: Loan) {
        const dialogRef = this.dialog.open(DialogConfirmation, {
            data: {
                title: 'Eliminar préstamo',
                description:
                    'Atención si borra el préstamo se perderán sus datos.<br> ¿Desea eliminar el préstamo?',
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.loanService.deleteLoan(loan.id).subscribe((result) => {
                    this.ngOnInit();
                });
            }
        });
    }

    
    onCleanFilter(): void {
        this.filterClient.set(null);
        this.filterGame.set(null);
        this.filterDate.set(null);
        this.onSearch();
    }

    onSearch(event?: PageEvent): void {

        const pageable: Pageable = {
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            sort: [
                {
                    property: 'id',
                    direction: 'ASC',
                },
            ],
        };

        if (event != null) {
            pageable.pageSize = event.pageSize;
            pageable.pageNumber = event.pageIndex;
        }
        const gameTitle =
            this.filterGame() != null ? this.filterGame()?.title : null;
        const clientName =
            this.filterClient() != null ? this.filterClient()?.name : null;
        const activeDate = 
            this.filterDate() != null ? this.filterDate() : null;
        this.loanService
            .getLoans(pageable, gameTitle ?? undefined, clientName ?? undefined, activeDate ?? undefined)
            .subscribe((loans) => this.dataSource.data = loans.content);

    }
}