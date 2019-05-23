Pre-requis

    Node.js (recommended version)
    Angular 7 CLI
    Angular 7
    Express and MongoDB API
    Terminal (Mac/Linux) or Node Command Line (Windows)
    IDE or Text Editor
	
	-Verification de la version utilisé
		#node -v

		#npm -v
		

Mise en place de l'environnement de developpement

1 - Installation de angular/cli

	#npm install -g @angular/cli
	
2 - Verification de la version utilisé
	
	#ng --version
	
	Angular CLI: 7.0.1
	Node: 8.12.0
	OS: darwin x64
	Angular:
	...

	Package                      Version
	------------------------------------------------------
	@angular-devkit/architect    0.10.1
	@angular-devkit/core         7.0.1
	@angular-devkit/schematics   7.0.1
	@schematics/angular          7.0.1
	@schematics/update           0.10.1
	rxjs                         6.3.3
	
3 - Création d'un nouveau projet

	#ng new angular7-crud
	
	? Would you like to add Angular routing? Yes
	? Which stylesheet format would you like to use? SCSS
	
4 - Aller dans le repertoire du projet

	#cd angular7-crud

5 - Lancer l'application

	#ng serve
	
	NB: L'adresse par defaut est http://localhost:4200

6 - Creation des routes pour naviguer entre les pages et composants
	6-1- Creation des composants a partir de la commande ng
		#ng g component products
		
		#ng g component product-detail
		
		#ng g component product-add
		
		#ng g component product-edit
		
	NB: les composants sont importés automatiquement dans `src/app/app.module.ts` et declarés dans `@NgModule`
	
	6-2- Configurer les routings dans `src/app/app-routing.module.ts`
		
		6-2-1- Importer les composants
		
			import { ProductsComponent } from './products/products.component';
			import { ProductDetailComponent } from './product-detail/product-detail.component';
			import { ProductAddComponent } from './product-add/product-add.component';
			import { ProductEditComponent } from './product-edit/product-edit.component';
			
		6-2-1- Ajouter la route dans l'array existant
			const routes: Routes = [
					{
						path: 'products',
						component: ProductsComponent,
						data: { title: 'List of Products' }
					},
					{
						path: 'product-details/:id',
						component: ProductDetailComponent,
						data: { title: 'Product Details' }
					},
					{
						path: 'product-add',
						component: ProductAddComponent,
						data: { title: 'Add Product' }
					},
					{
						path: 'product-edit/:id',
						component: ProductEditComponent,
						data: { title: 'Edit Product' }
					},
						{ path: '',
						redirectTo: '/products',
						pathMatch: 'full'
						}
					];
	6-3-Configurer les vues

		6-3-1- configurer la vue principal `src/app/app.component.html`
		
			<div class="container">
			  <router-outlet></router-outlet>
			</div>
		
		6-3-2- Configurer le css
			
			.container {
			  padding: 20px;
			}
	
