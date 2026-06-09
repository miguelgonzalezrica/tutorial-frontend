import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoanService } from '../loan.service';
import { Loan } from '../model/Loan';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
//import { validateFields } from '../../core/helpers/validation.helper';

@Component({
    selector: 'app-loan-edit',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule ],
    templateUrl: './loan-edit.html',
    styleUrl: './loan-edit.scss',
})
export class LoanEdit implements OnInit {
    protected readonly authorService = inject(LoanService);
    protected readonly dialogRef = inject(MatDialogRef<LoanEdit>);
    protected readonly data = inject(MAT_DIALOG_DATA);

    protected readonly id = signal<number | null>(null);
    protected readonly gameName = signal<string | null>(null);
    protected readonly clientName = signal<string | null>(null);
    protected readonly loanDate = signal<Date | null>(null);
    protected readonly returnDate = signal<Date | null>(null);

    loadFormData(initialData: Loan | null) {
        this.id.set(initialData?.id ?? null);
        this.gameName.set(initialData?.gameName ?? null);
        this.clientName.set(initialData?.clientName ?? null);
        this.loanDate.set(initialData?.loanDate ?? null);
        this.returnDate.set(initialData?.returnDate ?? null);
    }

    ngOnInit(): void {
        this.loadFormData(this.data.loan ?? null);
    }

    onSave() {
        const id = this.id();
        const gameName = this.gameName();
        const clientName = this.clientName();
        const loanDate = this.loanDate();
        const returnDate = this.returnDate();

        const requiredFields = ["gameName", "clientName", "loanDate", "returnDate"] as const
        const data = { gameName, clientName, loanDate, returnDate }

        /*if (!validateFields(data, requiredFields)) {
            return;
        }*/

        const loan = {
            id,
            gameName,
            clientName,
            loanDate,
            returnDate
        } as Loan;
        this.authorService.saveLoan(loan).subscribe(() => {
            this.dialogRef.close(true);
        });
    }

    onClose() {
        this.dialogRef.close(false);
    }
}