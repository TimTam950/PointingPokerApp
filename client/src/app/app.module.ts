import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatGridListModule} from "@angular/material/grid-list";
import { NewLobbyComponent } from './components/new-lobby/new-lobby.component';
import {MatCardModule} from "@angular/material/card";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import { HomePageComponent } from './components/home-page/home-page.component';
import { RouterModule, Routes } from '@angular/router';
import { ExistingLobbyComponent } from './components/existing-lobby/existing-lobby.component';
import { ActiveLobbyComponent } from './components/active-lobby/active-lobby.component'
import {MatInputModule} from "@angular/material/input";

const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'lobby/:lobbyId/:connectedUser', component: ActiveLobbyComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' }
]

@NgModule({
  declarations: [
    AppComponent,
    NewLobbyComponent,
    HomePageComponent,
    ExistingLobbyComponent,
    ActiveLobbyComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatGridListModule,
    MatCardModule,
    ReactiveFormsModule,
    MatButtonModule,
    RouterModule.forRoot(routes),
    MatInputModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