7- Creation des services pour acceder au RESTFULL API
	7-1- installation ou declaration de `HttpClientModule` dans `src/app/app.module.ts`
		- import 

			import { FormsModule } from '@angular/forms';
			import { HttpClientModule } from '@angular/common/http';
			
		- Ajouter dans `@NgModule` apres `BrowserModule`
		
			imports: [
			  BrowserModule,
			  FormsModule,
			  HttpClientModule,
			  AppRoutingModule
			],
	7-2- Creation du type `Product` dans `src/app/product.ts` pour avoir un resultat typé objet
		
		export class Product {
		  id: number;
		  prod_name: string;
		  prod_desc: string;
		  prod_price: number;
		  updated_at: Date;
		}
	7-3- Generer un service
	
	#ng generate service api
	
	7-4-Parametrer le service
		- Import
		---------
	
			import { Observable, of, throwError } from 'rxjs';
			import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
			import { catchError, tap, map } from 'rxjs/operators';
			import { Product } from './product';
			
		- Ajouter les constants suivants avant `@Injectable`
		----------------------------------------------------
			
			const httpOptions = {
			  headers: new HttpHeaders({'Content-Type': 'application/json'})
			};
			const apiUrl = "/api/v1/products";
		
		- Injecter le module `HttpClient` dans le constructeur
		
			constructor(private http: HttpClient) { }
			
		- Ajouter une fonction de gestion d'exception
		
			private handleError<T> (operation = 'operation', result?: T) {
			  return (error: any): Observable<T> => {

				// TODO: send the error to remote logging infrastructure
				console.error(error); // log to console instead

				// Let the app keep running by returning an empty result.
				return of(result as T);
			  };
			}
		
		- Ajouter les functions crud des produits(create, read, update, delete)
			
			getProducts (): Observable<Product[]> {
			  return this.http.get<Product[]>(apiUrl)
				.pipe(
				  tap(heroes => console.log('fetched products')),
				  catchError(this.handleError('getProducts', []))
				);
			}

			getProduct(id: number): Observable<Product> {
			  const url = `${apiUrl}/${id}`;
			  return this.http.get<Product>(url).pipe(
				tap(_ => console.log(`fetched product id=${id}`)),
				catchError(this.handleError<Product>(`getProduct id=${id}`))
			  );
			}

			addProduct (product): Observable<Product> {
			  return this.http.post<Product>(apiUrl, product, httpOptions).pipe(
				tap((product: Product) => console.log(`added product w/ id=${product.id}`)),
				catchError(this.handleError<Product>('addProduct'))
			  );
			}

			updateProduct (id, product): Observable<any> {
			  const url = `${apiUrl}/${id}`;
			  return this.http.put(url, product, httpOptions).pipe(
				tap(_ => console.log(`updated product id=${id}`)),
				catchError(this.handleError<any>('updateProduct'))
			  );
			}

			deleteProduct (id): Observable<Product> {
			  const url = `${apiUrl}/${id}`;

			  return this.http.delete<Product>(url, httpOptions).pipe(
				tap(_ => console.log(`deleted product id=${id}`)),
				catchError(this.handleError<Product>('deleteProduct'))
			  );
			}
		
8 - Afficher la liste des produits
	8-1-Developpement du composant `src/app/products/products.component.ts`
		- import 
		
			import { ApiService } from '../api.service';
			
		- Injecter l'api Service dans le constructeur
		
			constructor(private api: ApiService) { }
		
		- Installer Angular 6 Material et CDK pour l'interface
			#ng add @angular/material
			
			? Enter a prebuilt theme name, or "custom" for a custom theme: purple-green
			? Set up HammerJS for gesture recognition? Yes
			? Set up browser animations for Angular Material? Yes
		- Importer les composants Materiel dans `src/app/app.module.ts`
			
			import {
				  MatInputModule,
				  MatPaginatorModule,
				  MatProgressSpinnerModule,
				  MatSortModule,
				  MatTableModule,
				  MatIconModule,
				  MatButtonModule,
				  MatCardModule,
				  MatFormFieldModule } from "@angular/material";
				  
			import { FormsModule, ReactiveFormsModule } from '@angular/forms';
			
		- Declarer les composants dans `@NgModule`
		
			imports: [
				BrowserModule,
				FormsModule,
				HttpClientModule,
				AppRoutingModule,
				ReactiveFormsModule,
				BrowserAnimationsModule,
				MatInputModule,
				MatTableModule,
				MatPaginatorModule,
				MatSortModule,
				MatProgressSpinnerModule,
				MatIconModule,
				MatButtonModule,
				MatCardModule,
				MatFormFieldModule
			],
		- Retourner dans  `src/app/products/products.component.ts` et importer 
			
			import { Product } from '../product';
		
		- Declarer les variables Angular Material Table Data Source avant le constructeur
		
			displayedColumns: string[] = ['prod_name', 'prod_price'];
			data: Product[] = [];
			isLoadingResults = true;
			
		- Configurer `ngOninit`
		
			ngOnInit() {
			  this.api.getProducts()
				.subscribe(res => {
				  this.data = res;
				  console.log(this.data);
				  this.isLoadingResults = false;
				}, err => {
				  console.log(err);
				  this.isLoadingResults = false;
				});
			}
			
	8-2- Mise en place de 	`src/app/products/products.component.html`
	
		<div class="example-container mat-elevation-z8">
		  <div class="example-loading-shade"
			   *ngIf="isLoadingResults">
			<mat-spinner *ngIf="isLoadingResults"></mat-spinner>
		  </div>
		  <div class="button-row">
			<a mat-flat-button color="primary" [routerLink]="['/product-add']"><mat-icon>add</mat-icon></a>
		  </div>
		  <div class="mat-elevation-z8">
			<table mat-table [dataSource]="data" class="example-table"
				   matSort matSortActive="prod_name" matSortDisableClear matSortDirection="asc">

			  <!-- Product Name Column -->
			  <ng-container matColumnDef="prod_name">
				<th mat-header-cell *matHeaderCellDef>Product Name</th>
				<td mat-cell *matCellDef="let row">{{row.prod_name}}</td>
			  </ng-container>

			  <!-- Product Price Column -->
			  <ng-container matColumnDef="prod_price">
				<th mat-header-cell *matHeaderCellDef>Product Price</th>
				<td mat-cell *matCellDef="let row">$ {{row.prod_price}}</td>
			  </ng-container>

			  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
			  <tr mat-row *matRowDef="let row; columns: displayedColumns;" [routerLink]="['/product-details/', row.id]"></tr>
			</table>
		  </div>
		</div>
		
	8-3- Mise en place du CSS dans `src/app/products/products.component.css`
	
		/* Structure */
		.example-container {
		  position: relative;
		  padding: 5px;
		}

		.example-table-container {
		  position: relative;
		  max-height: 400px;
		  overflow: auto;
		}

		table {
		  width: 100%;
		}

		.example-loading-shade {
		  position: absolute;
		  top: 0;
		  left: 0;
		  bottom: 56px;
		  right: 0;
		  background: rgba(0, 0, 0, 0.15);
		  z-index: 1;
		  display: flex;
		  align-items: center;
		  justify-content: center;
		}

		.example-rate-limit-reached {
		  color: #980000;
		  max-width: 360px;
		  text-align: center;
		}

		/* Column Widths */
		.mat-column-number,
		.mat-column-state {
		  max-width: 64px;
		}

		.mat-column-created {
		  max-width: 124px;
		}

		.mat-flat-button {
		  margin: 5px;
		}
	
