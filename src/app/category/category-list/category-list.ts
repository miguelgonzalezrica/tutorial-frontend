import { Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Category } from '../model/Category';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CategoryService } from '../category.service';
import { MatDialog } from '@angular/material/dialog';
import { CategoryEdit } from '../category-edit/category-edit';
import { DialogConfirmation } from '../../core/dialog-confirmation/dialog-confirmation';


@Component({
    selector: 'app-category-list',
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        CommonModule
    ],
    templateUrl: './category-list.html',
    styleUrl: './category-list.scss'
})

export class CategoryList implements OnInit{

    dataSource = new MatTableDataSource<Category>();
    displayedColumns: string[] = ['id', 'name', 'action'];

    protected readonly categoryService = inject(CategoryService);
    protected readonly dialog = inject(MatDialog);

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.categoryService.getCategories().subscribe(
            categories => this.dataSource.data = categories
        );
    }

    createCategory() {    
        const dialogRef = this.dialog.open(CategoryEdit, {
            data: {}
        });

        dialogRef.afterClosed().subscribe(result => {
            if(!result) return;
            this.loadData();
        });    
    }   

    editCategory(category: Category) {
        const dialogRef = this.dialog.open(CategoryEdit, {
            data: { category }
        });

        dialogRef.afterClosed().subscribe(result => {
            if(!result) return;
            this.loadData();
        });
    }

    deleteCategory(category: Category) {    
        const dialogRef = this.dialog.open(DialogConfirmation, {
        data: { title: "Eliminar categoría", description: "Atención si borra la categoría se perderán sus datos.<br> ¿Desea eliminar la categoría?" }
        });

        dialogRef.afterClosed().subscribe(result => {
        if (result) {
            this.categoryService.deleteCategory(category.id).subscribe(result => {
            this.loadData();
            }); 
        }
        });
    }  
}  
