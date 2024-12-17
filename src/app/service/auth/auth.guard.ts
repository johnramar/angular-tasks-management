import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { map, take } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

export const authGuard: CanActivateFn =  () => {
  const angularFireAuth = inject(AngularFireAuth);
  return angularFireAuth.authState.pipe(
    take(1),
    map(user =>{ return !!user})
  )
};