9 - Afficher et supprimer un produit

	9 - 1 -Configuration de `src/app/product-detail/product-detail.component.ts`
		- importation
			import { ActivatedRoute, Router } from '@angular/router';
			import { ApiService } from '../api.service';
			import { Product } from '../product';
			
		- Injecter les modules dans le constructeur
			constructor(private route: ActivatedRoute, private api: ApiService, private router: Router) { }
		- Declaration des variables avant le constructeur
			product: Product = { _id: '', prod_name: '', prod_desc: '', prod_price: null, updated_at: null };
			isLoadingResults = true;
		
		- Ajouter une fonction pour charger la liste des produit a partir de l'API
			
			getProductDetails(id) {
			  this.api.getProduct(id)
				.subscribe(data => {
				  this.product = data;
				  console.log(this.product);
				  this.isLoadingResults = false;
				});
			}
		- Appeler la fonction dans ngONinit
		
			deleteProduct(id) {
			  this.isLoadingResults = true;
			  this.api.deleteProduct(id)
				.subscribe(res => {
					this.isLoadingResults = false;
					this.router.navigate(['/products']);
				  }, (err) => {
					console.log(err);
					this.isLoadingResults = false;
				  }
				);
			}
	9-2- Mise en place de la vue `src/app/product-detail/product-detail.component.html`
		- le fichier html `src/app/product-detail/product-detail.component.html`
			<div class="example-container mat-elevation-z8">
			  <div class="example-loading-shade"
				   *ngIf="isLoadingResults">
				<mat-spinner *ngIf="isLoadingResults"></mat-spinner>
			  </div>
			  <div class="button-row">
				<a mat-flat-button color="primary" [routerLink]="['/products']"><mat-icon>list</mat-icon></a>
			  </div>
			  <mat-card class="example-card">
				<mat-card-header>
				  <mat-card-title><h2>{{product.prod_name}}</h2></mat-card-title>
				  <mat-card-subtitle>{{product.prod_desc}}</mat-card-subtitle>
				</mat-card-header>
				<mat-card-content>
				  <dl>
					<dt>Product Price:</dt>
					<dd>{{product.prod_price}}</dd>
					<dt>Updated At:</dt>
					<dd>{{product.updated_at | date}}</dd>
				  </dl>
				</mat-card-content>
				<mat-card-actions>
				  <a mat-flat-button color="primary" [routerLink]="['/product-edit', product._id]"><mat-icon>edit</mat-icon></a>
				  <a mat-flat-button color="warn" (click)="deleteProduct(product._id)"><mat-icon>delete</mat-icon></a>
				</mat-card-actions>
			  </mat-card>
			</div>
			
		- le fichier CSS `src/app/product-detail/product-detail.component.css`
			/* Structure */
			.example-container {
			  position: relative;
			  padding: 5px;
			}

			.example-loading-shade {
			  position: absolute;
			  top: 0;
			  left: 0;
			  bottom: 56px;
			  right: 0;
			  background: rgba(0, 0, 0, 0.15);
			  z-index: 1;
			  display: flex;
			  align-items: center;
			  justify-content: center;
			}

			.mat-flat-button {
			  margin: 5px;
			}
