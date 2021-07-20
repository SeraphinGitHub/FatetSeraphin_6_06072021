import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  loading: boolean;
  errorMsgEmail: string;
  errorMsgPsw: string;

  constructor(private formBuilder: FormBuilder,
              private auth: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
    });
  }

  onSignup() {

    // Have to contain: 
    //    LETTER || letter || number || dot || under score || dash && at (@) &&
    //    LETTER || letter || number && dot && LETTER || letter
    const emailRegEx = new RegExp(/^[A-Za-z0-9\._-]+[@]+[A-Za-z0-9]+[\.]+[A-Za-z]+$/);

    // Have to contain: LETTER || letter || number || accent letters || number && minimum 9 characters 
    const passwordRegEx = new RegExp(/^[A-Za-zÜ-ü0-9].{9,}$/);

    this.loading = true;
    const email = this.signupForm.get('email').value;
    const password = this.signupForm.get('password').value;
    
    if(!emailRegEx.test(email)) {
      this.loading = false;
      console.error("E-mail incorrect !");
      this.errorMsgEmail = "E-mail incorrect !";
    }

    if(!passwordRegEx.test(password)) {
      this.loading = false;
      console.error("Mot de passe incorrect ou moins de 10 caractères !");
      this.errorMsgPsw = "Mot de passe incorrect ou moins de 10 caractères !";
    }

    if (emailRegEx.test(email) && passwordRegEx.test(password)) {

      this.auth.createUser(email, password).then(
        (response: { message: string }) => {
          console.log(response.message);
          this.auth.loginUser(email, password).then(
            () => {
              this.loading = false;
              this.router.navigate(['/sauces']);
            }
          ).catch(
            () => {
              this.loading = false;
              console.error("Cet utilisateur existe déjà !");
              this.errorMsgEmail = "Cet utilisateur existe déjà !";
            }
          );
        }
      ).catch((error) => {
          this.loading = false;
          console.error(error);
          this.errorMsgEmail = "Erreur serveur !";
      });

    }
  }
}
