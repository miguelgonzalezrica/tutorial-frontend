import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoanService, formatDate } from '../loan.service';
import { Loan } from '../model/Loan';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GameService } from '../../game/game';
import { ClientService } from '../../client/client.service';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Client } from '../../client/model/Client';
import { Game } from '../../game/model/Game';

//import { validateFields } from '../../core/helpers/validation.helper';

@Component({
    selector: 'app-loan-edit',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule],
    templateUrl: './loan-edit.html',
    styleUrl: './loan-edit.scss',
    providers: [provideNativeDateAdapter()]
})
export class LoanEdit implements OnInit {
    protected readonly authorService = inject(LoanService);
    protected readonly gameService = inject(GameService);
    protected readonly clientService = inject(ClientService);
    protected readonly dialogRef = inject(MatDialogRef<LoanEdit>);
    protected readonly data = inject(MAT_DIALOG_DATA);

    
    protected readonly games = signal<Game[]>([]);
    protected readonly clients = signal<Client[]>([]);


    protected readonly id = signal<number | null>(null);
    protected readonly game = signal<Game | null>(null);
    protected readonly client = signal<Client | null>(null);
    protected readonly loanDate = signal<string | null>(null);
    protected readonly returnDate = signal<string | null>(null);
    protected readonly errorMessage = signal<string | null>(null);

    loadFormData(initialData: Loan | null) {
        this.id.set(initialData?.id ?? null);
        this.game.set(initialData?.game ?? null);
        this.client.set(initialData?.client ?? null);
        this.loanDate.set(initialData?.loanDate ?? null);
        this.returnDate.set(initialData?.returnDate ?? null);
    }

    
    ngOnInit(): void {
        this.loadFormData(this.data.loan ?? null);

        this.gameService.getGames().subscribe(games => {
            this.games.set(games);
            if (this.game() != null) {
                const selectedGame = games.find(
                    (g) => g.id === this.game()?.id
                );

                if (selectedGame != null) {
                    this.game.set(selectedGame);
                }
            }
        });

        this.clientService.getClients().subscribe(clients => {
            this.clients.set(clients);
            if (this.client() != null) {
                const selectedClient = clients.find(
                    (g) => g.id === this.client()?.id
                );

                if (selectedClient != null) {
                    this.client.set(selectedClient);
                }
            }
        });
    }


    onSave() {
        const id = this.id();
        const game = this.game();
        const client = this.client();
        let loanDate = this.loanDate();
        let returnDate = this.returnDate();

        const requiredFields = ["game", "client", "loanDate", "returnDate"] as const
        const data = { game, client, loanDate, returnDate }

        /*if (!validateFields(data, requiredFields)) {
            return;
        }*/
       if(loanDate) loanDate = formatDate(new Date(loanDate));
       if(returnDate) returnDate = formatDate(new Date(returnDate));

        const loan = {
            id,
            game,
            client,
            loanDate,
            returnDate
        } as Loan;
        this.authorService.saveLoan(loan).subscribe({
            next: () => {
                this.dialogRef.close(true);
            },
            error: (err) => {
                this.errorMessage.set(err.error?.message);
            }
        });
    }

    onClose() {
        this.dialogRef.close(false);
    }
}