10 - Ajouter produit

	10-1- Mise en place de `src/app/product-add/product-add.component.ts`
		- importation
		
			import { Router } from '@angular/router';
			import { ApiService } from '../api.service';
			import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
		- Injecter les composants dans le constructeur
			constructor(private router: Router, private api: ApiService, private formBuilder: FormBuilder) { }
		- Declaration des Form Group et les champs a l'interieur de form avant le constructeur
		
			productForm: FormGroup;
			prod_name:string='';
			prod_desc:string='';
			prod_price:number=null;
			updated_at:Date=null;
			isLoadingResults = false;
			
		- Ajouter une validation initiale pour chaque champ
		
			ngOnInit() {
			  this.productForm = this.formBuilder.group({
				'prod_name' : [null, Validators.required],
				'prod_desc' : [null, Validators.required],
				'prod_price' : [null, Validators.required],
				'updated_at' : [null, Validators.required]
			  });
			}
		- Creer une fonction pour soumettre (POST) un formulaire de produit	
		
			nFormSubmit(form:NgForm) {
			  this.isLoadingResults = true;
			  this.api.addProduct(form)
				.subscribe(res => {
					let id = res['_id'];
					this.isLoadingResults = false;
					this.router.navigate(['/product-details', id]);
				  }, (err) => {
					console.log(err);
					this.isLoadingResults = false;
				  });
			}
		
	10-2- Mise en place de la vue `src/app/product-add/product-add.component.html`
		- Le fichier HTML
		---------------------
		<div class="example-container mat-elevation-z8">
		  <div class="example-loading-shade"
			   *ngIf="isLoadingResults">
			<mat-spinner *ngIf="isLoadingResults"></mat-spinner>
		  </div>
		  <div class="button-row">
			<a mat-flat-button color="primary" [routerLink]="['/products']"><mat-icon>list</mat-icon></a>
		  </div>
		  <mat-card class="example-card">
			<form [formGroup]="productForm" (ngSubmit)="onFormSubmit(productForm.value)">
			  <mat-form-field class="example-full-width">
				<input matInput placeholder="Product Name" formControlName="prod_name"
					   [errorStateMatcher]="matcher">
				<mat-error>
				  <span *ngIf="!productForm.get('prod_name').valid && productForm.get('prod_name').touched">Please enter Product Name</span>
				</mat-error>
			  </mat-form-field>
			  <mat-form-field class="example-full-width">
				<input matInput placeholder="Product Desc" formControlName="prod_desc"
					   [errorStateMatcher]="matcher">
				<mat-error>
				  <span *ngIf="!productForm.get('prod_desc').valid && productForm.get('prod_desc').touched">Please enter Product Description</span>
				</mat-error>
			  </mat-form-field>
			  <mat-form-field class="example-full-width">
				<input matInput placeholder="Product Price" formControlName="prod_price"
					   [errorStateMatcher]="matcher">
				<mat-error>
				  <span *ngIf="!productForm.get('prod_price').valid && productForm.get('prod_price').touched">Please enter Product Price</span>
				</mat-error>
			  </mat-form-field>
			  <div class="button-row">
				<button type="submit" [disabled]="!productForm.valid" mat-flat-button color="primary"><mat-icon>save</mat-icon></button>
			  </div>
			</form>
		  </mat-card>
		</div>
		
		- Le fichier CSS `src/app/product-add/product-add.component.css`
	
		/* Structure */
		.example-container {
		  position: relative;
		  padding: 5px;
		}

		.example-form {
		  min-width: 150px;
		  max-width: 500px;
		  width: 100%;
		}

		.example-full-width {
		  width: 100%;
		}

		.example-full-width:nth-last-child() {
		  margin-bottom: 10px;
		}

		.button-row {
		  margin: 10px 0;
		}

		.mat-flat-button {
		  margin: 5px;
		}
