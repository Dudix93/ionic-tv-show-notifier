import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { User } from '../../models/user';
 
@Injectable()
export class UserService {
 
    private userRef = this.db.list<User>('users');
 
    constructor(private db: AngularFireDatabase) { }
 
    getUsers() {
        return this.userRef;
    }
 
    addUser(user: User) {
        return this.userRef.push(user);
    }
 
    updateUser(user: User) {
        return this.userRef.update(user.key, user);
    }
 
    removeUser(user: User) {
        return this.userRef.remove(user.key);
    }
}
