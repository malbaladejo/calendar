import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  imports: [],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login implements OnInit {

  private _name:string | null = null;
  private _password:string | null = null;

  public constructor(
        
        private readonly _route: ActivatedRoute,
        private readonly _router: Router) {        
    }

    public ngOnInit(): void {
        this._name = this._route.snapshot.queryParamMap.get('name');
        this._name = this._route.snapshot.queryParamMap.get('password');
    }
}