11 - Modifier un produit

	11-1- Mise en place du composant `src/app/product-edit/product-edit.component.ts`
		- Importation
		
		import { Router, ActivatedRoute } from '@angular/router';
		import { ApiService } from '../api.service';
		import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
		
		- Injection dans le constructeur
		
		constructor(private router: Router, private route: ActivatedRoute, private api: ApiService, private formBuilder: FormBuilder) { }
		
		- Declaration de la variable avant le constructeur
		
		productForm: FormGroup;
		_id:string='';
		prod_name:string='';
		prod_desc:string='';
		prod_price:number=null;
		isLoadingResults = false;
		
		- Ajout de la validation initiale
		
		ngOnInit() {
		  this.getProduct(this.route.snapshot.params['id']);
		  this.productForm = this.formBuilder.group({
			'prod_name' : [null, Validators.required],
			'prod_desc' : [null, Validators.required],
			'prod_price' : [null, Validators.required]
		  });
		}
		
		- Function pour avoir le produit
		
		getProduct(id) {
		  this.api.getProduct(id).subscribe(data => {
			this._id = data._id;
			this.productForm.setValue({
			  prod_name: data.prod_name,
			  prod_desc: data.prod_desc,
			  prod_price: data.prod_price
			});
		  });
		}
		
		- Function pour mettre à jour le produit
		
		onFormSubmit(form:NgForm) {
		  this.isLoadingResults = true;
		  this.api.updateProduct(this._id, form)
			.subscribe(res => {
				let id = res['_id'];
				this.isLoadingResults = false;
				this.router.navigate(['/product-details', id]);
			  }, (err) => {
				console.log(err);
				this.isLoadingResults = false;
			  }
			);
		}
		
		- Fonction pour gerer l'affichage du details u produit
		
		productDetails() {
		  this.router.navigate(['/product-details', this._id]);
		}
	11-1- Mise en place de la vue dans `src/app/product-edit/product-edit.component.html`
		- fichier HTML
		<div class="example-container mat-elevation-z8">
		  <div class="example-loading-shade"
			   *ngIf="isLoadingResults">
			<mat-spinner *ngIf="isLoadingResults"></mat-spinner>
		  </div>
		  <div class="button-row">
			<a mat-flat-button color="primary" (click)="productDetails()"><mat-icon>info</mat-icon></a>
		  </div>
		  <mat-card class="example-card">
			<form [formGroup]="productForm" (ngSubmit)="onFormSubmit(productForm.value)">
			  <mat-form-field class="example-full-width">
				<input matInput placeholder="Product Name" formControlName="prod_name"
					   [errorStateMatcher]="matcher">
				<mat-error>
				  <span *ngIf="!productForm.get('prod_name').valid && productForm.get('prod_name').touched">Please enter Product Name</span>
				</mat-error>
			  </mat-form-field>
			  <mat-form-field class="example-full-width">
				<input matInput placeholder="Product Desc" formControlName="prod_desc"
					   [errorStateMatcher]="matcher">
				<mat-error>
				  <span *ngIf="!productForm.get('prod_desc').valid && productForm.get('prod_desc').touched">Please enter Product Description</span>
				</mat-error>
			  </mat-form-field>
			  <mat-form-field class="example-full-width">
				<input matInput placeholder="Product Price" formControlName="prod_price"
					   [errorStateMatcher]="matcher">
				<mat-error>
				  <span *ngIf="!productForm.get('prod_price').valid && productForm.get('prod_price').touched">Please enter Product Price</span>
				</mat-error>
			  </mat-form-field>
			  <div class="button-row">
				<button type="submit" [disabled]="!productForm.valid" mat-flat-button color="primary"><mat-icon>save</mat-icon></button>
			  </div>
			</form>
		  </mat-card>
		</div>
		
		- Fichier CSS
		
		/* Structure */
		.example-container {
		  position: relative;
		  padding: 5px;
		}

		.example-form {
		  min-width: 150px;
		  max-width: 500px;
		  width: 100%;
		}

		.example-full-width {
		  width: 100%;
		}

		.example-full-width:nth-last-child() {
		  margin-bottom: 10px;
		}

		.button-row {
		  margin: 10px 0;
		}

		.mat-flat-button {
		  margin: 5px;
		}
	