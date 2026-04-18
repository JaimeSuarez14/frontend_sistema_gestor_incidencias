import { effect, Injectable, signal } from "@angular/core";

@Injectable({
  providedIn:"root"
})
export class SessionThema {
  private isDark =  signal(true);
  public _isDark =  this.isDark.asReadonly();

  constructor(){
    effect(() => {
      const thema = this.isDark();
      if(thema){
        document.documentElement.classList.add("dark");
      }else{
        document.documentElement.classList.remove("dark");
      }

    })
  }

  cambiarThema(){
    this.isDark.update(t => !t);
  }
}
